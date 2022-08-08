#ifndef PLAYER_H
#define PLAYER_H

#include <QObject>
#include <vector>

#include "Enums/elixirtype.h"

class Player: public QObject
{
    Q_OBJECT

    int _agility;
    int _constitution;
    int _luck;

    const int _starting_agility;
    const int _starting_constitution;
    int _starting_luck;

    int _gold;
    int _rations;
    int _elixir_count;
    const ElixirType _elixir_type;

    std::vector<std::string> _inventory;

public:
    Player(QObject* parent, int agility, int constitution, int luck, ElixirType elixir_type);

    Q_INVOKABLE int getAgility() const;
    Q_INVOKABLE int getConstitution() const;
    Q_INVOKABLE int getLuck() const;
    int getStartingAgility() const;
    int getStartingConstitution() const;
    int getStartingLuck() const;
    int getGold() const;
    int getRations() const;
    int getElixirCount() const;
    ElixirType getElixirType() const;
    std::string getElixirTypeAsString() const;
    bool hasItem(const std::string& item) const;
    Q_INVOKABLE bool hasItem(const QVariant& item) const;
    std::string getInventory() const;

    void setAgility(int value);
    void setConstitution(int value);
    void setLuck(int value);
    void setGold(int value);
    void setRations(int value);
    void setElixirCount(int value);

    void modifyAgility(int value);
    Q_INVOKABLE void modifyConstitution(int value);
    void modifyLuck(int value);
    void modifyGold(int value);

    bool eatRation();
    bool drinkElixir();
    void addItem(const std::string& item);
    void removeItem(const std::string& item);
    bool performLuckCheck();
};

#endif // PLAYER_H
