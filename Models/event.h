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

public:
    Event(int id);

    int getId() const;
    std::string getDescription() const;
    int getDestination(Direction direction) const;
    bool isDirectionAvailable(Direction direction) const;
    bool hasEnemies() const;

    void setDescription(const std::string& description);
    void setDestination(Direction direction, int destination);

    Enemy& getCurrentEnemy();
    void addEnemy(const std::string& name, int agility, int constitution);
    void defeatCurrentEnemy();
    void defeatAllEnemies();
};

#endif // EVENT_H
