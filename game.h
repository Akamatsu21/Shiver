#ifndef GAME_H
#define GAME_H

#include <QObject>

#include "console.h"
#include "scriptingengine.h"

class QCoreApplication;

class Game: public QObject
{
    Q_OBJECT

    Console _console;
    ScriptingEngine* _scripting_engine;

public:
    explicit Game(QCoreApplication* parent);

    void gameLoop();

signals:
    void gameOver();

};

#endif // GAME_H
