#ifndef CONSOLE_H
#define CONSOLE_H

#include <string>

class Console
{
    std::string _log;

    std::string replaceTag(const std::string& text,
                           const std::string& open_tag,
                           const std::string& close_tag,
                           const std::string& colour_code) const;
    std::string parseMarkup(const std::string& text) const;

public:
    Console();

    void clearScreen();
    void waitForAnyKey();
    std::string waitForInput();
    void writeLine();
    void writeText(const std::string& text);
};

#endif // CONSOLE_H
