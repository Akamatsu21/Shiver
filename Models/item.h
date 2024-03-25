#ifndef ITEM_H
#define ITEM_H

#include <string>
#include <vector>

class Item
{
    std::string _id;
    std::string _name;
    std::string _status;
    std::vector<std::string> _tags;
    std::string _description;

public:
    Item(const std::string& id, const std::string& name, const std::string& status,
         const std::vector<std::string>& tags, const std::string& description);

    std::string getID() const;
    std::string getName() const;
    std::string getStatus() const;
    std::vector<std::string> getTags() const;
    std::string getDescription() const;
};

#endif // ITEM_H
