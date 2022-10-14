#include "event.h"
#include <algorithm>
#include <numeric>

#include "Utils/utils.h"

Event::Event(int id):
    _id(id),
    _redirect(0),
    _new_room(false),
    _description(""),
    _destinations{},
    _enemies{},
    _gold(0),
    _has_gold(false),
    _items{},
    _item_limit(0),
    _rations_enabled(false),
    _choice(),
    _local_commands{},
    _exit_callback(false)
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

bool Event::leadsToNewRoom() const
{
    return _new_room;
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

bool Event::hasGold() const
{
    return _has_gold;
}

int Event::getGold() const
{
    return _gold;
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

bool Event::rationsEnabled() const
{
    return _rations_enabled;
}

bool Event::hasYesNoChoice() const
{
    return _choice._type == ChoiceType::YES_NO;
}

bool Event::hasMultiChoice() const
{
    return _choice._type == ChoiceType::MULTI;
}

std::string Event::getChoiceQuestion() const
{
    return _choice._question;
}

std::vector<std::string> Event::getChoiceOptions() const
{
    return utils::getKeys(_choice._options);
}

UserOption Event::getChoiceOption(const std::string& option) const
{
    return _choice._options.at(option);
}

bool Event::hasLocalCommands() const
{
    return !_local_commands.empty();
}

std::vector<std::string> Event::getLocalCommands() const
{
    return utils::getKeys(_local_commands);
}

UserOption Event::getLocalCommand(const std::string& command) const
{
    return _local_commands.at(command);
}

void Event::setRedirect(int value)
{
    _redirect = value;
}

void Event::setNewRoom(bool value)
{
    _new_room = value;
}

void Event::setDescription(const std::string& value)
{
    _description = value;
}

void Event::setDestination(Direction direction, int destination)
{
    _destinations[direction] = destination;
}

void Event::setHasGold(bool value)
{
    _has_gold = value;
}

void Event::setGold(int value)
{
    _gold = value;
}

void Event::setItemLimit(int value)
{
    _item_limit = value;
}

void Event::setRationsEnabled(bool value)
{
    _rations_enabled = value;
}

void Event::setExitCallback(QJSValue callback)
{
    _exit_callback = callback;
}

Enemy Event::getCurrentEnemy() const
{
    return _enemies.front();
}

Enemy& Event::getCurrentEnemy()
{
    return _enemies.front();
}

void Event::addEnemy(const std::string& name,
                     int agility,
                     int constitution,
                     QJSValue on_death,
                     const std::map<int, QJSValue>& on_round_end)
{
    _enemies.emplace(name, agility, constitution, on_death, on_round_end);
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

void Event::setChoice(ChoiceType type, const std::string& question)
{
    _choice._type = type;
    _choice._question = question;
}

void Event::addChoiceOption(const std::string& answer, int redirect, bool new_room, QJSValue callback)
{
    _choice._options[answer] = {redirect, new_room, callback};
}

void Event::triggerChoiceOptionCallback(const std::string& option)
{
    if(getChoiceOption(option)._callback.isCallable())
    {
        getChoiceOption(option)._callback.call();
    }
}

void Event::addLocalCommand(const std::string& command, int redirect, bool new_room, QJSValue callback)
{
    _local_commands[command] = {redirect, new_room, callback};
}

void Event::triggerLocalCommandCallback(const std::string& command)
{
    if(getLocalCommand(command)._callback.isCallable())
    {
        getLocalCommand(command)._callback.call();
    }
}

void Event::triggerExitCallback()
{
    if(_exit_callback.isCallable())
    {
        _exit_callback.call();
    }
}
