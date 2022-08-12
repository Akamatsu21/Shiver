#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickView>
#include <QQuickItem>

//#include "game.h"
#include "System/console.h"

int main(int argc, char* argv[])
{
    QGuiApplication app(argc, argv);

    QQmlApplicationEngine engine;
    QUrl url("qrc:qml/main.qml");
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreated, &app,
                     [url](QObject* obj, const QUrl& objUrl)
                     {
                        if (!obj && url == objUrl)
                        {
                            QCoreApplication::exit(-1);
                        }
                     }, Qt::QueuedConnection);
    Console* console = new Console(&app);
    console->writeText("Hello");
    console->writeLine();
    console->writeText("Time to start your adventure.");
    engine.rootContext()->setContextProperty("terminalController", console);
    engine.load(url);

    QObject::connect(engine.rootObjects().at(0), SIGNAL(inputReceived(QString)),
                     console, SLOT(obtainUserInput(QString)));

    console->setWaitingForInput(true);

//    Game* game = new Game(&app);
//    game->setup();
//    game->titleScreen();

    return app.exec();
}
