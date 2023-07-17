#ifndef CHOICE_H
#define CHOICE_H

#include <string>
#include <map>

#include "useroption.h"

enum class ChoiceType
{
    NONE,
    YES_NO,
    MULTI
};

struct Choice
{
    ChoiceType type = ChoiceType::NONE;
    std::string question;
    std::map<std::string, UserOption> options;
};

#endif // CHOICE_H
