#include "game.h"
#include <iostream>
#include <string>
#include <QCoreApplication>
#include <QJSEngine>

#include "commandparser.h"
#include "player.h"
#include "scriptingengine.h"
#include "utils.h"

Game::Game(QCoreApplication* parent):
    QObject(parent),
    _console(),
    _scripting_engine(new ScriptingEngine(this)),
    _player(nullptr)
{
    connect(this, &Game::gameOver, parent, &QCoreApplication::quit, Qt::QueuedConnection);
}

void Game::gameLoop()
{
    _console.writeText("Game start!");
    bool running = true;
    _player = new Player(this, 18, 24, 18, Player::ElixirType::CONSTITUTION);
    _scripting_engine->registerPlayer(_player);

    Event current_event = _scripting_engine->parseEvent(1);
    _console.writeText(current_event.getDescription());
    _console.writeText("Current player agility: " + std::to_string(current_event.getAg()));

    while(running)
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
            Direction direction = utils::commandToDirection(command);
            if(current_event.isDirectionAvailable(direction))
            {
                current_event = _scripting_engine->parseEvent(current_event.getDestination(direction));
                _console.clearScreen();
                _console.writeText(current_event.getDescription());
                _console.writeText("Current player agility: " + std::to_string(current_event.getAg()));
            }
            else
            {
                _console.writeText("Direction unavailable.");
            }
        }
            break;
        case Command::FIGHT:
            _console.writeText("No one to fight!");
            _player->modifyAgility(-1);
            break;
        case Command::ESCAPE:
            _console.writeText("Time to die!");
            running = false;
            break;
        case Command::TAKE:
            _console.writeText("You took " + params.front());
            break;
        case Command::INVALID:
        default:
            _console.writeText("Invalid command");
            break;
        }
    }

    emit gameOver();
}
