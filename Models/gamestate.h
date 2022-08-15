#ifndef GAMESTATE_H
#define GAMESTATE_H

#include <string>

struct GameState
{
    int _player_agility;
    int _player_constitution;
    int _player_luck;
    int _player_start_agility;
    int _player_start_constitution;
    int _player_start_luck;
    int _player_gold;
    int _player_rations;
    int _player_elixir_count;
    int _player_elixir_type;
    std::string _player_inventory;

    int _event_id;
    bool _event_enemy_present;
    std::string _event_enemy_name;
    int _event_enemy_constitution;
    bool _event_gold_present;
    bool _event_items_present;
    int _event_item_limit;

    bool _combat_in_progress;
    int _combat_round;
    int _combat_enemy_score;
    int _combat_player_score;

    std::string _log;
    std::string _variables;
};

#endif // GAMESTATE_H
