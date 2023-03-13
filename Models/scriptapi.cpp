#include "scriptapi.h"
#include "combatstate.h"
#include "event.h"
#include "Utils/utils.h"

ScriptApi::ScriptApi(QObject* parent, const Event& event, const CombatState& combat_state):
    QObject(parent),
    _combat_state(combat_state),
    _event(event)
{

}

int ScriptApi::getCurrentEnemyConstitution() const
{
    return _event.getCurrentEnemy().getConstitution();
}

int ScriptApi::getCurrentEnemyScore() const
{
    return _combat_state.enemy_score;
}

int ScriptApi::getCurrentPlayerScore() const
{
    return _combat_state.player_score;
}

int ScriptApi::getCurrentRound() const
{
    return _combat_state.combat_round;
}

QString ScriptApi::getFileContents(const QString& path) const
{
    try
    {
        return QString::fromStdString(utils::accessStaticResource(path.toStdString()));
    }
    catch(const std::system_error& e)
    {
        return "<font color=\"red\">Error occured. Content not loaded.</font>";
    }
}

int ScriptApi::rollD6(int count) const
{
    return utils::rollD6(count);
}
