#ifndef ENEMY_H
#define ENEMY_H

#include <string>
#include <QJSValue>

#include "Models/callback.h"

class Enemy
{
    std::string _name;
    int _agility;
    int _constitution;
    const int _starting_constitution;
    bool _escape_enabled;
    int _escape_redirect;
    bool _invincible;

    std::vector<Callback> _callbacks;

public:
    Enemy(const std::string& name,
          int agility,
          int constitution,
          bool escape_enabled,
          int escape_redirect,
          bool invincible,
          const std::vector<Callback>& callbacks);

    std::string getName() const;
    int getAgility() const;
    int getConstitution() const;
    bool isEscapeEnabled() const;
    int getEscapeRedirect() const;
    bool isInvincible() const;
    std::vector<Callback> getCallbacks() const;

    void setConstitution(int value);
    void setEscapeEnabled(bool value);
    void setEscapeRedirect(int value);

    void modifyConstitution(int value);
};

#endif // ENEMY_H
