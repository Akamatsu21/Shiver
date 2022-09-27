#include "player.h"
#include <QVariant>

#include "Utils/utils.h"

Player::Player(QObject* parent, int agility, int constitution, int luck, ElixirType elixir_type):
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

int Player::getStartingAgility() const
{
    return _starting_agility;
}

int Player::getStartingConstitution() const
{
    return _starting_constitution;
}

int Player::getStartingLuck() const
{
    return _starting_luck;
}

int Player::getGold() const
{
    return _gold;
}

int Player::getRations() const
{
    return _rations;
}

int Player::getElixirCount() const
{
    return _elixir_count;
}

ElixirType Player::getElixirType() const
{
    return _elixir_type;
}

std::string Player::getElixirTypeAsString() const
{
    switch(_elixir_type)
    {
    case ElixirType::AGILITY:
        return "Elixir of Agility";
    case ElixirType::CONSTITUTION:
        return "Elixir of Constitution";
    case ElixirType::LUCK:
        return "Elixir of Luck";
    case ElixirType::INVALID:
    default:
        return "";
    }
}

bool Player::hasItem(const std::string& item) const
{
    return std::find(std::begin(_inventory), std::end(_inventory), item) != std::end(_inventory);
}

bool Player::hasItem(const QVariant& item) const
{
    return hasItem(item.toString().toStdString());
}

std::string Player::getInventory() const
{
    if(_inventory.empty())
    {
        return "";
    }

    return std::accumulate(std::next(std::begin(_inventory)), std::end(_inventory), _inventory.at(0),
        [](std::string acc, std::string element)
        {
            return acc + "\n" + element;
        });
}

std::string Player::getInventoryHtml() const
{
    if(_inventory.empty())
    {
        return "";
    }

    return std::accumulate(std::next(std::begin(_inventory)), std::end(_inventory), _inventory.at(0),
        [](std::string acc, std::string element)
        {
            return acc + "<br />" + element;
    });
}

void Player::setAgility(int value)
{
    if(value < 0 || value > _starting_agility)
    {
        throw std::out_of_range("Player agility out of range.");
    }

    _agility = value;
}

void Player::setConstitution(int value)
{
    if(value < 0 || value > _starting_constitution)
    {
        throw std::out_of_range("Player constitution out of range.");
    }

    _constitution = value;
}

void Player::setLuck(int value)
{
    if(value < 0 || value > _starting_luck)
    {
        throw std::out_of_range("Player luck out of range.");
    }

    _luck = value;
}

void Player::setGold(int value)
{
    if(value < 0)
    {
        throw std::out_of_range("Gold number out of range.");
    }

    _gold = value;
}

void Player::setRations(int value)
{
    if(value < 0)
    {
        throw std::out_of_range("Rations number out of range.");
    }

    _rations = value;
}

void Player::setElixirCount(int value)
{
    if(value < 0)
    {
        throw std::out_of_range("Elixir number out of range.");
    }

    _elixir_count = value;
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

void Player::modifyGold(int value)
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

void Player::modifyRations(int value)
{
    if(_rations < -value)
    {
        _rations = 0;
    }
    else
    {
        _rations += value;
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
        break;
    }

    --_elixir_count;
    return true;
}

void Player::addItem(const std::string& item)
{
    if(!hasItem(item))
    {
        _inventory.push_back(item);
    }
}

void Player::addItem(const QVariant& item)
{
    addItem(item.toString().toStdString());
}

void Player::removeItem(const std::string& item)
{
    _inventory.erase(std::find(std::begin(_inventory), std::end(_inventory), item));
}

void Player::removeItem(const QVariant& item)
{
    removeItem(item.toString().toStdString());
}

bool Player::performLuckCheck()
{
    if(getLuck() == 0)
    {
        return false;
    }

    int testValue = utils::rollD6(2);
    bool success = testValue <= getLuck();
    modifyLuck(-1);
    return success;
}
