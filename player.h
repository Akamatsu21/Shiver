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

    const uint8_t _starting_agility;
    const uint8_t _starting_constitution;
    uint8_t _starting_luck;

    uint16_t _gold;
    uint8_t _rations;
    uint8_t _elixir_count;
    ElixirType _elixir_type;

    std::vector<std::string> _inventory;

public:
    Player(QObject* parent, uint8_t agility, uint8_t constitution, uint8_t luck, ElixirType elixir_type);

    Q_INVOKABLE int getAgility() const;
    Q_INVOKABLE int getConstitution() const;
    Q_INVOKABLE int getLuck() const;
    uint16_t getGold() const;
    bool hasItem(const std::string& item);

    void modifyAgility(int value);
    void modifyConstitution(int value);
    void modifyLuck(int value);
    void modifyGold(int8_t value);

    bool eatRation();
    bool drinkElixir();
    void addItem(const std::string& item);
    void removeItem(const std::string& item);
};

#endif // PLAYER_H
