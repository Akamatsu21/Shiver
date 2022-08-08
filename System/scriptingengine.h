#ifndef SCRIPTINGENGINE_H
#define SCRIPTINGENGINE_H

#include <QObject>
#include <QJSEngine>

#include "Models/event.h"

class Player;

class ScriptingEngine : public QObject
{
    Q_OBJECT

    QJSEngine _js_engine;
    QJSValue _event_list;
    QJSValue _help_pages;
    QJSValue _player;

public:
    explicit ScriptingEngine(QObject* parent);

    void loadModules();
    void registerPlayer(Player* player);

    QJSValue getObjectProperty(const QJSValue& object, const QString& property);
    Event parseEvent(int id);
    std::vector<std::string> parseHelpPages();
};

#endif // SCRIPTINGENGINE_H
