#include "player.h"
#include <QVariant>

#include "Utils/utils.h"

Player::Player(QObject* parent, int agility, int constitution, int luck, PlayerStat elixir_type):
    QObject(parent),
    _agility(agility),
    _constitution(constitution),
    _luck(luck),
    _starting_agility(agility),
    _starting_constitution(constitution),
    _starting_luck(luck),
    _agility_mod(0),
    _constitution_mod(0),
    _luck_mod(0),
    _combat_mod(0),
    _gold(0),
    _rations(8),
    _elixir_count(2),
    _elixir_type(elixir_type),
    _inventory{"Sword", "Shield", "Backpack", "Lantern"},
    _conditions{}
{

}

int Player::getAgility() const
{
    return (_agility + _agility_mod >= 0 ? _agility + _agility_mod : 0);
}

int Player::getConstitution() const
{
    return (_constitution + _constitution_mod >= 0 ? _constitution + _constitution_mod : 0);
}

int Player::getLuck() const
{
    return (_luck + _luck_mod >= 0 ? _luck + _luck_mod : 0);
}

int Player::getAgilityWithoutModifiers() const
{
    return _agility;
}

int Player::getConstitutionWithoutModifiers() const
{
    return _constitution;
}

int Player::getLuckWithoutModifiers() const
{
    return _luck;
}

int Player::getAgilityModifier() const
{
    return _agility_mod;
}

int Player::getConstitutionModifier() const
{
    return _constitution_mod;
}

int Player::getLuckModifier() const
{
    return _luck_mod;
}

int Player::getCombatModifier() const
{
    return _combat_mod;
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

PlayerStat Player::getElixirType() const
{
    return _elixir_type;
}

std::string Player::getElixirTypeAsString() const
{
    switch(_elixir_type)
    {
    case PlayerStat::AGILITY:
        return "Elixir of Agility";
    case PlayerStat::CONSTITUTION:
        return "Elixir of Constitution";
    case PlayerStat::LUCK:
        return "Elixir of Luck";
    case PlayerStat::COMBAT_STRENGTH:
    case PlayerStat::INVALID:
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

std::vector<Condition> Player::getConditions() const
{
    return _conditions;
}

std::string Player::getConditionsString() const
{
    if(_conditions.empty())
    {
        return "";
    }

    return std::accumulate(std::next(std::begin(_conditions)), std::end(_conditions), _conditions.at(0)._name,
        [](std::string acc, Condition element)
        {
            return acc + "<br />" + element._name;
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
    case PlayerStat::AGILITY:
        _agility = _starting_agility;
        break;
    case PlayerStat::CONSTITUTION:
        _constitution = _starting_constitution;
        break;
    case PlayerStat::LUCK:
        ++_starting_luck;
        _luck = _starting_luck;
        break;
    case PlayerStat::COMBAT_STRENGTH:
    case PlayerStat::INVALID:
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
    std::vector<std::string>::iterator found_item =
            std::find(std::begin(_inventory), std::end(_inventory), item);
    if(found_item != std::end(_inventory))
    {
        _inventory.erase(found_item);
    }
}

void Player::removeItem(const QVariant& item)
{
    removeItem(item.toString().toStdString());
}

void Player::addCondition(const Condition& cond)
{
    switch(cond._modified_stat)
    {
    case PlayerStat::AGILITY:
        _agility_mod += cond._modifier;
        break;
    case PlayerStat::CONSTITUTION:
        _constitution_mod += cond._modifier;
        break;
    case PlayerStat::LUCK:
        _luck_mod += cond._modifier;
        break;
    case PlayerStat::COMBAT_STRENGTH:
        _combat_mod += cond._modifier;
    case PlayerStat::INVALID:
    default:
        break;
    }

    _conditions.push_back(cond);
}

void Player::removeCondition(const std::string& name)
{
    std::vector<Condition>::iterator found_cond =
            std::find_if(std::begin(_conditions), std::end(_conditions),
            [&name](const Condition& cond){return cond._name == name;});

    if(found_cond != std::end(_conditions))
    {
        switch(found_cond->_modified_stat)
        {
        case PlayerStat::AGILITY:
            _agility_mod -= found_cond->_modifier;
            break;
        case PlayerStat::CONSTITUTION:
            _constitution_mod -= found_cond->_modifier;
            break;
        case PlayerStat::LUCK:
            _luck_mod -= found_cond->_modifier;
            break;
        case PlayerStat::COMBAT_STRENGTH:
            _combat_mod -= found_cond->_modifier;
            break;
        case PlayerStat::INVALID:
        default:
            break;
        }

        if(found_cond->_callback.isCallable())
        {
            found_cond->_callback.call();
        }

        _conditions.erase(found_cond);
    }
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
