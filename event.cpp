#include "event.h"

Event::Event(uint16_t id):
    _id(id),
    _description(""),
    _destinations(),
    _ag(0)
{

}

uint16_t Event::getId() const
{
    return _id;
}

std::string Event::getDescription() const
{
    return _description;
}

uint16_t Event::getDestination(Direction direction)
{
    return _destinations.at(direction);
}

void Event::setDescription(const std::string &description)
{
    _description = description;
}

void Event::setDestination(Direction direction, uint16_t destination)
{
    _destinations[direction] = destination;
}

bool Event::isDirectionAvailable(Direction direction)
{
    return _destinations.find(direction) != std::end(_destinations);
}

int Event::getAg()
{
    return _ag;
}

void Event::setAg(int ag)
{
    _ag = ag;
}
