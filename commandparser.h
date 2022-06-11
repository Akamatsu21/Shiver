#ifndef COMMANDPARSER_H
#define COMMANDPARSER_H

#include <string>
#include <queue>

#include "command.h"

class CommandParser
{
public:
    CommandParser() = delete;

    static std::pair<Command, std::queue<std::string>> parse(std::string input);
};

#endif // COMMANDPARSER_H
