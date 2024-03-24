export const conditions = 
{
    cursed_gloves:
    {
        modifiers:
        [
            {
                stat: PlayerStat.Agility,
                value: -1
            }
        ],
        clear_timing: CallbackTiming.CombatEnd,
        on_clear: function()
        {
            player.removeItem("Cursed Gloves (-1 Agility)");
            system.message("Due to the damage sustained in battle, the Cursed Gloves feel a lot looser. You attempt to take them off once again, and this time you succeed.");
        }
    },
    enchanted_sword:
    {
        modifiers:
        [
            {
                stat: PlayerStat.CombatStrength,
                value: +1
            }
        ],
        clear_timing: CallbackTiming.None
    },
    fireball:
    {
        modifiers:
        [
            {
                stat: PlayerStat.CombatStrength,
                value: +2
            },
            {
                stat: PlayerStat.Damage,
                value: +1
            }
        ],
        clear_timing: CallbackTiming.CombatEnd,
        on_clear: function()
        {
            player.removeItem("Fireball");
        },
        on_damage: function(damage)
        {
            const score = system.rollD6(1);
            if(score == 6)
            {
                system.message("You were protected by the power of the fireball! Damage nullified.");
                return 0;
            }
            else if(score == 2 || score == 4)
            {
                system.message("You were protected by the power of the fireball! Damage reduced by 1.");
                return damage - 1;
            }
            else
            {
                return damage;
            }
        }
    },
    goblin_follower:
    {
        modifiers:
        [
            {
                stat: PlayerStat.Agility,
                value: +3
            }
        ],
        clear_timing: CallbackTiming.CombatEnd
    },
    helmet:
    {
        modifiers:
        [
            {
                stat: PlayerStat.Constitution,
                value: +3
            }
        ],
        clear_timing: CallbackTiming.CombatEnd,
        on_clear: function()
        {
            player.removeItem("Helmet");
        }
    }
};