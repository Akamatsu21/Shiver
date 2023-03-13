#ifndef UTILS_H
#define UTILS_H

#include <map>
#include <sstream>
#include <string>
#include <queue>
#include <vector>

#include "Enums/command.h"
#include "Enums/callbacktiming.h"
#include "Enums/direction.h"
#include "Enums/playerstat.h"

namespace utils
{

std::string accessStaticResource(const std::string filename);

Direction commandToDirection(Command command);

template<typename... Args>
std::string createString(Args... args)
{
    std::ostringstream ss("");
    ((ss << args), ...);
    return ss.str();
}

std::string directionToString(Direction direction);

std::map<std::string, CallbackTiming> getAllCallbackTimingsWithLabels();

std::vector<Direction> getAllDirections();

std::map<std::string, PlayerStat> getAllPlayerStatsWithLabels();

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

std::string parseParams(std::queue<std::string>& params);

int rollD6(int count);

std::string toLower(const std::string& s);

}

#endif // UTILS_H
