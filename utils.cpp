#include "utils.h"

std::string utils::directionToString(Direction direction)
{
    std::string result = "";
    switch(direction)
    {
    case Direction::NORTH:
        result = "north";
        break;
    case Direction::SOUTH:
        result = "south";
        break;
    case Direction::EAST:
        result = "east";
        break;
    case Direction::WEST:
        result = "west";
        break;
    case Direction::INVALID:
    default:
        result = "error";
        break;
    }

    return result;
}

std::vector<Direction> utils::getAllDirections()
{
    return std::vector {Direction::NORTH, Direction::SOUTH, Direction::EAST, Direction::WEST};
}

Direction utils::commandToDirection(Command command)
{
    Direction result = Direction::INVALID;
    switch(command)
    {
    case Command::NORTH:
        result = Direction::NORTH;
        break;
    case Command::SOUTH:
        result = Direction::SOUTH;
        break;
    case Command::EAST:
        result = Direction::EAST;
        break;
    case Command::WEST:
        result = Direction::WEST;
        break;
    default:
        result = Direction::INVALID;
        break;
    }

    return result;
}
