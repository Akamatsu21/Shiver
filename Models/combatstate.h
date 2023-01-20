#ifndef COMBATSTATE_H
#define COMBATSTATE_H

struct CombatState
{
    bool combat_in_progress;
    int combat_round;
    int enemy_score;
    int player_score;
};

#endif // COMBATSTATE_H
