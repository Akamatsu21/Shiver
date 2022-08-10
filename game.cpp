#include "game.h"
#include <iostream>
#include <sstream>
#include <string>
#include <QCoreApplication>
#include <QJSEngine>

#include "Models/gamestate.h"
#include "Models/gamevariables.h"
#include "Models/player.h"
#include "System/commandparser.h"
#include "System/scriptingengine.h"
#include "Utils/utils.h"

Game::Game(QCoreApplication* parent):
    QObject(parent),
    _console(),
    _save_state_manager(),
    _scripting_engine(new ScriptingEngine(this)),
    _current_event(1),
    _player(nullptr),
    _game_vars(new GameVariables(this)),
    _running(true),
    _combat_state{false, 0, 0, 0}
{
    connect(this, &Game::gameOver, parent, &QCoreApplication::quit, Qt::QueuedConnection);
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
        updateCurrentEvent(_current_event.getDestination(direction));
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
            msg += "\nYour starting luck has increased by 1!";
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

    int damage = 2;
    _console.writeText("Would you like to attempt a luck check to reduce the damage received while escaping?");
    if(resolveYesNoQuestion())
    {
        bool player_lucky = _player->performLuckCheck();
        damage = player_lucky ? 1 : 3;
        _console.writeText(player_lucky ? "Luck check successful!" : "Luck check failed!");
    }

    resolveDamage(false, damage);
    _current_event.defeatAllEnemies();
    _combat_state._combat_in_progress = false;
    _console.writeText("You have escaped!");
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
    int current_help_page = 1;
    while(current_help_page != 0)
    {
        current_help_page = _console.showHelpPage(current_help_page,
                                                  _help_pages.size(),
                                                  _help_pages.at(current_help_page - 1));
    }

    _console.restoreLog();
}

void Game::handleLoadCommand(const std::string& save_file)
{
    if(save_file.empty())
    {
        _console.writeText("Specify save file name.");
        return;
    }

    if(!_save_state_manager.saveFileExists(save_file))
    {
        _console.writeText(utils::createString("Save file \"",
                                               save_file,
                                               "\" not found."));
        return;
    }

    _console.writeText("Are you sure you want to load a saved game?");
    if(!resolveYesNoQuestion())
    {
        return;
    }

    try
    {
        _save_state_manager.loadSaveFile(save_file);
        restoreGameState(_save_state_manager.parseSaveFileContents());
    }
    catch(const std::runtime_error& e)
    {
        _console.writeError("Error encountered.");
        _console.writeError(e.what());
        _console.writeError("Load failed.");
    }
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

void Game::handleSaveCommand(const std::string& save_file)
{
    if(save_file.empty())
    {
        _console.writeText("Specify save file name.");
        return;
    }

    bool new_file = !_save_state_manager.saveFileExists(save_file);
    if(!new_file)
    {
        _console.writeText(utils::createString("Are you sure you want to overwrite save file \"",
                                               save_file,
                                               "\"?"));
        if(!resolveYesNoQuestion())
        {
            return;
        }
    }

    try
    {
        _save_state_manager.createSaveFileContents(createGameState());
        _save_state_manager.saveCurrentGameState(save_file);
        if(new_file)
        {
            _console.writeText(utils::createString("New save file \"",
                                                   save_file,
                                                   "\" created successfully."));
        }
        else
        {
            _console.writeText(utils::createString("Save file \"",
                                                   save_file,
                                                   "\" overwritten successfully."));
        }
    }
    catch(const std::system_error& e)
    {
        _console.writeError("Error encountered.");
        _console.writeError(e.what());
        _console.writeError("Save failed.");
    }
}

void Game::handleSaveDelCommand(const std::string& save_file)
{
    if(save_file.empty())
    {
        _console.writeText("Specify save file name.");
        return;
    }

    if(!_save_state_manager.saveFileExists(save_file))
    {
        _console.writeText(utils::createString("Save file \"",
                                               save_file,
                                               "\" not found."));
        return;
    }

    _console.writeText(utils::createString("Are you sure you want to delete save file \"",
                                           save_file,
                                           "\"?"));
    if(!resolveYesNoQuestion())
    {
        return;
    }

    try
    {
        _save_state_manager.deleteSaveFile(save_file);
        _console.writeText(utils::createString("Save file \"",
                                               save_file,
                                               "\" successfully deleted."));
    }
    catch(const std::system_error& e)
    {
        _console.writeError("Error encountered.");
        _console.writeError(e.what());
        _console.writeError("File deletion failed.");
    }
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
                                          "\nAgility: ",
                                          _player->getAgility(), "/", _player->getStartingAgility(),
                                          "\nConstitution: ",
                                          _player->getConstitution(), "/", _player->getStartingConstitution(),
                                          "\nLuck: ",
                                          _player->getLuck(), "/", _player->getStartingLuck(),
                                          "\nGold: ",
                                          _player->getGold(),
                                          "\nRations: ",
                                          _player->getRations(),
                                          "\n", _player->getElixirTypeAsString(), ": ",
                                          _player->getElixirCount(),
                                          "\n\nInventory:\n",
                                          _player->getInventory());
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
    std::string msg = utils::createString("\nRemaining constitution:\n[e]",
                              _current_event.getCurrentEnemy().getName(), "[/e]: ",
                              _current_event.getCurrentEnemy().getConstitution(),
                              "\n[p]Player[/p]: ",
                              _player->getConstitution());
    _console.writeText(msg);
    _console.writeLine();
}

void Game::displayCurrentEvent()
{
    _console.clearScreen();
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
                                          "[/e]\nAgility: ",
                                          _current_event.getCurrentEnemy().getAgility(),
                                          "\nConstitution: ",
                                          _current_event.getCurrentEnemy().getConstitution());
    _console.writeText(msg);
    _console.waitForAnyKey();
}

void Game::resolveDamage(bool player_win, int damage)
{
    std::string msg("");
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

bool Game::resolveYesNoQuestion()
{
    for(;;)
    {
        std::string user_input = _console.waitForInput();
        auto [valid, answer] = CommandParser::parseYesNo(user_input);
        if(valid)
        {
            return answer;
        }
        else
        {
            _console.writeText("Invalid answer. Please answer [c]yes[/c] or [c]no[/c].");
        }
    }
}

void Game::updateCurrentEvent(int id)
{
    _current_event = _scripting_engine->parseEvent(id);
    if(_current_event.hasEnemies())
    {
        _combat_state = { true, 0, 0, 0 };
    }
    displayCurrentEvent();
}

void Game::checkForDeath()
{
    if(_combat_state._combat_in_progress)
    {
        if(_current_event.getCurrentEnemy().getConstitution() == 0)
        {
            std::string msg = utils::createString("You have defeated [e]",
                                                  _current_event.getCurrentEnemy().getName(), "[/e]");
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
        _running = false;
        _combat_state._combat_in_progress = false;
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
                                              "\n[e]",_current_event.getCurrentEnemy().getName(), "[/e]'s score: ",
                                              _combat_state._enemy_score,
                                              "\n[p]Player[/p]'s score: ",
                                              _combat_state._player_score);
        _console.writeText(msg);

        if(_combat_state._player_score == _combat_state._enemy_score)
        {
            tie = true;
            _console.writeLine();
            _console.writeText("Rerolling dice...");
            _console.waitForAnyKey();
        }
        else
        {
            tie = false;
        }
    } while(tie);

}

GameState Game::createGameState()
{
    GameState game_state{};
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
        std::string item("");
        std::getline(ss, item);
        _player->addItem(item);
    }

    _game_vars->clear();
    ss.str(game_state._variables);
    ss.clear();
    while(!ss.eof())
    {
        std::string type("");
        std::string key("");
        std::getline(ss, type);
        std::getline(ss, key);
        if(type == "counter")
        {
            int counter(0);
            ss >> counter;
            ss.get();
            _game_vars->setCounter(QString::fromStdString(key), counter);
        }
        else if(type == "flag")
        {
            bool flag(false);
            ss >> flag;
            ss.get();
            _game_vars->setFlag(QString::fromStdString(key), flag);
        }
        else
        {
            terminate("Incorrect game state loaded. Error code: 3189");
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

void Game::characterCreation()
{
    _console.clearScreen();
    std::string msg = "Creating your character...\nRandomly assigning player stats:\n";
    int agility = utils::rollD6(1) + 6;
    int constitution = utils::rollD6(2) + 12;
    int luck = utils::rollD6(1) + 6;
    msg += utils::createString("Agility: ", agility,
                               "\nConstitution: ", constitution,
                               "\nLuck: ", luck,
                               "\n\nChoose one of the three stats. You will receive an elixir that can be used up to twice per game to recover that statistic back to the starting value.");
    _console.writeText(msg);

    ElixirType elixir = ElixirType::INVALID;
    while(elixir == ElixirType::INVALID)
    {
        std::string user_input = _console.waitForInput();
        elixir = CommandParser::parseElixirType(user_input);

        if(elixir == ElixirType::INVALID)
        {
            _console.writeText("Invalid choice.");
        }
    }

    _player = new Player(this, agility, constitution, luck, elixir);
    _scripting_engine->registerPlayer(_player);
    _console.writeText("\nThis is your character. Type [c]stats[/c] at any point to see this list.");
    handleStatsCommand();
    _console.writeText("\nYou are now ready to begin your adventure.");
    _console.waitForAnyKey();
}

void Game::gameLoop()
{
    updateCurrentEvent(1);
    while(_running)
    {
        std::string user_input = _console.waitForInput();
        auto [command, params] = CommandParser::parseCommand(user_input);
        switch(command)
        {
        case::Command::HELP:
            handleHelpCommand();
            continue;
        case::Command::STATS:
            handleStatsCommand();
            continue;
        case Command::NORTH:
        case Command::SOUTH:
        case Command::EAST:
        case Command::WEST:
            if(!handleDirectionCommand(utils::commandToDirection(command)))
            {
                continue;
            }
            break;
        case Command::FIGHT:
            if(!handleFightCommand())
            {
                continue;
            }
            break;
        case Command::ESCAPE:
            if(!handleEscapeCommand())
            {
                continue;
            }
            break;
        case Command::TAKE:
            handleTakeCommand(utils::parseParams(params));
            continue;
        case Command::EAT:
            handleEatCommand();
            continue;
        case Command::DRINK:
            handleDrinkCommand();
            continue;
        case Command::LUCKY:
            if(!handleLuckyCommand())
            {
                continue;
            }
            break;
        case Command::SAVE:
            handleSaveCommand(utils::parseParams(params));
            continue;
        case Command::LOAD:
            handleLoadCommand(utils::parseParams(params));
            continue;
        case Command::SAVELIST:
            handleSaveListCommand();
            continue;
        case Command::SAVEDEL:
            handleSaveDelCommand(utils::parseParams(params));
            continue;
        case Command::INVALID:
        default:
            _console.writeText("Invalid command.");
            continue;
        }

        checkForDeath();
        if(_combat_state._combat_in_progress)
        {
            handleCombatRound();
        }
    }

    emit gameOver();
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
        return;
    }

    bool title_screen = true;
    while(title_screen)
    {
        std::string user_input = _console.waitForInput();
        auto [command, params] = CommandParser::parseCommand(user_input);
        switch(command)
        {
        case Command::BEGIN:
            title_screen = false;
            break;
        case::Command::HELP:
            handleHelpCommand();
            continue;
        case Command::SAVE:
            _console.writeText("Please start a game first.");
            continue;
        case Command::LOAD:
            handleLoadCommand(utils::parseParams(params));
            continue;
        case Command::SAVELIST:
            handleSaveListCommand();
            continue;
        case Command::SAVEDEL:
            handleSaveDelCommand(utils::parseParams(params));
            continue;
        case Command::INVALID:
        default:
            _console.writeText("Invalid command.");
            continue;
        }
    }

    characterCreation();
    gameLoop();
}
