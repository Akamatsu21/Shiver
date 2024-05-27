#ifndef SETTINGSMANAGER_H
#define SETTINGSMANAGER_H

#include <QFile>

class SettingsManager: public QObject
{
    Q_OBJECT
    QFile _settings_file;
    int _text_speed;

    QString createFileContents() const;

public:
    SettingsManager(QObject* parent);
};

#endif // SETTINGSMANAGER_H
