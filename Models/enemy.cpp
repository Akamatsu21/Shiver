#include "enemy.h"
#include "System/utils.h"

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

std::string Enemy::toString() const
{
    return utils::createString(_name, "\n",
                               _agility, "\n",
                               _constitution, "\n",
                               _starting_constitution, "\n");
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
