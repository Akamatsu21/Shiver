#ifndef GAME_H
#define GAME_H

#include <QObject>

#include "Enums/inputmode.h"
#include "Enums/playerstat.h"
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
    bool _game_won;
    CombatState _combat_state;
    unsigned int _current_help_page;
    std::string _save_file;

    // Object for exporting game information to JavaScript.
    ScriptApi* _script_api;


    // Helper variables for character creation.
    std::string _entered_name;
    std::tuple<int, int, int> _generated_stats;
    bool _conan;

    // Setup.
    void createPlayer(std::string name, int agility, int constitution, int luck, PlayerStat elixir);

    // Command handlers.
    bool handleDirectionCommand(Direction direction);   // true if valid movement
    void handleDrinkCommand();
    void handleEatCommand();
    bool handleEscapeCommand(); // true if valid
    bool handleFightCommand(); // true if needs to advance combat state
    void handleHelpCommand();
    void handleInspectCommand(const std::string& item_name);
    bool handleLoadCommand(const std::string& save_file, bool confirmation_needed); // true if successful
    bool handleLocalCommand(const std::string& input);  // true if valid
    bool handleLuckyCommand(); // true if needs to advance combat state
    bool handleSaveCommand(const std::string& save_file); // true if input mode change needed
    bool handleSaveDelCommand(const std::string& save_file); // true if valid
    void handleSaveListCommand();
    void handleSettingsCommand();
    void handleStatsCommand();
    bool handleTakeCommand(const std::string& item_name); // true if picked something up

    // Text display
    void displayCombatStatus();
    void displayCurrentEvent();
    void displayCurrentEnemy();
    void displayHelpPage();

    // Mechanics resolution
    void deleteSaveFile();
    void loadGame();
    void resolveDamage(bool player_win, int damage);
    std::optional<bool> resolveYesNoQuestion(const std::string& user_input);
    std::optional<std::string> resolveMultiChoiceQuestion(const std::vector<std::string>& options,
                                                          const std::string& user_input);
    bool resolveQuizQuestion(const std::vector<std::string>& answers, const std::string& user_input);
    InputMode updateCurrentEvent(int id, bool new_room);
    InputMode updateRoomExit(InputMode default_mode);
    void saveGame();

    // Game checks
    void checkForEnemyDeath();
    void handleCombatRound();
    bool performGameChecks(bool advance_combat_round = true);   // true if player died

    // Resolve triggers
    void resolveCombatEndTriggers(bool escape);
    void resolveDamageTriggers(int& damage);
    void resolveRoundActionTriggers(int round);
    void resolveRoundEndTriggers(int round);

    // Game state saving
    GameState createGameState();
    void restoreGameState(const GameState& game_state);

public:
    Game(QObject* parent, Console& console);
    void setup();

    Player* getPlayer();
    ScriptApi* getScriptApi();

    InputMode resolveCharacterCreationInput(const std::string& user_input);
    InputMode resolveEscapeInput(const std::string& user_input);
    InputMode resolveGameInput(const std::string& user_input);
    InputMode resolveGameStartInput();
    InputMode resolveLoadInput(const std::string& user_input);
    InputMode resolveMultiChoice(const std::string& user_input);
    InputMode resolveQuiz(const std::string& user_input);
    InputMode resolvePlayerNameInput(const std::string user_input);
    InputMode resolveRedirectInput();
    InputMode resolveSaveDelInput(const std::string& user_input);
    InputMode resolveSaveInput(const std::string& user_input);
    InputMode resolveTitleScreenInput(const std::string& user_input);
    InputMode resolveYesNoChoice(const std::string& user_input);

    void gameOverScreen();
    void titleScreen();
    void victoryScreen();
    void nextHelpPage();
    void previousHelpPage();
    void exitHelpPage();

    void updateEventRedirect(int id, bool new_room);

public slots:
    void onAddCondition(const QVariant& name);
    void onAddItem(const QVariant& id);
    void onDisableEnemyEscape();
    void onDisableRoomEscape();
    void onEnableEnemyEscape(int redirect);
    void onEnableRoomEscape(int redirect);
    void onRemoveCondition(const QVariant& name);
    void onRemoveItem(const QVariant& id);
    void onStopCombat();
    void onWinGame();

signals:
    void gameCrash();
};

#endif // GAME_H
