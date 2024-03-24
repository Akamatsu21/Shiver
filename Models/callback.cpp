#include "callback.h"

Callback::Callback(CallbackTiming timing, int round, QJSValue effect):
    _timing(timing),
    _round(round),
    _effect(effect)
{

}

Callback::Callback(CallbackTiming timing, QJSValue effect):
    Callback(timing, 0, effect)
{

}

CallbackTiming Callback::getTiming() const
{
    return _timing;
}

int Callback::getRound() const
{
    return _round;
}

bool Callback::isValid() const
{
    return _effect.isCallable();
}

QJSValue Callback::operator()(const QJSValueList& params)
{
    return _effect.call(params);
}
