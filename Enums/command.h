#ifndef COMMAND_H
#define COMMAND_H

enum class Command
{
    INVALID,
    BEGIN,
    HELP,
    STATS,
    NORTH,
    SOUTH,
    EAST,
    WEST,
    FIGHT,
    ESCAPE,
    TAKE,
    EAT,
    DRINK,
    LUCKY,
    SAVE,
    LOAD,
    SAVELIST,
    SAVEDEL,
    CHEAT
};

#endif // COMMAND_H
