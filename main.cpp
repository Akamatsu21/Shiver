#include <QCoreApplication>

#include "game.h"

int main(int argc, char *argv[])
{
    QCoreApplication app(argc, argv);

    Game* game = new Game(&app);
    game->setup();
    game->titleScreen();

    return app.exec();
}
