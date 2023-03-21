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
#include "Models/scriptapi.h"
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
    _save_file(""),
    _script_api(new ScriptApi(this, _current_event, _combat_state)),
    _conan(false)
{

}

void Game::setup()
{
    try
    {
        _save_state_manager.initDirectories();
        _scripting_engine->registerEnums();
        _scripting_engine->registerScriptApi(_script_api);
        _scripting_engine->registerGameVariables(_game_vars);
        _scripting_engine->loadModules();
        _help_pages = _scripting_engine->parseHelpPages();
    }
    catch(const std::runtime_error& e)
    {
        _console.writeError("Fatal error while loading the game.");
        _console.writeError(e.what());
        _console.writeError("Game terminated.");
        emit gameCrash();
    }
}

ScriptApi* Game::getScriptApi()
{
    return _script_api;
}

bool Game::handleDirectionCommand(Direction direction)
{
    if(_combat_state.combat_in_progress)
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
        case PlayerStat::AGILITY:
            stat =  "Agility";
            break;
        case PlayerStat::CONSTITUTION:
            stat = "Constitution";
            break;
        case PlayerStat::LUCK:
            stat = "Luck";
            break;
        default:
            _console.writeError("Error: Impossible game state.");
            break;
        }

        std::string msg = utils::createString("You drank your elixir. ",
                                              stat, " restored to the starting value.");
        if(_player->getElixirType() == PlayerStat::LUCK)
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
    if(_combat_state.combat_in_progress)
    {
        _console.writeText("You have to defeat all enemies before you can eat.");
        return;
    }
    else if(!_current_event.isEatingEnabled())
    {
        _console.writeText("Eating not allowed in this location.");
        return;
    }

    if(_current_event.hasEatingCallback())
    {
        _current_event.triggerEatingCallback();
        _current_event.setEatingEnabled(false);
    }
    else if(_player->eatRation())
    {
        _current_event.setEatingEnabled(false);
        _console.writeText("You consume a ration and recover 4 Constitution.");
    }
    else
    {
        _console.writeText("You don't have any rations left!");
    }
}

bool Game::handleEscapeCommand()
{
    if(_current_event.getEscapeRedirect() == 0)
    {
        if(!_combat_state.combat_in_progress)
        {
            _console.writeText("No enemies present!");
            return false;
        }
        else if(!_current_event.getCurrentEnemy().isEscapeEnabled())
        {
            _console.writeText("Escape not enabled in this fight!");
            return false;
        }
    }

    _console.writeText("Would you like to attempt a luck check to reduce the damage received while escaping?");
    return true;
}

bool Game::handleFightCommand()
{
    if(!_combat_state.combat_in_progress)
    {
        _console.writeText("No enemies present!");
        return false;
    }

    resolveRoundActionTriggers(_combat_state.combat_round);
    if(!_combat_state.combat_in_progress)
    {
        // Trigger ended the combat.
        return false;
    }

    resolveDamage(_combat_state.player_score > _combat_state.enemy_score, 2);
    displayCombatStatus();
    resolveRoundEndTriggers(_combat_state.combat_round);
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
    }
    else
    {
        loadGame();
    }
    return true;
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
            return !_combat_state.combat_in_progress;
        }
    }

    return false;
}

bool Game::handleLuckyCommand()
{
    if(!_combat_state.combat_in_progress)
    {
        _console.writeText("No enemies present!");
        return false;
    }

    resolveRoundActionTriggers(_combat_state.combat_round);
    if(!_combat_state.combat_in_progress)
    {
        // Trigger ended the combat.
        return false;
    }

    bool player_win = _combat_state.player_score > _combat_state.enemy_score;
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
    resolveRoundEndTriggers(_combat_state.combat_round);
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
    if(!_save_state_manager.saveFileExists(_save_file))
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
        _console.writeText(save_list);
    }
}

void Game::handleStatsCommand()
{
    std::string player_name = _conan ? "Conan The Barbarian King"
                                     : "Adventurer";
    auto createModString = [](int val)
    {
        if(val == 0)
        {
            return std::string();
        }
        else
        {
            return utils::createString(" (",
                                       (val > 0 ? "+" : ""),
                                       val,
                                       ")");
        }
    };

    std::string msg = utils::createString("[p]", player_name, "[/p]",
                                          "<br />Agility: ",
                                            _player->getAgilityWithoutModifiers(),
                                            "/", _player->getStartingAgility(),
                                            createModString(_player->getAgilityModifier()),
                                          "<br />Constitution: ",
                                            _player->getConstitutionWithoutModifiers(),
                                            "/", _player->getStartingConstitution(),
                                            createModString(_player->getConstitutionModifier()),
                                          "<br />Luck: ",
                                            _player->getLuckWithoutModifiers(),
                                            "/", _player->getStartingLuck(),
                                            createModString(_player->getLuckModifier()),
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
    if(_combat_state.combat_in_progress)
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

            QVariant flag = QString::fromStdString(utils::createString(_current_event.getId(),
                                                                       "_gold_taken"));
            _game_vars->setFlag(flag, true);
        }
        else
        {
            _console.writeText("No gold to pick up here.");
        }
        return;
    }
    else if(utils::toLower(item) == "ration" || utils::toLower(item) == "rations")
    {
        if(_current_event.hasRations())
        {
            _player->modifyRations(_current_event.getRations());
            _current_event.setHasRations(false);

            if(_current_event.getRations() == 1)
            {
                _console.writeText("You picked up a ration.");
            }
            else
            {
                _console.writeText(utils::createString("You picked up ",
                                                       _current_event.getRations(),
                                                       " rations."));
            }

            QVariant flag = QString::fromStdString(utils::createString(_current_event.getId(),
                                                                       "_rations_taken"));
            _game_vars->setFlag(flag, true);
        }
        else
        {
            _console.writeText("No rations to pick up here.");
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

            QVariant counter = QString::fromStdString(utils::createString(_current_event.getId(),
                                                                          "_items_taken"));
            _game_vars->incrementCounter(counter, +1);
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
    if(_combat_state.combat_in_progress)
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
    std::string msg;
    int agility, constitution, luck;
    if(_conan)
    {
        msg = "Creating your character...<br />Conan The Barbarian King begins with the highest possible stats:<br />";
        agility = 12;
        constitution = 24;
        luck = 12;
    }
    else
    {
        msg = "Creating your character...<br />Randomly assigning player stats:<br />";
        agility = utils::rollD6(1) + 6;
        constitution = utils::rollD6(2) + 12;
        luck = utils::rollD6(1) + 6;
    }
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
        if(_current_event.getCurrentEnemy().isInvincible())
        {
            msg += utils::createString("Your attack is ineffective. [e]",
                                       _current_event.getCurrentEnemy().getName(),
                                       "[/e] takes no damage!");
        }
        else
        {
            _current_event.getCurrentEnemy().modifyConstitution(-damage);

            msg += utils::createString("You deal ", damage, " damage to [e]",
                                       _current_event.getCurrentEnemy().getName(), "[/e]");
        }
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
    _current_event.triggerExitCallback();

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

    if(!_combat_state.combat_in_progress)
    {
        mode = updateRoomExit(mode);
    }

    return mode;
}

InputMode Game::updateRoomExit(InputMode default_mode)
{
    InputMode mode = default_mode;

    if(_current_event.getRedirect() != 0)
    {
        mode = InputMode::KEY_REDIRECT;
    }
    else if(_current_event.hasYesNoChoice())
    {
        _console.writeLine();
        _console.writeText(_current_event.getChoiceQuestion());
        mode = InputMode::YES_NO_CHOICE;
    }
    else if(_current_event.hasMultiChoice())
    {
        _console.writeLine();
        _console.writeText(_current_event.getChoiceQuestion());
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

void Game::checkForEnemyDeath()
{
    if(_combat_state.combat_in_progress)
    {
        if(_current_event.getCurrentEnemy().getConstitution() == 0)
        {
            std::string msg = utils::createString("You have defeated [e]",
                                                  _current_event.getCurrentEnemy().getName(), "[/e]");
            _console.writeText(msg);
            resolveCombatEndTriggers();
            _current_event.defeatCurrentEnemy();

            if(!_current_event.hasEnemies())
            {
                _combat_state.combat_in_progress = false;
            }
            else
            {
                _combat_state.combat_round = 0;
                displayCurrentEnemy();
            }
        }
    }
}

void Game::handleCombatRound()
{
    ++_combat_state.combat_round;

    bool tie = false;
    do
    {
        _combat_state.enemy_score = utils::rollD6(2) + _current_event.getCurrentEnemy().getAgility();
        _combat_state.player_score = utils::rollD6(2) + _player->getAgility() + _player->getCombatModifier();

        std::string msg = utils::createString("Combat round ",
                                              _combat_state.combat_round,
                                              "<br />[e]", _current_event.getCurrentEnemy().getName(), "[/e]'s score: ",
                                              _combat_state.enemy_score,
                                              "<br />[p]Player[/p]'s score: ",
                                              _combat_state.player_score);

        _console.writeText(msg);

        if(_combat_state.player_score == _combat_state.enemy_score)
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

    if(_current_event.getCurrentEnemy().isEscapeEnabled())
    {
        _console.writeText("If you don't want to continue the fight, you can [c]escape[/c].");
    }
}

bool Game::performGameChecks()
{
    checkForEnemyDeath();
    if(_player->getConstitution() == 0)
    {
        _combat_state.combat_in_progress = false;
        return true;
    }
    if(_combat_state.combat_in_progress)
    {
        handleCombatRound();
    }
    return false;
}

void Game::resolveCombatEndTriggers()
{
    for(const auto& condition: _player->getConditions())
    {
        if(condition.getClearTiming() == CallbackTiming::COMBAT_END)
        {
            _player->removeCondition(condition.getName());
        }
    }

    for(auto callback: _current_event.getCurrentEnemy().getCallbacks())
    {
        if(callback.isValid() && callback.getTiming() == CallbackTiming::COMBAT_END)
        {
            callback();
        }
    }
}

void Game::resolveRoundActionTriggers(int round)
{
    for(auto callback: _current_event.getCurrentEnemy().getCallbacks())
    {
        if(callback.isValid()
        && callback.getTiming() == CallbackTiming::ROUND_ACTION
        && callback.getRound() == round)
        {
            callback();
        }
    }
}

void Game::resolveRoundEndTriggers(int round)
{
    for(auto callback: _current_event.getCurrentEnemy().getCallbacks())
    {
        if(callback.isValid()
        && callback.getTiming() == CallbackTiming::ROUND_END
        && callback.getRound() == round)
        {
            callback();
        }
    }
}

GameState Game::createGameState()
{
    GameState game_state = {};
    game_state.player_agility = _player->getAgilityWithoutModifiers();
    game_state.player_constitution = _player->getConstitutionWithoutModifiers();
    game_state.player_luck = _player->getLuckWithoutModifiers();
    game_state.player_start_agility = _player->getStartingAgility();
    game_state.player_start_constitution = _player->getStartingConstitution();
    game_state.player_start_luck = _player->getStartingLuck();
    game_state.player_gold = _player->getGold();
    game_state.player_rations = _player->getRations();
    game_state.player_elixir_count = _player->getElixirCount();
    game_state.player_elixir_type = static_cast<int>(_player->getElixirType());
    game_state.player_inventory = _player->getInventory();
    game_state.player_conditions = _player->getConditionsString();

    game_state.event_id = _current_event.getId();
    game_state.event_enemy_present = _current_event.hasEnemies();
    if(_current_event.hasEnemies())
    {
        game_state.event_enemy_name = _current_event.getCurrentEnemy().getName();
        game_state.event_enemy_constitution = _current_event.getCurrentEnemy().getConstitution();
        game_state.event_enemy_escape_enabled = _current_event.getCurrentEnemy().isEscapeEnabled();
        if(_current_event.getCurrentEnemy().isEscapeEnabled())
        {
            game_state.event_enemy_escape_redirect = _current_event.getCurrentEnemy().getEscapeRedirect();
        }
    }
    game_state.event_gold_present = _current_event.hasGold();
    game_state.event_rations_present = _current_event.hasRations();
    game_state.event_items_present = _current_event.hasItems();
    if(_current_event.hasItems())
    {
        game_state.event_item_limit = _current_event.getItemLimit();
    }
    game_state.event_eating_enabled = _current_event.isEatingEnabled();

    game_state.combat_in_progress = _combat_state.combat_in_progress;
    if(_combat_state.combat_in_progress)
    {
        game_state.combat_round = _combat_state.combat_round;
        game_state.combat_enemy_score = _combat_state.enemy_score;
        game_state.combat_player_score = _combat_state.player_score;
    }

    game_state.log = _console.getLogContents();
    game_state.variables = _game_vars->toString();
    game_state.conan = _conan;

    return game_state;
}

void Game::restoreGameState(const GameState& game_state)
{
    auto reportError = [this](const char* msg)
    {
        _console.writeError("Fatal error while loading savefile.");
        _console.writeError(msg);
        _console.writeError("Game terminated.");
        emit gameCrash();
    };

    delete _player;
    _player = new Player(this,
                         game_state.player_start_agility,
                         game_state.player_start_constitution,
                         game_state.player_start_luck,
                         static_cast<PlayerStat>(game_state.player_elixir_type));

    try
    {
        _player->setAgility(game_state.player_agility);
        _player->setConstitution(game_state.player_constitution);
        _player->setLuck(game_state.player_luck);
        _player->setGold(game_state.player_gold);
        _player->setRations(game_state.player_rations);
        _player->setElixirCount(game_state.player_elixir_count);
    }
    catch(const std::out_of_range& e)
    {
        reportError(e.what());
        return;
    }
    _scripting_engine->registerPlayer(_player);

    std::istringstream ss;
    if(!game_state.player_inventory.empty())
    {
        ss.str(game_state.player_inventory);
        ss.clear();
        while(!ss.eof())
        {
            std::string item;
            std::getline(ss, item);
            _player->addItem(item);
        }
    }

    if(!game_state.player_conditions.empty())
    {
        ss.str(game_state.player_conditions);
        ss.clear();
        while(!ss.eof())
        {
            std::string cond;
            std::getline(ss, cond);
            onAddCondition(QString::fromStdString(cond));
        }
    }

    _game_vars->clear();
    if(!game_state.variables.empty())
    {
        ss.str(game_state.variables);
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
                reportError("Incorrect game state loaded. Error code: 2775");
                return;
            }
        }
    }

    _current_event = _scripting_engine->parseEvent(game_state.event_id);
    if(game_state.event_enemy_present)
    {
        if(!_current_event.hasEnemies())
        {
            reportError("Incorrect game state loaded. Error code: 5554");
            return;
        }

        while(_current_event.getCurrentEnemy().getName() != game_state.event_enemy_name)
        {
            _current_event.defeatCurrentEnemy();
            if(!_current_event.hasEnemies())
            {
                reportError("Incorrect game state loaded. Error code: 5145");
                return;
            }
        }

        try
        {
            _current_event.getCurrentEnemy().setConstitution(game_state.event_enemy_constitution);
        }
        catch(const std::out_of_range& e)
        {
            reportError(e.what());
            return;
        }
        _current_event.getCurrentEnemy().setEscapeEnabled(game_state.event_enemy_escape_enabled);
        if(game_state.event_enemy_escape_enabled)
        {
            _current_event.getCurrentEnemy().setEscapeRedirect(game_state.event_enemy_escape_redirect);
        }
    }
    else
    {
        if(_current_event.hasEnemies())
        {
            _current_event.defeatAllEnemies();
        }
    }

    _current_event.setHasGold(game_state.event_gold_present);
    _current_event.setHasRations(game_state.event_rations_present);
    _current_event.setEatingEnabled(game_state.event_eating_enabled);

    if(game_state.event_items_present)
    {
        if(!_current_event.hasItems())
        {
            reportError("Incorrect game state loaded. Error code: 9254");
            return;
        }
        _current_event.setItemLimit(game_state.event_item_limit);
    }

    _combat_state.combat_in_progress = game_state.combat_in_progress;
    if(game_state.combat_in_progress)
    {
        if(!_current_event.hasEnemies())
        {
            reportError("Incorrect game state loaded. Error code: 3642");
            return;
        }
        _combat_state.combat_round = game_state.combat_round;
        _combat_state.enemy_score = game_state.combat_enemy_score;
        _combat_state.player_score = game_state.combat_player_score;
    }

    _console.setLog(game_state.log);
    emit _console.forceLogPrint();

    _conan = game_state.conan;
}

InputMode Game::resolveCharacterCreationInput(const std::string& user_input)
{
    InputMode mode = InputMode::CHARACTER_CREATION;
    PlayerStat elixir = PlayerStat::INVALID;
    elixir = CommandParser::parseElixirType(user_input);
    if(elixir == PlayerStat::INVALID)
    {
        _console.writeText("Invalid choice.");
    }
    else
    {
        auto [agility, constitution, luck] = _generated_stats;
        _player = new Player(this, agility, constitution, luck, elixir);
        _scripting_engine->registerPlayer(_player);

        _player->addItem(std::string("Sword"));
        _player->addItem(std::string("Shield"));
        _player->addItem(std::string("Backpack"));
        _player->addItem(std::string("Lantern"));

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

        mode = InputMode::KEY_REDIRECT;
        _current_event.setNewRoom(true);

        if(_combat_state.combat_in_progress)
        {
            _current_event.setRedirect(_current_event.getCurrentEnemy().getEscapeRedirect());
            resolveDamage(false, damage);
            _current_event.defeatAllEnemies();
            _combat_state.combat_in_progress = false;
        }
        else
        {
            _current_event.setRedirect(_current_event.getEscapeRedirect());
            _player->modifyConstitution(-damage);
            std::string msg = utils::createString("You take ", damage, " damage.");
            _console.writeText(msg);
        }

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
    {
        Direction direction = utils::commandToDirection(command);
        if(handleDirectionCommand(direction))
        {
            _current_event.triggerDirectionCallback(direction);
            perform_game_checks = true;
            mode = updateCurrentEvent(_current_event.getDestination(utils::commandToDirection(command)), true);
        }
    }   break;
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
    default:
        if(handleLocalCommand(user_input))
        {
            perform_game_checks = true;
            _current_event.triggerLocalCommandCallback(utils::toLower(user_input));
            UserOption local_command = _current_event.getLocalCommand(utils::toLower(user_input));

            if(local_command.redirect != 0)
            {
                mode = updateCurrentEvent(local_command.redirect, local_command.new_room);
            }
        }
        else
        {
            _console.writeText("Invalid command.");
        }
        break;
    }

    if(perform_game_checks)
    {
        bool combat_happened = _combat_state.combat_in_progress;
        if(performGameChecks())
        {
            mode = InputMode::KEY_DEATH;
        }
        else if(combat_happened && !_combat_state.combat_in_progress)
        {
            mode = updateRoomExit(mode);
        }
    }

    return mode;
}

InputMode Game::resolveGameStartInput()
{
    _game_running = true;
    InputMode mode = updateCurrentEvent(1, true);
    if(performGameChecks())
    {
        mode = InputMode::KEY_DEATH;
    }
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
                            _current_event.getChoiceOptions(),
                            user_input);
    if(valid)
    {
        _current_event.triggerChoiceOptionCallback(answer);
        UserOption option = _current_event.getChoiceOption(answer);

        if(option.redirect != 0)
        {
            mode = updateCurrentEvent(option.redirect, option.new_room);
        }
        if(performGameChecks())
        {
            mode = InputMode::KEY_DEATH;
        }
    }

    return mode;
}

InputMode Game::resolveRedirectInput()
{
    InputMode mode = updateCurrentEvent(_current_event.getRedirect(),
                                        _current_event.leadsToNewRoom());
    if(performGameChecks())
    {
        mode = InputMode::KEY_DEATH;
    }
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
    case Command::CHEAT:
        _conan = true;
        // Intentional fallthrough.
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
        std::string answer_string = answer ? "yes" : "no";
        _current_event.triggerChoiceOptionCallback(answer_string);
        UserOption option = _current_event.getChoiceOption(answer_string);

        if(option.redirect != 0)
        {
            mode = updateCurrentEvent(option.redirect, option.new_room);
        }
        if(performGameChecks())
        {
            mode = InputMode::KEY_DEATH;
        }
    }

    return mode;
}

void Game::gameOverScreen()
{
    try
    {
        _console.clearScreen();
        _console.pasteText(utils::accessStaticResource("gameover.txt"));
    }
    catch(const std::system_error& e)
    {
        _console.writeError("Error encountered.");
        _console.writeError(e.what());
        _console.writeError("Game over screen returned an error.");
    }
}

void Game::titleScreen()
{
    try
    {
        _console.clearScreen();
        _console.pasteText(utils::accessStaticResource("title.txt"));
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
    emit _console.forceLogPrint();
}

void Game::updateEventRedirect(int id, bool new_room)
{
    _current_event.setRedirect(id);
    _current_event.setNewRoom(new_room);
}

void Game::onAddCondition(const QVariant& name)
{
    _player->addCondition(_scripting_engine->parseCondition(name.toString()));
}

void Game::onDisableEnemyEscape()
{
    _current_event.getCurrentEnemy().setEscapeEnabled(false);
}

void Game::onDisableRoomEscape()
{
    _current_event.setEscapeRedirect(0);
}

void Game::onEnableEnemyEscape(int redirect)
{
    _current_event.getCurrentEnemy().setEscapeEnabled(true);
    _current_event.getCurrentEnemy().setEscapeRedirect(redirect);
}

void Game::onEnableRoomEscape(int redirect)
{
    _current_event.setEscapeRedirect(redirect);
}

void Game::onRemoveCondition(const QVariant& name)
{
    _player->removeCondition(name.toString().toStdString());
}

void Game::onStopCombat()
{
    _combat_state.combat_in_progress = false;
    _current_event.defeatAllEnemies();
}
