#ifndef SAVESTATEMANAGER_H
#define SAVESTATEMANAGER_H

#include <string>

struct CombatState;
class Console;
class Event;
class Player;

class SaveStateManager
{
    std::string _game_state;

public:
    SaveStateManager();

    void createGameState(const Player& player,
                         const Event& event,
                         const CombatState& combat_state,
                         const Console& console);
    void loadGameState(const std::string& save_slot);
    void saveCurrentGameState(const std::string& save_slot);
};

#endif // SAVESTATEMANAGER_H
