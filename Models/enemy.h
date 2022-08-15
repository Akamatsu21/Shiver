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
    std::string _death_text;

    QJSValue _on_death_callback;

public:
    Enemy(const std::string& name,
          int agility,
          int constitution,
          const std::string& death_text,
          QJSValue on_death);

    std::string getName() const;
    int getAgility() const;
    int getConstitution() const;
    std::string getDeathText() const;

    void setConstitution(int value);

    void modifyConstitution(int value);
    void triggerOnDeathCallback();
};

#endif // ENEMY_H
