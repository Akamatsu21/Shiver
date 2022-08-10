#ifndef GAME_H
#define GAME_H

#include <QObject>

#include "Models/event.h"
#include "Models/combatstate.h"
#include "System/console.h"
#include "System/savestatemanager.h"

class GameVariables;
class Player;
class QCoreApplication;
class ScriptingEngine;

class Game: public QObject
{
    Q_OBJECT

    Console _console;
    SaveStateManager _save_state_manager;
    ScriptingEngine* _scripting_engine;

    // Game data.
    Event _current_event;
    std::vector<std::string> _help_pages;
    Player* _player;
    GameVariables* _game_vars;

    // Game state.
    bool _running;
    CombatState _combat_state;

    // Command handlers.
    bool handleDirectionCommand(Direction direction);
    void handleDrinkCommand();
    void handleEatCommand();
    bool handleEscapeCommand();
    bool handleFightCommand();
    void handleHelpCommand();
    bool handleLoadCommand(const std::string& save_file, bool confirmation_needed);
    bool handleLuckyCommand();
    void handleSaveCommand(const std::string& save_file);
    void handleSaveDelCommand(const std::string& save_file);
    void handleSaveListCommand();
    void handleStatsCommand();
    void handleTakeCommand(const std::string& item);

    void displayCombatStatus();
    void displayCurrentEvent();
    void displayCurrentEnemy();

    void resolveDamage(bool player_win, int damage);
    bool resolveYesNoQuestion();
    void updateCurrentEvent(int id, bool redirect = false);

    void checkForDeath();
    void handleCombatRound();

    GameState createGameState();
    void restoreGameState(const GameState& game_state);

    void characterCreation();
    void gameLoop();

public:
    explicit Game(QCoreApplication* parent);

    void setup();
    void titleScreen();

signals:
    void gameOver();

};

#endif // GAME_H
