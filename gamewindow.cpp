#include "gamewindow.h"
#include <QCoreApplication>
#include <QQmlApplicationEngine>

#include "Models/scriptapi.h"
#include "System/console.h"

GameWindow::GameWindow(QCoreApplication* parent, Console& console, QQmlApplicationEngine& qml_engine):
    QObject(parent),
    _game(new Game(this, console)),
    _console(console),
    _input_mode(InputMode::TITLE_SCREEN),
    _prev_mode(InputMode::TITLE_SCREEN),
    _interrupted(false),
    _interrupt_id(0),
    _interrupt_new_room(false)
{
    connect(qml_engine.rootObjects().at(0), SIGNAL(leftArrowReceived()),
            this, SLOT(onPreviousHelpPage()));
    connect(qml_engine.rootObjects().at(0), SIGNAL(rightArrowReceived()),
            this, SLOT(onNextHelpPage()));
    connect(qml_engine.rootObjects().at(0), SIGNAL(escapeReceived()),
            this, SLOT(onLeaveHelp()));

    connect(&_console, &Console::inputReady,
            this, &GameWindow::onUserInputReceived);
    connect(&_console, &Console::returnReady,
            this, &GameWindow::onUserKeyReceived);

    setupGameConnections();
}

void GameWindow::resetGame()
{
    disconnect(_game);
    delete _game;
    _input_mode = InputMode::TITLE_SCREEN;
    _prev_mode = InputMode::TITLE_SCREEN;
    _interrupted = false;
    _interrupt_id = 0;
    _interrupt_new_room = false;
    _game = new Game(this, _console);
    setupGameConnections();
    startGame();
}

void GameWindow::setupGameConnections()
{
    connect(_game, &Game::gameCrash,
            this, &GameWindow::onGameCrash);
    connect(_game->getScriptApi(), &ScriptApi::redirect,
            this, &GameWindow::onRedirect);
    connect(_game->getScriptApi(), &ScriptApi::message,
            &_console, &Console::onMessage);
    connect(_game->getScriptApi(), &ScriptApi::stopCombat,
            _game, &Game::onStopCombat);
    connect(_game->getScriptApi(), &ScriptApi::addCondition,
            _game, &Game::onAddCondition);
    connect(_game->getScriptApi(), &ScriptApi::removeCondition,
            _game, &Game::onRemoveCondition);
    connect(_game->getScriptApi(), &ScriptApi::disableEnemyEscape,
            _game, &Game::onDisableEnemyEscape);
    connect(_game->getScriptApi(), &ScriptApi::disableRoomEscape,
            _game, &Game::onDisableRoomEscape);
    connect(_game->getScriptApi(), &ScriptApi::enableEnemyEscape,
            _game, &Game::onEnableEnemyEscape);
    connect(_game->getScriptApi(), &ScriptApi::enableRoomEscape,
            _game, &Game::onEnableRoomEscape);
}

void GameWindow::updateInputState()
{
    if(_interrupted)
    {
        _interrupted = false;
        _prev_mode = _input_mode;
        _input_mode = InputMode::KEY_REDIRECT;
        _game->updateEventRedirect(_interrupt_id, _interrupt_new_room);
    }

    switch(_input_mode)
    {
    case InputMode::HELP:
        _console.setWaitingForInput(false);
        _console.setWaitingForReturn(false);
        _console.setHelpVisible(true);
        break;
    case InputMode::TITLE_SCREEN:
    case InputMode::CHARACTER_CREATION:
    case InputMode::GAME:
    case InputMode::YES_NO_CHOICE:
    case InputMode::MULTI_CHOICE:
    case InputMode::QUIZ:
    case InputMode::ESCAPE_CHECK:
    case InputMode::SAVE_CONFIRMATION:
    case InputMode::LOAD_CONFIRMATION:
    case InputMode::SAVEDEL_CONFIRMATION:
        _console.setWaitingForInput(true);
        _console.setWaitingForReturn(false);
        _console.setHelpVisible(false);
        break;
    case InputMode::KEY_DEATH:
    case InputMode::KEY_GAME_START:
    case InputMode::KEY_GAME_OVER:
    case InputMode::KEY_REDIRECT:
        _console.setWaitingForInput(false);
        _console.setWaitingForReturn(true);
        _console.setHelpVisible(false);
        break;
    }
}

void GameWindow::onUserInputReceived(const QString& user_input)
{
    _prev_mode = _input_mode;
    switch(_input_mode)
    {
    case InputMode::TITLE_SCREEN:
        _input_mode = _game->resolveTitleScreenInput(user_input.toStdString());
        break;
    case InputMode::CHARACTER_CREATION:
        _input_mode = _game->resolveCharacterCreationInput(user_input.toStdString());
        break;
    case InputMode::GAME:
        _input_mode = _game->resolveGameInput(user_input.toStdString());
        break;
    case InputMode::YES_NO_CHOICE:
        _input_mode = _game->resolveYesNoChoice(user_input.toStdString());
        break;
    case InputMode::MULTI_CHOICE:
        _input_mode = _game->resolveMultiChoice(user_input.toStdString());
        break;
    case InputMode::QUIZ:
        _input_mode = _game->resolveQuiz(user_input.toStdString());
        break;
    case InputMode::ESCAPE_CHECK:
        _input_mode = _game->resolveEscapeInput(user_input.toStdString());
        break;
    case InputMode::SAVE_CONFIRMATION:
        _input_mode = _game->resolveSaveInput(user_input.toStdString());
        break;
    case InputMode::LOAD_CONFIRMATION:
        _input_mode = _game->resolveLoadInput(user_input.toStdString());
        break;
    case InputMode::SAVEDEL_CONFIRMATION:
        _input_mode = _game->resolveSaveDelInput(user_input.toStdString());
        break;
    default:
        assert(false);
        break;
    }

    updateInputState();
}

void GameWindow::onUserKeyReceived()
{
    _prev_mode = _input_mode;
    switch(_input_mode)
    {
    case InputMode::KEY_DEATH:
        _game->gameOverScreen();
        _input_mode = InputMode::KEY_GAME_OVER;
        break;
    case InputMode::KEY_GAME_START:
        _input_mode = _game->resolveGameStartInput();
        break;
    case InputMode::KEY_GAME_OVER:
        resetGame();
        return;
    case InputMode::KEY_REDIRECT:
        _input_mode = _game->resolveRedirectInput();
        break;
    default:
        assert(false);
        break;
    }

    updateInputState();
}

void GameWindow::onNextHelpPage()
{
    _game->nextHelpPage();
}

void GameWindow::onPreviousHelpPage()
{
    _game->previousHelpPage();
}

void GameWindow::onLeaveHelp()
{
    _game->exitHelpPage();
    _input_mode = _prev_mode;
    updateInputState();
}

void GameWindow::onGameCrash()
{
    _console.setWaitingForInput(false);
    _console.setWaitingForReturn(false);
    _console.setHelpVisible(false);
}

void GameWindow::onRedirect(int id, bool new_room)
{
    _interrupted = true;
    _interrupt_id = id;
    _interrupt_new_room = new_room;
}

void GameWindow::startGame()
{
    _game->setup();
    _game->titleScreen();
    _input_mode = InputMode::TITLE_SCREEN;
    updateInputState();
}
