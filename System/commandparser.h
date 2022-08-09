#ifndef COMMANDPARSER_H
#define COMMANDPARSER_H

#include <string>
#include <queue>

#include "Enums/command.h"
#include "Enums/elixirtype.h"

class CommandParser
{
public:
    CommandParser() = delete;

    static std::pair<Command, std::queue<std::string>> parseCommand(const std::string& input);

    static ElixirType parseElixirType(const std::string& input);

    static std::pair<bool, bool> parseYesNo(const std::string& input);
};

#endif // COMMANDPARSER_H
