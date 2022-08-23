#ifndef SCRIPTAPI_H
#define SCRIPTAPI_H

#include <QObject>

class CombatState;
class Event;

class ScriptApi: public QObject
{
    Q_OBJECT

    const CombatState& _combat_state;
    const Event& _event;

public:
    ScriptApi(QObject* parent, const Event& event, const CombatState& combat_state);

    Q_INVOKABLE int getCurrentEnemyConstitution() const;
    Q_INVOKABLE int getCurrentEnemyScore() const;
    Q_INVOKABLE int getCurrentPlayerScore() const;
    Q_INVOKABLE int getCurrentRound() const;

signals:
    void message(const QVariant& text);
    void redirect(int id, bool new_room);
    void stopCombat();
};

#endif // SCRIPTAPI_H
