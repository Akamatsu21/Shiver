#include "event.h"

Event::Event(uint16_t id, std::string description):
    _id(id),
    _description(description)
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
