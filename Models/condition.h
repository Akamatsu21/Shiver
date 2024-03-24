#ifndef CONDITION_H
#define CONDITION_H

#include <QJSValue>

#include "Models/callback.h"
#include "Models/statmodifier.h"

class Condition
{
    std::string _name;
    std::vector<StatModifier> _stat_modifiers;
    Callback _clear_callback;
    Callback _damage_callback;

public:
    Condition(const std::string& name, const std::vector<StatModifier>& stat_modifier,
              CallbackTiming clear_timing, QJSValue on_clear_callback,
              QJSValue on_damage_callback);

    std::string getName() const;
    std::vector<StatModifier> getStatModifiers() const;
    CallbackTiming getClearTiming() const;

    void triggerClearCallback();
    int triggerDamageCallback(int damage);
};

#endif // CONDITION_H
