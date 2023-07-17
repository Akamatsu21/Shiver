export const conditions = 
{
    cursed_gloves:
    {
        stat: PlayerStat.Agility,
        modifier: -1,
        clear_timing: CallbackTiming.CombatEnd,
        on_clear: function()
        {
            player.removeItem("Cursed Gloves (-1 Agility)");
            system.message("Due to the damage sustained in battle, the Cursed Gloves feel a lot looser. You attempt to take them off once again, and this time you succeed.");
        }
    },
    enchanted_sword:
    {
        stat: PlayerStat.CombatScore,
        modifier: +1,
        clear_timing: CallbackTiming.None
    },
    goblin_follower:
    {
        stat: PlayerStat.Agility,
        modifier: +3,
        clear_timing: CallbackTiming.CombatEnd
    },
    helmet:
    {
        stat: PlayerStat.Constitution,
        modifier: +3,
        clear_timing: CallbackTiming.CombatEnd,
        on_clear: function()
        {
            player.removeItem("Helmet");
            if(player.getConstitution() <= 0)
            {
                system.message("You take of your helmet, and that is when you realise the extent of your injuries. You collapse from all the bloodloss...");
            }
        }
    }
};