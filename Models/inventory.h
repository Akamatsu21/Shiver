#ifndef INVENTORY_H
#define INVENTORY_H

#include "item.h"

#include <optional>

class Inventory
{
    std::vector<Item> _items;

public:
    Inventory();

    bool empty() const;
    bool hasItemID(const std::string& item_id) const;
    bool hasItemName(const std::string& item_name) const;
    std::optional<Item> findItemByID(const std::string& item_id) const;
    std::optional<Item> findItemByName(const std::string& item_name) const;

    std::string toString() const;
    std::string toHTML() const;

    void addItem(const Item& item);
    void removeItem(const Item& item);
};

#endif // INVENTORY_H
