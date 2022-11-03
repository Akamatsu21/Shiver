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
class ScriptApi;
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

    // Object for exporting game information to JavaScript.
    ScriptApi* _script_api;

    // Secret switch.
    bool _conan;

    // Command handlers.
    bool handleDirectionCommand(Direction direction);   // true if valid movement
    void handleDrinkCommand();
    void handleEatCommand();
    bool handleEscapeCommand(); // true if valid
    bool handleFightCommand();  // true if valid
    void handleHelpCommand();
    bool handleLoadCommand(const std::string& save_file, bool confirmation_needed); // true if successful
    bool handleLocalCommand(const std::string& input);  // true if valid
    bool handleLuckyCommand();  // true if valid
    bool handleSaveCommand(const std::string& save_file); // true if input mode change needed
    bool handleSaveDelCommand(const std::string& save_file); // true if valid
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
    InputMode updateRoomExit(InputMode default_mode);
    void saveGame();

    // Game checks
    void checkForEnemyDeath();
    void handleCombatRound();
    bool performGameChecks();   // true if player died

    // Resolve triggers
    void resolveCombatEndTriggers();
    void resolveRoundActionTriggers(int round);
    void resolveRoundEndTriggers(int round);

    // Game state saving
    GameState createGameState();
    void restoreGameState(const GameState& game_state);

public:
    Game(QObject* parent, Console& console);
    void setup();

    ScriptApi* getScriptApi();

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

    void gameOverScreen();
    void titleScreen();
    void nextHelpPage();
    void previousHelpPage();
    void exitHelpPage();

    void updateEventRedirect(int id, bool new_room);

public slots:
    void onAddCondition(const QVariant& name);
    void onDisableEscape();
    void onEnableEscape(int redirect);
    void onRemoveCondition(const QVariant& name);
    void onStopCombat();

signals:
    void gameCrash();
};

#endif // GAME_H
