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
    _temp_constitution(0),
    _combat_mod(0),
    _damage_mod(0),
    _gold(0),
    _rations(8),
    _elixir_count(2),
    _elixir_type(elixir_type),
    _inventory{},
    _conditions{}
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

int Player::getTempConstitution() const
{
    return _temp_constitution;
}

int Player::getCombatModifier() const
{
    return _combat_mod;
}

int Player::getDamageModifier() const
{
    return _damage_mod;
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

    return std::accumulate(std::next(std::begin(_conditions)), std::end(_conditions), _conditions.at(0).getName(),
        [](std::string acc, Condition element)
        {
            return acc + "<br />" + element.getName();
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

void Player::setTempConstitution(int value)
{
    if(value < 0)
    {
        throw std::out_of_range("Temporary constitution value out of range.");
    }

    _temp_constitution = value;
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
    if(value < 0 && _temp_constitution > 0)
    {
        // Damage goes to temporary hit points first.
        _temp_constitution += value;
        if(_temp_constitution < 0)
        {
            _constitution += _temp_constitution;
            _temp_constitution = 0;
        }
    }
    else
    {
        _constitution += value;
    }

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
    modifyRations(-1);
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

void Player::addConditionToList(const Condition& cond)
{
    _conditions.push_back(cond);
}

void Player::applyCondition(const Condition& cond)
{
    for(const StatModifier& mod: cond.getStatModifiers())
    {
        switch(mod.stat)
        {
        case PlayerStat::AGILITY:
            _starting_agility += mod.value;
            modifyAgility(mod.value);
            break;
        case PlayerStat::CONSTITUTION:
            // The code makes an assumption that there will only
            // be one temp constitution source at a time.
            // If this becomes false in the game, this logic will need to be altered.
            // It also assumes constitution conditions will always give positive bonus.
            setTempConstitution(mod.value);
            break;
        case PlayerStat::LUCK:
            _starting_luck += mod.value;
            modifyLuck(mod.value);
            break;
        case PlayerStat::COMBAT_STRENGTH:
            _combat_mod += mod.value;
            break;
        case PlayerStat::DAMAGE:
            _damage_mod += mod.value;
            break;
        default:
            break;
        }
    }

    addConditionToList(cond);
}

void Player::removeCondition(const std::string& name)
{
    std::vector<Condition>::iterator found_cond =
            std::find_if(std::begin(_conditions), std::end(_conditions),
            [&name](const Condition& cond){return cond.getName() == name;});

    if(found_cond != std::end(_conditions))
    {
        for(const StatModifier& mod: found_cond->getStatModifiers())
        {
            switch(mod.stat)
            {
            case PlayerStat::AGILITY:
                _starting_agility -= mod.value;
                modifyAgility(-mod.value);
                break;
            case PlayerStat::CONSTITUTION:
                setTempConstitution(0);
                break;
            case PlayerStat::LUCK:
                _starting_luck -= mod.value;
                modifyLuck(-mod.value);
                break;
            case PlayerStat::COMBAT_STRENGTH:
                _combat_mod -= mod.value;
                break;
            case PlayerStat::DAMAGE:
                _damage_mod -= mod.value;
                break;
            default:
                break;
            }
        }

        found_cond->triggerClearCallback();
        _conditions.erase(found_cond);
    }
}

bool Player::performLuckCheck()
{
    if(getLuck() <= 0)
    {
        return false;
    }

    int testValue = utils::rollD6(2);
    bool success = testValue <= getLuck();
    modifyLuck(-1);
    return success;
}
