#ifndef ENEMY_H
#define ENEMY_H

#include <string>

class Enemy
{
    std::string _name;
    int _agility;
    int _constitution;
    const int _starting_constitution;

public:
    Enemy(const std::string& name, int agility, int constitution);

    std::string getName() const;
    int getAgility() const;
    int getConstitution() const;

    void setConstitution(int value);

    void modifyConstitution(int value);
};

#endif // ENEMY_H
