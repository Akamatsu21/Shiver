#include "game.h"
#include <iostream>
#include <string>
#include <QCoreApplication>
#include <QJSEngine>

#include "commandparser.h"

Game::Game(QCoreApplication* parent):
    QObject(parent),
    _console(),
    _scripting_engine(new ScriptingEngine(this))
{
    connect(this, &Game::gameOver, parent, &QCoreApplication::quit, Qt::QueuedConnection);
}

void Game::gameLoop()
{
    _console.writeText("Game start!");
    bool running = true;
    uint16_t current_event_id = 1;

    while(running)
    {
        Event current_event = _scripting_engine->parseEvent(current_event_id);
        _console.writeText(current_event.getDescription());
        std::string user_input = _console.waitForInput();
        auto [command, params] =  CommandParser::parse(user_input);
        switch(command)
        {
        case::Command::HELP:
            _console.writeText("Help page not yet available.");
            break;
        case Command::NORTH:
            ++current_event_id;
            _console.clearScreen();
            break;
        case Command::SOUTH:
            --current_event_id;
            _console.clearScreen();
            break;
        case Command::EAST:
            _console.clearScreen();
            break;
        case Command::WEST:
            _console.clearScreen();
            break;
        case Command::FIGHT:
            _console.writeText("No one to fight!");
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
