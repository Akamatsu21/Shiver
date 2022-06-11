#ifndef CONSOLE_H
#define CONSOLE_H

#include <string>

class Console
{
public:
    Console();

    void clearScreen();
    void waitForAnyKey();
    std::string waitForInput();
    void writeText(std::string text);
};

#endif // CONSOLE_H
