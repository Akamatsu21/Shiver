#ifndef EVENT_H
#define EVENT_H

#include <string>
#include <map>
#include <queue>

#include "Enums/direction.h"
#include "enemy.h"

class Event
{
    int _id;
    std::string _description;
    std::map<Direction, int> _destinations;
    std::queue<Enemy> _enemies;
    std::vector<std::string> _items;
    int _item_limit;

public:
    Event(int id);

    int getId() const;
    std::string getDescription() const;
    int getDestination(Direction direction) const;
    bool isDirectionAvailable(Direction direction) const;
    bool hasEnemies() const;
    bool hasItems() const;
    bool hasItem(const std::string& item) const;
    std::string getItemList() const;
    std::string findItem(const std::string& item) const;
    int getItemLimit() const;

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
};

#endif // EVENT_H
