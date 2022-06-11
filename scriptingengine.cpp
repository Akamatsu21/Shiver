#include "scriptingengine.h"

ScriptingEngine::ScriptingEngine(QObject* parent):
    QObject(parent),
    _js_engine(),
    _event_list()
{
    // TODO: implement some error handling
    _js_engine.installExtensions(QJSEngine::AllExtensions);
    _event_list = _js_engine.importModule(":js/events.jsm").property("events").toVariant().toList();
}

Event ScriptingEngine::parseEvent(uint16_t id) const
{
    std::string description = _event_list.at(id).toMap().value("description").toString().toStdString();
    return Event(id, description);
}
