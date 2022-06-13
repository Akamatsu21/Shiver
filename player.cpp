#include "player.h"

Player::Player(QObject* parent, uint8_t agility, uint8_t constitution, uint8_t luck, ElixirType elixir_type):
    QObject(parent),
    _agility(agility),
    _constitution(constitution),
    _luck(luck),
    _starting_agility(agility),
    _starting_constitution(constitution),
    _starting_luck(luck),
    _gold(0),
    _rations(8),
    _elixir_count(2),
    _elixir_type(elixir_type),
    _inventory{"Sword", "Shield", "Backpack", "Lantern"}
{

}

int Player::getAgility() const
{
    return _agility;
}

int Player::getConstitution() const
{
    return _constitution;
}

int Player::getLuck() const
{
    return _luck;
}

uint16_t Player::getGold() const
{
    return _gold;
}

bool Player::hasItem(const std::string& item)
{
    return std::find(std::begin(_inventory), std::end(_inventory), item) != std::end(_inventory);
}

void Player::modifyAgility(int value)
{
    _agility += value;
    if(_agility < 0)
    {
        _agility = 0;
    }
    else if(_agility > _starting_agility)
    {
        _agility = _starting_agility;
    }
}

void Player::modifyConstitution(int value)
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

void Player::modifyLuck(int value)
{
    _luck += value;
    if(_luck < 0)
    {
        _luck = 0;
    }
    else if(_luck > _starting_luck)
    {
        _luck = _starting_luck;
    }
}

void Player::modifyGold(int8_t value)
{
    if(_gold < -value)
    {
        _gold = 0;
    }
    else
    {
        _gold += value;
    }
}

bool Player::eatRation()
{
    if(_rations == 0)
    {
        return false;
    }

    modifyConstitution(+4);
    --_rations;
    return true;
}

bool Player::drinkElixir()
{
    if(_elixir_count == 0)
    {
        return false;
    }

    switch(_elixir_type)
    {
    case ElixirType::AGILITY:
        _agility = _starting_agility;
        break;
    case ElixirType::CONSTITUTION:
        _constitution = _starting_constitution;
        break;
    case ElixirType::LUCK:
        ++_starting_luck;
        _luck = _starting_luck;
        break;
    default:
        Q_ASSERT(false);
        break;
    }

    --_elixir_count;
    return true;
}

void Player::addItem(const std::string& item)
{
    _inventory.push_back(item);
}

void Player::removeItem(const std::string& item)
{
    _inventory.erase(std::find(std::begin(_inventory), std::end(_inventory), item));
}
