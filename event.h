#ifndef EVENT_H
#define EVENT_H

#include <string>
#include <map>

#include "direction.h"

class Event
{
    uint16_t _id;
    std::string _description;
    std::map<Direction, uint16_t> _destinations;
    int _ag;

public:
    Event(uint16_t id);

    uint16_t getId() const;
    std::string getDescription() const;
    uint16_t getDestination(Direction direction);

    void setDescription(const std::string& description);
    void setDestination(Direction direction, uint16_t destination);

    bool isDirectionAvailable(Direction direction);

    int getAg();
    void setAg(int ag);
};

#endif // EVENT_H
