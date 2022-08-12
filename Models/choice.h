#ifndef CHOICE_H
#define CHOICE_H

#include <string>
#include <map>

enum class ChoiceType
{
    NONE,
    YES_NO,
    MULTI
};

struct Choice
{
    ChoiceType _type = ChoiceType::NONE;
    std::string _question;
    std::map<std::string, int> _options;
};

#endif // CHOICE_H
