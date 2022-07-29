#include "savestatemanager.h"
#include <sstream>

#include "Models/enemy.h"
#include "Models/event.h"
#include "Models/player.h"

SaveStateManager::SaveStateManager():
    _game_state("")
{

}

void SaveStateManager::createGameState(const Player &player,
                                       const Event &event,
                                       const CombatState &combat_state,
                                       const Console &console)
{
    std::ostringstream ss("");

    // Player stats
    ss << player.getAgility() << "\n"
       << player.getConstitution() << "\n"
       << player.getLuck() << "\n"
       << player.getStartingAgility() << "\n"
       << player.getStartingConstitution() << "\n"
       << player.getStartingLuck() << "\n"
       << player.getGold() << "\n"
       << player.getRations() << "\n"
       << player.getElixirCount() << "\n"
       << static_cast<int>(player.getElixirType()) << "\n"
       << "INVENTORY_START\n"s
       << player.getInventory() << "\n"
       << "INVENTORY_END\n";

    // Current event description
    ss << event.getId() << "\n"
       << "ENEMY_START\n";
       //<< event.getCurrentEnemy().toString() << "\n";
}
