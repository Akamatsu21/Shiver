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

    void clearScreenPreserveLog();

public:
    Console();

    void clearScreen();
    void restoreLog();
    int showHelpPage(int page_number, int total_pages, const std::string& text);
    void waitForAnyKey();
    std::string waitForInput();
    void writeLine();
    void writeText(const std::string& text);
};

#endif // CONSOLE_H
