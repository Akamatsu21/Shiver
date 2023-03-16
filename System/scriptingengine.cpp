#include "scriptingengine.h"
#include "Models/gamevariables.h"
#include "Models/player.h"
#include "Models/scriptapi.h"
#include "Utils/utils.h"

ScriptingEngine::ScriptingEngine(QObject* parent):
    QObject(parent),
    _game_variables_obj(nullptr),
    _js_engine(),
    _api(),
    _game_vars(),
    _player(),
    _callback_timings(),
    _directions(),
    _player_stats(),
    _condition_list(),
    _event_list(),
    _help_pages()
{
}

void ScriptingEngine::loadModules()
{
    _js_engine.installExtensions(QJSEngine::AllExtensions);
    _condition_list = _js_engine.importModule(":js/conditions.jsm").property("conditions");
    _event_list = _js_engine.importModule(":js/events.jsm").property("events");
    _help_pages = _js_engine.importModule(":js/help.jsm").property("help_pages");

    if(_condition_list.isError() || _event_list.isError() || _help_pages.isError()
    || _condition_list.isUndefined() || _event_list.isUndefined() || _help_pages.isUndefined())
    {
        throw std::runtime_error("Failure loading JS modules.");
    }
}

void ScriptingEngine::registerEnums()
{
    _player_stats = _js_engine.newObject();
    for(const auto &[key, val]: utils::getAllPlayerStatsWithLabels())
    {
        _player_stats.setProperty(QString::fromStdString(key),
                                  QJSValue(static_cast<int>(val)));
    }
    _js_engine.globalObject().setProperty("PlayerStat", _player_stats);

    _directions = _js_engine.newObject();
    for(const auto &[key, val]: utils::getAllDirectionsWithLabels())
    {
        _directions.setProperty(QString::fromStdString(key),
                                QJSValue(static_cast<int>(val)));
    }
    _js_engine.globalObject().setProperty("Direction", _directions);

    _callback_timings = _js_engine.newObject();
    for(const auto &[key, val]: utils::getAllCallbackTimingsWithLabels())
    {
        _callback_timings.setProperty(QString::fromStdString(key),
                                      QJSValue(static_cast<int>(val)));
    }
    _js_engine.globalObject().setProperty("CallbackTiming", _callback_timings);
}

void ScriptingEngine::registerGameVariables(GameVariables* game_vars)
{
    _game_variables_obj = game_vars;
    _game_vars = _js_engine.newQObject(game_vars);
    _js_engine.globalObject().setProperty("game_vars", _game_vars);
}

void ScriptingEngine::registerPlayer(Player* player)
{
    _player = _js_engine.newQObject(player);
    _js_engine.globalObject().setProperty("player", _player);
}

void ScriptingEngine::registerScriptApi(ScriptApi* api)
{
    _api = _js_engine.newQObject(api);
    _js_engine.globalObject().setProperty("system", _api);
}

QJSValue ScriptingEngine::getObjectProperty(const QJSValue& object, const QString& property)
{
    if(object.property(property).isCallable())
    {
        return object.property(property).call();
    }
    else
    {
        return object.property(property);
    }
}

Condition ScriptingEngine::parseCondition(const QString& name)
{
    assert(_condition_list.hasProperty(name));
    QJSValue condition_object = _condition_list.property(name);

    assert(condition_object.hasProperty("stat"));
    PlayerStat stat = static_cast<PlayerStat>(getObjectProperty(condition_object, "stat").toInt());

    assert(condition_object.hasProperty("modifier"));
    int mod = getObjectProperty(condition_object, "modifier").toInt();

    assert(condition_object.hasProperty("clear_timing"));
    CallbackTiming timing = static_cast<CallbackTiming>(
                getObjectProperty(condition_object, "clear_timing").toInt());

    QJSValue callback = condition_object.hasProperty("on_clear")
                      ? condition_object.property("on_clear")
                      : QJSValue(false);

    return Condition(name.toStdString(), stat, mod, timing, callback);
}

Event ScriptingEngine::parseEvent(int id)
{
    assert(_game_variables_obj != nullptr);

    QString event_id = "event" + QString::number(id);
    assert(_event_list.hasProperty(event_id));

    QJSValue event_object = _event_list.property(event_id);
    Event event(id);

    assert(event_object.hasProperty("description"));
    event.setDescription(getObjectProperty(event_object, "description").toString().toStdString());

    if(event_object.hasProperty("redirect"))
    {
        QJSValue redirect_value = getObjectProperty(event_object, "redirect");
        if(!redirect_value.isUndefined())
        {
            event.setRedirect(redirect_value.toInt());
            event.setNewRoom(getObjectProperty(event_object, "new_room").toBool());
        }
    }

    if(event_object.hasProperty("escape_redirect"))
    {
        QJSValue escape_redirect_value = getObjectProperty(event_object, "escape_redirect");
        if(!escape_redirect_value.isUndefined())
        {
            event.setEscapeRedirect(escape_redirect_value.toInt());
        }
    }

    for(Direction direction: utils::getAllDirections())
    {
        QString direction_string = QString::fromStdString(utils::directionToString(direction));
        if(event_object.hasProperty(direction_string))
        {
            QJSValue direction_value = getObjectProperty(event_object, direction_string);
            if(!direction_value.isUndefined())
            {
                event.setDestination(direction, direction_value.toInt());
            }
        }
    }

    if(event_object.hasProperty("on_direction"))
    {
        event.setDirectionCallback(event_object.property("on_direction"));
    }

    if(event_object.hasProperty("enemies"))
    {
        QJSValue enemies = getObjectProperty(event_object, "enemies");
        if(!enemies.isUndefined())
        {
            assert(enemies.isArray());
            int length = enemies.property("length").toInt();
            for(int i = 0; i < length; ++i)
            {
                QJSValue enemy = enemies.property(i);

                bool escape_enabled = false;
                int escape_redirect = -1;
                if(enemy.hasProperty("escape_redirect"))
                {
                    escape_enabled = true;
                    escape_redirect = getObjectProperty(enemy, "escape_redirect").toInt();
                }

                std::vector<Callback> enemy_callbacks;
                if(enemy.hasProperty("callbacks"))
                {
                    QJSValue callbacks = getObjectProperty(enemy, "callbacks");
                    assert(callbacks.isArray());
                    int callbacks_length = callbacks.property("length").toInt();
                    for(int k = 0; k < callbacks_length; ++k)
                    {
                        QJSValue callback = callbacks.property(k);
                        CallbackTiming timing = static_cast<CallbackTiming>(
                                    getObjectProperty(callback, "timing").toInt());
                        QJSValue effect = callback.property("callback");

                        switch(timing)
                        {
                        case CallbackTiming::ROUND_ACTION:
                        case CallbackTiming::ROUND_END:
                        {
                            assert(callback.hasProperty("round"));
                            int round = getObjectProperty(callback, "round").toInt();
                            enemy_callbacks.emplace_back(timing, round, effect);
                        } break;
                        default:
                            enemy_callbacks.emplace_back(timing, effect);
                            break;
                        }
                    }
                }

                event.addEnemy(getObjectProperty(enemy, "name").toString().toStdString(),
                               getObjectProperty(enemy, "agility").toInt(),
                               getObjectProperty(enemy, "constitution").toInt(),
                               escape_enabled,
                               escape_redirect,
                               enemy_callbacks);
            }
        }
    }

    if(event_object.hasProperty("gold"))
    {
        QJSValue gold = getObjectProperty(event_object, "gold");
        if(!gold.isUndefined())
        {
            QVariant flag = QString::fromStdString(utils::createString(id, "_gold_taken"));
            if(_game_variables_obj->getFlag(flag))
            {
                event.setHasGold(false);
            }
            else
            {
                event.setHasGold(true);
                event.setGold(gold.toInt());
            }
        }
    }

    if(event_object.hasProperty("rations"))
    {
        QJSValue rations = getObjectProperty(event_object, "rations");
        if(!rations.isUndefined())
        {
            QVariant flag = QString::fromStdString(utils::createString(id, "_rations_taken"));
            if(_game_variables_obj->getFlag(flag))
            {
                event.setHasRations(false);
            }
            else
            {
                event.setHasRations(true);
                event.setRations(rations.toInt());
            }
        }
    }

    if(event_object.hasProperty("items"))
    {
        QJSValue items = getObjectProperty(event_object, "items");
        if(!items.isUndefined())
        {
            assert(event_object.hasProperty("item_limit"));
            QVariant counter = QString::fromStdString(utils::createString(id, "_items_taken"));
            int items_allowed = getObjectProperty(event_object, "item_limit").toInt();
            int items_taken = _game_variables_obj->getCounter(counter);
            event.setItemLimit(items_allowed - items_taken);

            assert(items.isArray());
            int length = items.property("length").toInt();
            for(int i = 0; i < length; ++i)
            {
                event.addItem(items.property(i).toString().toStdString());
            }
        }
    }

    if(event_object.hasProperty("eat"))
    {
        event.setEatingEnabled(getObjectProperty(event_object, "eat").toBool());

        if(event_object.hasProperty("on_eat"))
        {
            event.setEatingCallback(event_object.property("on_eat"));
        }
    }

    if(event_object.hasProperty("yes_no_choice"))
    {
        QJSValue choice = getObjectProperty(event_object, "yes_no_choice");
        if(!choice.isUndefined())
        {
            event.setChoice(ChoiceType::YES_NO, getObjectProperty(choice, "question").toString().toStdString());

            QJSValue on_no_callback = choice.hasProperty("on_no")
                                      ? choice.property("on_no")
                                      : QJSValue::UndefinedValue;
            QJSValue on_yes_callback = choice.hasProperty("on_yes")
                                       ? choice.property("on_yes")
                                       : QJSValue::UndefinedValue;

            event.addChoiceOption("yes",
                                  getObjectProperty(choice, "yes").toInt(),
                                  getObjectProperty(choice, "yes_new_room").toBool(),
                                  on_yes_callback);
            event.addChoiceOption("no",
                                  getObjectProperty(choice, "no").toInt(),
                                  getObjectProperty(choice, "no_new_room").toBool(),
                                  on_no_callback);
        }
    }
    else if(event_object.hasProperty("choice"))
    {
        QJSValue choice = getObjectProperty(event_object, "choice");
        if(!choice.isUndefined())
        {
            event.setChoice(ChoiceType::MULTI, getObjectProperty(choice, "question").toString().toStdString());

            QJSValue options = getObjectProperty(choice, "options");
            assert(options.isArray());
            int length = options.property("length").toInt();
            for(int i = 0; i < length; ++i)
            {
                QJSValue option = options.property(i);
                QJSValue on_option_callback = option.hasProperty("on_option")
                                              ? option.property("on_option")
                                              : QJSValue::UndefinedValue;

                event.addChoiceOption(getObjectProperty(option, "answer").toString().toStdString(),
                                      getObjectProperty(option, "redirect").toInt(),
                                      getObjectProperty(option, "new_room").toBool(),
                                      on_option_callback);
            }
        }
    }

    if(event_object.hasProperty("locals"))
    {
        QJSValue locals = getObjectProperty(event_object, "locals");
        if(!locals.isUndefined())
        {
            assert(locals.isArray());
            int length = locals.property("length").toInt();
            for(int i = 0; i < length; ++i)
            {
                QJSValue command = locals.property(i);
                QJSValue on_command_callback = command.hasProperty("on_command")
                                               ? command.property("on_command")
                                               : QJSValue::UndefinedValue;

                event.addLocalCommand(getObjectProperty(command, "command").toString().toStdString(),
                                      getObjectProperty(command, "redirect").toInt(),
                                      getObjectProperty(command, "new_room").toBool(),
                                      on_command_callback);
            }
        }
    }

    if(event_object.hasProperty("on_exit"))
    {
        event.setExitCallback(event_object.property("on_exit"));
    }

    return event;
}

std::vector<std::string> ScriptingEngine::parseHelpPages()
{
    assert(_help_pages.isArray());
    std::vector<std::string> pages;
    int length = _help_pages.property("length").toInt();
    for(int i = 0; i < length; ++i)
    {
        pages.push_back(_help_pages.property(i).toString().toStdString());
    }

    return pages;
}
