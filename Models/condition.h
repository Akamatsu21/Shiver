#ifndef CONDITION_H
#define CONDITION_H

#include <QJSValue>

#include "Enums/playerstat.h"
#include "Enums/conditioncleartiming.h"

struct Condition
{
    std::string _name;
    PlayerStat _modified_stat = PlayerStat::INVALID;
    int _modifier;
    ConditionClearTiming _clear_timing = ConditionClearTiming::NONE;
    QJSValue _callback;
};

#endif // CONDITION_H
