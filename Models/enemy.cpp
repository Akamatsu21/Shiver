#include "enemy.h"
#include "Utils/utils.h"

Enemy::Enemy(const std::string& name, int agility, int constitution):
    _name(name),
    _agility(agility),
    _constitution(constitution),
    _starting_constitution(constitution)
{

}

std::string Enemy::getName() const
{
    return _name;
}

int Enemy::getAgility() const
{
    return _agility;
}

int Enemy::getConstitution() const
{
    return _constitution;
}

void Enemy::setConstitution(int value)
{
    if(value < 0 || value > _starting_constitution)
    {
        throw std::out_of_range("Enemy constitution out of range.");
    }

    _constitution = value;
}

void Enemy::modifyConstitution(int value)
{
    _constitution += value;
    if(_constitution < 0)
    {
        _constitution = 0;
    }
    else if(_constitution > _starting_constitution)
    {
        _constitution = _starting_constitution;
    }
}
