#ifndef SCRIPTINGENGINE_H
#define SCRIPTINGENGINE_H

#include <QObject>
#include <QJSEngine>

#include "event.h"

class ScriptingEngine : public QObject
{
    Q_OBJECT

    QJSEngine _js_engine;
    QVariantList _event_list;

public:
    explicit ScriptingEngine(QObject* parent);

    Event parseEvent(uint16_t id) const;
};

#endif // SCRIPTINGENGINE_H
