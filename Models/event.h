#ifndef EVENT_H
#define EVENT_H

#include <string>
#include <map>
#include <queue>

#include "choice.h"
#include "enemy.h"
#include "Enums/direction.h"

class Event
{
    int _id;
    int _redirect;
    bool _new_room;
    std::string _description;
    std::map<Direction, int> _destinations;
    std::queue<Enemy> _enemies;
    std::vector<std::string> _items;
    int _item_limit;
    Choice _choice;
    std::map<std::string, int> _local_commands;

public:
    Event(int id);

    int getId() const;
    int getRedirect() const;
    bool leadsToNewRoom() const;
    std::string getDescription() const;
    int getDestination(Direction direction) const;
    bool isDirectionAvailable(Direction direction) const;
    bool hasEnemies() const;
    bool hasItems() const;
    bool hasItem(const std::string& item) const;
    std::string getItemList() const;
    std::string findItem(const std::string& item) const;
    int getItemLimit() const;
    bool hasYesNoChoice() const;
    bool hasMultiChoice() const;
    Choice getChoice() const;
    bool hasLocalCommands() const;
    std::vector<std::string> getLocalCommands() const;
    int getLocalCommandRedirect(const std::string& command) const;

    void setRedirect(int redirect);
    void setNewRoom(bool new_room);
    void setDescription(const std::string& description);
    void setDestination(Direction direction, int destination);
    void setItemLimit(int limit);

    Enemy getCurrentEnemy() const;
    Enemy& getCurrentEnemy();
    void addEnemy(const std::string& name, int agility,
                  int constitution, QJSValue on_death);
    void defeatCurrentEnemy();
    void defeatAllEnemies();

    void addItem(const std::string& item);
    void takeItem();

    void setChoice(ChoiceType type, const std::string& question);
    void addChoiceOption(const std::string& answer, int redirect);
    void addLocalCommand(const std::string& command, int redirect);
};

#endif // EVENT_H
