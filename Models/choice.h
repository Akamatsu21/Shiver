#ifndef CHOICE_H
#define CHOICE_H

#include <string>
#include <map>
#include <QJSValue>

enum class ChoiceType
{
    NONE,
    YES_NO,
    MULTI
};

struct UserOption
{
    int redirect;
    bool new_room;
    QJSValue callback;
};

struct Choice
{
    ChoiceType type = ChoiceType::NONE;
    std::string question;
    std::map<std::string, UserOption> options;
};

#endif // CHOICE_H
