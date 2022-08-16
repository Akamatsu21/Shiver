#ifndef GAME_H
#define GAME_H

#include <QObject>

#include "Enums/inputmode.h"
#include "Models/event.h"
#include "Models/combatstate.h"
#include "System/savestatemanager.h"

class Console;
class GameVariables;
class Player;
class QCoreApplication;
class QQmlApplicationEngine;
class ScriptingEngine;

class Game: public QObject
{
    Q_OBJECT

    Console& _console;
    SaveStateManager _save_state_manager;
    ScriptingEngine* _scripting_engine;

    // Game data.
    Event _current_event;
    std::vector<std::string> _help_pages;
    Player* _player;
    GameVariables* _game_vars;

    // Game state.
    bool _game_running;
    CombatState _combat_state;
    std::tuple<int, int, int> _generated_stats;
    unsigned int _current_help_page;
    std::string _save_file;

    // Command handlers.
    bool handleDirectionCommand(Direction direction);
    void handleDrinkCommand();
    void handleEatCommand();
    bool handleEscapeCommand();
    bool handleFightCommand();
    void handleHelpCommand();
    bool handleLoadCommand(const std::string& save_file, bool confirmation_needed); // true if successful
    bool handleLocalCommand(const std::string& input);
    bool handleLuckyCommand();
    bool handleSaveCommand(const std::string& save_file); // true if input mode change needed
    bool handleSaveDelCommand(const std::string& save_file);
    void handleSaveListCommand();
    void handleStatsCommand();
    void handleTakeCommand(const std::string& item);

    // Text display
    void displayCombatStatus();
    void displayCurrentEvent();
    void displayCurrentEnemy();
    void displayHelpPage();

    // Mechanics resolution
    void characterCreation();
    void deleteSaveFile();
    void loadGame();
    void resolveDamage(bool player_win, int damage);
    std::pair<bool, bool> resolveYesNoQuestion(const std::string& user_input);
    std::pair<bool, std::string> resolveMultiChoiceQuestion(const std::vector<std::string>& options,
                                                            const std::string& user_input);
    InputMode updateCurrentEvent(int id, bool new_room);
    void saveGame();

    // Game checks
    void checkForDeath();
    void handleCombatRound();
    void performGameChecks();

    // Game state saving
    GameState createGameState();
    void restoreGameState(const GameState& game_state);

public:
    Game(QObject* parent, Console& console);
    void setup();

    InputMode resolveCharacterCreationInput(const std::string& user_input);
    InputMode resolveEscapeInput(const std::string& user_input);
    InputMode resolveGameInput(const std::string& user_input);
    InputMode resolveGameStartInput();
    InputMode resolveLoadInput(const std::string& user_input);
    InputMode resolveMultiChoice(const std::string& user_input);
    InputMode resolveRedirectInput();
    InputMode resolveSaveDelInput(const std::string& user_input);
    InputMode resolveSaveInput(const std::string& user_input);
    InputMode resolveTitleScreenInput(const std::string& user_input);
    InputMode resolveYesNoChoice(const std::string& user_input);

    void titleScreen();
    void nextHelpPage();
    void previousHelpPage();
    void exitHelpPage();

signals:
    void gameOver();
};

#endif // GAME_H
