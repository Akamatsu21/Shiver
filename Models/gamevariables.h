#ifndef GAMEVARIABLES_H
#define GAMEVARIABLES_H

#include <QObject>
#include <variant>

class GameVariables: public QObject
{
    Q_OBJECT

    std::map<std::string, std::variant<bool, int>> _variables;

public:
    explicit GameVariables(QObject* parent);

    std::string toString() const;

    Q_INVOKABLE int getCounter(const QVariant& var);
    Q_INVOKABLE bool getFlag(const QVariant& var);

    Q_INVOKABLE void incrementCounter(const QVariant& var, int value);
    Q_INVOKABLE void setCounter(const QVariant& var, int value);
    Q_INVOKABLE void setFlag(const QVariant& var, bool value);

    void clear();
};

#endif // GAMEVARIABLES_H
