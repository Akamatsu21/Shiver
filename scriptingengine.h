#ifndef SCRIPTINGENGINE_H
#define SCRIPTINGENGINE_H

#include <QObject>
#include <QJSEngine>

#include "event.h"

class Player;

class ScriptingEngine : public QObject
{
    Q_OBJECT

    QJSEngine _js_engine;
    QVariantMap _event_list;
    QJSValue _player;

public:
    explicit ScriptingEngine(QObject* parent);

    void registerPlayer(Player* player);
    Event parseEvent(uint16_t id);
};

#endif // SCRIPTINGENGINE_H
