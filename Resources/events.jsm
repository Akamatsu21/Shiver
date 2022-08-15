export const events =
{
    event1:
    {
        description: "The entrance to the dungeon is wide, covered in moss and lush bushes. You check your clothing and equipment. Remember to light the lantern!<br /><br />You enter the corridor. It's so tall you don't even need to bend. It leads straight towards the north. Soon you reach an intersection. It's shaped like the letter T. The roads lead towards [c]west[/c], [c]east[/c] and south (where you came from).",
        redirect: 25
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
        redirect: 116
    },
    event44:
    {
        description: "You go east. You can see a bulky door in front of you. You try to open it, but it won't even budge. You may give up and go back [c]west[/c], or try to [l]break[/l] down the door.",
        west: 75,
        locals:
        [
            {
                command: "break",
                redirect: 105
            }
        ]
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
                redirect: 120
            },
        ]
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
            no: 75
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
                redirect: 120
            },
            {
                command: "look",
                redirect: 89
            }
        ]
    },
    event120:
    {
        description: "You go west. The corridor takes a gentle turn to the right and is now leading north. You see an intersection.",
        redirect: 64
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
    event301:
    {
        description: "You may try to [l]open[/l] the door, or just keep going [c]west[/c].",
        west: 120,
        locals:
        [
            {
                command: "open",
                redirect: 364
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
                redirect: 116
            },
            {
                command: "steal",
                redirect: 29
            }
        ]
    }
};
