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
                constitution: 1
            }
        ]
    },
    event4:
    {
        description: "Dead end",
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
        north: 5
    }
};
