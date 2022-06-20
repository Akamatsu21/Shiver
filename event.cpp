#include "event.h"

Event::Event(int id):
    _id(id),
    _description(""),
    _destinations(),
    _enemies()
{

}

int Event::getId() const
{
    return _id;
}

std::string Event::getDescription() const
{
    return _description;
}

int Event::getDestination(Direction direction) const
{
    return _destinations.at(direction);
}

bool Event::isDirectionAvailable(Direction direction) const
{
    return _destinations.find(direction) != std::end(_destinations);
}

bool Event::hasEnemies() const
{
    return !_enemies.empty();
}

void Event::setDescription(const std::string &description)
{
    _description = description;
}

void Event::setDestination(Direction direction, int destination)
{
    _destinations[direction] = destination;
}

Enemy& Event::getCurrentEnemy()
{
    return _enemies.front();
}

void Event::addEnemy(const std::string& name, int agility, int constitution)
{
    _enemies.emplace(name, agility, constitution);
}

void Event::defeatCurrentEnemy()
{
    _enemies.pop();
}
