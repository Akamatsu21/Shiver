#ifndef UTILS_H
#define UTILS_H

#include <string>
#include <vector>

#include "command.h"
#include "direction.h"

namespace utils
{

Direction commandToDirection(Command command);

std::string directionToString(Direction direction);

std::vector<Direction> getAllDirections();

}

#endif // UTILS_H
