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
    int _redirect;
    bool _new_room;
    QJSValue _callback;
};

struct Choice
{
    ChoiceType _type = ChoiceType::NONE;
    std::string _question;
    std::map<std::string, UserOption> _options;
};

#endif // CHOICE_H
