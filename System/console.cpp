#include "console.h"
#include <algorithm>
#include <iostream>
#include <limits>
#include <sstream>

Console::Console():
    _log("")
{

}

std::string Console::replaceTag(const std::string& text,
                                const std::string& open_tag,
                                const std::string& close_tag,
                                const std::string& colour_code) const
{
    std::stringstream ss;
    std::string buffer = text;
    std::string::iterator open_tag_pos = std::search(std::begin(buffer), std::end(buffer),
                                                     std::begin(open_tag), std::end(open_tag));
    while(open_tag_pos != std::end(buffer))
    {
        std::string::iterator close_tag_pos = std::search(open_tag_pos, std::end(buffer),
                                                          std::begin(close_tag), std::end(close_tag));
        ss << std::string(std::begin(buffer), open_tag_pos)
           << colour_code
           << std::string(open_tag_pos + open_tag.length(), close_tag_pos)
           << "\033[0m"
           << std::string(close_tag_pos + close_tag.length(), std::end(buffer));

        buffer = ss.str();
        ss.str("");
        open_tag_pos = std::search(std::begin(buffer), std::end(buffer),
                                   std::begin(open_tag), std::end(open_tag));
    }

    return buffer;
}

std::string Console::parseMarkup(const std::string& text) const
{
    std::string buffer = text;
    buffer = replaceTag(buffer, "[e]", "[/e]", "\033[31m");
    buffer = replaceTag(buffer, "[c]", "[/c]", "\033[32m");
    buffer = replaceTag(buffer, "[i]", "[/i]", "\033[34m");
    return buffer;
}

void Console::clearScreen()
{
    (void)system("clear");
    _log = "";
}

void Console::waitForAnyKey()
{
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    _log += "\n";
}

std::string Console::waitForInput()
{
    writeLine();
    std::cout << "> ";
    std::string input = "";
    std::getline(std::cin, input);
    _log += "> " + input + "\n";
    return input;
}

void Console::writeLine()
{
    std::cout << std::endl;
    _log += "\n";
}

void Console::writeText(const std::string &text)
{
    auto parsedText = parseMarkup(text);
    std::cout << parsedText;
    _log += parsedText;
    writeLine();
}
