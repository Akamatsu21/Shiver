#include "game.h"
#include <iostream>
#include <string>
#include <sstream>
#include <QCoreApplication>
#include <QJSEngine>

#include "commandparser.h"
#include "player.h"
#include "scriptingengine.h"
#include "utils.h"

Game::Game(QCoreApplication* parent):
    QObject(parent),
    _console(),
    _current_event(1),
    _scripting_engine(new ScriptingEngine(this)),
    _player(nullptr),
    _running(true),
    _combat_state{false, 0, 0, 0}
{
    connect(this, &Game::gameOver, parent, &QCoreApplication::quit, Qt::QueuedConnection);
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
    std::ostringstream ss("");
    ss << "You are fighting against "
       << _current_event.getCurrentEnemy().getName()
       << "\nAgility: "
       << _current_event.getCurrentEnemy().getAgility()
       << "\nConstitution: "
       << _current_event.getCurrentEnemy().getConstitution();
    _console.writeText(ss.str());
    _console.waitForAnyKey();
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
            std::ostringstream ss("");
            ss << "You have defeated "
               << _current_event.getCurrentEnemy().getName();
            _console.writeText(ss.str());
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

        std::ostringstream ss("");
        ss << "Combat round "
           << _combat_state._combat_round
           << "\n" << _current_event.getCurrentEnemy().getName() << "'s score: "
           << _combat_state._enemy_score
           << "\nPlayer's score: "
           << _combat_state._player_score;
        _console.writeText(ss.str());

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
    _player = new Player(this, 18, 24, 18, Player::ElixirType::CONSTITUTION);
    _scripting_engine->registerPlayer(_player);
    updateCurrentEvent(1);

    while(_running)
    {
        std::string user_input = _console.waitForInput();
        auto [command, params] = CommandParser::parse(user_input);
        switch(command)
        {
        case::Command::HELP:
            _console.writeText("Help page not yet available.");
            break;
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
        {
            if(!_combat_state._combat_in_progress)
            {
                _console.writeText("No enemies present!");
                continue;
            }

            // Make function for building strings.
            std::ostringstream ss("");
            if(_combat_state._player_score > _combat_state._enemy_score)
            {
                _current_event.getCurrentEnemy().modifyConstitution(-2);

                ss << "You deal 2 damage to "
                   << _current_event.getCurrentEnemy().getName();
            }
            else
            {
                _player->modifyConstitution(-2);

                ss << _current_event.getCurrentEnemy().getName()
                   << " deals 2 damage to you";
            }

            ss << "\nRemaining constitution:\n"
               << _current_event.getCurrentEnemy().getName() << ": " << _current_event.getCurrentEnemy().getConstitution()
               << "\nPlayer: " << _player->getConstitution();
            _console.writeText(ss.str());
            _console.writeLine();
        }   break;
        case Command::ESCAPE:
            _console.writeText("Time to die!");
            break;
        case Command::TAKE:
            _console.writeText("You took " + params.front());
            break;
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
