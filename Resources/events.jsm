export const events =
{
    event1:
    {
        description: "The entrance to the dungeon is wide, covered in moss and lush bushes. You check your clothing and equipment. Remember to light the lantern!<br /><br />You enter the corridor. It's so tall you don't even need to bend. It leads straight towards the north. Soon you reach an intersection. It's shaped like the letter T. The roads lead towards [c]west[/c], [c]east[/c] and south (where you came from).",
        redirect: 25,
        new_room: false
    },
    event11:
    {
        description: function()
        {
            game_vars.setFlag("331_visited", true);
            return "The entrance stands wide open. There are no doors to this chamber. You enter confidently. \"Hello\" - a single word resounds and you freeze. \"Hello [p]Adventurer[/p], hehe.\" In a corner of the chamber there is a small, wrinkled creature, sitting down. \"Are you thirsty? Have some water. It's delicious and cold. It'll fell yummy in your tummy, hehe.\" In the middle of the chamber there is a stone fountain. Water surrounds a statue of some extraordinary being. A small stream of water is pouring from its stout. \"It's a strange fountain. At the bottom there are many strange things, there are pebbles...\" The creature grabs a few pebbles from the ground and throws them into the water. \"...and there are real treasures. Would you like to try some of the water? It's delicious and cold.\" You're completely dumbfounded. This small, funny creature has managed to astonish you. You've completely lost your mind.";
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
            return "You approach the fountain. You take some [i]magical water[/i] into a flask given to you by the creature. You may put it into your backpack. You notice the fountain's now completely empty. You gain 2 Luck. You may now [l]leave[/l].";
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
    event64:
    {
        description: "You approach an intersection. You can choose any of the four directions.",
        north: 264,
        south: 224,
        east: 284,
        west: 296
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
    event146:
    {
        description: "The corridor runs south, and then turns [c]east[/c]. You see an intersection ahead.",
        east: 64
    },
    event151:
    {
        description: function()
        {
            game_vars.setFlag("38_door_open");
            return "Thus far, none of the doors you've come across have opened as quietly and gently as this one. You come in. The room has a regular shapre and straight, smooth walls. In each of them, there is a torch holder. They all have torches. In the torchlight you notice a group of small creatures moving about. These are [e]Dwarves[/e]. They are running around flower beds. They're weeding and harvesting their greatest treasure - the dungeon lettuce. This is what all the inhabitants of this maze call their favourite snack. You can try to [l]befriend[/l] the [e]Dwarves[/e]. Or you can just walk to the door on the [c]east[/c]ern  side of the room. You may also [l]attack[/l] the innocent creatures.";
        },
        east: 272,
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
            }
        ]
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
    event171:
    {
        description: "You hurry out of the chamber. There are two exits. One to the [c]south[/c], which you originally came from, and one to the [c]east[/c].",
        south: 50,
        east: 99
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

            desc += "[/i] added to your inventory";
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
    event241:
    {
        description: "You may take some [i]Lake Water[/i] with you, if you wish. It's now time to [l]leave[/l].",
        items:
        [
            "Lake Water"
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
    event336:
    {
        description: function()
        {
            let desc = "You notice a door ahead. You come closer.";
            if(game_vars.getFlag("336_door_open"))
            {
                desc += " It's open. You've already visited this place, but you can [l]enter[/l] again.";
            }
            else
            {
                desc += " It's closed. You could [l]open[/l] it.";
            }
            desc += " If you don't want to, go back [c]north[/c].";
            return desc;
        },
        north: 212,
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
                return [
                    {
                        command: "open",
                        redirect: 21,
                        new_room: true
                    }
                ];
            }
        }
    },
    event340:
    {
        description: "[e]Kormaa[/e] listens to your order and... runs away.",
        redirect: 251,
        new_room: false
    },
    event351:
    {
        description: "You squeeze through the corridor, largely inhibited by the stone rubble lying around. You move further [c]south[/c].",
        south: 64
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
    event374:
    {
        description: "This isn't a corridor - it feels more like a sewer. Your legs sink into some muddy substance. The tunnel changes direction: It turns south first, then east, then finally [c]north[/c]. You may [c]eat[/c] a ration while you navigate through the twists.",
        north: 178,
        rations: true
    }
};
