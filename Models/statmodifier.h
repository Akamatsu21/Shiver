#ifndef STATMODIFIER_H
#define STATMODIFIER_H

#include "Enums/playerstat.h"

struct StatModifier
{
    PlayerStat stat = PlayerStat::INVALID;
    int value;
};

#endif // STATMODIFIER_H
