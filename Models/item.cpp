#include "item.h"

Item::Item(const std::string& id, const std::string& name, const std::string& status,
           const std::vector<std::string>& tags, const std::string& description):
    _id(id), _name(name), _status(status), _tags(tags), _description(description)
{

}

std::string Item::getID() const
{
    return _id;
}

std::string Item::getName() const
{
    return _name;
}

std::string Item::getStatus() const
{
    return _status;
}

std::vector<std::string> Item::getTags() const
{
    return _tags;
}

std::string Item::getDescription() const
{
    return _description;
}
