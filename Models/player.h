#ifndef PLAYER_H
#define PLAYER_H

#include <QObject>
#include <vector>

class Player: public QObject
{
    Q_OBJECT

public:
    enum class ElixirType
    {
        AGILITY,
        CONSTITUTION,
        LUCK
    };

private:
    int _agility;
    int _constitution;
    int _luck;

    const int _starting_agility;
    const int _starting_constitution;
    int _starting_luck;

    int _gold;
    int _rations;
    int _elixir_count;
    ElixirType _elixir_type;

    std::vector<std::string> _inventory;

public:
    Player(QObject* parent, int agility, int constitution, int luck, ElixirType elixir_type);

    Q_INVOKABLE int getAgility() const;
    Q_INVOKABLE int getConstitution() const;
    Q_INVOKABLE int getLuck() const;
    int getGold() const;
    int getRations() const;
    int getElixirCount() const;
    std::string getElixirType() const;
    bool hasItem(const std::string& item) const;
    std::string getInventory() const;

    void modifyAgility(int value);
    void modifyConstitution(int value);
    void modifyLuck(int value);
    void modifyGold(int value);

    bool eatRation();
    bool drinkElixir();
    void addItem(const std::string& item);
    void removeItem(const std::string& item);
    bool performLuckTest();
};

#endif // PLAYER_H
