#include "game.h"
#include <iostream>
#include <sstream>
#include <string>
#include <QCoreApplication>
#include <QJSEngine>

#include "Models/player.h"
#include "System/commandparser.h"
#include "System/scriptingengine.h"
#include "System/utils.h"

Game::Game(QCoreApplication* parent):
    QObject(parent),
    _console(),
    _scripting_engine(new ScriptingEngine(this)),
    _current_event(1),
    _player(nullptr),
    _running(true),
    _current_help_page(0),
    _combat_state{false, 0, 0, 0}
{
    connect(this, &Game::gameOver, parent, &QCoreApplication::quit, Qt::QueuedConnection);
    _help_pages = _scripting_engine->parseHelpPages();
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

void Game::displayPlayerStats()
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

void Game::gameLoop()
{
    _player = new Player(this, 18, 24, 18, ElixirType::CONSTITUTION);
    _scripting_engine->registerPlayer(_player);
    updateCurrentEvent(1);

    while(_running)
    {
        std::string user_input = _console.waitForInput();
        auto [command, params] = CommandParser::parse(user_input);
        switch(command)
        {
        case::Command::HELP:
            _current_help_page = 1;
            while(_current_help_page != 0)
            {
                _current_help_page = _console.showHelpPage(_current_help_page,
                                                           _help_pages.size(),
                                                           _help_pages.at(_current_help_page - 1));
            }

            _console.restoreLog();
            continue;
        case::Command::STATS:
            displayPlayerStats();
            continue;
        case Command::NORTH:
        case Command::SOUTH:
        case Command::EAST:
        case Command::WEST:
        {
            if(_combat_state._combat_in_progress)
            {
                _console.writeText("You have to defeat all enemies before you can travel.");
                continue;
            }

            Direction direction = utils::commandToDirection(command);
            if(_current_event.isDirectionAvailable(direction))
            {
                updateCurrentEvent(_current_event.getDestination(direction));
            }
            else
            {
                _console.writeText("Direction unavailable.");
                continue;
            }
        }   break;
        case Command::FIGHT:
            if(!_combat_state._combat_in_progress)
            {
                _console.writeText("No enemies present!");
                continue;
            }

            resolveDamage(_combat_state._player_score > _combat_state._enemy_score, 2);
            displayCombatStatus();
            break;
        case Command::ESCAPE:
        {
            if(!_combat_state._combat_in_progress)
            {
                _console.writeText("No enemies present!");
                continue;
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
        }   break;
        case Command::TAKE:
        {
            if(_combat_state._combat_in_progress)
            {
                _console.writeText("You have to defeat all enemies before you can pick up items.");
                continue;
            }
            else if(params.empty())
            {
                _console.writeText("Not specified which item to take.");
                continue;
            }

            std::ostringstream ss("");
            while(!params.empty())
            {
                ss << params.front();
                params.pop();
                if(!params.empty())
                {
                    ss << " ";
                }
            }
            std::string item = _current_event.findItem(ss.str());

            if(item.empty())
            {
                _console.writeText("Item not found in this room.");
            }
            else
            {
                if(_player->hasItem(item))
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
                    _player->addItem(item);
                    _console.writeText(utils::createString("[i]", item, "[/i] added to your inventory."));
                }
            }
        }   continue;
        case Command::LUCKY:
        {
            if(!_combat_state._combat_in_progress)
            {
                _console.writeText("No enemies present!");
                continue;
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
        }   break;
        case Command::INVALID:
        default:
            _console.writeText("Invalid command");
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
