#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickView>
#include <QQuickItem>

#include "gamewindow.h"
#include "System/console.h"
#include "System/settingsmanager.h"

int main(int argc, char* argv[])
{
    QGuiApplication app(argc, argv);

    QQmlApplicationEngine engine;
    QUrl url("qrc:qml/main.qml");
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreated, &app,
        [url](QObject* obj, const QUrl& objUrl)
        {
            if(!obj && url == objUrl)
            {
                QCoreApplication::exit(-1);
            }
        }, Qt::QueuedConnection);

    Console* console = new Console(&app);
    SettingsManager* settings = new SettingsManager(&app);

    engine.rootContext()->setContextProperty("terminalController", console);
    engine.rootContext()->setContextProperty("settingsManager", settings);
    engine.load(url);

    GameWindow* gameWindow = new GameWindow(&app, *console, *settings, engine);
    gameWindow->startGame();

    return app.exec();
}
