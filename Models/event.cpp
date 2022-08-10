#include "event.h"
#include <algorithm>
#include <numeric>

#include "Utils/utils.h"

Event::Event(int id):
    _id(id),
    _redirect(0),
    _description(""),
    _destinations{},
    _enemies{},
    _items{},
    _item_limit(0)
{

}

int Event::getId() const
{
    return _id;
}

int Event::getRedirect() const
{
    return _redirect;
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
    return _destinations.count(direction) > 0;
}

bool Event::hasEnemies() const
{
    return !_enemies.empty();
}

bool Event::hasItems() const
{
    return !_items.empty();
}

bool Event::hasItem(const std::string& item) const
{
    return std::find(std::begin(_items), std::end(_items), item) != std::end(_items);
}

std::string Event::getItemList() const
{
    if(_items.empty())
    {
        return "";
    }

    return std::accumulate(std::next(std::begin(_items)), std::end(_items), _items.at(0),
        [](std::string acc, std::string element)
        {
            return acc + "\n" + element;
        });
}

std::string Event::findItem(const std::string& item) const
{
    std::string itemLower = utils::toLower(item);
    std::vector<std::string> itemsLower;
    std::transform(std::begin(_items), std::end(_items), std::back_inserter(itemsLower),
                   [](const std::string& s){ return utils::toLower(s); });
    auto result = std::find(std::begin(itemsLower), std::end(itemsLower), itemLower);
    if(result == std::end(itemsLower))
    {
        return "";
    }
    else
    {
        return _items.at(result - std::begin(itemsLower));
    }
}

int Event::getItemLimit() const
{
    return _item_limit;
}

void Event::setRedirect(int redirect)
{
    _redirect = redirect;
}

void Event::setDescription(const std::string &description)
{
    _description = description;
}

void Event::setDestination(Direction direction, int destination)
{
    _destinations[direction] = destination;
}

void Event::setItemLimit(int limit)
{
    _item_limit = limit;
}

Enemy Event::getCurrentEnemy() const
{
    return _enemies.front();
}

Enemy& Event::getCurrentEnemy()
{
    return _enemies.front();
}

void Event::addEnemy(const std::string& name, int agility,
                     int constitution, QJSValue on_death)
{
    _enemies.emplace(name, agility, constitution, on_death);
}

void Event::defeatCurrentEnemy()
{
    _enemies.pop();
}

void Event::defeatAllEnemies()
{
    while(!_enemies.empty())
    {
        _enemies.pop();
    }
}

void Event::addItem(const std::string& item)
{
    _items.push_back(item);
}

void Event::takeItem()
{
    if(_item_limit > 0)
    {
        --_item_limit;
    }
}
