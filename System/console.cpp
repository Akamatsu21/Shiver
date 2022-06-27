#include "console.h"
#include <iostream>
#include <limits>

Console::Console()
{

}

void Console::clearScreen()
{
    (void)system("clear");
}

void Console::waitForAnyKey()
{
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n' );
}

std::string Console::waitForInput()
{
    writeLine();
    std::cout << "> ";
    std::string input = "";
    std::getline(std::cin, input);
    return input;
}

void Console::writeLine()
{
    std::cout << std::endl;
}

void Console::writeText(const std::string &text)
{
    std::cout << text;
    writeLine();
}
