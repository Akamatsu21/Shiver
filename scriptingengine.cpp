#include "scriptingengine.h"
#include "player.h"
#include "utils.h"

ScriptingEngine::ScriptingEngine(QObject* parent):
    QObject(parent),
    _js_engine(),
    _event_list(),
    _player()
{
    // TODO: Implement some error handling.
    _js_engine.installExtensions(QJSEngine::AllExtensions);
    _event_list = _js_engine.importModule(":js/events.jsm").property("events").toVariant().toMap();
}

void ScriptingEngine::registerPlayer(Player* player)
{
    _player = _js_engine.newQObject(player);
    _js_engine.globalObject().setProperty("player", _player);
}

Event ScriptingEngine::parseEvent(uint16_t id)
{
    QString event_id = "event" + QString::number(id);
    Q_ASSERT(_event_list.contains(event_id));

    QVariantMap event_object = _event_list.value(event_id).toMap();
    Q_ASSERT(event_object.contains("description"));

    Event event(id);
    event.setDescription(event_object.value("description").toString().toStdString());

    for(Direction direction: utils::getAllDirections())
    {
        QString direction_string = QString::fromStdString(utils::directionToString(direction));
        if(event_object.contains(direction_string))
        {
            event.setDestination(direction, event_object.value(direction_string).toInt());
        }
    }

    QJSValue test = _js_engine.evaluate("player.getLuck()");

    event.setAg(_js_engine.evaluate(event_object.value("agility").toString()).toInt());

    return event;
}
