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
    INSPECT,
    EAT,
    DRINK,
    LUCKY,
    SAVE,
    LOAD,
    SAVELIST,
    SAVEDEL,
    SETTINGS,
    CHEAT
};

#endif // COMMAND_H
