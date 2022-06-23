#include "scriptingengine.h"
#include "utils.h"
#include "Models/player.h"

ScriptingEngine::ScriptingEngine(QObject* parent):
    QObject(parent),
    _js_engine(),
    _event_list(),
    _player()
{
    // TODO: Implement some error handling.
    _js_engine.installExtensions(QJSEngine::AllExtensions);
    _event_list = _js_engine.importModule(":js/events.jsm").property("events");
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
        uint8_t length = enemies.property("length").toInt();
        for(uint8_t i = 0; i < length; ++i)
        {
            QJSValue enemy = enemies.property(i);
            event.addEnemy(getObjectProperty(enemy, "name").toString().toStdString(),
                           getObjectProperty(enemy, "agility").toInt(),
                           getObjectProperty(enemy, "constitution").toInt());
        }
    }

    return event;
}
