#ifndef ENEMY_H
#define ENEMY_H

#include <string>
#include <QJSValue>

class Enemy
{
    std::string _name;
    int _agility;
    int _constitution;
    const int _starting_constitution;

    QJSValue _on_death_callback;
    std::map<int, QJSValue> _on_round_end_callbacks;

public:
    Enemy(const std::string& name,
          int agility,
          int constitution,
          QJSValue on_death,
          const std::map<int, QJSValue>& on_round_end);

    std::string getName() const;
    int getAgility() const;
    int getConstitution() const;

    void setConstitution(int value);

    void modifyConstitution(int value);
    void triggerOnDeathCallback();
    void triggerOnRoundEndCallback(int round);
};

#endif // ENEMY_H
