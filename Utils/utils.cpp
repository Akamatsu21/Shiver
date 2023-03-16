#include "utils.h"
#include <algorithm>
#include <random>
#include <QFile>

namespace utils {

std::string accessStaticResource(const std::string filename)
{
    QFile file(":static/" + QString::fromStdString(filename));
    if(file.open(QIODevice::ReadOnly))
    {
        return file.readAll().toStdString();
    }

    throw std::system_error(std::make_error_code(std::errc::io_error), "File cannot be opened");
}

std::string directionToString(Direction direction)
{
    std::string result;
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
    default:
        result = "error";
        break;
    }

    return result;
}

std::map<std::string, CallbackTiming> getAllCallbackTimingsWithLabels()
{
    return std::map<std::string, CallbackTiming> {{"None", CallbackTiming::NONE},
                                                  {"RoundAction", CallbackTiming::ROUND_ACTION},
                                                  {"RoundEnd", CallbackTiming::ROUND_END},
                                                  {"CombatEnd", CallbackTiming::COMBAT_END}};
}

std::vector<Direction> getAllDirections()
{
    return std::vector {Direction::NORTH, Direction::SOUTH, Direction::EAST, Direction::WEST};
}

std::map<std::string, Direction> getAllDirectionsWithLabels()
{
    return std::map<std::string, Direction> {{"North", Direction::NORTH},
                                             {"South", Direction::SOUTH},
                                             {"East", Direction::EAST},
                                             {"West", Direction::WEST}};
}

std::map<std::string, PlayerStat> getAllPlayerStatsWithLabels()
{
    return std::map<std::string, PlayerStat> {{"Agility", PlayerStat::AGILITY},
                                              {"Constitution", PlayerStat::CONSTITUTION},
                                              {"Luck", PlayerStat::LUCK},
                                              {"CombatStrength", PlayerStat::COMBAT_STRENGTH}};
}

Direction commandToDirection(Command command)
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

std::string parseParams(std::queue<std::string>& params)
{
    std::ostringstream ss;
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

int rollD6(int count)
{
#ifdef _WIN32
    static std::mt19937 rng(time(0));
#else
    static std::random_device rd;
    static std::mt19937 rng(rd());
#endif
    static std::uniform_int_distribution<std::mt19937::result_type> d6(1, 6);

    int result = 0;
    for(int i = 0; i < count; ++i)
    {
        result += d6(rng);
    }

    return result;
}

std::string toLower(const std::string& s)
{
    std::string result;
    std::transform(std::cbegin(s), std::cend(s), std::back_inserter(result),
                   [](char c){ return std::tolower(c); });
    return result;
}

}
