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
    event31:
    {
        description: "Lower your lantern. Move the corpse with your sword. See - you found 5 [i]gold[/i]! If that's not enough, you can still [l]inspect[/l] the chamber. Otherwise, just [l]leave[/l].",
        gold: 5,
        locals:
        [
            {
                command: "inspect",
                redirect: 119,
                new_room: false
            },
            {
                command: "leave",
                redirect: 102,
                new_room: true
            }
        ]
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
        description: "You approach an intersection. You can choose any of the four directions.",
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
    event119:
    {
        description: "What was the beast trying to cover up so desperately? You touch the wall at the spot that the hairy [e]Ogre[/e] was pressing its back against. Suddenly, part of the wall moves. There is a secret stash here! Inside, there is a long [i]fireproof rope[/i] with a hook, an empty [i]decrepit flask[/i] and a [i]Werewolf's scalp[/i]. You may only take up to two of these items. You may also [l]loot[/l] the body or [l]leave[/l] the chamber.",
        items:
        [
            "Fireproof Rope",
            "Decrepit Flask",
            "Werewolf's Scalp"
        ],
        item_limit: 2,
        locals:
        [
            {
                command: "leave",
                redirect: 102,
                new_room: true
            },
            {
                command: "loot",
                redirect: 31,
                new_room: false
            }
        ]
    },
    event120:
    {
        description: "You go west. The corridor takes a gentle turn to the right and is now leading [c]north[/c]. You see an intersection.",
        north: 64
    },
    event123:
    {
        description: "The corridor continues west, and then turns [c]south[/c]. There is an intersection ahead.",
        south: 39
    },
    event130:
    {
        description: "The corridor is almost 5 feet wide, so you can walk comfortable. You stretch your bones. After walking only a hundred feet towards the [c]east[/c], you see another intersection.",
        east: 212
    },
    event146:
    {
        description: "The corridor runs south, and then turns [c]east[/c]. You see an intersection ahead.",
        east: 64
    },
    event180:
    {
        description: "You search the room once again. In the [e]Orc[/e]'s bag, which you didn't have time to search, you find [i]Key#45[/i]. The number 45 is engraved on the key. You may take it with you. You may now [l]leave[/l] the chamber, leaving the door wide open.",
        items:
        [
            "Key#45"
        ],
        item_limit: 1,
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
    event228:
    {
        description: "The corridor runs to the north and then turns [c]east[/c]. You see an intersection ahead.",
        east: 102
    },
    event264:
    {
        description: "The stone rubble is quite difficult to get through. Fortunately, the corridor does not have many turns, and instead leads straight to the [c]north[/c].",
        north: 102
    },
    event268:
    {
        description: function()
        {
            let desc = "A short tunnel ends with a decrepit old door.";
            if(game_vars.getFlag("268_door_open"))
            {
                desc += " It's open. You've already visited this place. You decide to go back [c]south[/c].";
            }
            else
            {
                desc += " It's closed. You should be able to [l]open[/l] it. Alternatively, you may go back [c]south[/c].";
            }
            return desc;
        },
        south: 102,
        locals: function()
        {
            if(game_vars.getFlag("268_door_open"))
            {
                return [];
            }
            else
            {
                return [
                    {
                        command: "open",
                        redirect: 317,
                        new_room: true
                    }
                ];
            }
        }
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
    event310:
    {
        description: function()
        {
            let desc = "Only ten feet away from you, there is a rotten wooden door.";
            if(game_vars.getFlag("310_door_open"))
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
            if(game_vars.getFlag("310_door_open"))
            {
                return 67;
            }
            else
            {
                return 17;
            }
        },
        new_room: function()
        {
            return game_vars.getFlag("310_door_open");
        }
    },
    event317:
    {
        description: function()
        {
            game_vars.setFlag("268_door_open", true);
            return "The door gives in. Inside, a terrifying stench emanates. In the faint light of an oil lamp placed on a bench, you can see someone's remains scattered around the whole room. You look closely. All that's left is bones! You turn your face in disgust. But what were you expecting here? Nice flowers? Dancing elves? Melancholic music? This, my friend, is what the dungeons is like - the kingdom of evil. And that's why you're here. You must strip the dungeon's mystery naked. Come on - dive into inspecting this corpse!<br /><br />Be quiet for a moment... Can you hear those quiet steps? They are getting louder and louder... \"Dear king Almanhagor, this noise is giving me a headache!\" you think. The sound of the steps is replaced by the noise of air flowing through monstrous nostrils. An [e]Ogre[/e] is standing at the entrance. You immediately draw your sword. You press your back against a wall. [e]Ogre[/e] runs into the chamber... But it doesn't attack you. It reaches the opposite wall and spreads its arms. as if it was hiding something behind its back. It bares its teeth and flails a long bone it's just picked up from the ground. You can see terror in its eyes. Now it's your move. Slowly, while pushing all the muck aside with your legs, you approach the monster.";
        },
        enemies:
        [
            {
                name: "Ogre",
                agility: 8,
                constitution: 10,
                death_text: "[e]Ogre[/e] lies at your feet. Are you still disgusted? If so, at least [l]inspect[/l] the walls. If not, [l]loot[/l] the corpse."
            }
        ],
        locals:
        [
            {
                command: "inspect",
                redirect: 119,
                new_room: false
            },
            {
                command: "loot",
                redirect: 31,
                new_room: false
            }
        ]
    },
    event331:
    {
        description: function()
        {
            let desc = "A very short tunnel leads into a room.";
            if(game_vars.getFlag("331_door_open"))
            {
                desc += " You've already visited this place.";
            }
            else
            {
                desc += " It looks like you can come in.";
            }
            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("331_door_open"))
            {
                return 59;
            }
            else
            {
                return 11;
            }
        },
        new_room: function()
        {
            return game_vars.getFlag("331_door_open");
        }
    },
    event351:
    {
        description: "You squeeze through the corridor, largely inhibited by the stone rubble lying around. You move further [c]south[/c].",
        south: 64
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
    },
    event374:
    {
        description: "This isn't a corridor - it feels more like a sewer. Your legs sink into some muddy substance. The tunnel changes direction: It turns south first, then east, then finally [c]north[/c]. You may eat a ration while you navigate through the twists.",
        north: 178,
        rations: true
    }
};
