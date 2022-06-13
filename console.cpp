#include "console.h"
#include <iostream>

Console::Console()
{

}

void Console::clearScreen()
{
    system("clear");
}

void Console::waitForAnyKey()
{
    std::cout << std::endl;
    (void)std::getchar();
}

std::string Console::waitForInput()
{
    std::cout << std::endl << "> ";
    std::string input = "";
    std::getline(std::cin, input);
    return input;
}

void Console::writeText(const std::string &text)
{
    std::cout << text <<std::endl;
}
