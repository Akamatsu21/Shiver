#ifndef SCRIPTINGENGINE_H
#define SCRIPTINGENGINE_H

#include <QObject>
#include <QJSEngine>

#include "Models/condition.h"
#include "Models/event.h"

class GameVariables;
class Player;
class ScriptApi;

class ScriptingEngine : public QObject
{
    Q_OBJECT

    // Local reference to game_vars
    GameVariables* _game_variables_obj;

    // JavaScript engine
    QJSEngine _js_engine;

    // Objects to be registered with the engine
    QJSValue _api;
    QJSValue _game_vars;
    QJSValue _player;

    //Enums to be registered with the engine
    QJSValue _callback_timings;
    QJSValue _directions;
    QJSValue _player_stats;

    // Objects to import from JS
    QJSValue _condition_list;
    QJSValue _event_list;
    QJSValue _help_pages;

public:
    explicit ScriptingEngine(QObject* parent);

    void loadModules();
    void registerEnums();
    void registerGameVariables(GameVariables* game_vars);
    void registerPlayer(Player* player);
    void registerScriptApi(ScriptApi* api);

    QJSValue getObjectProperty(const QJSValue& object, const QString& property);
    Condition parseCondition(const QString& name);
    Event parseEvent(int id);
    std::vector<std::string> parseHelpPages();
};

#endif // SCRIPTINGENGINE_H
