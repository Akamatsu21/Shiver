export const events =
{
    event1:
    {
        description: "Starting room",
        north: 2,
        west: function()
        {
            if(game_vars.getFlag("met_fairy"))
            {
                return 11;
            }
            else
            {
                return 10;
            }
        }
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
        south: 9,
        east: 16,
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
        north: 9,
        west: 8
    },
    event8:
    {
        description: function()
        {
            return "You approach a dodgy man, sitting at a table inside a cave.\n\"I am the orc counting guy\" he introduces himself.\n\"Thus far, in your adventure you have killed " + game_vars.getCounter("orc_kills") + " Orcs!\"";
        },
        east: 7
    },
    event9:
    {
        description: "You suddenly hear the ground shaking...",
        redirect: 6
    },
    event10:
    {
        description: "There is a big door in front of you.",
        yes_no_choice:
        {
            question: "Would you like to try and break if down?",
            no: 11,
            yes: 12
        }
    },
    event11:
    {
        description: "There is nothing more for you to do here.",
        east: 1
    },
    event12:
    {
        description: function()
        {
            game_vars.setFlag("met_fairy", true);
            return "You encounter a fairy. It offers to grant your one wish. You options are: 100 [o]gold[/o], [o]heal[/o] your Constitution to the starting value, gain a magical [o]sword[/o] or do [o]nothing[/o].";
        },
        choice:
        {
            question: "What do you choose?",
            options:
            [
                {
                    answer: "gold",
                    redirect: 13
                },
                {
                    answer: "heal",
                    redirect: 14
                },
                {
                    answer: "sword",
                    redirect: 15
                },
                {
                    answer: "nothing",
                    redirect: 11
                }
            ]
        }
    },
    event13:
    {
        description: function()
        {
            player.modifyGold(+100);
            return "The fairy hands you a pot full of gold coins. It then bows and disappears."
        },
        redirect: 11,
        new_room: true
    },
    event14:
    {
        description: function()
        {
            player.modifyConstitution(+100);
            return "The fairy performs a few mysterious gestures. You feel like you're in a trance. Your body feels lighter than air, and when you reconnect with reality you realise all your wounds have been healed, but the fairy is nowhere to be found."
        },
        redirect: 11,
        new_room: true
    },
    event15:
    {
        description: function()
        {
            player.addItem("Magical Sword");
            return "The fairy hands you a huge sword covered in runes. You thank her and she bids you farewell."
        },
        redirect: 11,
        new_room: true
    },
    event16:
    {
        description: "You enter a murky chamber. There is a magical circle on the floor. You may use it to [l]teleport[/l].",
        locals:
        [
            {
                command: "teleport",
                redirect: 8
            }
        ],
        west: 5
    }
};
