export const events =
{
    event1:
    {
        description: "Starting room",
        north: 2
    },
    event2:
    {
        description: "Cave",
        south: 1,
        west: 3,
        east: 4
    },
    event3:
    {
        description: "Enemy fight",
        east: 2,
        south: 5,
        enemies:
        [
            {
                name: "Orc",
                agility: 5,
                constitution: 1,
                onDeath: function()
                {
                    game_vars.incrementCounter("orc_kills", +1);
                }
            }
        ]
    },
    event4:
    {
        description: function()
        {
            game_vars.setFlag("visited_dead_end", true);
            return "Dead end";
        },
        west: 2,
        enemies:
        [
            {
                name: "Goblin",
                agility: 1,
                constitution: 1
            },
            {
                name: "Griffon",
                agility: 20,
                constitution: 60
            }
        ]
    },
    event5:
    {
        description: "You found a chest. You find: [i]Amulet[/i], [i]Axe[/i] and [i]Cock Shield[/i]. You may only take two.",
        north: 3,
        south: 6,
        items:
        [
            "Amulet",
            "Axe",
            "Cock Shield"
        ],
        item_limit: 2
    },
    event6:
    {
        description: function()
        {
            let desc = "You encounter the [e]Kicker Troll[/e]. He kicks you in the nuts.\n";
            if(player.hasItem("Cock Shield"))
            {
                desc += "Your shield protects you. You may proceed.";
            }
            else
            {
                desc += "You die."
                player.modifyConstitution(-100);
            }
            return desc;
        },
        north: 5,
        south: 7
    },
    event7:
    {
        description: function()
        {
            let desc = "You find a decrepit old man sitting on a rock. He stares you down.\n\"Have you been to the dead end up north?\" he asks.\n";
            if(game_vars.getFlag("visited_dead_end"))
            {
                desc += "You reply you have. He high fives you with a laugh.";
            }
            else
            {
                desc += "You say you haven't. He shows you a middle finger.";
            }
            return desc;
        },
        north: 6,
        west: 8
    },
    event8:
    {
        description: function()
        {
            return "You approach a dodgy man, sitting at a table inside a cave.\n\"I am the orc counting guy\" he introduces himself.\n\"Thus far, in your adventure you have killed " + game_vars.getCounter("orc_kills") + " Orcs!\"";
        },
        east: 7
    }
};
