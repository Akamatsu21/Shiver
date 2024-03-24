#include "condition.h"


Condition::Condition(const std::string& name, const std::vector<StatModifier>& stat_modifier,
                     CallbackTiming clear_timing, QJSValue on_clear_callback,
                     QJSValue on_damage_callback):
    _name(name),
    _stat_modifiers(stat_modifier),
    _clear_callback(clear_timing, on_clear_callback),
    _damage_callback(CallbackTiming::NONE, on_damage_callback)
{

}

std::string Condition::getName() const
{
    return _name;
}

std::vector<StatModifier> Condition::getStatModifiers() const
{
    return _stat_modifiers;
}

CallbackTiming Condition::getClearTiming() const
{
    return _clear_callback.getTiming();
}

void Condition::triggerClearCallback()
{
    if(_clear_callback.isValid())
    {
        _clear_callback();
    }
}

int Condition::triggerDamageCallback(int damage)
{
    if(_damage_callback.isValid())
    {
        QJSValueList params = {damage};
        QJSValue ret = _damage_callback(params);
        return ret.toInt();
    }

    return damage;
}
