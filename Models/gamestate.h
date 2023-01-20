#ifndef GAMESTATE_H
#define GAMESTATE_H

#include <string>

struct GameState
{
    int player_agility;
    int player_constitution;
    int player_luck;
    int player_start_agility;
    int player_start_constitution;
    int player_start_luck;
    int player_gold;
    int player_rations;
    int player_elixir_count;
    int player_elixir_type;
    std::string player_inventory;
    std::string player_conditions;

    int event_id;
    bool event_enemy_present;
    std::string event_enemy_name;
    int event_enemy_constitution;
    bool event_enemy_escape_enabled;
    int event_enemy_escape_redirect;
    bool event_gold_present;
    bool event_items_present;
    int event_item_limit;
    bool event_rations_enabled;

    bool combat_in_progress;
    int combat_round;
    int combat_enemy_score;
    int combat_player_score;

    std::string log;
    std::string variables;
};

#endif // GAMESTATE_H
