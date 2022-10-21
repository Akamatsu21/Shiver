#ifndef CONDITION_H
#define CONDITION_H

#include <QJSValue>

#include "Enums/playerstat.h"
#include "Models/callback.h"

class Condition
{
    std::string _name;
    PlayerStat _modified_stat = PlayerStat::INVALID;
    int _modifier;
    Callback _callback;

public:
    Condition(const std::string& name, PlayerStat modified_stat, int modifier,
              CallbackTiming clear_timing, QJSValue on_clear_callback);

    std::string getName() const;
    PlayerStat getModifiedStat() const;
    int getModifierValue() const;
    CallbackTiming getClearTiming() const;

    void triggerCallback();
};

#endif // CONDITION_H
