#include "enemy.h"

Enemy::Enemy(const std::string& name,
             int agility,
             int constitution,
             QJSValue on_death,
             const std::map<int, QJSValue>& on_round_end):
    _name(name),
    _agility(agility),
    _constitution(constitution),
    _starting_constitution(constitution),
    _on_death_callback(on_death),
    _on_round_end_callbacks(on_round_end)
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

void Enemy::triggerOnDeathCallback()
{
    if(_on_death_callback.isCallable())
    {
        _on_death_callback.call();
    }
}

void Enemy::triggerOnRoundEndCallback(int round)
{
    if(_on_round_end_callbacks.count(round) > 0 && _on_round_end_callbacks.at(round).isCallable())
    {
        _on_round_end_callbacks.at(round).call();
    }
}
