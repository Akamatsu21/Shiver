#include "utils.h"
#include <algorithm>
#include <random>

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

std::string utils::parseParams(std::queue<std::string>& params)
{
    std::ostringstream ss("");
    while(!params.empty())
    {
        ss << params.front();
        params.pop();
        if(!params.empty())
        {
            ss << " ";
        }
    }
    return ss.str();
}

int utils::rollD6(int count)
{
    static std::random_device rd;
    static std::mt19937 rng(rd());
    static std::uniform_int_distribution<std::mt19937::result_type> d6(1, 6);

    int result = 0;
    for(int i = 0; i < count; ++i)
    {
        result += d6(rng);
    }

    return result;
}

std::string utils::toLower(const std::string& s)
{
    std::string result("");
    std::transform(std::cbegin(s), std::cend(s), std::back_inserter(result),
                   [](char c){ return std::tolower(c); });
    return result;
}
