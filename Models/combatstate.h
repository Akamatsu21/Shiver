#ifndef COMBATSTATE_H
#define COMBATSTATE_H

struct CombatState
{
    bool _combat_in_progress;
    int _combat_round;
    int _enemy_score;
    int _player_score;
};

#endif // COMBATSTATE_H
