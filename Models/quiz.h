#ifndef QUIZ_H
#define QUIZ_H

#include <string>
#include <vector>

#include "useroption.h"

struct Quiz
{
    std::string question;
    std::vector<std::string> answers;
    UserOption correct;
    UserOption incorrect;
};

#endif // QUIZ_H
