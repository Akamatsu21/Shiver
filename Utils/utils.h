#ifndef UTILS_H
#define UTILS_H

#include <map>
#include <sstream>
#include <string>
#include <queue>
#include <vector>

#include "Enums/command.h"
#include "Enums/direction.h"

namespace utils
{

Direction commandToDirection(Command command);

template<typename... Args>
std::string createString(Args... args)
{
    std::ostringstream ss("");
    ((ss << args), ...);
    return ss.str();
}

std::string directionToString(Direction direction);

std::vector<Direction> getAllDirections();

template<typename K, typename V>
std::vector<K> getKeys(const std::map<K, V>& map)
{
    std::vector<K> keys;
    for(const auto& element: map)
    {
        keys.push_back(element.first);
    }
    return keys;
}

std::string getTitleScreenText();

std::string parseParams(std::queue<std::string>& params);

int rollD6(int count);

std::string toLower(const std::string& s);

}

#endif // UTILS_H
