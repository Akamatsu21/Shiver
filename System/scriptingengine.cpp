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
    _event_list(),
    _game_vars(),
    _help_pages(),
    _player()
{
}

void ScriptingEngine::loadModules()
{
    _js_engine.installExtensions(QJSEngine::AllExtensions);
    _event_list = _js_engine.importModule(":js/events.jsm").property("events");
    _help_pages = _js_engine.importModule(":js/help.jsm").property("help_pages");

    if(_event_list.isError() || _help_pages.isError())
    {
        throw std::runtime_error("Failure loading JS modules.");
    }
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
        event.setRedirect(getObjectProperty(event_object, "redirect").toInt());
        event.setNewRoom(getObjectProperty(event_object, "new_room").toBool());
    }

    for(Direction direction: utils::getAllDirections())
    {
        QString direction_string = QString::fromStdString(utils::directionToString(direction));
        if(event_object.hasProperty(direction_string))
        {
            event.setDestination(direction, getObjectProperty(event_object, direction_string).toInt());
        }
    }

    if(event_object.hasProperty("enemies"))
    {
        QJSValue enemies = getObjectProperty(event_object, "enemies");
        assert(enemies.isArray());
        int length = enemies.property("length").toInt();
        for(int i = 0; i < length; ++i)
        {
            QJSValue enemy = enemies.property(i);
            QJSValue on_death_callback = enemy.hasProperty("on_death")
                                         ? enemy.property("on_death")
                                         : QJSValue(false);

            std::map<int, QJSValue> on_round_end_callbacks;
            if(enemy.hasProperty("on_round_end"))
            {
                QJSValue callbacks = getObjectProperty(enemy, "on_round_end");
                assert(callbacks.isArray());
                int callbacks_length = callbacks.property("length").toInt();
                for(int k = 0; k < callbacks_length; ++k)
                {
                    QJSValue callback = callbacks.property(k);
                    int round = getObjectProperty(callback, "round").toInt();
                    QJSValue func = callback.property("callback");
                    on_round_end_callbacks[round] = func;
                }
            }

            event.addEnemy(getObjectProperty(enemy, "name").toString().toStdString(),
                           getObjectProperty(enemy, "agility").toInt(),
                           getObjectProperty(enemy, "constitution").toInt(),
                           on_death_callback,
                           on_round_end_callbacks);
        }
    }

    if(event_object.hasProperty("gold"))
    {
        QVariant flag = QString::fromStdString(utils::createString(id, "_gold_taken"));
        if(_game_variables_obj->getFlag(flag))
        {
            event.setHasGold(false);
        }
        else
        {
            event.setHasGold(true);
            event.setGold(getObjectProperty(event_object, "gold").toInt());
        }
    }

    if(event_object.hasProperty("items"))
    {
        assert(event_object.hasProperty("item_limit"));

        QVariant counter = QString::fromStdString(utils::createString(id, "_items_taken"));
        int items_allowed = getObjectProperty(event_object, "item_limit").toInt();
        int items_taken = _game_variables_obj->getCounter(counter);
        event.setItemLimit(items_allowed - items_taken);

        QJSValue items = getObjectProperty(event_object, "items");
        assert(items.isArray());
        int length = items.property("length").toInt();
        for(int i = 0; i < length; ++i)
        {
            event.addItem(items.property(i).toString().toStdString());
        }
    }

    if(event_object.hasProperty("rations"))
    {
        event.setRationsEnabled(getObjectProperty(event_object, "rations").toBool());
    }

    if(event_object.hasProperty("yes_no_choice"))
    {
        QJSValue choice = getObjectProperty(event_object, "yes_no_choice");
        event.setChoice(ChoiceType::YES_NO, getObjectProperty(choice, "question").toString().toStdString());

        QJSValue on_no_callback = choice.hasProperty("on_no")
                                  ? choice.property("on_no")
                                  : QJSValue(false);
        QJSValue on_yes_callback = choice.hasProperty("on_yes")
                                   ? choice.property("on_yes")
                                   : QJSValue(false);

        event.addChoiceOption("yes",
                              getObjectProperty(choice, "yes").toInt(),
                              getObjectProperty(choice, "yes_new_room").toBool(),
                              on_no_callback);
        event.addChoiceOption("no",
                              getObjectProperty(choice, "no").toInt(),
                              getObjectProperty(choice, "no_new_room").toBool(),
                              on_yes_callback);
    }
    else if(event_object.hasProperty("choice"))
    {
        QJSValue choice = getObjectProperty(event_object, "choice");
        event.setChoice(ChoiceType::MULTI, getObjectProperty(choice, "question").toString().toStdString());

        QJSValue options = getObjectProperty(choice, "options");
        assert(options.isArray());
        int length = options.property("length").toInt();
        for(int i = 0; i < length; ++i)
        {
            QJSValue option = options.property(i);
            QJSValue on_option_callback = option.hasProperty("on_option")
                                          ? option.property("on_option")
                                          : QJSValue(false);

            event.addChoiceOption(getObjectProperty(option, "answer").toString().toStdString(),
                                  getObjectProperty(option, "redirect").toInt(),
                                  getObjectProperty(option, "new_room").toBool(),
                                  on_option_callback);
        }
    }

    if(event_object.hasProperty("locals"))
    {
        QJSValue locals = getObjectProperty(event_object, "locals");
        assert(locals.isArray());
        int length = locals.property("length").toInt();
        for(int i = 0; i < length; ++i)
        {
            QJSValue command = locals.property(i);
            QJSValue on_command_callback = command.hasProperty("on_command")
                                           ? command.property("on_command")
                                           : QJSValue(false);

            event.addLocalCommand(getObjectProperty(command, "command").toString().toStdString(),
                                  getObjectProperty(command, "redirect").toInt(),
                                  getObjectProperty(command, "new_room").toBool(),
                                  on_command_callback);
        }
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
