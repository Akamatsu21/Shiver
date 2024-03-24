#ifndef CALLBACK_H
#define CALLBACK_H

#include <QJSValue>

#include "Enums/callbacktiming.h"

class Callback
{
    CallbackTiming _timing = CallbackTiming::NONE;
    int _round;
    QJSValue _effect;

public:
    Callback(CallbackTiming timing, int round, QJSValue effect);
    Callback(CallbackTiming timing, QJSValue effect);

    CallbackTiming getTiming() const;
    int getRound() const;
    bool isValid() const;

    QJSValue operator()(const QJSValueList& params = {});
};

#endif // CALLBACK_H
