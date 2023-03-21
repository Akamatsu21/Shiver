#include "enemy.h"

Enemy::Enemy(const std::string& name,
             int agility,
             int constitution,
             bool escape_enabled,
             int escape_redirect,
             bool invincible,
             const std::vector<Callback>& callbacks):
    _name(name),
    _agility(agility),
    _constitution(constitution),
    _starting_constitution(constitution),
    _escape_enabled(escape_enabled),
    _escape_redirect(escape_redirect),
    _invincible(invincible),
    _callbacks(callbacks)
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

bool Enemy::isEscapeEnabled() const
{
    return _escape_enabled;
}

int Enemy::getEscapeRedirect() const
{
    return _escape_redirect;
}

bool Enemy::isInvincible() const
{
    return _invincible;
}

std::vector<Callback> Enemy::getCallbacks() const
{
    return _callbacks;
}

void Enemy::setConstitution(int value)
{
    if(value < 0 || value > _starting_constitution)
    {
        throw std::out_of_range("Enemy constitution out of range.");
    }

    _constitution = value;
}

void Enemy::setEscapeEnabled(bool value)
{
    _escape_enabled = value;
}

void Enemy::setEscapeRedirect(int value)
{
    _escape_redirect = value;
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
