#include "condition.h"


Condition::Condition(const std::string& name, PlayerStat modified_stat, int modifier,
                     CallbackTiming clear_timing, QJSValue on_clear_callback):
    _name(name),
    _modified_stat(modified_stat),
    _modifier(modifier),
    _callback(clear_timing, on_clear_callback)
{

}

std::string Condition::getName() const
{
    return _name;
}

PlayerStat Condition::getModifiedStat() const
{
    return _modified_stat;
}

int Condition::getModifierValue() const
{
    return _modifier;
}

CallbackTiming Condition::getClearTiming() const
{
    return _callback.getTiming();
}

void Condition::triggerCallback()
{
    if(_callback.isValid())
    {
        _callback();
    }
}
