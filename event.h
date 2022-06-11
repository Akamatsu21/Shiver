#ifndef EVENT_H
#define EVENT_H

#include <string>

class Event
{
    uint16_t _id;
    std::string _description;

public:
    Event(uint16_t id, std::string description);

    uint16_t getId() const;
    std::string getDescription() const;
};

#endif // EVENT_H
