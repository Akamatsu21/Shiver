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
    int countByTag(const std::string& tag) const;
    std::vector<Item> findItemsWithTag(const std::string& tag) const;

    std::string toString() const;
    std::string toHTML() const;

    void addItem(const Item& item);
    void removeItem(const std::string& item_id);
};

#endif // INVENTORY_H
