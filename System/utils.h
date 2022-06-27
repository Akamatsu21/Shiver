#ifndef UTILS_H
#define UTILS_H

#include <sstream>
#include <string>
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

int rollD6(int count);

std::string toLower(const std::string& s);

}

#endif // UTILS_H
