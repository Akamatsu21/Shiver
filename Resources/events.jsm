export const events =
{
    event1:
    {
        description: "The entrance to the dungeon is wide, covered in moss and lush bushes. You check your clothing and equipment. Remember to light the lantern!<br /><br />You enter the corridor. It's so tall you don't even need to bend. It leads straight towards the north. Soon you reach an intersection. It's shaped like the letter T. The roads lead towards [c]west[/c], [c]east[/c] and south (where you came from).",
        redirect: 25,
        new_room: false
    },
    event25:
    {
        description: "There is an elderly man sitting on a stone. He recommends you go to the [c]west[/c], and then turn right on the next few intersections.",
        east: 44,
        west: 200
    },
    event29:
    {
        description: "You trip over a pebble. Your sword hits a rock and makes a sound. [e]Orc[/e] lifts its head. It's noticed you. It throws itself into battle.",
        redirect: 116,
        new_room: false
    },
    event39:
    {
        description: "You reach an intersection. Its paths split into the [c]west[/c], [c]north[/c] and [c]south[/c].",
        north: 228,
        south: 146,
        west: 331
    },
    event44:
    {
        description: "You go east. You can see a bulky door in front of you. You try to open it, but it won't even budge. You may give up and go back [c]west[/c], or try to [l]break[/l] down the door.",
        west: 75,
        locals:
        [
            {
                command: "break",
                redirect: 105,
                new_room: false
            }
        ]
    },
    event50:
    {
        description: "You approach an intersection. You may go [c]north[/c], [c]west[/c] or [c]east[/c].",
        north: 310,
        east: 130,
        west: 64
    },
    event56:
    {
        description: function()
        {
            player.modifyConstitution(-1);
            return "You make another attempt at breaking the door. Once again, your efforts are futile. You take 1 damage.";
        },
        redirect: 75,
        new_room: true
    },
    event64:
    {
        description: "You approach the intersection. You can choose any of the four directions.",
        north: 264,
        south: 224,
        east: 284,
        west: 296
    },
    event75:
    {
        description: "You back off and go back towards the intersection. You pass the elderly man.",
        redirect: 200,
        new_room: true
    },
    event89:
    {
        description: function()
        {
            player.modifyLuck(+2);
            return "With the tip of your sword, you lift the lid of the box. There is 3 [i]gold[/i] inside. You can take it. You look around the corners. Suddenly, you hear a noise. It's time to grab your equipment and [l]leave[/l]. You gain 2 Luck.";
        },
        gold: 3,
        locals:
        [
            {
                command: "leave",
                redirect: 120,
                new_room: true
            },
        ]
    },
    event102:
    {
        description: "You reach an intersection. The corridors spread in all directions.",
        north: 268,
        south: 351,
        east: 374,
        west: 123
    },
    event105:
    {
        description: function()
        {
            player.modifyConstitution(-1);
            return "You attempt to break the door. You run towards it and hit it with your shoulder using all your strength. The door won't even budge. You take 1 damage.";
        },
        yes_no_choice:
        {
            question: "Would you like to try again?",
            yes: 56,
            yes_new_room: false,
            no: 75,
            no_new_room: true
        }
    },
    event116:
    {
        description: "You run into the corner of the cavern. Pebbles shuffle around under your feet. [e]Orc[/e] watches you carefully and advances. You have no choice but to fight.",
        enemies:
        [
            {
                name: "Orc",
                agility: 6,
                constitution: 4,
                death_text: "You may [l]look[/l] around the room if you wish. Otherwise, [l]leave[/l] the cavern."
            }
        ],
        locals:
        [
            {
                command: "leave",
                redirect: 120,
                new_room: true
            },
            {
                command: "look",
                redirect: 89,
                new_room: false
            }
        ]
    },
    event120:
    {
        description: "You go west. The corridor takes a gentle turn to the right and is now leading north. You see an intersection.",
        redirect: 64,
        new_room: false
    },
    event180:
    {
        description: "You search the room once again. In the [e]Orc[/e]'s bag, which you didn't have time to search, you find [i]Key#45[/i]. The number 45 is engraved on the key. You may take it with you. You may now [l]leave[/l] the chamber, leaving the door wide open.",
        items:
        [
            "Key#45"
        ],
        locals:
        [
            {
                command: "leave",
                redirect: 120,
                new_room: true
            }
        ]
    },
    event200:
    {
        description: function()
        {
            let desc = "After some time you notice a door in the southern wall of the corridor.";
            if(game_vars.getFlag("200_door_open"))
            {
                desc += " It's open. You've already visited this place.";
            }
            else
            {
                desc += " It's closed.";
            }
            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("200_door_open"))
            {
                return 120;
            }
            else
            {
                return 301;
            }
        },
        new_room: function()
        {
            return game_vars.getFlag("200_door_open");
        }
    },
    event224:
    {
        description: function()
        {
            let desc = "After a moment of walking, the corridor turns east. You move on. In the southern wall you notice a door.";
            if(game_vars.getFlag("200_door_open"))
            {
                desc += " It's open.";
            }
            else
            {
                desc += " It's closed.";
            }
            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("200_door_open"))
            {
                return 180;
            }
            else
            {
                return 301;
            }
        },
        new_room: function()
        {
            return game_vars.getFlag("200_door_open");
        }
    },
    event264:
    {
        description: "The stone rubble is quite difficult to get through. Fortunately, the corridor does not have many turns, and instead leads straight to the [c]north[/c].",
        north: 102
    },
    event284:
    {
        description: function()
        {
            let desc = "The corridor is progressively getting narrower as you keep going [c]east[/c]. Long stalactites are hanging down the ceiling. They could fall off any moment now...<br /><br />";
            if(player.performLuckCheck())
            {
                desc += "Luck check successful!<br />Everything is fine.";
            }
            else
            {
                player.modifyConstitution(-2);
                desc += "Luck check failed!<br />You take 2 damage."
            }

            return desc;
        },
        east: 50
    },
    event296:
    {
        description: "The corridor leads west, and then turns to the [c]north[/c]. At the turn, you may [c]eat[/c] a ration. You keep going. There is an intersection up ahead.",
        north: 39,
        rations: true
    },
    event301:
    {
        description: "You may try to [l]open[/l] the door, or just keep going [c]west[/c].",
        west: 120,
        locals:
        [
            {
                command: "open",
                redirect: 364,
                new_room: true
            }
        ]
    },
    event364:
    {
        description: function()
        {
            game_vars.setFlag("200_door_open", true);
            return "You push the door and it gives in. A dark abyss opens up before you. You come inside while lighting the way with your lantern. You feel pebbles under your feet. From the other side of the room you can hear quiet snoring. You move in that direction. On the floor there is a sleeping [e]Orc[/e]. There is some kind of a box lying next to it. You may try to stealthily [l]steal[/l] the box or attempt to [l]attack[/l] the [e]Orc[/e].";
        },
        locals:
        [
            {
                command: "attack",
                redirect: 116,
                new_room: false
            },
            {
                command: "steal",
                redirect: 29,
                new_room: false
            }
        ]
    }
};
