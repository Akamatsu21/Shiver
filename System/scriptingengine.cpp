#include "scriptingengine.h"
#include "Models/gamevariables.h"
#include "Models/player.h"
#include "Utils/utils.h"

ScriptingEngine::ScriptingEngine(QObject* parent):
    QObject(parent),
    _js_engine(),
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
    _game_vars = _js_engine.newQObject(game_vars);
    _js_engine.globalObject().setProperty("game_vars", _game_vars);
}

void ScriptingEngine::registerPlayer(Player* player)
{
    _player = _js_engine.newQObject(player);
    _js_engine.globalObject().setProperty("player", _player);
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
            QJSValue death_text = enemy.hasProperty("death_text")
                                  ? getObjectProperty(enemy, "death_text")
                                  : QJSValue("");
            QJSValue on_death_callback = enemy.hasProperty("on_death")
                                         ? enemy.property("on_death")
                                         : QJSValue(false);

            event.addEnemy(getObjectProperty(enemy, "name").toString().toStdString(),
                           getObjectProperty(enemy, "agility").toInt(),
                           getObjectProperty(enemy, "constitution").toInt(),
                           death_text.toString().toStdString(),
                           on_death_callback);
        }
    }

    if(event_object.hasProperty("gold"))
    {
        event.setHasGold(true);
        event.setGold(getObjectProperty(event_object, "gold").toInt());
    }

    if(event_object.hasProperty("items"))
    {
        assert(event_object.hasProperty("item_limit"));
        event.setItemLimit(getObjectProperty(event_object, "item_limit").toInt());

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
        event.addChoiceOption("yes",
                              getObjectProperty(choice, "yes").toInt(),
                              getObjectProperty(choice, "yes_new_room").toBool());
        event.addChoiceOption("no",
                              getObjectProperty(choice, "no").toInt(),
                              getObjectProperty(choice, "no_new_room").toBool());
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
            event.addChoiceOption(getObjectProperty(options.property(i), "answer").toString().toStdString(),
                                  getObjectProperty(options.property(i), "redirect").toInt(),
                                  getObjectProperty(options.property(i), "new_room").toBool());
        }
    }

    if(event_object.hasProperty("locals"))
    {
        QJSValue locals = getObjectProperty(event_object, "locals");
        assert(locals.isArray());
        int length = locals.property("length").toInt();
        for(int i = 0; i < length; ++i)
        {
            event.addLocalCommand(getObjectProperty(locals.property(i), "command").toString().toStdString(),
                                  getObjectProperty(locals.property(i), "redirect").toInt(),
                                  getObjectProperty(locals.property(i), "new_room").toBool());
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
