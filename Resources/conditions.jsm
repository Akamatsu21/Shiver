export const conditions = 
{
    cursed_gloves:
    {
        stat: function() { return PlayerStats.Agility; },
        modifier: -1,
        clear_timing: function() { return ConditionClearTimings.CombatEnd; },
        on_clear: function()
        {
            player.removeItem("Cursed Gloves (-1 Agility)");
            system.message("Due to the damage sustained in battle, the Cursed Gloves feel a lot looser. You attempt to take them off once again, and this time you succeed.");
        }
    },
    enchanted_sword:
    {
        stat: function() { return PlayerStats.CombatScore; },
        modifier: +1,
        clear_timing: function() { return ConditionClearTimings.None; }
    }
};