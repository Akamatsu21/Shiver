#include "settingsmanager.h"

#include <QTextStream>

#include <sstream>

SettingsManager::SettingsManager(QObject* parent):
    QObject(parent),
    _settings_file("settings.local"),
    _text_speed(5)
{
    if(!_settings_file.exists())
    {
        if(!_settings_file.open(QIODevice::WriteOnly))
        {
            throw std::system_error(std::make_error_code(std::errc::io_error), "Settings file cannot be opened");
        }

        QTextStream ts(&_settings_file);
        ts << createFileContents();

        _settings_file.close();
    }
    else
    {
        //TODO: Try to parse. If invalid, delete and recreate? Or crash the game.
    }
}

QString SettingsManager::createFileContents() const
{
    std::ostringstream ss;

    ss << "TEXT_SPEED=" << _text_speed << "\n";

    return QString::fromStdString(ss.str());
}
