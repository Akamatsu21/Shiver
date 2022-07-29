#include "commandparser.h"
#include <algorithm>
#include <cctype>
#include <iterator>
#include <sstream>

#include "utils.h"

std::pair<Command, std::queue<std::string>> CommandParser::parse(const std::string &input)
{
    if(input.empty())
    {
        return {Command::INVALID, std::queue<std::string>()};
    }

    std::istringstream iss(input);
    std::queue<std::string> params(
                std::deque<std::string>(
                    (std::istream_iterator<std::string>(iss)),
                    std::istream_iterator<std::string>()
                ));
    std::string input_command = params.front();
    params.pop();
    input_command = utils::toLower(input_command);

    Command command = Command::INVALID;
    if(input_command == "help")
    {
        command = Command::HELP;
    }
    else if(input_command == "stats")
    {
        command = Command::STATS;
    }
    else if(input_command == "north")
    {
        command = Command::NORTH;
    }
    else if(input_command == "south")
    {
        command = Command::SOUTH;
    }
    else if(input_command == "east")
    {
        command = Command::EAST;
    }
    else if(input_command == "west")
    {
        command = Command::WEST;
    }
    else if(input_command == "fight")
    {
        command = Command::FIGHT;
    }
    else if(input_command == "escape")
    {
        command = Command::ESCAPE;
    }
    else if(input_command == "take")
    {
        command = Command::TAKE;
    }
    else if(input_command == "lucky")
    {
        command = Command::LUCKY;
    }
    else if(input_command == "save")
    {
        command = Command::SAVE;
    }
    else if(input_command == "load")
    {
        command = Command::LOAD;
    }
    else if(input_command == "savelist")
    {
        command = Command::SAVELIST
    }

    return {command, params};
}

std::pair<bool, bool> CommandParser::parseYesNo(const std::string &input)
{
    std::string answer = utils::toLower(input);

    if(answer == "yes" || answer == "y")
    {
        return {true, true};
    }

    if(answer == "no" || answer == "n")
    {
        return {true, false};
    }

    return {false, false};
}
