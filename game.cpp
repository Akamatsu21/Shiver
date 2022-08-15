#include "game.h"
#include <iostream>
#include <sstream>
#include <string>
#include <QCoreApplication>
#include <QJSEngine>
#include <QQmlApplicationEngine>

#include "Models/gamestate.h"
#include "Models/gamevariables.h"
#include "Models/player.h"
#include "System/commandparser.h"
#include "System/console.h"
#include "System/scriptingengine.h"
#include "Utils/utils.h"

Game::Game(QObject* parent, Console& console):
    QObject(parent),
    _console(console),
    _save_state_manager(),
    _scripting_engine(new ScriptingEngine(this)),
    _current_event(1),
    _player(nullptr),
    _game_vars(new GameVariables(this)),
    _game_running(false),
    _combat_state{false, 0, 0, 0},
    _generated_stats{0, 0, 0},
    _current_help_page(0),
    _save_file("")
{

}

void Game::setup()
{
    try
    {
        _save_state_manager.initDirectories();
        _scripting_engine->loadModules();
        _scripting_engine->registerGameVariables(_game_vars);
        _help_pages = _scripting_engine->parseHelpPages();
    }
    catch(const std::runtime_error& e)
    {
        _console.writeError("Fatal error while loading the game.");
        _console.writeError(e.what());
        _console.writeError("Game terminated.");
        emit gameOver();
    }
}

bool Game::handleDirectionCommand(Direction direction)
{
    if(_combat_state._combat_in_progress)
    {
        _console.writeText("You have to defeat all enemies before you can travel.");
        return false;
    }

    if(_current_event.isDirectionAvailable(direction))
    {
        return true;
    }
    else
    {
        _console.writeText("Direction unavailable.");
        return false;
    }
}

void Game::handleDrinkCommand()
{
    if(_player->drinkElixir())
    {
        std::string stat;
        switch(_player->getElixirType())
        {
        case ElixirType::AGILITY:
            stat =  "Agility";
            break;
        case ElixirType::CONSTITUTION:
            stat = "Constitution";
            break;
        case ElixirType::LUCK:
            stat = "Luck";
            break;
        case ElixirType::INVALID:
        default:
            _console.writeError("Error: Impossible game state.");
            break;
        }

        std::string msg = utils::createString("You drank your elixir. ", stat, " restored to the starting value.");
        if(_player->getElixirType() == ElixirType::LUCK)
        {
            msg += "<br />Your starting luck has increased by 1!";
        }
        _console.writeText(msg);
    }
    else
    {
        _console.writeText("You don't have any elixir left!");
    }
}

void Game::handleEatCommand()
{
    if(_combat_state._combat_in_progress)
    {
        _console.writeText("You have to defeat all enemies before you can eat.");
        return;
    }

    if(_player->eatRation())
    {
        _console.writeText("You consume a Ration and recover 4 Constitution.");
    }
    else
    {
        _console.writeText("You don't have any rations left!");
    }
}

bool Game::handleEscapeCommand()
{
    if(!_combat_state._combat_in_progress)
    {
        _console.writeText("No enemies present!");
        return false;
    }

    _console.writeText("Would you like to attempt a luck check to reduce the damage received while escaping?");
    return true;
}

bool Game::handleFightCommand()
{
    if(!_combat_state._combat_in_progress)
    {
        _console.writeText("No enemies present!");
        return false;
    }

    resolveDamage(_combat_state._player_score > _combat_state._enemy_score, 2);
    displayCombatStatus();
    return true;
}

void Game::handleHelpCommand()
{
    _current_help_page = 1;
    displayHelpPage();
}

bool Game::handleLoadCommand(const std::string& save_file, bool confirmation_needed)
{
    if(save_file.empty())
    {
        _console.writeText("Specify save file name.");
        return false;
    }

    if(!_save_state_manager.saveFileExists(save_file))
    {
        _console.writeText(utils::createString("Save file \"",
                                               save_file,
                                               "\" not found."));
        return false;
    }

    _save_file = save_file;
    if(confirmation_needed)
    {
        _console.writeText("Are you sure you want to load a saved game?");
        return true;
    }
    else
    {
        loadGame();
        return true;
    }
}

bool Game::handleLocalCommand(const std::string& input)
{
    if(_current_event.hasLocalCommands())
    {
        std::string command = utils::toLower(input);
        const std::vector<std::string>& local_commands = _current_event.getLocalCommands();
        bool valid = std::find(std::begin(local_commands),
                               std::end(local_commands),
                               command) != std::end(local_commands);
        if(valid)
        {
            if(_combat_state._combat_in_progress)
            {
                _console.writeText("You have to defeat all enemies first.");
                return false;
            }
            else
            {
                return true;
            }
        }
    }

    return false;
}

bool Game::handleLuckyCommand()
{
    if(!_combat_state._combat_in_progress)
    {
        _console.writeText("No enemies present!");
        return false;
    }

    bool player_win = _combat_state._player_score > _combat_state._enemy_score;
    bool player_lucky = _player->performLuckCheck();
    int damage = 0;
    if(player_win)
    {
        damage = player_lucky ? 4 : 1;
    }
    else
    {
        damage = player_lucky ? 1 : 3;
    }

    _console.writeText(player_lucky ? "Luck check successful!" : "Luck check failed!");
    resolveDamage(player_win, damage);
    displayCombatStatus();
    return true;
}

bool Game::handleSaveCommand(const std::string& save_file)
{
    if(save_file.empty())
    {
        _console.writeText("Specify save file name.");
        return false;
    }

    _save_file = save_file;
    bool new_file = !_save_state_manager.saveFileExists(_save_file);
    if(new_file)
    {
        saveGame();
        return false;
    }
    else
    {
        _console.writeText(utils::createString("Are you sure you want to overwrite save file \"",
                                               _save_file,
                                               "\"?"));
        return true;
    }
}

bool Game::handleSaveDelCommand(const std::string& save_file)
{
    if(save_file.empty())
    {
        _console.writeText("Specify save file name.");
        return false;
    }

    if(!_save_state_manager.saveFileExists(save_file))
    {
        _console.writeText(utils::createString("Save file \"",
                                               save_file,
                                               "\" not found."));
        return false;
    }

    _save_file = save_file;
    _console.writeText(utils::createString("Are you sure you want to delete save file \"",
                                           _save_file,
                                           "\"?"));
    return true;
}

void Game::handleSaveListCommand()
{
    std::string save_list = _save_state_manager.listSaveFiles();
    if(save_list.empty())
    {
        _console.writeText("No save files found.");
    }
    else
    {
        _console.writeText(_save_state_manager.listSaveFiles());
    }
}

void Game::handleStatsCommand()
{
    std::string msg = utils::createString("[p]Adventurer[/p]",
                                          "<br />Agility: ",
                                          _player->getAgility(), "/", _player->getStartingAgility(),
                                          "<br />Constitution: ",
                                          _player->getConstitution(), "/", _player->getStartingConstitution(),
                                          "<br />Luck: ",
                                          _player->getLuck(), "/", _player->getStartingLuck(),
                                          "<br />Gold: ",
                                          _player->getGold(),
                                          "<br />Rations: ",
                                          _player->getRations(),
                                          "<br />", _player->getElixirTypeAsString(), ": ",
                                          _player->getElixirCount(),
                                          "<br /><br />Inventory:<br />",
                                          _player->getInventoryHtml());
    _console.writeText(msg);
}

void Game::handleTakeCommand(const std::string& item)
{
    if(_combat_state._combat_in_progress)
    {
        _console.writeText("You have to defeat all enemies before you can pick up items.");
        return;
    }
    else if(item.empty())
    {
        _console.writeText("Specify which item to take.");
        return;
    }

    if(utils::toLower(item) == "gold")
    {
        if(_current_event.hasGold())
        {
            _player->modifyGold(_current_event.getGold());
            _current_event.setHasGold(false);
            _console.writeText(utils::createString("You picked up ", _current_event.getGold(), " gold."));
        }
        else
        {
            _console.writeText("No gold to pick up here.");
        }
        return;
    }

    std::string found_item = _current_event.findItem(item);
    if(found_item.empty())
    {
        _console.writeText("Item not found in this room.");
    }
    else
    {
        if(_player->hasItem(found_item))
        {
            _console.writeText("You've already picked up this item.");
        }
        else if(_current_event.getItemLimit() < 1)
        {
            _console.writeText("You cannot take any more items from this room.");
        }
        else
        {
            _current_event.takeItem();
            _player->addItem(found_item);
            _console.writeText(utils::createString("[i]", found_item, "[/i] added to your inventory."));
        }
    }
}

void Game::displayCombatStatus()
{
    std::string msg = utils::createString("<br />Remaining constitution:<br />[e]",
                              _current_event.getCurrentEnemy().getName(), "[/e]: ",
                              _current_event.getCurrentEnemy().getConstitution(),
                              "<br />[p]Player[/p]: ",
                              _player->getConstitution());
    _console.writeText(msg);
    _console.writeLine();
}

void Game::displayCurrentEvent()
{
    _console.writeText(_current_event.getDescription());
    if(_combat_state._combat_in_progress)
    {
        displayCurrentEnemy();
    }
}

void Game::displayCurrentEnemy()
{
    _console.writeLine();
    std::string msg = utils::createString("You are fighting against [e]",
                                          _current_event.getCurrentEnemy().getName(),
                                          "[/e]<br />Agility: ",
                                          _current_event.getCurrentEnemy().getAgility(),
                                          "<br />Constitution: ",
                                          _current_event.getCurrentEnemy().getConstitution());
    _console.writeText(msg);
    _console.writeLine();
}

void Game::displayHelpPage()
{
    _console.showHelpPage(_current_help_page,
                          _help_pages.size(),
                          _help_pages.at(_current_help_page - 1));
}

void Game::characterCreation()
{
    _console.clearScreen();
    std::string msg = "Creating your character...<br />Randomly assigning player stats:<br />";
    int agility = utils::rollD6(1) + 6;
    int constitution = utils::rollD6(2) + 12;
    int luck = utils::rollD6(1) + 6;
    _generated_stats = std::make_tuple(agility, constitution, luck);

    msg += utils::createString("Agility: ", agility,
                               "<br />Constitution: ", constitution,
                               "<br />Luck: ", luck,
                               "<br /><br />Choose one of the three stats. You will receive an elixir that can be used up to twice per game to recover that statistic back to the starting value.");
    _console.writeText(msg);
}

void Game::deleteSaveFile()
{
    try
    {
        _save_state_manager.deleteSaveFile(_save_file);
        _console.writeText(utils::createString("Save file \"",
                                               _save_file,
                                               "\" successfully deleted."));
        _save_file = "";
    }
    catch(const std::system_error& e)
    {
        _console.writeError("Error encountered.");
        _console.writeError(e.what());
        _console.writeError("File deletion failed.");
    }
}

void Game::loadGame()
{
    try
    {
        _save_state_manager.loadSaveFile(_save_file);
        restoreGameState(_save_state_manager.parseSaveFileContents());
        _save_file = "";
        _game_running = true;
    }
    catch(const std::runtime_error& e)
    {
        _console.writeError("Error encountered.");
        _console.writeError(e.what());
        _console.writeError("Load failed.");
    }
}

void Game::resolveDamage(bool player_win, int damage)
{
    std::string msg;
    if(player_win)
    {
        _current_event.getCurrentEnemy().modifyConstitution(-damage);

        msg += utils::createString("You deal ", damage, " damage to [e]",
                                   _current_event.getCurrentEnemy().getName(), "[/e]");
    }
    else
    {
        _player->modifyConstitution(-damage);

        msg += utils::createString("[e]", _current_event.getCurrentEnemy().getName(),
                                   "[/e] deals ", damage, " damage to you");
    }

    _console.writeText(msg);
}

std::pair<bool, bool> Game::resolveYesNoQuestion(const std::string& user_input)
{
    auto [valid, answer] = CommandParser::parseYesNo(user_input);
    if(!valid)
    {
        _console.writeText("Invalid answer. Please answer [o]yes[/o] or [o]no[/o].");
    }

    return {valid, answer};
}

std::pair<bool, std::string> Game::resolveMultiChoiceQuestion(const std::vector<std::string>& options,
                                                              const std::string& user_input)
{
    std::string answer = utils::toLower(user_input);
    bool valid = std::find(std::begin(options), std::end(options), answer) != std::end(options);
    if(!valid)
    {
        _console.writeText("Invalid answer. Please choose one of the highlighted answers.");
    }

    return {valid, answer};
}

InputMode Game::updateCurrentEvent(int id, bool new_room)
{
    InputMode mode = InputMode::GAME;
    _current_event = _scripting_engine->parseEvent(id);
    if(_current_event.hasEnemies())
    {
        _combat_state = { true, 0, 0, 0 };
    }

    if(new_room)
    {
        _console.clearScreen();
    }
    displayCurrentEvent();

    if(_current_event.getRedirect() != 0)
    {
        mode = InputMode::KEY_REDIRECT;
    }
    else if(_current_event.hasYesNoChoice())
    {
        _console.writeLine();
        _console.writeText(_current_event.getChoice()._question);
        mode = InputMode::YES_NO_CHOICE;
    }
    else if(_current_event.hasMultiChoice())
    {
        _console.writeLine();
        _console.writeText(_current_event.getChoice()._question);
        mode = InputMode::MULTI_CHOICE;
    }

    return mode;
}

void Game::saveGame()
{
    try
    {
        bool new_file = !_save_state_manager.saveFileExists(_save_file);
        _save_state_manager.createSaveFileContents(createGameState());
        _save_state_manager.saveCurrentGameState(_save_file);
        if(new_file)
        {
            _console.writeText(utils::createString("New save file \"",
                                                   _save_file,
                                                   "\" created successfully."));
        }
        else
        {
            _console.writeText(utils::createString("Save file \"",
                                                   _save_file,
                                                   "\" overwritten successfully."));
        }
        _save_file = "";
    }
    catch(const std::system_error& e)
    {
        _console.writeError("Error encountered.");
        _console.writeError(e.what());
        _console.writeError("Save failed.");
    }
}

void Game::checkForDeath()
{
    if(_combat_state._combat_in_progress)
    {
        if(_current_event.getCurrentEnemy().getConstitution() == 0)
        {
            std::string msg = utils::createString("You have defeated [e]",
                                                  _current_event.getCurrentEnemy().getName(), "[/e]");
            if(!_current_event.getCurrentEnemy().getDeathText().empty())
            {
                msg += "<br />" + _current_event.getCurrentEnemy().getDeathText();
            }
            _console.writeText(msg);
            _current_event.getCurrentEnemy().triggerOnDeathCallback();
            _current_event.defeatCurrentEnemy();

            if(!_current_event.hasEnemies())
            {
                _combat_state._combat_in_progress = false;
            }
            else
            {
                _combat_state._combat_round = 0;
                displayCurrentEnemy();
            }
        }
    }

    if(_player->getConstitution() == 0)
    {
        _console.writeText("You are dead!");
        _combat_state._combat_in_progress = false;
        emit gameOver();
    }
}

void Game::handleCombatRound()
{
    ++_combat_state._combat_round;
    bool tie = false;
    do
    {
        _combat_state._enemy_score = utils::rollD6(2) + _current_event.getCurrentEnemy().getAgility();
        _combat_state._player_score = utils::rollD6(2) + _player->getAgility();

        std::string msg = utils::createString("Combat round ",
                                              _combat_state._combat_round,
                                              "<br />[e]",_current_event.getCurrentEnemy().getName(), "[/e]'s score: ",
                                              _combat_state._enemy_score,
                                              "<br />[p]Player[/p]'s score: ",
                                              _combat_state._player_score);
        _console.writeText(msg);

        if(_combat_state._player_score == _combat_state._enemy_score)
        {
            tie = true;
            _console.writeLine();
            _console.writeText("Rerolling dice...");
            _console.writeLine();
        }
        else
        {
            tie = false;
        }
    } while(tie);

}

void Game::performGameChecks()
{
    checkForDeath();
    if(_combat_state._combat_in_progress)
    {
        handleCombatRound();
    }
}

GameState Game::createGameState()
{
    GameState game_state = {};
    game_state._player_agility = _player->getAgility();
    game_state._player_constitution = _player->getConstitution();
    game_state._player_luck = _player->getLuck();
    game_state._player_start_agility = _player->getStartingAgility();
    game_state._player_start_constitution = _player->getStartingConstitution();
    game_state._player_start_luck = _player->getStartingLuck();
    game_state._player_gold = _player->getGold();
    game_state._player_rations = _player->getRations();
    game_state._player_elixir_count = _player->getElixirCount();
    game_state._player_elixir_type = static_cast<int>(_player->getElixirType());
    game_state._player_inventory = _player->getInventory();

    game_state._event_id = _current_event.getId();
    game_state._event_enemy_present = _current_event.hasEnemies();
    if(_current_event.hasEnemies())
    {
        game_state._event_enemy_name = _current_event.getCurrentEnemy().getName();
        game_state._event_enemy_constitution = _current_event.getCurrentEnemy().getConstitution();
    }
    game_state._event_gold_present = _current_event.hasGold();
    game_state._event_items_present = _current_event.hasItems();
    if(_current_event.hasItems())
    {
        game_state._event_item_limit = _current_event.getItemLimit();
    }

    game_state._combat_in_progress = _combat_state._combat_in_progress;
    if(_combat_state._combat_in_progress)
    {
        game_state._combat_round = _combat_state._combat_round;
        game_state._combat_enemy_score = _combat_state._enemy_score;
        game_state._combat_player_score = _combat_state._player_score;
    }

    game_state._log = _console.getLogContents();
    game_state._variables = _game_vars->toString();

    return game_state;
}

void Game::restoreGameState(const GameState& game_state)
{
    auto terminate = [this](const char* msg)
    {
        _console.writeError("Fatal error while loading savefile.");
        _console.writeError(msg);
        _console.writeError("Game terminated.");
        emit gameOver();
    };

    delete _player;
    _player = new Player(this,
                         game_state._player_start_agility,
                         game_state._player_start_constitution,
                         game_state._player_start_luck,
                         static_cast<ElixirType>(game_state._player_elixir_type));

    try
    {
        _player->setAgility(game_state._player_agility);
        _player->setConstitution(game_state._player_constitution);
        _player->setLuck(game_state._player_luck);
        _player->setGold(game_state._player_gold);
        _player->setRations(game_state._player_rations);
        _player->setElixirCount(game_state._player_elixir_count);
    }
    catch(const std::out_of_range& e)
    {
        terminate(e.what());
    }
    _scripting_engine->registerPlayer(_player);

    std::istringstream ss(game_state._player_inventory);
    while(!ss.eof())
    {
        std::string item;
        std::getline(ss, item);
        _player->addItem(item);
    }

    _game_vars->clear();
    if(!game_state._variables.empty())
    {
        ss.str(game_state._variables);
        ss.clear();
        while(!ss.eof())
        {
            std::string type, key;
            std::getline(ss, type);
            std::getline(ss, key);
            if(type == "counter")
            {
                int counter = 0;
                ss >> counter;
                ss.get();
                _game_vars->setCounter(QString::fromStdString(key), counter);
            }
            else if(type == "flag")
            {
                bool flag = false;
                ss >> flag;
                ss.get();
                _game_vars->setFlag(QString::fromStdString(key), flag);
            }
            else
            {
                terminate("Incorrect game state loaded. Error code: 3189");
            }
        }
    }

    _current_event = _scripting_engine->parseEvent(game_state._event_id);
    if(game_state._event_enemy_present)
    {
        if(!_current_event.hasEnemies())
        {
            terminate("Incorrect game state loaded. Error code: 5554");
        }

        while(_current_event.getCurrentEnemy().getName() != game_state._event_enemy_name)
        {
            _current_event.defeatCurrentEnemy();
        }

        try
        {
            _current_event.getCurrentEnemy().setConstitution(game_state._event_enemy_constitution);
        }
        catch(const std::out_of_range& e)
        {
            terminate(e.what());
        }
    }
    else
    {
        if(_current_event.hasEnemies())
        {
            _current_event.defeatAllEnemies();
        }
    }

    _current_event.setHasGold(game_state._event_gold_present);

    if(game_state._event_items_present)
    {
        if(!_current_event.hasItems())
        {
            terminate("Incorrect game state loaded. Error code: 9254");
        }
        _current_event.setItemLimit(game_state._event_item_limit);
    }

    _combat_state._combat_in_progress = game_state._combat_in_progress;
    if(game_state._combat_in_progress)
    {
        if(!_current_event.hasEnemies())
        {
            terminate("Incorrect game state loaded. Error code: 3642");
        }
        _combat_state._combat_round = game_state._combat_round;
        _combat_state._enemy_score = game_state._combat_enemy_score;
        _combat_state._player_score = game_state._combat_player_score;
    }

    _console.setLog(game_state._log);
    _console.restoreLog();
}

InputMode Game::resolveCharacterCreationInput(const std::string& user_input)
{
    InputMode mode = InputMode::CHARACTER_CREATION;
    ElixirType elixir = ElixirType::INVALID;
    elixir = CommandParser::parseElixirType(user_input);
    if(elixir == ElixirType::INVALID)
    {
        _console.writeText("Invalid choice.");
    }
    else
    {
        auto [agility, constitution, luck] = _generated_stats;
        _player = new Player(this, agility, constitution, luck, elixir);
        _scripting_engine->registerPlayer(_player);
        _console.writeText("<br />This is your character. Type [c]stats[/c] at any point to see this list.");
        handleStatsCommand();
        _console.writeText("<br />You are now ready to begin your adventure.<br />Please press enter to continue.");
        mode = InputMode::KEY_GAME_START;
    }

    return mode;
}

InputMode Game::resolveEscapeInput(const std::string& user_input)
{
    InputMode mode = InputMode::ESCAPE_CHECK;
    int damage = 2;
    auto [valid, answer] = resolveYesNoQuestion(user_input);


    if(valid)
    {
        if(answer)
        {
            bool player_lucky = _player->performLuckCheck();
            damage = player_lucky ? 1 : 3;
            _console.writeText(player_lucky ? "Luck check successful!" : "Luck check failed!");
        }

        mode = InputMode::GAME;
        resolveDamage(false, damage);
        _current_event.defeatAllEnemies();
        _combat_state._combat_in_progress = false;
        _console.writeText("You have escaped!");
    }

    return mode;
}

InputMode Game::resolveGameInput(const std::string& user_input)
{
    InputMode mode = InputMode::GAME;
    bool perform_game_checks = false;
    auto [command, params] = CommandParser::parseCommand(user_input);
    switch(command)
    {
    case::Command::HELP:
        handleHelpCommand();
        mode = InputMode::HELP;
        break;
    case::Command::STATS:
        handleStatsCommand();
        break;
    case Command::NORTH:
    case Command::SOUTH:
    case Command::EAST:
    case Command::WEST:
        if(handleDirectionCommand(utils::commandToDirection(command)))
        {
            perform_game_checks = true;
            mode = updateCurrentEvent(_current_event.getDestination(utils::commandToDirection(command)));
        }
        break;
    case Command::FIGHT:
        perform_game_checks = handleFightCommand();
        break;
    case Command::ESCAPE:
        if(handleEscapeCommand())
        {
            mode = InputMode::ESCAPE_CHECK;
        }
        break;
    case Command::TAKE:
        handleTakeCommand(utils::parseParams(params));
        break;
    case Command::EAT:
        handleEatCommand();
        break;
    case Command::DRINK:
        handleDrinkCommand();
        break;
    case Command::LUCKY:
        perform_game_checks = handleLuckyCommand();
        break;
    case Command::SAVE:
        if(handleSaveCommand(utils::parseParams(params)))
        {
            mode = InputMode::SAVE_CONFIRMATION;
        }
        break;
    case Command::LOAD:
        if(handleLoadCommand(utils::parseParams(params), true))
        {
            mode = InputMode::LOAD_CONFIRMATION;
        }
        break;
    case Command::SAVELIST:
        handleSaveListCommand();
        break;
    case Command::SAVEDEL:
        if(handleSaveDelCommand(utils::parseParams(params)))
        {
            mode = InputMode::SAVEDEL_CONFIRMATION;
        }
        break;
    case Command::INVALID:
    default:
        if(handleLocalCommand(user_input))
        {
            perform_game_checks = true;
            mode = updateCurrentEvent(_current_event.getLocalCommandRedirect(utils::toLower(user_input)));
        }
        else
        {
            _console.writeText("Invalid command.");
        }
        break;
    }

    if(perform_game_checks)
    {
        performGameChecks();
    }

    return mode;
}

InputMode Game::resolveGameStartInput()
{
    _game_running = true;
    InputMode mode = updateCurrentEvent(1);
    performGameChecks();
    return mode;
}

InputMode Game::resolveLoadInput(const std::string& user_input)
{
    InputMode mode = InputMode::LOAD_CONFIRMATION;
    auto [valid, answer] = resolveYesNoQuestion(user_input);

    if(valid)
    {
        mode = InputMode::GAME;
        if(answer)
        {
            loadGame();
        }
    }

    return mode;
}

InputMode Game::resolveMultiChoice(const std::string& user_input)
{
    InputMode mode = InputMode::MULTI_CHOICE;
    auto [valid, answer] = resolveMultiChoiceQuestion(
                utils::getKeys(_current_event.getChoice()._options),
                user_input);
    if(valid)
    {
        _console.writeLine();
        mode = updateCurrentEvent(_current_event.getChoice()._options.at(answer),
                                  _current_event.leadsToNewRoom());
        performGameChecks();
    }

    return mode;
}

InputMode Game::resolveRedirectInput()
{
    InputMode mode = updateCurrentEvent(_current_event.getRedirect(),
                                        _current_event.leadsToNewRoom());
    performGameChecks();
    return mode;
}

InputMode Game::resolveSaveDelInput(const std::string& user_input)
{
    InputMode mode = InputMode::SAVEDEL_CONFIRMATION;
    auto [valid, answer] = resolveYesNoQuestion(user_input);

    if(valid)
    {
        mode = _game_running ? InputMode::GAME : InputMode::TITLE_SCREEN;
        if(answer)
        {
            deleteSaveFile();
        }
    }

    return mode;
}

InputMode Game::resolveSaveInput(const std::string& user_input)
{
    InputMode mode = InputMode::SAVE_CONFIRMATION;
    auto [valid, answer] = resolveYesNoQuestion(user_input);

    if(valid)
    {
        mode = InputMode::GAME;
        if(answer)
        {
            saveGame();
        }
    }

    return mode;
}

InputMode Game::resolveTitleScreenInput(const std::string& user_input)
{
    InputMode mode = InputMode::TITLE_SCREEN;
    auto [command, params] = CommandParser::parseCommand(user_input);
    switch(command)
    {
    case Command::BEGIN:
        characterCreation();
        mode = InputMode::CHARACTER_CREATION;
        break;
    case::Command::HELP:
        handleHelpCommand();
        mode = InputMode::HELP;
        break;
    case Command::SAVE:
        _console.writeText("Please start a game first.");
        break;
    case Command::LOAD:
        if(handleLoadCommand(utils::parseParams(params), false))
        {
            mode = InputMode::GAME;
        }
        break;
    case Command::SAVELIST:
        handleSaveListCommand();
        break;
    case Command::SAVEDEL:
        if(handleSaveDelCommand(utils::parseParams(params)))
        {
            mode = InputMode::SAVEDEL_CONFIRMATION;
        }
        break;
    case Command::INVALID:
    default:
        _console.writeText("Invalid command.");
        break;
    }

    return mode;
}

InputMode Game::resolveYesNoChoice(const std::string& user_input)
{
    InputMode mode = InputMode::YES_NO_CHOICE;
    auto [valid, answer] = resolveYesNoQuestion(user_input);
    if(valid)
    {
        _console.writeLine();
        mode = updateCurrentEvent(_current_event.getChoice()._options.at(answer ? "yes" : "no"),
                                  _current_event.leadsToNewRoom());
        performGameChecks();
    }

    return mode;
}

void Game::titleScreen()
{
    try
    {
        _console.clearScreen();
        _console.writeText(utils::getTitleScreenText());
    }
    catch(const std::system_error& e)
    {
        _console.writeError("Error encountered.");
        _console.writeError(e.what());
        _console.writeError("Game couldn't be started.");
    }
}

void Game::nextHelpPage()
{
    if(_current_help_page < _help_pages.size())
    {
        ++_current_help_page;
        displayHelpPage();
    }
}

void Game::previousHelpPage()
{
    if(_current_help_page > 1)
    {
        --_current_help_page;
        displayHelpPage();
    }
}

void Game::exitHelpPage()
{
    _current_help_page = 0;
    _console.restoreLog();
}
