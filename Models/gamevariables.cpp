#include "gamevariables.h"
#include <QVariant>

GameVariables::GameVariables(QObject *parent):
    QObject(parent),
    _variables{}
{

}

std::string GameVariables::toString() const
{
    return std::accumulate(std::begin(_variables), std::end(_variables), std::string(""),
                           [](std::string acc, auto element)
                           {
                               bool is_counter = std::holds_alternative<int>(element.second);
                               std::string type = is_counter ? "counter" : "flag";
                               std::string val = std::to_string(is_counter
                                                                ? std::get<int>(element.second)
                                                                : std::get<bool>(element.second));
                               return acc
                                      + type + "\n"
                                      + element.first + "\n"
                                      + val + "\n";
                           });
}

int GameVariables::getCounter(const QVariant& var)
{
    std::string key = var.toString().toStdString();
    if(_variables.count(key) > 0)
    {
        return std::get<int>(_variables.at(key));
    }
    else
    {
        return 0;
    }
}

bool GameVariables::getFlag(const QVariant& var)
{
    std::string key = var.toString().toStdString();
    if(_variables.count(key) > 0)
    {
        return std::get<bool>(_variables.at(key));
    }
    else
    {
        return false;
    }
}

void GameVariables::incrementCounter(const QVariant& var, int value)
{
    setCounter(var, getCounter(var) + value);
}

void GameVariables::setCounter(const QVariant& var, int value)
{
    _variables[var.toString().toStdString()] = value;
}

void GameVariables::setFlag(const QVariant& var, bool value)
{
    _variables[var.toString().toStdString()] = value;
}

void GameVariables::clear()
{
    _variables.clear();
}
