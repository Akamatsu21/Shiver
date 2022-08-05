#include "scriptingengine.h"
#include "Models/player.h"
#include "Utils/utils.h"

ScriptingEngine::ScriptingEngine(QObject* parent):
    QObject(parent),
    _js_engine(),
    _event_list(),
    _help_pages(),
    _player()
{
    // TODO: Implement some error handling.
    _js_engine.installExtensions(QJSEngine::AllExtensions);
    _event_list = _js_engine.importModule(":js/events.jsm").property("events");
    _help_pages = _js_engine.importModule(":js/help.jsm").property("help_pages");
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
    Q_ASSERT(_event_list.hasProperty(event_id));

    QJSValue event_object = _event_list.property(event_id);
    Event event(id);

    Q_ASSERT(event_object.hasProperty("description"));
    event.setDescription(getObjectProperty(event_object, "description").toString().toStdString());

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
        Q_ASSERT(enemies.isArray());
        int length = enemies.property("length").toInt();
        for(int i = 0; i < length; ++i)
        {
            QJSValue enemy = enemies.property(i);
            event.addEnemy(getObjectProperty(enemy, "name").toString().toStdString(),
                           getObjectProperty(enemy, "agility").toInt(),
                           getObjectProperty(enemy, "constitution").toInt());
        }
    }

    if(event_object.hasProperty("items"))
    {
        Q_ASSERT(event_object.hasProperty("item_limit"));
        event.setItemLimit(getObjectProperty(event_object, "item_limit").toInt());

        QJSValue items = getObjectProperty(event_object, "items");
        Q_ASSERT(items.isArray());
        int length = items.property("length").toInt();
        for(int i = 0; i < length; ++i)
        {
            event.addItem(items.property(i).toString().toStdString());
        }
    }

    return event;
}

std::vector<std::string> ScriptingEngine::parseHelpPages()
{
    Q_ASSERT(_help_pages.isArray());
    std::vector<std::string> pages{};
    int length = _help_pages.property("length").toInt();
    for(int i = 0; i < length; ++i)
    {
        pages.push_back(_help_pages.property(i).toString().toStdString());
    }

    return pages;
}
