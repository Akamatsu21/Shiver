#ifndef USEROPTION_H
#define USEROPTION_H

#include <QJSValue>

struct UserOption
{
    int redirect;
    bool new_room;
    QJSValue callback;
};

#endif // USEROPTION_H
