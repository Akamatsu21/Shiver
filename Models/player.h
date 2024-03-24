#ifndef PLAYER_H
#define PLAYER_H

#include <QObject>
#include <vector>

#include "Enums/playerstat.h"
#include "Models/condition.h"

class Player: public QObject
{
    Q_OBJECT

    int _agility;
    int _constitution;
    int _luck;

    int _starting_agility;
    const int _starting_constitution;
    int _starting_luck;

    int _temp_constitution;
    int _combat_mod;
    int _damage_mod;

    int _gold;
    int _rations;
    int _elixir_count;
    const PlayerStat _elixir_type;

    std::vector<std::string> _inventory;
    std::vector<Condition> _conditions;

public:
    Player(QObject* parent, int agility, int constitution, int luck, PlayerStat elixir_type);

    Q_INVOKABLE int getAgility() const;
    Q_INVOKABLE int getConstitution() const;
    Q_INVOKABLE int getLuck() const;
    int getTempConstitution() const;
    int getCombatModifier() const;
    int getDamageModifier() const;
    Q_INVOKABLE int getStartingAgility() const;
    Q_INVOKABLE int getStartingConstitution() const;
    Q_INVOKABLE int getStartingLuck() const;

    Q_INVOKABLE int getGold() const;
    Q_INVOKABLE int getRations() const;
    int getElixirCount() const;
    PlayerStat getElixirType() const;
    std::string getElixirTypeAsString() const;
    bool hasItem(const std::string& item) const;
    Q_INVOKABLE bool hasItem(const QVariant& item) const;
    std::string getInventory() const;
    std::string getInventoryHtml() const;
    std::vector<Condition> getConditions() const;
    std::string getConditionsString() const;

    void setAgility(int value);
    void setConstitution(int value);
    void setLuck(int value);
    void setTempConstitution(int value);
    void setGold(int value);
    void setRations(int value);
    void setElixirCount(int value);

    Q_INVOKABLE void modifyAgility(int value);
    Q_INVOKABLE void modifyConstitution(int value);
    Q_INVOKABLE void modifyLuck(int value);
    Q_INVOKABLE void modifyGold(int value);
    Q_INVOKABLE void modifyRations(int value);

    Q_INVOKABLE bool eatRation();
    bool drinkElixir();
    void addItem(const std::string& item);
    Q_INVOKABLE void addItem(const QVariant& item);
    void removeItem(const std::string& item);
    Q_INVOKABLE void removeItem(const QVariant& item);
    void addConditionToList(const Condition& cond);
    void applyCondition(const Condition& cond);
    void removeCondition(const std::string& name);
    Q_INVOKABLE bool performLuckCheck();
};

#endif // PLAYER_H
