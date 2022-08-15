#include "enemy.h"

Enemy::Enemy(const std::string& name,
             int agility,
             int constitution,
             const std::string& death_text,
             QJSValue on_death):
    _name(name),
    _agility(agility),
    _constitution(constitution),
    _starting_constitution(constitution),
    _death_text(death_text),
    _on_death_callback(on_death)
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

std::string Enemy::getDeathText() const
{
    return _death_text;
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

void Enemy::triggerOnDeathCallback()
{
    if(_on_death_callback.isCallable())
    {
        _on_death_callback.call();
    }
}
