#include "commandparser.h"
#include <algorithm>
#include <cctype>
#include <iterator>
#include <sstream>

std::pair<Command, std::queue<std::string>> CommandParser::parse(std::string input)
{
    std::istringstream iss(input);
    std::queue<std::string> params(
                std::deque<std::string>(
                    (std::istream_iterator<std::string>(iss)),
                    std::istream_iterator<std::string>()
                ));
    std::string input_command = params.front();
    params.pop();
    std::transform(std::begin(input_command), std::end(input_command), std::begin(input_command),
                   [](char c){ return std::tolower(c); });

    Command command = Command::INVALID;
    if(input_command == "help")
    {
        command = Command::HELP;
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

    return std::pair<Command, std::queue<std::string>>(command, params);
}
