#include "console.h"
#include <algorithm>
#include <iostream>
#include <limits>
#include <sstream>

Console::Console():
    _log("")
{

}

std::string Console::getLogContents() const
{
    return _log;
}

void Console::setLog(const std::string& value)
{
    _log = value;
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
    buffer = replaceTag(buffer, "[e]", "[/e]", "\033[31m"); // enemy name
    buffer = replaceTag(buffer, "[c]", "[/c]", "\033[32m"); // command
    buffer = replaceTag(buffer, "[i]", "[/i]", "\033[34m"); // item
    buffer = replaceTag(buffer, "[l]", "[/l]", "\033[33m"); // local command
    buffer = replaceTag(buffer, "[o]", "[/o]", "\033[35m"); // option
    buffer = replaceTag(buffer, "[p]", "[/p]", "\033[36m"); // player name
    return buffer;
}

void Console::clearScreenPreserveLog()
{
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

void Console::clearScreen()
{
    clearScreenPreserveLog();
    _log = "";
}

void Console::restoreLog()
{
    clearScreenPreserveLog();
    std::cout << _log;
}

int Console::showHelpPage(int page_number, int total_pages, const std::string &text)
{
    clearScreenPreserveLog();
    std::string parsed_text = parseMarkup(text);
    std::cout << parsed_text
              << "\n\nPage " << page_number << "/" << total_pages
              << "\nEnter a page number to see that page, or 0 to exit.\n";

    bool invalid_input = true;
    int new_page = 0;
    while(invalid_input)
    {
        std::string input;
        std::getline(std::cin, input);
        try
        {
            new_page = std::stoi(input);

            if(new_page < 0 || new_page > total_pages)
            {
                throw std::out_of_range("Page range");
            }
            else
            {
                invalid_input = false;
            }
        }
        catch(const std::logic_error&)
        {
            std::cout << "Invalid page number.\n";
        }
    }

    return new_page;
}

void Console::waitForAnyKey()
{
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    _log += "\n";
}

std::string Console::waitForInput()
{
    writeLine();
    std::cout << "\033[33m>\033[0m ";
    std::string input;
    std::getline(std::cin, input);
    _log += "\033[33m>\033[0m " + input + "\n";
    return input;
}

void Console::writeError(const std::string& error)
{
    std::cout << "\033[0;91m" << error << "\033[0m";
    writeLine();
}

void Console::writeLine()
{
    std::cout << std::endl;
    _log += "\n";
}

void Console::writeText(const std::string &text)
{
    std::string parsed_text = parseMarkup(text);
    std::cout << parsed_text;
    _log += parsed_text;
    writeLine();
}
