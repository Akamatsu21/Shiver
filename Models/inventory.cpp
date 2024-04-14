#include "inventory.h"
#include <algorithm>
#include <numeric>

#include "Utils/utils.h"

Inventory::Inventory():
    _items{}
{

}

bool Inventory::empty() const
{
    return _items.empty();
}

bool Inventory::hasItemID(const std::string& item_id) const
{
    return findItemByID(item_id).has_value();
}

bool Inventory::hasItemName(const std::string& item_name) const
{
    return findItemByName(item_name).has_value();
}

std::optional<Item> Inventory::findItemByID(const std::string& item_id) const
{
    auto result = std::find_if(std::begin(_items), std::end(_items),
                               [item_id](const Item& item)
                               {
                                   return item.getID() == item_id;
                               });

    if(result != std::end(_items))
    {
        return *result;
    }

    return {};
}

std::optional<Item> Inventory::findItemByName(const std::string& item_name) const
{
    auto result = std::find_if(std::begin(_items), std::end(_items),
                               [item_name](const Item& item)
                               {
                                   return utils::toLower(item.getName()) == utils::toLower(item_name);
                               });

    if(result != std::end(_items))
    {
        return *result;
    }

    return {};
}

int Inventory::countByTag(const std::string& tag) const
{
    return std::count_if(std::begin(_items), std::end(_items),
                         [tag](const Item& item)
                         {
                             const auto& tags = item.getTags();
                             return std::find(std::begin(tags), std::end(tags), tag) != std::end(tags);
                         });
}

std::string Inventory::toString() const
{
    if(empty())
    {
        return "";
    }

    return std::accumulate(std::next(std::begin(_items)), std::end(_items), _items.at(0).getName(),
                           [](const std::string& acc, const Item& element)
                           {
                               return acc + "\n" + element.getID();
                           });
}

std::string Inventory::toHTML() const
{
    if(empty())
    {
        return "";
    }

    return std::accumulate(std::next(std::begin(_items)), std::end(_items), _items.at(0).getName(),
                           [](const std::string& acc, const Item& element)
                           {
                               std::string status("");
                               if(!element.getStatus().empty())
                               {
                                   status = " (" + element.getStatus() + ")";
                               }
                               return acc + "<br />" + element.getName() + status;
                           });
}

void Inventory::addItem(const Item& item)
{
    _items.push_back(item);
}

void Inventory::removeItem(const std::string& item_id)
{
    auto result = std::find_if(std::begin(_items), std::end(_items),
                               [item_id](const Item& item)
                               {
                                   return item.getID() == item_id;
                               });

    if(result != std::end(_items))
    {
        _items.erase(result);
    }
}
