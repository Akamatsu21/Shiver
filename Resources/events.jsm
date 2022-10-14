export const events =
{
    event1:
    {
        description: "The entrance to the dungeon is wide, covered in moss and lush bushes. You check your clothing and equipment. Remember to light the lantern!<br /><br />You enter the corridor. It's so tall you don't even need to bend over. It leads straight towards the north. Soon you reach an intersection. It's shaped like the letter T. The roads lead towards [c]west[/c], [c]east[/c] and south (where you came from).",
        redirect: 25,
        new_room: false
    },
    event4:
    {
        description: "[e]Dwarves[/e] lead you towards a table. They bring bowls of clean, green lettuce. They set up cups. You pour the drink. With the corner of your eye, you notice two [e]Dwarves[/e] leaving the room through the eastern door. You undo your strap, secretly pull out your sword, and then place it on the table in front of you. The room goes silent. [e]Dwarves[/e] are observing you. You look them dead in the eyes. The silence continues.",
        yes_no_choice:
        {
            question: "Will you attack the [e]Dwarves[/e]?",
            no: 295,
            no_new_room: false,
            yes: 318,
            yes_new_room: false
        },
    },
    event6:
    {
        description: function()
        {
            game_vars.setFlag("115_taken_first", false);
            return "You look through the room. Ah, it's a real armoury. [o]Shield[/o]s are hanging off the walls, some of them heavy, with spiky finishes on top and bottom, other decorative, abundant with red and gold plates; also, light leather shields. At a rack, multiple [o]sword[/o]s are shining at you. The long, thin ones are the only effective weapon against witches. Stone swords with smooth blades and sharp tips are meant for fighting amphibiosaurs. You don't swing them around, but rather throw them from above to pierce the monsters. On the floor you see a row of neatly organised tiny swords used by gremlins, the underground dwarves. If only you knew what they can do with them!<br /><br />On a bench by the wall, you see [o]gloves[/o]: plated ones for fighting with heavy swords, leather ones for throwing spears. And even some furry gloves (it gets cold in the dungeon too!).<br /><br />On the eastern wall there are wooden shelves with a full collection of [o]helmet[/o]s. Helmets for tournament fights with yellow grass ornaments, heavy helmets with a visor. On the top floor there are three... Pots? No, they are helmets for fights that take place in rooms or corridors full of deadly gas. With the tip of your sword, you move some leather patches. You see a cap that the cruel monsters put on the heads of the people they torture.<br /><br />You continue looking around. There are tons of weapons around here. You don't even know why they're here and for what. You see a heavy [o]hammer[/o] with a wooden handle, probably taken from the goblins, and a hunting [o]dagger[/o] made out of bones, in a leather sheath.";
        },
        redirect: 115,
        new_room: false
    },
    event10:
    {
        description: "[e]Dwarves[/e] invite you to seat at the table. They are smiling. \"Finally a well-behaved monster\" they say. \"Whenever someone comes here, they just steal our lettuce and run. But we honestly can't blame them. At least our produce is useful to someone, hehe.\" You start thinking about the \"hehe\", and before you realise, the [e]Dwarves[/e] are already reeling off their tales. Few of them have ever explored further depths of the dungeon. The ones who came back say that the scariest thing you can come across is fire. The maze is also home to a fat Dragon. It is said to be extremely sinister, but some claim it can be bribed.<br /><br />You listen to these tales, but something is still bothering you.",
        redirect: function()
        {
            if(game_vars.getFlag("85_door_discovered"))
            {
                return 34;
            }
            else
            {
                return 257;
            }
        },
        new_room: false
    },
    event11:
    {
        description: function()
        {
            game_vars.setFlag("331_visited", true);
            return "The entrance stands wide open. There are no doors to this chamber. You enter confidently. \"Hello\" - a single word resounds and you freeze. \"Hello [p]Adventurer[/p], hehe.\" In a corner of the chamber there is a small, wrinkled creature, sitting down. \"Are you thirsty? Have some water. It's delicious and cold. It'll feel yummy in your tummy, hehe.\" In the middle of the chamber there is a stone fountain. Water surrounds a statue of some extraordinary being. A small stream of water is pouring from its stout. \"It's a strange fountain. At the bottom there are many strange things, there are pebbles...\" The creature grabs a few pebbles from the ground and throws them into the water. \"...and there are real treasures. Would you like to try some of the water? It's delicious and cold.\" You're completely dumbfounded. This small, funny creature has managed to astonish you. You've completely lost your mind.";
        },
        choice:
        {
            question: "So, decide now. Do you go straight for the [o]water[/o] or would you rather attack the [o]creature[/o]?",
            options:
            [
                {
                    answer: "creature",
                    redirect: 192,
                    new_room: false
                },
                {
                    answer: "water",
                    redirect: 45,
                    new_room: false
                }
            ]
        },
    },
    event14:
    {
        description: "You may leave through the [c]north[/c] exit of the [c]east[/c] exit.",
        north: 197,
        east: 39
    },
    event15:
    {   // TODO swimming counter
        description: "If you're not excited about the idea of entering the water, you may just simply [l]search[/l] around. Alternatively, you may take on the challenge of [l]swim[/l]ming through the lake.",
        locals:
        [
            {
                command: "search",
                redirect: 241,
                new_room: false
            },
            {
                command: "swim",
                redirect: 113,
                new_room: true
            }
        ]
    },
    event17:
    {
        description: "You may [l]open[/l] it and see what lies beyond. Alternatively, you may turn back and [l]leave[/l].",
        locals:
        [
            {
                command: "open",
                redirect: 265,
                new_room: true
            },
            {
                command: "leave",
                redirect: 50,
                new_room: true
            }
        ]
    },
    event19:
    {
        description: function()
        {
            player.modifyRations(+1);
            player.modifyLuck(+2);
            return "[e]Dwarves[/e] bid you farewell and kindly offer two lettuces to you. That can serve you as one ration. They lead you to the eastern door. It's time to [l]leave[/l]. You gain 2 Luck.";
        },
        locals:
        [
            {
                command: "leave",
                redirect: 141,
                new_room: true
            }
        ]
    },
    event21:
    {
        description: "If you want to see what's behind the door, you may [l]open[/l] it. If not, you may turn back [c]north[/c].",
        north: 212,
        locals:
        [
            {
                command: "open",
                redirect: 332,
                new_room: true
            }
        ]
    },
    event25:
    {
        description: "There is an elderly man sitting on a stone. He recommends you go to the [c]west[/c], and then turn right on the next few intersections.",
        east: 44,
        west: 200
    },
    event26:
    {
        description: function()
        {
            let pranksters_left = game_vars.getCounter("265_pranksters_left");
            let gold = 5 * (5 - pranksters_left);
            player.modifyGold(+gold);
            if(pranksters_left === 5)
            {
                return "You didn't manage to kill any pranksters. You leave the room in shame."
            }
            else if(pranksters_left === 4)
            {
                return "You only managed to kill 1 prankster. You loot his corpse and find 5 gold. Then, you leave the room."
            }
            else
            {
                return `You managed to kill ${5 - pranksters_left} pranksters. You loot their corpses and find ${gold} gold in total. Then, you leave the room.`;
            }
        },
        redirect: 171,
        new_room: true
    },
    event29:
    {
        description: "You trip over a pebble. Your sword hits a rock and makes a sound. [e]Orc[/e] lifts its head. It's noticed you. It throws itself into battle.",
        redirect: 116,
        new_room: false
    },
    event30:
    {
        description: function()
        {
            if(game_vars.getFlag("30_luck_check"))
            {
                return "Luck check successful!";
            }
            else
            {
                return "Luck check failed!";
            }
        },
        redirect: function()
        {
            if(game_vars.getFlag("30_luck_check"))
            {
                return 159;
            }
            else
            {
                return 342;
            }
        },
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
    event34:
    {
        description: "You reveal your discovery: a door in the northern wall. They don't seem impressed. You say you want to see what's behind the door. They're fine with that. One of the [e]Dwarves[/e] flips a switch hidden in the ground. The door opens and you can now [l]enter[/l].",
        locals:
        [
            {
                command: "enter",
                redirect: 128,
                new_room: true
            }
        ]
    },
    event37:
    {
        description: "You may choose a [o]metal[/o], [o]decorative[/o] or [o]leather[/o] shield.",
        choice:
        {
            question: "Which shield do you take?",
            options:
            [
                {
                    answer: "metal",
                    redirect: 324,
                    new_room: false,
                    on_option: function()
                    {
                        if(player.hasItem("Metal Shield"))
                        {
                            system.message("[i]Metal Shield[/i] is already in your inventory!");
                        }
                        else
                        {
                            player.addItem("Metal Shield");
                            system.message("[i]Metal Shield[/i] added to your inventory.")
                        }
                    }
                },
                {
                    answer: "decorative",
                    redirect: 324,
                    new_room: false,
                    on_option: function()
                    {
                        if(player.hasItem("Decorative Shield"))
                        {
                            system.message("[i]Decorative Shield[/i] is already in your inventory!");
                        }
                        else
                        {
                            player.addItem("Decorative Shield");
                            system.message("[i]Decorative Shield[/i] added to your inventory.")
                        }
                    }
                },
                {
                    answer: "leather",
                    redirect: 324,
                    new_room: false,
                    on_option: function()
                    {
                        if(player.hasItem("Leather Shield"))
                        {
                            system.message("[i]Leather Shield[/i] is already in your inventory!");
                        }
                        else
                        {
                            player.addItem("Leather Shield");
                            system.message("[i]Leather Shield[/i] added to your inventory.")
                        }
                    }
                }
            ]
        },
    },
    event38:
    {
        description: function()
        {
            let desc = "The corridor initially leads north, but then turns slightly towards the east. It widens a bit and ends with stairs leading down. You stand in front of a door covered in a multitude of decorative symbols.";
            if(game_vars.getFlag("38_door_open"))
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
            if(game_vars.getFlag("38_door_open"))
            {
                return 167;
            }
            else
            {
                return 328;
            }
        },
        new_room: false
    },
    event39:
    {
        description: "You reach an intersection. Its paths split into the [c]west[/c], [c]north[/c] and [c]south[/c].",
        north: 228,
        south: 146,
        west: 331
    },
    event40:
    {
        description: "You will have to rely on the cards to win.",
        yes_no_choice:
        {
            question: "Would you like to perform a luck check?",
            no: 334,
            no_new_room: false,
            yes: 62,
            yes_new_room: false,
            on_yes: function()
            {
                game_vars.setFlag("62_luck_check", player.performLuckCheck());
            }
        }
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
    event45:
    {
        description: function()
        {
            player.modifyLuck(+2);
            return "You approach the fountain. You take some [i]Magical Water[/i] into a flask given to you by the creature. You may put it into your backpack. You notice the fountain's now completely empty. You gain 2 Luck. You may now [l]leave[/l].";
        },
        items:
        [
            "Magical Water"
        ],
        item_limit: 1,
        locals:
        [
            {
                command: "leave",
                redirect: 251,
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
    event59:
    {
        description: "You enter, but you don't find anything here.",
        redirect: function()
        {
            if(game_vars.getFlag("163_passage_discovered"))
            {
                return 14;
            }
            else
            {
                return 70;
            }
        },
        new_room: false
    },
    event62:
    {
        description: function()
        {
            if(game_vars.getFlag("62_luck_check"))
            {
                return "Luck check successful!";
            }
            else
            {
                return "Luck check failed!";
            }
        },
        redirect: function()
        {
            if(game_vars.getFlag("62_luck_check"))
            {
                return 201;
            }
            else
            {
                return 145;
            }
        },
        new_room: false
    },
    event64:
    {
        description: "You approach an intersection. You can choose any of the four directions.",
        north: 264,
        south: 224,
        east: 284,
        west: 296
    },
    event66:
    {
        description: function()
        {
            const result = system.rollD6(2);
            player.modifyGold(+result);
            return `You won ${result} gold playing the game. You currently have ${player.getGold()} gold.`;
        },
        yes_no_choice:
        {
            question: "Would you like to play again?",
            no: 19,
            no_new_room: false,
            yes: 229,
            yes_new_room: false,
            on_yes: function()
            {
                game_vars.setFlag("229_luck_check", player.performLuckCheck());
            }
        }
    },
    event67:
    {
        description: "You have no other choice but to turn back and [l]leave[/l].",
        locals:
        [
            {
                command: "leave",
                redirect: 50,
                new_room: true
            }
        ]
    },
    event68:
    {
        description: "You leave the armoury. The only exit leads to the [c]north[/c]. You follow the corridor to the nearest crossing. On the way, you may [c]eat[/c] a ration.",
        north: 212,
        rations: true
    },
    event70:
    {
        description: "You may leave through the [c]east[/c] exit.",
        east: 39
    },
    event75:
    {
        description: "You back off and go back towards the intersection. You pass the elderly man.",
        redirect: 200,
        new_room: true
    },
    event77:
    {
        description: "You quickly gain advantage over the monster.",
        yes_no_choice:
        {
            question: "Do you want to force him to lift the metal bars?",
            no: 163,
            no_new_room: false,
            yes: 340,
            yes_new_room: false
        }
    },
    event82:
    {
        description: "You only make a few steps, then suddenly the corridor turns south and ends. The passage is blocked by rocks. Maybe the monsters have built another path? You could [l]search[/l] for it, or go back [c]west[/c] towards the intersection.",
        west: 212,
        locals:
        [
            {
                command: "search",
                redirect: 155,
                new_room: false
            }
        ]
    },
    event83:
    {
        description: function()
        {
            let desc = "The host offers to share the drink on the table with you. ";
            if(player.hasItem("Decrepit Flask"))
            {
                desc += "You may [l]refuse[/l], [l]down[/l] the drink or [l]fill[/l] your flask with it.";
            }
            else
            {
                desc += "You may of course [l]refuse[/l], but if you do want the drink you don't have anything to pour it into. Your only option would be to [l]down[/l] it.";
            }
            return desc;
        },
        locals: function()
        {
            let loc = [
                {
                    command: "refuse",
                    redirect: 124,
                    new_room: false
                },
                {
                    command: "down",
                    redirect: 217,
                    new_room: false
                }
            ];

            if(player.hasItem("Decrepit Flask"))
            {
                loc.push({
                    command: "fill",
                    redirect: 171,
                    new_room: true,
                    on_command: function()
                    {
                        player.removeItem("Decrepit Flask");
                        player.addItem("Filled Flask");
                        system.message("You fill up your flask and leave the chamber.");
                    }
                });
            }

            return loc;
        }
    },
    event85:
    {
        description: function()
        {
            game_vars.setFlag("85_door_discovered", true);
            return "You turn left. You decided to walk along the northern wall. Your back is rubbing against the rocks. Once you get to the middle of the wall, you can feel a secret door behind you. You don't say anything, and keep on moving. You reach the table.";
        },
        redirect: 10,
        new_room: false
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
    event90:
    {
        description: "You climb up a set of stairs. The corridor leads west first, and then turns [c]south[/c].",
        south: 212
    },
    event95:
    {
        description: function()
        {
            let desc = "";

            if(player.hasItem("Cursed Gloves (-1 Agility)"))
            {
                desc += "You're already wearing a very tight pair of gloves... You'd better get rid of them before you look for a new one.";
            }
            else
            {
                desc += "You choose a pair of gloves. No, those aren't good. But now you can't take them off! You can feel them squeezing your hands, crushing your fingers.";
                if(player.performLuckCheck())
                {
                    desc += "Luck check successful!<br />You managed to free yourself from the gloves.";
                }
                else
                {
                    desc += "Luck check failed!<br />You can't take the gloves off. You have to keep wearing them, which reduces your Agility by 1.<br />[i]Cursed Gloves[/i] added to your inventory.";
                    player.addItem("Cursed Gloves (-1 Agility)");
                    system.addCondition("cursed_gloves");
                }
            }

            return desc;
        },
        redirect: 324,
        new_room: false
    },
    event99:
    {
        description: function()
        {
            let desc = "The corridor runs west, but then turns north. It goes on straight for a while, only to turn back west. From the turn, you take 23 steps and the corridor ends.";
            if(game_vars.getFlag("99_visited"))
            {
                desc += " There is nothing to find here. Your only option is to go back [c]east[/c].";
            }

            return desc;
        },
        east: function()
        {
            if(game_vars.getFlag("99_visited"))
            {
                return 259;
            }
            else
            {
                return undefined;
            }
        },
        redirect: function()
        {
            if(game_vars.getFlag("99_visited"))
            {
                return undefined;
            }
            else
            {
                return 182;
            }
        },
        new_room: false
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
    event109:
    {
        description: "Suddenly, a disgusting monster appears out of nowhere. It's [e]Kormaa[/e]. You have no other choice but to fight.",
        enemies:
        [
            {
                name: "Kormaa",
                agility: 7,
                constitution: 8,
                on_round_end:
                [
                    {
                        round: 1,
                        callback: function()
                        {
                            game_vars.setCounter("kormaa_constitution", system.getCurrentEnemyConstitution());
                            system.stopCombat();
                            if(system.getCurrentPlayerScore() > system.getCurrentEnemyScore())
                            {
                                system.redirect(77, false);
                            }
                            else
                            {
                                system.message("You attempt to gain advantage, but fail!");
                                system.redirect(163, false);
                            }
                        }
                    }
                ]
            }
        ]
    },
    event113:
    {
        description: "One step at a time, you enter the water. Your legs sink into the stinky mud. Finally, you can swim. At some point you hear a strange sound. As if someone was throwing planks into the water: splash, splash, splash! You swim faster. Behind a nearby thicket you notice a suspicious movement in the water. \"Nothing good will come out of this\" you think.",
        yes_no_choice:
        {
            question: "Do you want keep swimming further?",
            no: 15,
            no_new_room: true,
            yes: 307,
            yes_new_room: false
        }
    },
    event115:
    {
        description: function()
        {
            if(game_vars.getFlag("115_taken_first"))
            {
                return "You can still take one more item.";
            }
            else
            {
                return "You can take up to two things from here. Remember you can never hold two identical items, but two different items of the same type are fine (for example, two different shields).";
            }
        },
        choice:
        {
            question: function()
            {
                if(game_vars.getFlag("115_taken_first"))
                {
                    return "What will be your second choice?";
                }
                else
                {
                    return "What will be your first choice?";
                }
            },
            options:
            [
                {
                    answer: "dagger",
                    redirect: 324,
                    new_room: false,
                    on_option: function()
                    {
                        if(player.hasItem("Bone Hunting Dagger"))
                        {
                            system.message("[i]Bone Hunting Dagger[/i] is already in your inventory!");
                        }
                        else
                        {
                            player.addItem("Bone Hunting Dagger");
                            system.message("[i]Bone Hunting Dagger[/i] added to your inventory.")
                        }
                    }
                },
                {
                    answer: "gloves",
                    redirect: 95,
                    new_room: false
                },
                {
                    answer: "hammer",
                    redirect: 324,
                    new_room: false,
                    on_option: function()
                    {
                        if(player.hasItem("Heavy Hammer"))
                        {
                            system.message("[i]Heavy Hammer[/i] is already in your inventory!");
                        }
                        else
                        {
                            player.addItem("Heavy Hammer");
                            system.message("[i]Heavy Hammer[/i] added to your inventory.")
                        }
                    }
                },
                {
                    answer: "helmet",
                    redirect: 298,
                    new_room: false
                },
                {
                    answer: "shield",
                    redirect: 37,
                    new_room: false
                },
                {
                    answer: "sword",
                    redirect: 232,
                    new_room: false
                }
            ]
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
                on_death: function()
                {
                    system.message("You may [l]look[/l] around the room if you wish. Otherwise, [l]leave[/l] the cavern.");
                }
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
    event124:
    {
        description: "That was extraordinarily rude, especially in such distinguished company! The pranksters disappear. You may [l]search[/l] the room or [l]leave[/l].",
        locals:
        [
            {
                command: "search",
                redirect: 294,
                new_room: false
            },
            {
                command: "leave",
                redirect: 171,
                new_room: true
            }
        ]
    },
    event128:
    {
        description: "The door shuts behind you. You can hear the [e]Dwarves[/e] cackling loudly. An unbelievable stench makes it difficult to breathe. You light up the chamber. It's not big. You see big piles of rotten lettuce leaves, some reaching all the way to the ceiling. Other than that, this place is almost completely empty. There are some broken rakes and hoes lying around. In a corner of the room you notice a [i]Bunch of Keys[/i]. You may take it. You poke the walls with your sword. It seems that there is a spot on the easter wall that sounds a little differently from the rest. Yes, there is an opening there - you can [l]leave[/l]!",
        items:
        [
            "Bunch of Keys"
        ],
        item_limit: 1,
        locals:
        [
            {
                command: "leave",
                redirect: 108,
                new_room: true,
                on_command: function()
                {
                    system.message("You insert your sword and clench your muscles. The rock slides to the side. You escape the stinky room promptly. Right behind you, the exit closes with a bang. You're now in a corridor.");
                }
            }
        ]
    },
    event130:
    {
        description: "The corridor is almost 5 feet wide, so you can walk comfortably. You stretch your bones. After walking only a hundred feet towards the [c]east[/c], you see another intersection.",
        east: 212
    },
    event131:
    {
        description: function()
        {
            player.removeItem("Small Shiny Key");
            return "Indeed, the metal bars are lifted up, but you can't get the key out. You will have to leave it here."
        },
        redirect: 251,
        new_room: false
    },
    event132:
    {
        description: "You return through the muddy sewer, all the way back to the intersection.",
        redirect: 102,
        new_room: true
    },
    event145:
    {
        description: function()
        {
            const result = system.rollD6(2);
            let desc = `You lost ${result} gold playing the game.`
            if(result > player.getGold())
            {
                desc += " Looks like you don't even have that much, so you just pay up all your gold."
            }
            else
            {
                desc += ` You currently have ${player.getGold()} gold.`;
            }

            player.modifyGold(-result);
            return desc;
        },
        yes_no_choice:
        {
            question: "Would you like to play again?",
            no: 19,
            no_new_room: false,
            yes: 40,
            yes_new_room: false
        }
    },
    event146:
    {
        description: "The corridor runs south, and then turns [c]east[/c]. You see an intersection ahead.",
        east: 64
    },
    event151:
    {
        description: function()
        {
            game_vars.setFlag("38_door_open", true);
            return "Thus far, none of the doors you've come across have opened as quietly and gently as this one. You come in. The room has a regular shape and straight, smooth walls. In each of them, there is a torch holder. They all have torches. In the torchlight you notice a group of small creatures moving about. These are [e]Dwarves[/e]. They are running around flower beds. They're weeding and harvesting their greatest treasure - the dungeon lettuce. This is what all the inhabitants of this maze call their favourite snack. You can try to [l]befriend[/l] the [e]Dwarves[/e]. Or you can just [l]walk[/l] to the door on the eastern  side of the room. You may also [l]attack[/l] the innocent creatures.";
        },
        locals:
        [
            {
                command: "attack",
                redirect: 318,
                new_room: false
            },
            {
                command: "befriend",
                redirect: 371,
                new_room: false
            },
            {
                command: "walk",
                redirect: 272,
                new_room: false
            }
        ]
    },
    event153:
    {
        description: function()
        {
            player.modifyLuck(+1);
            player.addItem("Enchanted Sword (+1 Combat Score)");
            system.addCondition("enchanted_sword");
            return "The rat is a good sign. This sword is enchanted. It will add 1 to your combat score in all future fights. You also gain 1 Luck.<br />[i]Enchanted Sword[/i] added to your inventory.";
        },
        redirect: 324,
    },
    event155:
    {
        description: "You observe the walls, move the lighter stones - nothing! All you can do now is go back [c]west[/c].",
        west: 212
    },
    event159:
    {
        description: "The wall opens up. It was hiding a corridor. You quickly enter the opening, as the wall closes back behind you.",
        redirect: 78,
        new_room: true
    },
    event160:
    {
        description: "You thread carefully. Your legs are caressed by the lush lettuce leaves. When you get to the middle of the room, you notice a beam of light piercing through the ceiling. You stay quiet about this discovery. You reach the table.",
        redirect: 10,
        new_room: false
    },
    event163:
    {
        description: "You decide to continue the battle until the end.",
        north: 197,
        enemies:
        [
            {
                name: "Kormaa",
                agility: 7,
                constitution: function()
                {
                    return game_vars.getCounter("kormaa_constitution");
                },
                on_death: function()
                {
                    player.modifyLuck(+1);
                    game_vars.setFlag("163_passage_discovered", true);
                    system.message("After defeating the monster, you learn that the fountain is now empty. You observe the walls of the cavern carefully. On the [c]north[/c]ern side you discover a hole that was covered up with a boulder. There's your exit. You gain 1 Luck.");
                }
            }
        ]
    },
    event167:
    {
        description: function()
        {
            if(player.hasItem("Filled Flask"))
            {
                return "Looks like you've found some non-magical water. You can now enter the chamber.";
            }
            else
            {
                return "There is no point entering this chamber right now. Come back when you've found something to drink (other than magical water!).";
            }
        },
        redirect: function()
        {
            if(player.hasItem("Filled Flask"))
            {
                return 236;
            }
            else
            {
                return 90;
            }
        },
        new_room: true
    },
    event171:
    {
        description: "You hurry out of the chamber. There are two exits. One to the [c]south[/c], which you originally came from, and one to the [c]west[/c].",
        south: 50,
        west: 99
    },
    event178:
    {
        description: "It's getting more and more difficult to lift your feet from the muddy sludge. The air is getting humid. The corridor is gradually widening, until finally you reach the shore of an underground lake. The area is full of plants with thick, wide leaves. The roof is very high up. In a few places thin rays of light are piercing through it. You look around. Is this a dead end? You don't see any exits, other than the corridor you came from.",
        redirect: 15,
        new_room: false
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
    event182:
    {
        description: function()
        {
            game_vars.setFlag("99_visited", true);
            return "You've reached a dead end. You could [l]search[/l] for secret passages or turn back [c]east[/c].";
        },
        east: 259,
        locals:
        [
            {
                command: "search",
                redirect: 30,
                new_room: false,
                on_command: function()
                {
                    game_vars.setFlag("30_luck_check", player.performLuckCheck());
                }
            }
        ]
    },
    event183:
    {
        description: "The encounter in this room was so drastically different from the cruel reality of the dungeon, that out of sympathy for the cheerful creatures, you really should try to play [o]fair[/o]. \"Although, it would probably be quite easy to [o]cheat[/o] against these gullible bums\" you think.",
        choice:
        {
            question: "The choice is yours.",
            options:
            [
                {
                    answer: "cheat",
                    redirect: 229,
                    new_room: false,
                    on_option: function()
                    {
                        game_vars.setFlag("229_luck_check", player.performLuckCheck());
                    }
                },
                {
                    answer: "fair",
                    redirect: 40,
                    new_room: false
                }
            ]
        }
    },
    event190:
    {
        description: "You may choose a [o]thin[/o], [o]stone[/o] or [o]short[/o] sword.",
        choice:
        {
            question: "Which sword do you take?",
            options:
            [
                {
                    answer: "thin",
                    redirect: 324,
                    new_room: false,
                    on_option: function()
                    {
                        if(player.hasItem("Thin Sword"))
                        {
                            system.message("[i]Thin Sword[/i] is already in your inventory!");
                        }
                        else
                        {
                            player.addItem("Thin Sword");
                            system.message("[i]Thin Sword[/i] added to your inventory.")
                        }
                    }
                },
                {
                    answer: "stone",
                    redirect: 324,
                    new_room: false,
                    on_option: function()
                    {
                        if(player.hasItem("Stone Sword"))
                        {
                            system.message("[i]Stone Sword[/i] is already in your inventory!");
                        }
                        else
                        {
                            player.addItem("Stone Sword");
                            system.message("[i]Stone Sword[/i] added to your inventory.")
                        }
                    }
                },
                {
                    answer: "short",
                    redirect: 324,
                    new_room: false,
                    on_option: function()
                    {
                        if(player.hasItem("Short Sword"))
                        {
                            system.message("[i]Short Sword[/i] is already in your inventory!");
                        }
                        else
                        {
                            player.addItem("Short Sword");
                            system.message("[i]Short Sword[/i] added to your inventory.")
                        }
                    }
                }
            ]
        },
    },
    event192:
    {
        description: function()
        {
            let desc = "\"What if I try to get something out of this clown?\" you think. You reach for your sword. Eh, what need is there for the sword? Your fists will be more than enough. You approach the creature and take a swing. It's suddenly gone. On top of that, metal bars fall in front of the entrance through which you got into this room. You look around, but you can't find another exit. You approach the fountain. Indeed, you can see some mysterious items: a monster's [o]bone[/o], a [o]jar[/o] of All-Eaters (a constantly hungry species of a shellfish), a tin [o]butterfly[/o], a [o]spear[/o] and a small shiny [o]key[/o].";

            if(player.hasItem("Decrepit Flask"))
            {
                desc += " Since you happen to have a flask, you may also take the [o]water[/o].";
            }
            else if(player.hasItem("Filled Flask")) // TODO: Update with actual name of the item
            {
                desc += " Since you happen to have a flask, you may also take the [o]water[/o]. However, your flask is currently full. If you choose this option, you must empty it.";
            }
            else
            {
                desc += " If you had a flask, you might also have been able to take some of the water..."
            }

            return desc;
        },
        choice:
        {
            question: function()
            {
                if(player.hasItem("Decrepit Flask") || player.hasItem("Filled Flask"))
                {
                    return "So: do you want the [o]water[/o] or one of the items? Remember that you can only take one thing.";
                }
                else
                {
                    return "So: which item do you want? Remember that you can only take one thing."
                }
            },
            options: function()
            {
                let opt = [
                    {
                        answer: "bone",
                        redirect: 220,
                        new_room: false,
                        on_option: function()
                        {
                            player.addItem("Monster's Bone");
                        }
                    },
                    {
                        answer: "butterfly",
                        redirect: 220,
                        new_room: false,
                        on_option: function()
                        {
                            player.addItem("Tin Butterfly");
                        }
                    },
                    {
                        answer: "jar",
                        redirect: 220,
                        new_room: false,
                        on_option: function()
                        {
                            player.addItem("Jar of All-Eaters");
                        }
                    },
                    {
                        answer: "key",
                        redirect: 220,
                        new_room: false,
                        on_option: function()
                        {
                            player.addItem("Small Shiny Key");
                        }
                    },
                    {
                        answer: "spear",
                        redirect: 220,
                        new_room: false,
                        on_option: function()
                        {
                            player.addItem("Spear");
                        }
                    }
                ];

                if(player.hasItem("Decrepit Flask") || player.hasItem("Filled Flask"))
                {
                    opt.push({
                        answer: "water",
                        redirect: 306,
                        new_room: false,
                        on_option: function()
                        {
                            if(player.hasItem("Filled Flask"))
                            {
                                player.removeItem("Filled Flask");
                                system.message("You empty your flask onto the floor.");
                            }
                            else
                            {
                                player.removeItem("Decrepit Flask");
                            }
                            player.addItem("Magical Water");
                        }
                    });
                }

                return opt;
            }
        }
    },
    event197:
    {
        description: "A long pavement leads stright [c]north[/c].",
        north: 276
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
    event201:
    {
        description: function()
        {
            const result = system.rollD6(2);
            player.modifyGold(+result);
            return `You won ${result} gold playing the game. You currently have ${player.getGold()} gold.`;
        },
        yes_no_choice:
        {
            question: "Would you like to play again?",
            no: 19,
            no_new_room: false,
            yes: 40,
            yes_new_room: false
        }
    },
    event212:
    {
        description: "You reach a large square, where the paths lead in four directions. Which one do you choose?",
        north: 38,
        south: 336,
        east: 82,
        west: 287
    },
    event217:
    {
        description: function()
        {
            let desc = "You glance at the pranksters sitting at the table. Once again, some of them disappear, some of them appear again. The host disappeared completely. You've figured it out. This is an elixir of invisibility. You now have the advantage: the pranksters can't see you.<br /><br />";

            let pranksters_left = game_vars.getCounter("265_pranksters_left");
            for(let i = 0; i < 2; ++i)
            {
                desc += "You aim at prankster no. " + pranksters_left + ".<br />"
                let result1 = system.rollD6(1);
                let result2 = system.rollD6(1);
                if(result1 === 5 || result2 === 5)
                {
                    --pranksters_left;
                    desc += "You hit him! He's dead meat.<br /><br/>";
                }
                else
                {
                    desc += "As your sword was approaching his head, he disappeared.<br /><br/>";
                }
            }
            game_vars.setCounter("265_pranksters_left", pranksters_left);

            desc += "You decide to back off.";
            return desc;
        },
        redirect: 26,
        new_room: false
    },
    event220:
    {
        description: function()
        {
            let desc = "[i]";
            if(player.hasItem("Monster's Bone"))
            {
                desc += "Monster's Bone";
            }
            else if(player.hasItem("Jar of All-Eaters"))
            {
                desc += "Jar of All-Eaters";
            }
            else if(player.hasItem("Tin Butterfly"))
            {
                desc += "Tin Butterfly";
            }
            else if(player.hasItem("Spear"))
            {
                desc += "Spear";
            }
            else if(player.hasItem("Small Shiny Key"))
            {
                desc += "Small Shiny Key";
            }

            desc += "[/i] added to your inventory.";
            return desc;
        },
        redirect: function()
        {
            if(player.hasItem("Small Shiny Key"))
            {
                return 366;
            }
            else
            {
                return 109;
            }
        },
        new_room: false
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
    event229:
    {
        description: function()
        {
            if(game_vars.getFlag("229_luck_check"))
            {
                return "Luck check successful!";
            }
            else
            {
                return "Luck check failed!";
            }
        },
        redirect: function()
        {
            if(game_vars.getFlag("229_luck_check"))
            {
                return 66;
            }
            else
            {
                return 383;
            }
        },
        new_room: false 
    },
    event232:
    {
        description: function()
        {
            if(game_vars.getFlag("232_chosen_sword"))
            {
                return "You've already upgraded your sword!";
            }
            else
            {
                return "You reach for the sword rack."
            }
        },
        redirect: function()
        {
            if(game_vars.getFlag("232_chosen_sword"))
            {
                return 68;
            }
            else
            {
                return 271;
            }
        }
        ,
        new_room: function()
        {
            return game_vars.getFlag("232_chosen_sword");
        }
    },
    event236:
    {
        description: "You enter the chamber. Two [e]Dwarves[/e] run up to you.",
        redirect: 4,
        new_room: false
    },
    event241:
    {
        description: "You may take some [i]Lake Water[/i] with you, if you wish. It's now time to [l]leave[/l].",
        items:
        [
            "Filled Flask"
        ],
        item_limit: 1,
        locals:
        [
            {
                command: "leave",
                redirect: 132,
                new_room: true
            }
        ]
    },
    event251:
    {
        description: "You leave the way you came in.",
        redirect: 39,
        new_room: true
    },
    event257:
    {
        description: "You ask your hosts about the beam of light in the middle of the chamber. They go quiet, and then suddenly explode in anger. Anticipating what will follow, you launch an attack.",
        redirect: 318,
        new_room: false
    },
    event259:
    {
        description: "You go back down the corridor, until you reach the pranksters' chamber. You open the door confidently. No one is there. You promptly reach the other door and come out to another corridor, continuing [c]south[/c].",
        south: 50
    },
    event264:
    {
        description: "The stone rubble is quite difficult to get through. Fortunately, the corridor does not have many turns, and instead leads straight to the [c]north[/c].",
        north: 102
    },
    event265:
    {
        description: function()
        {
            game_vars.setFlag("310_door_open", true);
            let desc = "The door opens by itself. By itself? Oh no! \"Come in, come in, mate! We've been waiting for you\" an incredibly obese, hairy individual shows you the way. He leads you to the other end of the cavern. At a round table, there are another five men of similar stature. \"Dear traveller\" the host begins. \"Here you have five wonderful men. The best pranksters in the entire maze.\" You look at them, but somehow cannot count to five. You count \"One, two, three...\" but then the first one's gone. Start again: \"One, two, three, fo...\" and something's wrong again - where did the third one go? Did he just disappear? The pranksters have noticed your confusion and they are laughing so hard the roof starts to shake. The chalices standing in front of every one of them, as well as a decorative vase (that looks more like a watering can) with some drink inside, are clattering. You begin once again: \"One, two, three, four...\" and the same thing happens. You counted up to four, but now you see only two. Enough is enough! You're angry. You draw your sword and stare down the pranksters. They are constantly appearing and disappearing. How to hit them? You choose prankster no. 5 as your target...<br /><br />";

            let pranksters_left = 5;
            for(let i = 0; i < 3; ++i)
            {
                desc += "You aim at prankster no. " + pranksters_left + ".<br />"
                let result = system.rollD6(1);
                if(result === 5)
                {
                    --pranksters_left;
                    desc += "You hit him! He's dead meat.<br /><br/>";
                }
                else
                {
                    desc += "As your sword was approaching his head, he disappeared.<br /><br/>";
                }
            }
            game_vars.setCounter("265_pranksters_left", pranksters_left);

            desc += "\"My friend, please leave them alone!\" screams the host.";
            return desc;
        },
        yes_no_choice:
        {
            question: "Will you listen to him?",
            no: 359,
            no_new_room: false,
            yes: 83,
            yes_new_room: false
        }
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
    event271:
    {
        description: function()
        {
            game_vars.setFlag("232_chosen_sword", true);
            player.modifyConstitution(-1);
            player.removeItem("Sword");
            return "You take an embellished, shiny sword. You turn the handle in your hand. Suddenly, you drop the weapon and hurt your arm, you take 1 damage. You pick up another one. It looks quite modest. It feels good in your hand. You discard your old sword, which turns into a rat with a hiss. Is that a good or bad sign?";
        },
        yes_no_choice:
        {
            question: "Would you like to exchange this new sword for a different one?",
            no: 153,
            no_new_room: false,
            yes: 190,
            yes_new_room: false,
        }
    },
    event272:
    {
        description: "Three [e]Dwarves[/e] run up to you. They invite you to sit at a table on the other side of the room. But there are flower beds everywhere around... \"I wouldn't want to step on your lettuce\" you say. \"Just walk next to the wall\" responds the [o]first[/o] [e]Dwarf[/e]. \"Take the path through the middle of the room\" says the [o]second[/o] one. \"Why are you worrying? Just go, doesn't matter which way!\" shouts the [o]third[/o] one.",
        choice:
        {
            question: "Whose advice will you listen to?",
            options:
            [
                {
                    answer: "first",
                    redirect: 85,
                    new_room: false
                },
                {
                    answer: "second",
                    redirect: 160,
                    new_room: false
                },
                {
                    answer: "third",
                    redirect: 356,
                    new_room: false
                }
            ]
        },
    },
    event276:
    {
        description: "You reach a crossing. You may go [c]north[/c], [c]east[/c] or [c]south[/c].",
        north: 308,
        south: 215,
        east: 382
    },
    event278:
    {
        description: function()
        {
            player.removeItem("Small Shiny Key");
            player.addItem("Key#122");
            return "You inspect the key. It has the number 122 engraved into it.<br />Item updated in inventory.";
        },
        redirect: 109,
        new_room: false
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
    event287:
    {
        description: "After some time, you see an intersection in the distance. The corridor continues [c]west[/c].",
        west: 50
    },
    event294:
    {
        description: function()
        {
            player.modifyLuck(+2);
            return "In a crevice in the wall you find [i]Elixir of Invisibility[/i]. You gain 2 Luck. The only thing left is to [l]leave[/l] the room.";
        },
        items:
        [
            "Elixir of Invisibility"
        ],
        item_limit: 1,
        locals:
        [
            {
                command: "leave",
                redirect: 171,
                new_room: true
            }
        ]
    },
    event295:
    {
        description: function()
        {
            let desc = "Two [e]Dwarves[/e] return cheerfully, holding a deck of cards in their hands. Everybody laughs out loud.";
            if(player.getGold() > 0)
            {
                desc += " You're going to play a game.";
            }
            else
            {
                desc += " Unfortunately, you don't have any money on you, so you're not able to join their game.";
            }

            return desc;
        },
        redirect: function()
        {
            if(player.getGold() > 0)
            {
                return 183;
            }
            else
            {
                return 19;
            }
        },
        new_room: false
    },
    event296:
    {
        description: "The corridor leads west, and then turns to the [c]north[/c]. At the turn, you may [c]eat[/c] a ration. You keep going. There is an intersection up ahead.",
        north: 39,
        rations: true
    },
    event298:
    {
        description: function()
        {
            if(player.hasItem("Helmet"))
            {
                return "You already have a helmet! Since you only have one head, you shouldn't need another one.";
            }
            else
            {
                player.addItem("Helmet");
                return "This helmet might really come in handy.<br />[i]Helmet[/i] added to your inventory.";
            }
        },
        redirect: 324,
        new_room: false
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
    event306:
    {
        description: function()
        {
            player.modifyLuck(+2);
            return "[i]Magical Water[/i] added to your inventory. You gain 2 Luck.";
        },
        redirect: 109,
        new_room: false
    },
    event307:
    {
        description: function()
        {
            player.modifyAgility(-2);
            return "The strange waves on the water surface refuse to stop, and actually... They are getting closer. You struggle to undo the belt holding your sword. In the water you notice 3 pairs of yellow eyes. They are too close to run away now. You attack. But the water is limiting your movements. You struggle to hit: lose 2 Agility. In front of you there are three [e]Green Lizards[/e].";
        },
        redirect: 214,
        new_room: true,
        enemies:
        [
            {
                name: "Green Lizards",
                agility: 7,
                constitution: 6,
                on_death: function()
                {
                    player.modifyLuck(+2);
                    system.message("You succeeded. You make it to the other side of the lake. You gain 2 luck.");
                },
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
        new_room: false
    },
    event317:
    {
        description: function()
        {
            game_vars.setFlag("268_door_open", true);
            return "The door gives in. Inside, a terrifying stench emanates. In the faint light of an oil lamp placed on a bench, you can see someone's remains scattered around the whole room. You look closely. All that's left is bones! You turn your face in disgust. But what were you expecting here? Nice flowers? Dancing elves? Melancholic music? This, my friend, is what the dungeon is like - the kingdom of evil. And that's why you're here. You must strip the dungeon's mystery naked. Come on - dive into inspecting this corpse!<br /><br />Be quiet for a moment... Can you hear those quiet steps? They are getting louder and louder... \"Dear king Almanhagor, this noise is giving me a headache!\" you think. The sound of the steps is replaced by the noise of air flowing through monstrous nostrils. An [e]Ogre[/e] is standing at the entrance. You immediately draw your sword. You press your back against a wall. [e]Ogre[/e] runs into the chamber... But it doesn't attack you. It reaches the opposite wall and spreads its arms. As if it was hiding something behind its back. It bares its teeth and flails a long bone it's just picked up from the ground. You can see terror in its eyes. Now it's your move. Slowly, while pushing all the muck aside with your legs, you approach the monster.";
        },
        enemies:
        [
            {
                name: "Ogre",
                agility: 8,
                constitution: 10,
                on_death: function()
                {
                    system.message("[e]Ogre[/e] lies at your feet. Are you still disgusted? If so, at least [l]inspect[/l] the walls. If not, [l]loot[/l] the corpse.");
                }
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
    event318:
    {
        description: function()
        {
            player.modifyConstitution(-3);
            player.modifyAgility(-2);
            return "You pull out your sword and swing. Suddenly, with a horrific rumble, the ceiling of this cavern parts into two. The room is covered with unusual brightness. It's just daylight. Which is probably needed by the lettuces, but it blinds you so much that you need to retreat the way you came. You lose 3 Constitution and 2 Agility.";
        },
        redirect: 90,
        new_room: true
    },
    event324:
    {
        description: function()
        {
            if(game_vars.getFlag("115_taken_first"))
            {
                return "That's all the choices you get. It's time to leave.";
            }
            else
            {
                return "That was your first choice.";
            }
        },
        redirect: function()
        {
            if(game_vars.getFlag("115_taken_first"))
            {
                return 68;
            }
            else
            {
                return 115;
            }
        },
        new_room: function()
        {
            return game_vars.getFlag("115_taken_first");
        },
        on_exit: function()
        {
            game_vars.setFlag("115_taken_first", true);
        }
    },
    event328:
    {
        description: "You stick your ear to the door. You can hear someone talking, and also a sound that resembles knocking.",
        yes_no_choice:
        {
            question: "Do you want to enter the chamber?",
            no: 90,
            no_new_room: true,
            yes: 151,
            yes_new_room: true
        }
    },
    event331:
    {
        description: function()
        {
            let desc = "A very short tunnel leads into a room.";
            if(game_vars.getFlag("331_visited"))
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
            if(game_vars.getFlag("331_visited"))
            {
                return 59;
            }
            else
            {
                return 11;
            }
        },
        new_room: true
    },
    event332:
    {
        description: function()
        {
            game_vars.setFlag("336_door_open", true);
            player.modifyConstitution(-2);
            return "The door is covered with a thick metal sheet. Thin, metallic stripes run diagonally across the surface, with a steel convex sticking out at their crossing point. You push your back against it. Your feet are slipping across the slushy ground. The door gives in with a horrific creak. You can hear a hurried murmur from inside the chamber. You squeeze into the opening, and with your back now against a rock you push the door, using all of your strength. With plenty of resistance, they finally open wide. This required mad effort - you take 2 damage. You raise your lantern to be at your head's height and... Your heart momentarily leaps into your throat. Hidden behind the wall, there is a [e]Troll[/e] here. It's bending its body like an arch. It's holding a sword with both of its hands, high above its head. It pushes out its hairy stomach. Its mad eyes are bloodshot. Its grinning, showing its clenched teeth. In just a moment, its gigantic sword will come down and cut the air. You reach for your sword. [e]Troll[/e] immediately attacks, but you manage to dodge. This will be a fight to the death.";
        },
        redirect: 6,
        new_room: false,
        enemies:
        [
            {
                name: "Troll",
                agility: 8,
                constitution: 8,
                on_death: function()
                {
                    player.modifyLuck(+1);
                    system.message("You gain 1 Luck.");
                }
            }
        ]
    },
    event334:
    {
        description: function()
        {
            const result = system.rollD6(2);
            let desc = "";

            if(result % 2 === 0)
            {
                desc += `You lost ${result} gold playing the game.`
                if(result > player.getGold())
                {
                    desc += " Looks like you don't even have that much, so you just pay up all your gold."
                }
                else
                {
                    desc += ` You currently have ${player.getGold()} gold.`;
                }

                player.modifyGold(-result);
            }
            else
            {
                const result = system.rollD6(2);
                player.modifyGold(+result);
                desc += `You won ${result} gold playing the game. You currently have ${player.getGold()} gold.`;
            }
            
            return desc;
        },
        yes_no_choice:
        {
            question: "Would you like to play again?",
            no: 19,
            no_new_room: false,
            yes: 334,
            yes_new_room: false
        }
    },
    event336:
    {
        description: function()
        {
            let desc = "You notice a door ahead. You come closer.";
            if(game_vars.getFlag("336_door_open"))
            {
                desc += " It's open. You've already visited this place, but you can [l]enter[/l] again. If you don't want to, go back [c]north[/c].";
            }
            else
            {
                desc += " It's closed.";
            }
            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("336_door_open"))
            {
                return undefined;
            }
            else
            {
                return 21;
            }
        },
        new_room: false,
        north: function()
        {
            if(game_vars.getFlag("336_door_open"))
            {
                return 212;
            }
            else
            {
                return undefined;
            }
        },
        locals: function()
        {
            if(game_vars.getFlag("336_door_open"))
            {
                return [
                    {
                        command: "enter",
                        redirect: 6,
                        new_room: true
                    }
                ];
            }
            else
            {
                return [];
            }
        }
    },
    event340:
    {
        description: "[e]Kormaa[/e] listens to your order and... runs away.",
        redirect: 251,
        new_room: false
    },
    event342:
    {
        description: "You didn't manage to find anything. You turn back.",
        redirect: 259,
        new_room: true
    },
    event351:
    {
        description: "You squeeze through the corridor, largely inhibited by the stone rubble lying around. You move further [c]south[/c].",
        south: 64
    },
    event356:
    {
        description: "You go without much care for what you step on. And, of course, you end up stepping on the lettuce. Twice. This time you definitely did not manage to win them over. They say good-bye in a cold tone and lead you to the eastern door. Oh, and on top of that they give you two lettuces. The ones you stepped on. With a bang, they close the door behind you.",
        redirect: 141,
        new_room: true
    },
    event359:
    {
        description: function()
        {
            let desc = "";
            let pranksters_left = game_vars.getCounter("265_pranksters_left");
            for(let i = 0; i < 2; ++i)
            {
                desc += "You aim at prankster no. " + pranksters_left + ".<br />"
                let result = system.rollD6(1);
                if(result === 5)
                {
                    --pranksters_left;
                    desc += "You hit him! He's dead meat.<br /><br/>";
                }
                else
                {
                    desc += "As your sword was approaching his head, he disappeared.<br /><br/>";
                }
            }
            game_vars.setCounter("265_pranksters_left", pranksters_left);

            desc += "You decide to back off.";
            return desc;
        },
        redirect: 26,
        new_room: false
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
    event366:
    {
        description: "In the wall next to the entrance you came through, there is a lock.",
        yes_no_choice:
        {
            question: "Would you like to try using your newfound key?",
            yes: 131,
            yes_new_room: false,
            no: 278,
            no_new_room: false
        }
    },
    event371:
    {
        description: function()
        {
            let desc = "[e]Dwarves[/e] have a friendly nature. They love company and guests. Although admittedly, usually it's some hairy creatures that come here, eat lots of lettuce, take a bit more with them and disappear.<br /><br />Two [e]Dwarves[/e] run over to you. You are still standing at the door, they invite you inside. But... Well, one of them starts scratching his shaggy head. \"We'd like to give you some of our lettuce, but we have nothing to drink. Maybe you have something? Just no magical water, it's poisonous to us.\"<br /><br />";

            if(player.hasItem("Filled Flask"))
            {
                desc += "You happen to have a flask filled with water. It's time to [l]feast[/l]!";
            }
            else
            {
                desc += "You don't have anything, but you can look around. You will have to [l]leave[/l] the chamber. Remember, you will need some sort of a container for the liquid: it could be an empty flask or even a helmet. If you do not want to look for a drink, all that is left is to [l]attack[/l] the creatures.";
            }
            return desc;
        },
        locals: function()
        {
            if(player.hasItem("Filled Flask"))
            {
                return [
                    {
                        command: "feast",
                        redirect: 4,
                        new_room: false,
                        on_command: function()
                        {
                            player.removeItem("Filled Flask");
                        }
                    }
                ];
            }
            else
            {
                return [
                    {
                        command: "attack",
                        redirect: 318,
                        new_room: false
                    },
                    {
                        command: "leave",
                        redirect: 90,
                        new_room: true
                    }
                ];
            }
        }
    },
    event374:
    {
        description: "This isn't a corridor - it feels more like a sewer. Your legs sink into some muddy substance. The tunnel changes direction: It turns south first, then east, then finally [c]north[/c]. You may [c]eat[/c] a ration while you navigate through the twists.",
        north: 178,
        rations: true
    },
    event383:
    {
        description: "You become agitated. You grab your sword and attack.",
        redirect: 318,
        new_room: false
    }
};
