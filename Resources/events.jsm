function payCommandEvent35()
{
    if(player.getGold() >= 10)
    {
        game_vars.setFlag("35_luck_check", player.performLuckCheck());
    }
}

function jumpCommandEvent110()
{
    if(player.getConstitution() < 14 || player.getAgility() < 9)
    {
        game_vars.setFlag("110_jump_possible", false);
    }
    else
    {
        game_vars.setFlag("110_jump_possible", true);
        game_vars.setCounter("110_jump_result", system.rollD6(1));
        game_vars.setFlag("110_ration_required", (player.getConstitution() < 18));
        game_vars.setFlag("110_ration_available", (player.getRations() !== 0));
    }
}

export const events =
{
    event1:
    {
        description: "The entrance to the dungeon is wide, covered in moss and lush bushes. You check your clothing and equipment. Remember to light the lantern!<br /><br />You enter the corridor. It's so tall you don't even need to bend over. It leads straight towards the north. Soon you reach an intersection. It's shaped like the letter T. The roads lead towards [c]west[/c], [c]east[/c] and south (where you came from).",
        redirect: 25,
        new_room: false
    },
    event2:
    {
        description: function()
        {
            let desc = "Kick the door. It opens up and hits a rock. You enter with your sword ready to attack. The monster definitely won't be hiding. It's too sure of its own power. Yes, it stands right before you. It's spreading its legs wide. It has a sword as well. The sword's tip is lodged into sand. It wraps its hands around the handle. It's waiting. But you shouldn't wait.";

            if(player.hasItem("Helmet"))
            {
                player.addCondition("helmet");
                desc += " You put on your helmet. It will give you +3 Constitution until the end of this fight.";
            }

            return desc;
        },
        redirect: 380,
        new_room: false,
        enemies:
        [
            {
                name: "Garazan",
                agility: 10,
                constitution: 10,
                escape_redirect: 372
            }
        ]
    },
    event3:
    {
        description: function()
        {
            let desc = "Your patience and, even more so, your gold supply are running out. Why not try a different approach? Old dungeon dwellers say that the [e]Dragon[/e] has some weaknesses. In particular, the left side of his body, where he carries his money bag, is a weak point.";
            if(player.getGold() >= 13)
            {
                desc += "You could attempt to [l]bribe[/l] the [e]Dragon[/e] by paying over the tariff? The alternatives are ";
            }
            else
            {
                desc += "Bribing the dragon would be a great idea, but you don't have enough money to try that. The alternatives are ";
            }

            if(player.hasItem("Fireproof Rope") || game_vars.getFlag("269_rope_present"))
            {
                desc += "[l]throw[/l]ing the rope, ";
            }
            desc += "[l]walk[/l]ing on the bridge or [l]jump[/l]ing over the gap.";

            return desc;
        },
        locals: function()
        {
            let loc = [
                {
                    command: "jump",
                    redirect: 110,
                    new_room: false,
                    on_command: jumpCommandEvent110
                },
                {
                    command: "walk",
                    redirect: 74,
                    new_room: false
                }
            ];

            if(player.getGold() >= 13)
            {
                loc.push({
                    command: "bribe",
                    redirect: 136,
                    new_room: false
                });
            }

            if(player.hasItem("Fireproof Rope"))
            {
                loc.push({
                    command: "throw",
                    redirect: 269,
                    new_room: false
                });
            }
            else if(game_vars.getFlag("269_rope_present"))
            {
                loc.push({
                    command: "throw",
                    redirect: 358,
                    new_room: false
                });
            }

            return loc;
        }
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
        }
    },
    event5:
    {
        description: function()
        {
            game_vars.setFlag("270_door_open", true);
            return "You like fighting? Yes? Perfect. Come and have a closer look. From left to right, there is a [e]Skeleton[/e], a [e]Zombie[/e] and a [e]Man-Eater[/e] waiting for you.";
        },
        yes_no_choice:
        {
            question: "Is this enough?",
            no: 140,
            no_new_room: false,
            yes: 312,
            yes_new_room: false
        }
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
    event7:
    {
        description: "\"Maybe you have something that would work as a gift?\" you say. \"But of course! I'm always prepared for such requests. I have a lovely wooden stake and a jar of corrosive dust. Would you like it gift-wrapped?\"",
        redirect: 219,
        new_room: false
    },
    event8:
    {
        description: "You peak inside the chamber. The door opens slightly. What do you see? Some strange creature is running around frantically, bouncing against the walls. It doesn't look dangerous. Under its belt, in its pockets and in its shoes it's carrying bones of various shapes and sizes. You walk inside. \"Why run around like this, you poor thing?\" you ask. \"Mister, what did I do to deserve this? Such a rumpus about some bones! My brothers hunted a few Slatterns. You probably know Slatterns are a sublime delicacy for us [e]Goblins[/e]. I just couldn't resist. I sneaked up and took a few bones. I sat here to eat in peace, but those beasts followed me and they'll be here any moment. Oh, I can hear their footsteps...\" And so, the [e]Goblin[/e] begins to circle around once again. You grab his arm and stand in the middle of the chamber. A swarm of [e]Goblins[/e] is about burst through the door. You can join the bullied creature in [l]defend[/l]ing against his own kin, or promptly [c]escape[/c].",
        escape_redirect: 210,
        locals:
        [
            {
                command: "defend",
                redirect: 98,
                new_room: false
            }
        ]
    },
    event9:
    {
        description: "You get ready to strike the [e]Gnome[/e] with a wooden stake. He notices this. \"Oh, what a beautiful stake\" he says. \"Sell it to me for 20 gold.\"",
        yes_no_choice:
        {
            question: "Do you agree to do it?",
            no: 375,
            no_new_room: false,
            yes: 289,
            yes_new_room: false
        }
    },
    event10:
    {
        description: "[e]Dwarves[/e] invite you to seat at the table. They are smiling. \"Finally a well-behaved monster\" they say. \"Whenever someone comes here, they just steal our lettuce and run. But we honestly can't blame them. At least our produce is useful to someone, hehe.\" You start thinking about the \"hehe\", and before you realise, the [e]Dwarves[/e] are already reeling off their tales. Few of them have ever explored further depths of the dungeon. The ones who came back say that the scariest thing you can come across is fire. The maze is also home to a fat [e]Dragon[/e]. It is said to be extremely sinister, but some claim it can be bribed.<br /><br />You listen to these tales, but something is still bothering you.",
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
            return "The entrance stands wide open. There are no doors to this chamber. You enter confidently. \"Hello\" - a single word resounds and you freeze. \"Hello adventurer, hehe.\" In a corner of the chamber there is a small, wrinkled creature, sitting down. \"Are you thirsty? Have some water. It's delicious and cold. It'll feel yummy in your tummy, hehe.\" In the middle of the chamber there is a stone fountain. Water surrounds a statue of some extraordinary being. A small stream of water is pouring from its stout. \"It's a strange fountain. At the bottom there are many strange things, there are pebbles...\" The creature grabs a few pebbles from the ground and throws them into the water. \"...and there are real treasures. Would you like to try some of the water? It's delicious and cold.\" You're completely dumbfounded. This small, funny creature has managed to astonish you. You've completely lost your mind.";
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
    event12:
    {
        description: function()
        {
            player.removeItem("Emerald");
            return "You take out the magical stone from your pocket. You feel the pain of your back tearing apart, your leather tunic is ripped into little pieces. Long, pale gray wings grow out of your back. This emerald grants the Gift of Wings! You fly upwards and land on the edge of the chasm. The spell loses its power as quickly as it appeared.";
        },
        redirect: 288,
        new_room: true
    },
    event13:
    {
        description: function()
        {
            player.modifyConstitution(-2);
            return "You don't even need to look around. Let's be completely blunt. This chamber is actually a lair of a [e]Werewolf[/e]. It knows you're here. You take a few steps in the dark. Behind a gap in the rocks you notice a shiny spot. You quietly reach for your sword and take a few more steps. Now there are two spots. Rumbling. It jumps from behind a rock. Within a strip of light that entered the cavern through the half-opened door, all you can see are white fangs and green eyes. Immediately, you grab your sword with both your hands. You take a swing and... Your whole body stops. The green eyes paralyse you and you take 2 damage. But that's just for a short moment. With massive leaps, you dash towards the monster.";
        },
        redirect: 126,
        new_room: false,
        on_exit: function()
        {
            game_vars.setFlag("126_luck_check", player.performLuckCheck());
        }
    },
    event14:
    {
        description: "You may leave through the [c]north[/c] exit of the [c]east[/c] exit.",
        north: 197,
        east: 39
    },
    event15:
    {
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
                new_room: true,
                on_command: function()
                {
                    game_vars.setCounter("lake_return_point", 15);
                }
            }
        ]
    },
    event16:
    {
        description: "You enter a corridor. After some time it turns south. You may [c]eat[/c] a ration here. You continue south until the tunnel turns west. About twenty steps ahead of you there is an entrance to a chamber. When you're ready, [l]enter[/l].",
        eat: true,
        locals:
        [
            {
                command: "enter",
                redirect: 80,
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
    event18:
    {
        description: function()
        {
            let desc = "You enter a tiny cavern adjacent to the chamber. The three [e]Evils[/e] follow you. The old man stays in the previous room. Within a gap between the rocks, you can see a [e]Gremlin[/e] bound in chains. The poor thing can barely breathe. One [e]Evil[/e] grabs your arm and counts a distance of 10 steps from the [e]Gremlin[/e]. You receive six darts. The [e]Evil[/e] also has six. It points at the chained [e]Gremlin[/e]. This is your target!";

            if(player.getGold() < 5)
            {
                desc += " Unfortunately, you don't have enough gold to bet in the game. You will have to refuse the challenge.";
            }

            return desc;
        },
        redirect: function()
        {
            if(player.getGold() < 5)
            {
                return 286;
            }
            else
            {
                return undefined;
            }
        },
        new_room: false,
        yes_no_choice: function()
        {
            if(player.getGold() < 5)
            {
                return undefined;
            }
            else
            {
                return {
                    question: "Do you want to play?",
                    no: 286,
                    no_new_room: false,
                    yes: 211,
                    yes_new_room: false,
                    on_yes: function()
                    {
                        game_vars.setCounter("211_evil_gold", 10);
                        game_vars.setCounter("211_ante", 0);
                        game_vars.setCounter("189_evils_left", 3);
                        game_vars.setCounter("156_evils_defeated", 0);
                    }
                };
            }
        }
    },
    event19:
    {
        description: function()
        {
            player.modifyLuck(+2);
            return "[e]Dwarves[/e] bid you farewell and kindly offer two lettuces to you. That can serve you as one [i]ration[/i]. They lead you to the eastern door. It's time to [l]leave[/l]. You gain 2 Luck.";
        },
        rations: 1,
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
    event22:
    {
        description: function()
        {
            let desc = "This might be the end of your journey. You haven't seen a chamber this cute yet. It's very bright and there is a green haze in the air. The floor is even smoother than around the chasm. A humanoid creature sits on the floor. Ah, it's a real [e]Gnome[/e] playing with a wound-up toy dragon. The toy is moving its legs and sliding its red tongue in and out. You have the following options:";

            if(player.hasItem("Tin Butterfly"))
            {
                desc += "<br />* Take out the tin butterfly and [l]play[/l] with the [e]Gnome[/e].";
            }

            if(player.hasItem("Emerald"))
            {
                desc += "<br />* [l]Show[/l] your emerald to the [e]Gnome[/e].";
            }

            if(player.hasItem("Wooden Stake"))
            {
                desc += "<br />* Intimidate and [l]attack[/l] the [e]Gnome[/e] using the wooden stake.";
            }

            return desc;
        },
        locals: function()
        {
            let loc = [];

            if(player.hasItem("Tin Butterfly"))
            {
                loc.push({
                    command: "play",
                    redirect: 321,
                    new_room: false
                });
            }

            if(player.hasItem("Emerald"))
            {
                loc.push({
                    command: "show",
                    redirect: 187,
                    new_room: false
                });
            }

            if(player.hasItem("Wooden Stake"))
            {
                loc.push({
                    command: "attack",
                    redirect: 9,
                    new_room: false
                });
            }

            return loc;
        }
    },
    event24:
    {
        description: function()
        {
            if(game_vars.getFlag("24_success"))
            {
                return "Your weapon turns out to be effective against the [e]Worms[/e]!";
            }
            else
            {
                return "No can do - your weapon seems completely ineffective!";
            }
        },
        redirect: function()
        {
            if(game_vars.getFlag("24_success"))
            {
                return 58;
            }
            else
            {
                return 168;
            }
        },
        new_room: false
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
            let pranksters_left = game_vars.getCounter("pranksters_left");
            let gold = 5 * (5 - pranksters_left);
            player.modifyGold(+gold);
            if(pranksters_left === 5)
            {
                return "You didn't manage to kill any pranksters. You leave the room in shame.";
            }
            else if(pranksters_left === 4)
            {
                return "You only managed to kill 1 prankster. You loot his corpse and find 5 gold. Then, you leave the room.";
            }
            else
            {
                return `You managed to kill ${5 - pranksters_left} pranksters. You loot their corpses and find ${gold} gold in total. Then, you leave the room.`;
            }
        },
        redirect: 171,
        new_room: true
    },
    event28:
    {
        description: function()
        {
            let desc = "You notice a large stone by the wall that seems to be covering something up. You attempt to pick it up. ";
            if(player.getConstitution() >= 18)
            {
                desc += "With your high Constitution, you are able to lift the stone.";
            }
            else
            {
                desc += "Unfortunately, your Constitution is not high enough to lift the stone.";
            }

            return desc;
        },
        redirect: function()
        {
            if(player.getConstitution() >= 18)
            {
                return 177;
            }
            else
            {
                return 330;
            }
        },
        new_room: false
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
    event32:
    {
        description: function()
        {
            if(!game_vars.getFlag("32_question_answered"))
            {
                return "You sit by a rock, completely out of breath.";
            }
            else
            {
                return "You barely manage to sit down, when all of a sudden, [e]Wolfmen[/e] enter the cavern. They are much weaker than the [e]Werewolf[/e], but there are three of them. You have to fight all of them at once.";
            }
        },
        redirect: function()
        {
            if(!game_vars.getFlag("32_question_answered"))
            {
                return undefined;
            }
            else
            {
                return 275;
            }
        },
        new_room: true,
        enemies: function()
        {
            if(!game_vars.getFlag("32_question_answered"))
            {
                return undefined;
            }
            else
            {
                return [
                    {
                        name: "Wolfmen",
                        agility: 8,
                        constitution: 7
                    }
                ];
            }
        },
        yes_no_choice: function()
        {
            if(!game_vars.getFlag("32_question_answered"))
            {
                return {
                    question: "Would you like to eat a ration now?",
                    no: 32,
                    no_new_room: false,
                    on_no: function()
                    {
                        game_vars.setFlag("32_question_answered", true);
                    },
                    yes: 32,
                    yes_new_room: false,
                    on_yes: function()
                    {
                        game_vars.setFlag("32_question_answered", true);
                        if(player.eatRation())
                        {
                            system.message("You consume a ration and recover 4 Constitution.");
                        }
                        else
                        {
                            system.message("You don't have any rations left!");
                        }
                    },
                };
            }
            else
            {
                return undefined;
            }
        }
    },
    event33:
    {
        description: "A little more, and you reach an intersection. You can go [c]north[/c], [c]east[/c] or [c]south[/c].",
        north: 293,
        south: 247,
        east: 188
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
    event35:
    {
        description: function()
        {
            if(player.getGold() < 10)
            {
                return "You don't have enough gold to pay the [e]Dragon[/e]. You will have to come up with another way to cross the gap.";
            }

            player.modifyGold(-10);
            let desc = "You pay the agreed tariff of 10 gold. He spreads his legs over the whole gap and pushes his tail towards you. You get on. He's about to carry you to the other side of the canyon, but... This [e]Dragon[/e] can be very moody. The tail suddenly stops right above the red abyss, with you clutching it desperately.<br /><br />";

            if(game_vars.getFlag("35_luck_check"))
            {
                desc += "Luck check successful!<br />The tail begins moving again and you get to the other side.";
            }
            else
            {
                desc += "Luck check failed!<br />The tail moves the other way and you're thrown back to the same edge.";
            }

            return desc;
        },
        redirect: function()
        {
            if(player.getGold() < 10)
            {
                return 207;
            }
            else if(game_vars.getFlag("35_luck_check"))
            {
                return 186;
            }
            else
            {
                return 158;
            }
        },
        new_room: function()
        {
            return player.getGold() < 10;
        }
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
                            system.message("[i]Metal Shield[/i] added to your inventory.");
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
                            system.message("[i]Decorative Shield[/i] added to your inventory.");
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
                            system.message("[i]Leather Shield[/i] added to your inventory.");
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
    event41:
    {
        description: function()
        {
            let desc = "You barely managed to take a few steps before you realised the corridor in front of you is blocked with stone rubble and sand. You attempt to stomp on the floor with all your might. The old gremlins say the dungeon floor carries shockwaves far.<br /><br />";

            if(game_vars.getFlag("41_luck_check"))
            {
                desc += "Luck check successful!<br />The stone rubble crumbles and reveals a path. You can move forward.";
            }
            else
            {
                desc += "Luck check failed!<br />You have to turn back.";
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("41_luck_check"))
            {
                return 348;
            }
            else
            {
                return 221;
            }
        },
        new_room: true
    },
    event42:
    {
        description: function()
        {
            if(game_vars.getFlag("42_incorrect_spell"))
            {
                player.modifyConstitution(-player.getConstitution());
                return "You weren't able to recite the spell correctly. This is the end of your journey - continuing in this situation would not be acceptable for a true Adventurer.";
            }

            let desc = "They call him [e]Barbarian[/e]. And is he really? Who knows? While he's sitting on a bench with his legs up and his arms crossed, he doesn't look all that intimidating. He snores quietly. You hit the wall with your sword. \"What's up?\" he awakens. You enter the chamber and point to the door on the western end. \"Quickly, open this door\" you direct your sword towards him. \"You open them\" he laughs. \"The key is in the lock.\" Indeed. You walk up to the door. Afraid of a trap, you don't touch the key with your hand, and instead you try to twist it with the tip of your sword. Nothing. \"Nothing\" roars [e]Barbarian[/e]. \"Do you know the spell? If you don't, get the hell out of here!\" Do you remember a spell from an old gremlin tome? ";

            if(game_vars.getFlag("122_spell_learned"))
            {
                desc += "You've seen the book - if you can't recall the spell, it's over for you. ";
            }
            else
            {
                desc += "You've never seen this book, so you'll have to guess... And if you don't, it's over for you. ";
            }

            desc += "You'll have to start over from the beginning.";
            return desc;
        },
        quiz:
        {
            question: "What do you thing the answer is?",
            answers:
            [
                "baroom baram baroten, may the gate stand open!"
            ],
            correct: 376,
            correct_new_room: false,
            incorrect: 42,
            incorrect_new_room: false,
            on_incorrect: function()
            {
                game_vars.setFlag("42_incorrect_spell", true);
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
    event46:
    {
        description: "You look around and try to get out of the northern shore of this cave. You see a small gap. You move towards it. It looks like it's just barely big enough for you to [l]squeeze[/l] through it.",
        locals:
        [
            {
                command: "squeeze",
                redirect: 53,
                new_room: true
            }
        ]
    },
    event47:
    {
        description: "You barely take a dozen steps before the corridor turns right and then reaches a dead end. You may sit down and [c]eat[/c] a ration. Then, go back to the intersection and turn [c]north[/c].",
        north: 191,
        eat: true
    },
    event48:
    {
        description: "You open up your backpack and reach for one of the urns to pour the gold over. In that instant, the gold spills everywhere, and the urns transform into two powerful, winged demons, which fly upwards and sit down on the rock protrusion. You may [l]attack[/l] them, or attempt to [l]collect[/l] the spilled gold.",
        locals:
        [
            {
                command: "attack",
                redirect: 169,
                new_room: false
            },
            {
                command: "collect",
                redirect: 133,
                new_room: false
            }
        ]
    },
    event49:
    {
        description: "You may take the [i]Tome[/i] with you. Then you can [l]leave[/l].",
        items:
        [
            "Tome"
        ],
        item_limit: 1,
        locals:
        [
            {
                command: "leave",
                redirect: 286,
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
    event51:
    {
        description: "You can choose the door that leads to the [c]north[/c] or the one that leads to the [c]south[/c].",
        north: 33,
        south: 134
    },
    event52:
    {
        description: function()
        {
            let desc = "From a an opening in the wall, a stream of acrid gas shoots out...";

            if(player.hasItem("Helmet"))
            {
                desc += " Fortunately, you were wearing your helmet and you avoid the damage. The helmet, however, gets destroyed.";
            }

            return desc;
        },
        redirect: function()
        {
            if(player.hasItem("Helmet"))
            {
                return 274;
            }
            else
            {
                return 315;
            }
        },
        new_room: false,
        on_exit: function()
        {
            if(player.hasItem("Helmet"))
            {
                player.removeItem("Helmet");
            }
            else
            {
                game_vars.setCounter("315_redirect", 274);
                game_vars.setFlag("315_new_room", false);
            }
            game_vars.setFlag("274_luck_check", player.performLuckCheck());
        }
    },
    event53:
    {
        description: "You end up at a spacious footpath. It leads to the north, and then swerves heavily to the west. You take several dozen steps and stop in front of a heavy door.",
        redirect: function()
        {
            if(game_vars.getFlag("53_door_open"))
            {
                return 322;
            }
            else
            {
                return 299;
            }
        },
        new_room: false
    },
    event55:
    {
        description: function()
        {
            let desc = "";
            if(game_vars.getFlag("55_buy_stake"))
            {
                if(player.hasItem("Wooden Stake"))
                {
                    desc += "You already have a wooden stake!<br />";
                }
                else
                {
                    player.modifyGold(-15);
                    player.addItem("Wooden Stake");
                    desc += "You pay 15 gold. [i]Wooden Stake[/i] added to your inventory.<br />";
                }
            }

            if(game_vars.getFlag("55_buy_jar"))
            {
                if(player.hasItem("Jar of Corrosive Dust"))
                {
                    desc += "You already have a jar of corrosive dust!<br />";
                }
                else
                {
                    player.modifyGold(-10);
                    player.addItem("Jar of Corrosive Dust");
                    desc += "You pay 10 gold. [i]Jar of Corrosive Dust[/i] added to your inventory.<br />";
                }
            }

            desc += "There is nothing else for you to do here.";

            return desc;
        },
        redirect: 196,
        new_room: false
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
    event57:
    {
        description: function()
        {
            let desc = "After you land, the bastard asks for all of your gold. ";

            if(game_vars.getFlag("57_can_afford"))
            {
                desc += "You can tell him that you're only willing to pay the agreed amount, or that as punishment for his slyness you'll give him nothing.";
            }
            else
            {
                desc += "But you don't even have enough money to pay what you promised, so you just tell him he's not getting anything.";
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("57_can_afford"))
            {
                return undefined;
            }
            else
            {
                return 91;
            }
        },
        new_room: false,
        yes_no_choice: function()
        {
            if(game_vars.getFlag("57_can_afford"))
            {
                return {
                    question: "Will you pay the money?",
                    no: 91,
                    no_new_room: false,
                    yes: 335,
                    yes_new_room: false
                };
            }
            else
            {
                return undefined;
            }
        }
    },
    event58:
    {
        description: function()
        {
            if(game_vars.getFlag("24_using_dust"))
            {
                return "You throw the jar into the swarm of [e]Worms[/e]. The dust quickly spreads around and one by one, the monsters stop moving, poisoned by the corrosive fumes.";
            }
            else
            {
                return "You throw the jar into the swarm of [e]Worms[/e]. A fierce battle begins, with the winners quickly becoming apparent. The All-Eaters get buried in the mountain of worm corpses they left behind.";
            }
        },
        yes_no_choice:
        {
            question: "Would you like to dive back into the sea of bodies and search the pool once again?",
            no: 320,
            no_new_room: true,
            yes: 142,
            yes_new_room: false
        }
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
    event60:
    {
        description: "The [e]Gnome[/e] offers 20 gold.",
        yes_no_choice:
        {
            question: "Do you accept the offer?",
            no: 338,
            no_new_room: false,
            yes: 262,
            yes_new_room: false,
            on_yes: function()
            {
                game_vars.setCounter("262_offer", 20);
            }
        }
    },
    event61:
    {
        description: "You go through a corridor. On the way you may [c]eat[/c] a ration. After some time, the corridor branches out towards the north but you continue going west. A dozen steps after the branching, you see a door. You may [l]open[/l] it.",
        eat: true,
        locals:
        [
            {
                command: "open",
                redirect: 42,
                new_room: true
            }
        ]
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
    event63:
    {
        description: function()
        {
            let desc = "The sword isn't an effective weapon against a [e]Werewolf[/e]. ";
            const items_present = player.hasItem("Bone Hunting Dagger") || player.hasItem("Heavy Hammer") ||
                                  player.hasItem("Metal Shield") || player.hasItem("Net") || player.hasItem("Bunch of Keys");

            if(items_present)
            {
                desc += "You can use one of the following items:";
            }
            else
            {
                desc += "You don't have any items you could use in this fight. Your only choice is to [c]escape[/c].";
            }

            if(player.hasItem("Bone Hunting Dagger"))
            {
                desc += "<br />* A [o]dagger[/o] made out of a bone of an ancient monster";
            }

            if(player.hasItem("Heavy Hammer"))
            {
                desc += "<br />* A [o]hammer[/o] made by the goblins";
            }

            if(player.hasItem("Metal Shield"))
            {
                desc += "<br />* A metal [o]shield[/o]";
            }

            if(player.hasItem("Net"))
            {
                desc += "<br />* A [o]net[/o]";
            }

            if(player.hasItem("Bunch of Keys"))
            {
                desc += "<br />* A bunch of [o]keys[/o]";
            }

            return desc;
        },
        escape_redirect: function()
        {
            if(player.hasItem("Bone Hunting Dagger") || player.hasItem("Heavy Hammer") ||
               player.hasItem("Metal Shield") || player.hasItem("Net") || player.hasItem("Bunch of Keys"))
            {
                return undefined;
            }
            else
            {
                return 275;
            }
        },
        choice: function()
        {
            if(player.hasItem("Bone Hunting Dagger") || player.hasItem("Heavy Hammer") ||
               player.hasItem("Metal Shield") || player.hasItem("Net") || player.hasItem("Bunch of Keys"))
            {
                let opt = [];

                if(player.hasItem("Bone Hunting Dagger"))
                {
                    opt.push({
                        answer: "dagger",
                        redirect: 157,
                        new_room: false
                    });
                }

                if(player.hasItem("Heavy Hammer"))
                {
                    opt.push({
                        answer: "hammer",
                        redirect: 346,
                        new_room: false
                    });
                }

                if(player.hasItem("Metal Shield"))
                {
                    opt.push({
                        answer: "shield",
                        redirect: 216,
                        new_room: false
                    });
                }

                if(player.hasItem("Net"))
                {
                    opt.push({
                        answer: "net",
                        redirect: 377,
                        new_room: false,
                        on_option: function()
                        {
                            game_vars.setFlag("377_wooden_stake_available", player.hasItem("Wooden Stake"));
                        }
                    });
                }

                if(player.hasItem("Bunch of Keys"))
                {
                    opt.push({
                        answer: "keys",
                        redirect: 181,
                        new_room: false
                    });
                }

                return {
                    question: "Which one do you use?",
                    options: opt
                };
            }
            else
            {
                return undefined;
            }
        }
    },
    event64:
    {
        description: "You approach an intersection. You can choose any of the four directions.",
        north: 264,
        south: 224,
        east: 284,
        west: 296
    },
    event65:
    {
        description: "You need to think about something important.",
        yes_no_choice:
        {
            question: "Are you sick of this place yet?",
            no: 283,
            no_new_room: false,
            yes: 195,
            yes_new_room: false
        },
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
        eat: true
    },
    event69:
    {
        description: "You asked for this. By a wall, you see two nightmarish [e]Ghouls[/e]. This encounter can only end in a fight, although they are fighting you one at a time.",
        enemies:
        [
            {
                name: "Ghoul",
                agility: 5,
                constitution: 3
            },
            {
                name: "Ghoul",
                agility: 5,
                constitution: 4,
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            system.message("You may [l]search[/l] the chamber or [l]leave[/l].");
                        }
                    }
                ]
            }
        ],
        locals:
        [
            {
                command: "leave",
                redirect: 291,
                new_room: false
            },
            {
                command: "search",
                redirect: 305,
                new_room: false
            }
        ]
    },
    event70:
    {
        description: "You may leave through the [c]east[/c] exit.",
        east: 39
    },
    event71:
    {
        description: "You peek into the room. Turns out that while you were bravely facing the [e]Evils[/e], the old man ran away. But he left a mysterious tome behind. As you grab it, the quiet wailing of the chained [e]Gremlin[/e] reaches your ears.",
        yes_no_choice:
        {
            question: "Do you want to free him?",
            no: 49,
            no_new_room: false,
            yes: 258,
            yes_new_room: false
        }
    },
    event72:
    {
        description: "You decide to finish off the [e]Demon[/e].",
        redirect: 199,
        new_room: false,
        enemies:
        [
            {
                name: "Demon",
                agility: 7,
                constitution: function()
                {
                    return game_vars.getCounter("demon_constitution");
                },
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            system.message("Time to get the gold! You approach the place where the urns were.");
                        }
                    }
                ]
            }
        ],
    },
    event74:
    {
        description: function()
        {
            let desc = "You approach the bridge. Wooden planks squeak at every step. Suddenly one of them slips from under your legs and falls down the chasm with a crash. ";
            let success = system.rollD6(1);
            if(success < 3)
            {
                player.modifyConstitution(-1);
                desc += "You got unlucky! You fall over and scrape your leg. You take 1 damage. You slowly pull yourself back up and continue forward. ";
            }
            else
            {
                desc += "You got lucky! You manage to regain your balance quickly and continue forward. ";
            }

            desc += "The bridge arches upwards. You can see a mighty hole at the peak of the arch. There is only one way to overcome it and it requires a net.";
            if(!player.hasItem("Net"))
            {
                desc += " Unfortunately, you don't have one! You must turn back. You can [l]pay[/l] the [e]Dragon[/e]";
                if(player.hasItem("Fireproof Rope") || game_vars.getFlag("269_rope_present"))
                {
                    desc += ", [l]throw[/l] your rope";
                }
                desc += " or attempt a [l]jump[/l].";
            }

            return desc;
        },
        redirect: function()
        {
            if(player.hasItem("Net"))
            {
                return 240;
            }
            else
            {
                return undefined;
            }
        },
        new_room: function()
        {
            if(player.hasItem("Net"))
            {
                return false;
            }
            else
            {
                return undefined;
            }
        },
        locals: function()
        {
            if(player.hasItem("Net"))
            {
                return undefined;
            }
            
            let loc = [
                {
                    command: "jump",
                    redirect: 110,
                    new_room: false,
                    on_command: jumpCommandEvent110
                },
                {
                    command: "pay",
                    redirect: 35,
                    new_room: false,
                    on_command: payCommandEvent35
                }
            ];

            if(player.hasItem("Fireproof Rope"))
            {
                loc.push({
                    command: "throw",
                    redirect: 269,
                    new_room: false
                });
            }
            else if(game_vars.getFlag("269_rope_present"))
            {
                loc.push({
                    command: "throw",
                    redirect: 358,
                    new_room: false
                });
            }
            
            return loc;
        }
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
    event78:
    {
        description: "You may go [c]north[/c] or [c]south[/c].",
        north: 170,
        south: 357
    },
    event79:
    {
        description: "After some time the corridor turns north. You are standing in front of a door. You could [l]open[/l] it and see what secrets it hides. Alternatively, you may [l]leave[/l].",
        locals:
        [
            {
                command: "leave",
                redirect: 161,
                new_room: true
            },
            {
                command: "open",
                redirect: 8,
                new_room: true
            }
        ]
    },
    event81:
    {
        description: function()
        {
            player.modifyConstitution(+2);
            player.modifyAgility(+1);
            return "You decide to sit down and rest after all you've been through. You gain 2 Constitution and 1 Agility.";
        },
        redirect: 121,
        new_room: false
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
                    }
                });
            }

            return loc;
        }
    },
    event84:
    {
        description: "You approach an intersection. You may head [c]north[/c], [c]east[/c] or [c]south[/c].",
        north: 209,
        south: 170,
        east: 144
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
    event86:
    {
        description: "The battle continues. If you lose, this will be your tomb!",
        redirect: 94,
        new_room: true,
        enemies:
        [
            {
                name: "Giant",
                agility: 10,
                constitution: function()
                {
                    return game_vars.getCounter("giant_constitution");
                }
            }
        ]
    },
    event87:
    {
        description: "Unfortunately, you can't find anything.",
        redirect: 354,
        new_room: true
    },
    event88:
    {
        description: function()
        {
            player.modifyConstitution(-2);
            return "You swim like a madman. You manage to safely reach the shore. You're in the same place you ended up in after crossing the lake. You take the [i]net[/i] and unfold it on the ground. You throw away entangles leaves and roots. Suddenly, the white marine rat, [e]Uruburu[/e], jumps out from underneath the floating trash. It bites your foot and runs: You take 2 damage. You may clean the [i]net[/i] and put it in your backpack. Then, it's time to [l]leave[/l].";
        },
        items:
        [
            "Net"
        ],
        item_limit: 1,
        locals:
        [
            {
                command: "leave",
                redirect: 195,
                new_room: true
            }
        ]
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
            }
        ]
    },
    event90:
    {
        description: "You climb up a set of stairs. The corridor leads west first, and then turns [c]south[/c].",
        south: 212
    },
    event91:
    {
        description: function()
        {
            if(game_vars.getCounter("57_offer") == 20)
            {
                return "The [e]Bat[/e] is really not happy about this...";
            }
            else
            {
                return "To your surprise, the [e]Bat[/e] flies away without a word. But now you have to find another way to get across the rift. You can [l]pay[/l] the [e]Dragon[/e], [l]walk[/l] on the bridge or attempt a [l]jump[/l].";
            }
        },
        redirect: function()
        {
            if(game_vars.getCounter("57_offer") === 20)
            {
                game_vars.setFlag("288_bat_angry", true);
                return 288;
            }
            else
            {
                return undefined;
            }
        },
        new_room: false,
        locals: function()
        {
            if(game_vars.getCounter("57_offer") === 20)
            {
                return undefined;
            }
            else
            {
                return [
                    {
                        command: "jump",
                        redirect: 110,
                        new_room: false,
                        on_command: jumpCommandEvent110
                    },
                    {
                        command: "pay",
                        redirect: 35,
                        new_room: false,
                        on_command: payCommandEvent35
                    },
                    {
                        command: "walk",
                        redirect: 74,
                        new_room: false
                    }
                ];
            }
        }
    },
    event92:
    {
        description: "This is going to be a real carnage. You start with the [e]Minotaur[/e].",
        enemies:
        [
            {
                name: "Minotaur",
                agility: 10,
                constitution: 10,
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            game_vars.incrementCounter("193_enemies_defeated", +1);
                            system.enableRoomEscape(193);
                            system.message("If you don't think you can keep going, you may [c]escape[/c]. Otherwise, you [l]remain[/l] on the battlefield.");
                        }
                    }
                ]
            }
        ],
        locals:
        [
            {
                command: "remain",
                redirect: 277,
                new_room: false
            }
        ]
    },
    event93:
    {
        description: "You return to the [e]Evils[/e]' chamber.",
        redirect: 313,
        new_room: true
    },
    event94:
    {
        description: "You can't find any other exist, so you squeeze through the narrow opening that you came through.",
        redirect: 129,
        new_room: false
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
    event96:
    {
        description: function()
        {
            player.modifyLuck(+2);
            return "You find [i]Key#12[/i]. It has number [k]12[/k] engraved on it. You gain 2 Luck. You may now [l]leave[/l].";
        },
        items:
        [
            "Key#12"
        ],
        item_limit: 1,
        locals:
        [
            {
                command: "leave",
                redirect: 253,
                new_room: true
            }
        ]
    },
    event97:
    {
        description: function()
        {
            let desc = "You enter the small cavern adjacent to the chamber. ";
            if(game_vars.getCounter("156_evils_defeated") >= 3)
            {
                desc += "You've already killed all the [e]Evils[/e] - there is no one left to play against.";
            }
            else
            {
                const evils_left = 3 - game_vars.getCounter("156_evils_defeated");
                game_vars.setCounter("189_evils_left", evils_left);
                desc += `You remember that when you first entered this room, you met 3 [e]Evils[/e]. Currently there are ${evils_left} left and each of them will start the game with a total of 10 gold (you wonder where they have all that gold from).`;
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getCounter("156_evils_defeated") >= 3)
            {
                return 286;
            }
            else
            {
                game_vars.setCounter("211_ante", 0);
                game_vars.setCounter("211_evil_gold", 10);
                return 211;
            }
        },
        new_room: false
    },
    event98:
    {
        description: function()
        {
            system.addCondition("goblin_follower");
            return "The [e]Goblins[/e] realised they will have more than one opponent. They proceed to run away. The only one left is the [e]Goblin Chieftain[/e]. The [e]Goblin[/e] fighting on your side has the Agility of 3 and he will add it to your stats during this battle. Unfortunately, he won't take any damage for you.";
        },
        redirect: 250,
        new_room: false,
        enemies:
        [
            {
                name: "Goblin Chieftain",
                agility: 9,
                constitution: 8
            }
        ]
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
    event100:
    {
        description: "\"I would like something that will recover my strength\" you say. \"My good sir, we've just received fresh new goods - a wonderful wooden stake and a jar of corrosive dust\" replies the [e]Orc[/e].",
        redirect: 249,
        new_room: false
    },
    event101:
    {
        description: "[e]Demon[/e] begs for your mercy.",
        yes_no_choice:
        {
            question: "Will you spare its life?",
            no: 234,
            no_new_room: false,
            yes: 362,
            yes_new_room: false
        }
    },
    event102:
    {
        description: "You reach an intersection. The corridors spread in all directions.",
        north: 268,
        south: 351,
        east: 374,
        west: 123
    },
    event103:
    {
        description: "You go back. You pass by an intersection. You turn [c]west[/c] and eventually approach another intersection.",
        west: 345
    },
    event104:
    {
        description: function()
        {
            player.modifyGold(+30);
            player.addItem("Toy Dragon");
            player.removeItem("Tin Butterfly");
            return "You give him the butterfly and take his gold and toy.";
        },
        redirect: 121,
        new_room: false
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
    event106:
    {
        description: function()
        {
            let desc = "Behind the door, you see a set of chipped, wooden stairs leading downwards. In the centre of the cavern you notice a square-shaped recess. It resembles an empty pool. The stairs lead you to the bottom of that pool. The flooring is covered with fine sand. It's just sand everywhere, no objects, rocks or creatures... Hey, what's that bended rod doing in the corner? Probably a root. You can't help yourself: you give it a nice kick. What follows is beyond imagination... If you live to tell the tale, no one will believe it. The pool now resembles a pot, where someone's stirring pasta. You are but a grain being thrown around in all directions. Around you appeared [e]Worms[/e], the most disgusting creaures in the whole dungeon. They're trying to grind you to dust as they wriggle their slimy bodies. They keep throwing you towards the surface and then pushing you to the ground. You may use your sword to defend yourself. Or you could attempt to use another weapon, like... Some say that corrosive dust is effective against [e]Worms[/e], others that you should use All-Eaters (permanently hungry shellfish). ";

            if(player.hasItem("Jar of Corrosive Dust") && player.hasItem("Jar of All-Eaters"))
            {
                desc += "Fortunately for you, you have both of them!";
            }
            else if(player.hasItem("Jar of Corrosive Dust"))
            {
                desc += "You happen to have a jar of corrosive dust on you.";
            }
            else if(player.hasItem("Jar of All-Eaters"))
            {
                desc += "You happen to have a jar of All-Eaters on you.";
            }
            else
            {
                desc += "Unfortunately, you have neither so your sword will have to suffice.";
            }

            return desc;
        },
        redirect: function()
        {
            if(player.hasItem("Jar of Corrosive Dust") || player.hasItem("Jar of All-Eaters"))
            {
                return undefined;
            }
            else
            {
                return 213;
            }
        },
        new_room: false,
        yes_no_choice: function()
        {
            if(player.hasItem("Jar of Corrosive Dust") || player.hasItem("Jar of All-Eaters"))
            {
                let yes_redirect = 0;
                if(player.hasItem("Jar of Corrosive Dust") && player.hasItem("Jar of All-Eaters"))
                {
                    yes_redirect = 292;
                }
                else
                {
                    yes_redirect = 24;
                }

                let choice = {
                    question: "Will you try to utilise this secret weapon?",
                    no: 213,
                    no_new_room: false,
                    yes: yes_redirect,
                    yes_new_room: false,
                    on_yes: function()
                    {
                        if(player.hasItem("Jar of Corrosive Dust") && !player.hasItem("Jar of All-Eaters"))
                        {
                            game_vars.setFlag("24_using_dust", true);
                            game_vars.setFlag("24_success", system.rollD6(1) < 4);
                            player.removeItem("Jar of Corrosive Dust");
                        }
                        else if(player.hasItem("Jar of All-Eaters") && !player.hasItem("Jar of Corrosive Dust"))
                        {
                            game_vars.setFlag("24_using_dust", false);
                            game_vars.setFlag("24_success", system.rollD6(1) < 4);
                            player.removeItem("Jar of All-Eaters");
                        }
                    },
                };
            }
            else
            {
                return undefined;
            }
        }
    },
    event108:
    {
        description: function()
        {
            let desc = "";

            if(game_vars.getFlag("108_show_exit_prompt"))
            {
                desc += "You insert your sword and clench your muscles. The rock slides to the side. You escape the stinky room promptly. Right behind you, the exit closes with a bang. You're now in a corridor.<br /><br />";
                game_vars.setFlag("108_show_exit_prompt", false);
            }

            desc += "You may go [c]north[/c] or [c]south[/c].";
            return desc;
        },
        north: 363,
        south: 141
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
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
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
    event110:
    {
        description: function()
        {
            if(!game_vars.getFlag("110_jump_possible"))
            {
                return "You haven't saved up enough of your strength to perform this feat. You will have to try something else.";
            }

            let desc = "";
            
            if(game_vars.getFlag("110_ration_required"))
            {
                desc += "You haven't saved up enough of your strength to perform this feat. You will have to eat a ration to recover some strength.<br />";
                if(player.eatRation())
                {
                    desc += "You consume a ration and recover 4 Constitution.<br /><br />";
                }
                else
                {
                    desc += "You don't have any rations left. You will have to try something else.";
                    return desc;
                }
            }

            const constitution_cost = Math.floor(player.getConstitution() / 2);
            player.modifyAgility(-3);
            player.modifyConstitution(-constitution_cost);
            desc += "This jump comes at a cost of 3 Agility points and half of your remaining Constitution (rounded down). You start running to gain momentum and...<br /><br />";

            if(game_vars.getCounter("110_jump_result") < 3)
            {
                desc += "You failed!<br />The jump was too short.";
            }
            else
            {
                desc += "You succeeded!<br />You make it to the other side.";
            }

            return desc;
        },
        redirect: function()
        {
            if(!game_vars.getFlag("110_jump_possible") ||
                (game_vars.getFlag("110_jump_possible") && game_vars.getFlag("110_ration_required") && !game_vars.getFlag("110_ration_available")))
            {
                return 207;
            }
            else if(game_vars.getCounter("110_jump_result") < 3)
            {
                return 314;
            }
            else
            {
                return 288;
            }
        },
        new_room: true
    },
    event111:
    {
        description: "Luck check failed!<br /><br />Your only choice is to turn back. The underground chapel is now completely empty. You pass through it and leave through the [c]west[/c] exit.",
        west: 194
    },
    event112:
    {
        description: function()
        {
            let desc = "You attempt to search through every nook and cranny of the chamber.<br /><br />";
            if(game_vars.getFlag("112_search_success"))
            {
                desc += "You find something interesting...";
            }
            else
            {
                desc += "After a long, fruitless search, you decide to give up.";
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("112_search_success"))
            {
                return 28;
            }
            else
            {
                return 291;
            }
        },
        new_room: false
    },
    event113:
    {
        description: "One step at a time, you enter the water. Your legs sink into the stinky mud. Finally, you can swim. At some point you hear a strange sound. As if someone was throwing planks into the water: splash, splash, splash! You swim faster. Behind a nearby thicket you notice a suspicious movement in the water. \"Nothing good will come out of this\" you think.",
        yes_no_choice:
        {
            question: "Do you want to keep swimming further?",
            no: function()
            {
                return game_vars.getCounter("lake_return_point");
            },
            no_new_room: true,
            yes: 307,
            yes_new_room: false
        }
    },
    event114:
    {
        description: "You don't find anything here, but you can [c]eat[/c] a ration and then [l]leave[/l].",
        eat: true,
        locals:
        [
            {
                command: "leave",
                redirect: 276,
                new_room: true
            }
        ]
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
                            system.message("[i]Bone Hunting Dagger[/i] added to your inventory.");
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
                            system.message("[i]Heavy Hammer[/i] added to your inventory.");
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
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            system.message("You may [l]look[/l] around the room if you wish. Otherwise, [l]leave[/l] the cavern.");
                        }
                    }
                ]
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
    event117:
    {
        description: "A short corridor leads north, then immediately turns west and thus you end up in a new room. There is no door, so...",
        redirect: 280,
        new_room: true
    },
    event118:
    {
        description: "You explore every corner, but you can't find anything of value.",
        redirect: 372,
        new_room: true
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
    event121:
    {
        description: "You leave the chamber using the [c]east[/c]ern door.",
        east: 325
    },
    event122:
    {
        description: function()
        {
            player.removeItem("Filled Flask");
            player.modifyAgility(+2);
            game_vars.setFlag("122_spell_learned", true);
            let desc = "You lift up the [e]Gremlin[/e]'s head. He drinks everything. He quickly comes to and opens the tome. \"Why, this is a spellbook! It used to belong to the gremlin tribe. It was craftily stolen by the [e]White Troll[/e] (back when trolls used to be enslaved by gremlins). Ever since then, everyone looks down on us, because we can't remember any of the spells.\" [e]Gremlin[/e] opens up the tome on a random page and reads out:<br /><br />\"If you see a door that won't budge, say:\"";
            desc += system.getFileContents("spell.txt");
            desc += "As soon as the [e]Gremlin[/e] read out those words, he closed the tome and ran away. You didn't manage to write down the spell and now you're not allowed to do so. Take one more quick look and make sure you remember it exactly, then quickly take your [l]leave[/l]. You gain 2 Agility.";

            return desc;
        },
        locals:
        [
            {
                command: "leave",
                redirect: 286,
                new_room: false
            }
        ]
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
    event125:
    {
        description: function()
        {
            let desc = "";
            if(game_vars.getFlag("125_door_open"))
            {
                desc += "The door is open. You've already visited this place.";
            }
            else
            {
                desc += "You carefully to open the door.";
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("125_door_open"))
            {
                return 261;
            }
            else
            {
                return 231;
            }
        },
        new_room: true
    },
    event126:
    {
        description: function()
        {
            let desc = "You attack it with your sword.<br /><br />";

            if(game_vars.getFlag("126_luck_check"))
            {
                desc += "Luck check successful!<br />You landed the first hit. Begin the battle...";
            }
            else
            {
                desc += "Luck check failed!<br />Your attack didn't hit. It's the beast's turn now...";
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("126_luck_check"))
            {
                return 309;
            }
            else
            {
                return 244;
            }
        },
        new_room: false
    },
    event128:
    {
        description: "The door shuts behind you. You can hear the [e]Dwarves[/e] cackling loudly. An unbelievable stench makes it difficult to breathe. You light up the chamber. It's not big. You see big piles of rotten lettuce leaves, some reaching all the way to the ceiling. Other than that, this place is almost completely empty. There are some broken rakes and hoes lying around. In a corner of the room you notice a [i]bunch of keys[/i]. You may take it. You poke the walls with your sword. It seems that there is a spot on the easter wall that sounds a little differently from the rest. Yes, there is an opening there - you can [l]leave[/l]!",
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
                    game_vars.setFlag("108_show_exit_prompt", true);
                }
            }
        ]
    },
    event129:
    {
        description: "You can only go south from here. Suddenly, you realise you're out of breath. You collapse unconcious. When you come to, you're sitting at an intersection.",
        redirect: 345,
        new_room: true
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
            return "Indeed, the metal bars are lifted up, but you can't get the key out. You will have to leave it here.";
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
    event133:
    {
        description: "You drop down on your knees and begin to gather this enormous treasure into one pile. But the monsters where waiting for this. They charge at you. Your only choice is to [c]escape[/c].",
        escape_redirect: 385
    },
    event134:
    {
        description: "There is an intersection in front of you. You may proceed [c]north[/c], [c]east[/c] or [c]south[/c].",
        north: 270,
        south: 276,
        east: 384
    },
    event135:
    {
        description: function()
        {
            let desc = "This room requires one of three special items to enter: a tin butterfly, a wooden stake, or an emerald that grants the Gift of Wings.<br /><br />";

            if(player.hasItem("Tin Butterfly") || player.hasItem("Wooden Stake") || player.hasItem("Emerald"))
            {
                desc += "Since you have at least one of the items in question, you may proceed.";
            }
            else
            {
                desc += "You don't have any of these items. Try wandering around this area, maybe someone would be willing to sell you one of them.";
            }

            return desc;
        },
        redirect: function()
        {
            if(player.hasItem("Tin Butterfly") || player.hasItem("Wooden Stake") || player.hasItem("Emerald"))
            {
                return 22;
            }
            else
            {
                return 43;
            }
        },
        new_room: false
    },
    event136:
    {
        description: function()
        {
            player.modifyGold(-13);
            return "The [e]Dragon[/e] politely invites you on his tail. Admittedly, it sways a lot over the gap, but soon after you end up on the other side.";
        },
        redirect: 186,
        new_room: false
    },
    event137:
    {
        description: "An extremely short corridor - where you can [c]eat[/c] a ration - leads to a T-shaped intersection, but you can only turn east. Then, the corridor turns south and east again... Until you reach a door. You may [l]open[/l] it.",
        eat: true,
        locals:
        [
            {
                command: "open",
                redirect: 13,
                new_room: true
            }
        ]
    },
    event139:
    {
        description: "You safely return to the northern shore of the lake.",
        redirect: 195,
        new_room: false
    },
    event140:
    {
        description: "In that case, look behind you. An [e]Orc[/e] and a [e]Vampire[/e] are hiding behind the door.",
        yes_no_choice:
        {
            question: "Is this enough?",
            no: 235,
            no_new_room: false,
            yes: 277,
            yes_new_room: false
        }
    },
    event141:
    {
        description: "You are at a dead end of a corridor that stops here. It leads directly [c]north[/c]. You may [c]eat[/c] a ration. You have no other choice but to go down the corridor.",
        north: 357,
        eat: true
    },
    event142:
    {
        description: "You reach the bottom of the pool. The sand has been spread al around. You squeeze between the meaty noodles. At some point you notice a tiny gold item - [i]Key#93[/i]. The number [k]93[/k] is visible on a small tag attached to the key. After taking it, it's time to [l]leave[/l].",
        items:
        [
            "Key#93"
        ],
        item_limit: 1,
        locals:
        [
            {
                command: "leave",
                redirect: 320,
                new_room: true
            }
        ]
    },
    event143:
    {
        description: "From a dark corner of the chamber, a barrage of blue arrows flies towards you...",
        redirect: 315,
        new_room: false,
        on_exit: function()
        {
            game_vars.setCounter("315_redirect", 52);
            game_vars.setFlag("315_new_room", false);
        }
    },
    event144:
    {
        description: function()
        {
            let desc = "You enter a short corridor. It's barely just begun, but it's already over: a smooth wall blocks the way. You sit down on a stone doorstep. You may [c]eat[/c] one of your rations. ";
            if(player.hasItem("Crushed Lettuce"))
            {
                player.modifyRations(-1);
                player.removeItem("Crushed Lettuce");
                desc += "You find out the crushed lettuce in your backpack got spoiled and contaminated one of your rations. You throw it away. ";
            }
            desc += "Suddenly, you hear rumbling. You hide in a gap between rocks. A herd of monsters run through the main corridor. You got lucky this time. You gain 1 Luck. It's time to [l]leave[/l].";

            return desc;
        },
        eat: true,
        locals:
        [
            {
                command: "leave",
                redirect: 84,
                new_room: true
            }
        ]
    },
    event145:
    {
        description: function()
        {
            const result = system.rollD6(2);
            let desc = `You lost ${result} gold playing the game.`;
            if(result > player.getGold())
            {
                desc += " Looks like you don't even have that much, so you just pay up all your gold.";
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
    event147:
    {
        description: function()
        {
            if(!player.hasItem("Wooden Stake"))
            {
                player.addItem("Wooden Stake");
            }

            if(!player.hasItem("Jar of Corrosive Dust"))
            {
                player.addItem("Jar of Corrosive Dust");
            }

            return "\"It was such a pleasure talking to you, good sir. Here, a wooden stake and a jar of corrosive dust, on the house.\"";
        },
        redirect: 196,
        new_room: false
    },
    event148:
    {
        description: "The corridor turns north and after some time, you reach a door.",
        yes_no_choice:
        {
            question: "Do you want to open it?",
            no: 93,
            no_new_room: true,
            yes: 80,
            yes_new_room: true
        }
    },
    event151:
    {
        description: function()
        {
            game_vars.setFlag("38_door_open", true);
            return "Thus far, none of the doors you've come across have opened as quietly and gently as this one. You come in. The room has a regular shape and straight, smooth walls. In each of them, there is a torch holder. They all have torches. In the torchlight you notice a group of small creatures moving about. These are [e]Dwarves[/e]. They are running around flower beds. They're weeding and harvesting their greatest treasure - the dungeon lettuce. This is what all the inhabitants of this maze call their favourite snack. You can try to [l]befriend[/l] the [e]Dwarves[/e]. Or you can just [l]walk[/l] to the door on the eastern side of the room. You may also [l]attack[/l] the innocent creatures.";
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
        redirect: 324
    },
    event154:
    {
        description: "You attach one of the buoys to your leather strap. You swim towards the shore. Yes, you could have seen this coming: In front of a green thicket you see three pairs of shiny eyes. The net seems too valuable of a find to lose it like this. You won't abandon it, although you have two choices: [l]attack[/l] the monsters or [c]escape[/c].",
        escape_redirect: 88,
        locals:
        [
            {
                command: "attack",
                redirect: 341,
                new_room: false
            }
        ]
    },
    event155:
    {
        description: "You observe the walls, move the lighter stones - nothing! All you can do now is go back [c]west[/c].",
        west: 212
    },
    event156:
    {
        description: function()
        {
            return `You managed to defeat ${game_vars.getCounter("156_evils_defeated")} [e]Evils[/e].`;
        },
        redirect: function()
        {
            if(game_vars.getCounter("156_evils_defeated") >= 2)
            {
                return 350;
            }
            else
            {
                return 286;
            }
        },
        new_room: false
    },
    event157:
    {
        description: "Yes, the bone is as hard as steel. It's perfect for this fight.",
        redirect: 32,
        new_room: false,
        enemies:
        [
            {
                name: "Werewolf",
                agility: 9,
                constitution: 6,
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 1,
                        callback: function()
                        {
                            if(system.getCurrentPlayerScore() < system.getCurrentEnemyScore())
                            {
                                system.enableEnemyEscape(275);
                            }
                        }
                    },
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 2,
                        callback: function()
                        {
                            system.disableEnemyEscape();
                        }
                    }
                ]
            }
        ],
        on_exit: function()
        {
            player.removeItem("Bone Hunting Dagger");
        }
    },
    event158:
    {
        description: function()
        {
            let desc = "Haven't you had enough? ";
            if(player.getGold() >= 10)
            {
                desc += "You still have money left, so you could try to [l]pay[/l] the [e]Dragon[/e] again. Alternatively, you could try ";
            }
            else
            {
                desc += "You don't have enough money to try this again, so you'll have to come up with something else. You could try ";
            }

            if(player.hasItem("Fireproof Rope") || game_vars.getFlag("269_rope_present"))
            {
                desc += "[l]throw[/l]ing the rope, ";
            }
            desc += "[l]walk[/l]ing on the bridge or [l]jump[/l]ing over the gap.";

            return desc;
        },
        locals: function()
        {
            let loc = [
                {
                    command: "jump",
                    redirect: 110,
                    new_room: false,
                    on_command: jumpCommandEvent110
                },
                {
                    command: "walk",
                    redirect: 74,
                    new_room: false
                }
            ];

            if(player.getGold() >= 10)
            {
                loc.push({
                    command: "pay",
                    redirect: 225,
                    new_room: false,
                    on_command: function()
                    {
                        if(player.getGold() >= 10)
                        {
                            game_vars.setFlag("225_luck_check", player.performLuckCheck());
                        }
                    }
                });
            }

            if(player.hasItem("Fireproof Rope"))
            {
                loc.push({
                    command: "throw",
                    redirect: 269,
                    new_room: false
                });
            }
            else if(game_vars.getFlag("269_rope_present"))
            {
                loc.push({
                    command: "throw",
                    redirect: 358,
                    new_room: false
                });
            }

            return loc;
        }
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
    event161:
    {
        description: "You go back down the pavement, all the way to the intersection.",
        redirect: 348,
        new_room: true
    },
    event162:
    {
        description: function()
        {
            player.modifyConstitution(-1);
            let desc = "You take 1 damage as you plummet downwards.<br /><br />";

            if(game_vars.getFlag("162_luck_check"))
            {
                desc += "Luck check successful!<br />A [e]Bat[/e] catches you as you're falling. The scoundrel wants gold as a reward for saving you. You can offer a [o]low[/o] reward of 10 gold, and it'll bring you back to the edge you came from. You can also offer a [o]high[/o] reward of 20 gold, and it'll bring you to the other edge. You have to make an offer regardless of whether you have the money or not.";
            }
            else
            {
                player.modifyAgility(+2);
                player.modifyLuck(+3);
                desc += "Luck check failed!<br />You fall down the abyss, getting hit by many of the protruding rocks on the way. You manage to grab onto one of them, and you notice an opening leading to some sort of a tunnel. You manage to crawl into the orifice. You are dreadfully tired. You should [c]eat[/c] something - you might get a special bonus if you do! For the heroic feat, you gain 2 Agility. Additionally, your unbelievable fortune earns you 3 Luck. You get up. The corridor is wide and lit, it leads into a round room. A rope is hanging from the top. You pull yourself upwards. At the top of this \"chimney\" you find yourself in another identical room. You see a door ahead of you. You push it. It turns out to be a revolving door. You end up in another corridor, and the door closes shut. It's impossible to find it anymore. You end up at a turning point of a tunnel, which goes from the north towards the east. You move east. You reach a thick door. You may [l]open[/l] it.";
            }

            return desc;
        },
        eat: function()
        {
            return !game_vars.getFlag("162_luck_check");
        },
        on_eat: function()
        {
            if(player.getRations() === 0)
            {
                system.message("You don't have any rations left!");
            }
            else
            {
                player.modifyConstitution(+5);
                player.modifyRations(-1);
                system.message("You consume a ration. Even the simplest food tastes amazing after getting out of a dangerous situation. You recover 5 Constitution.");
            }
        },
        choice: function()
        {
            if(game_vars.getFlag("162_luck_check"))
            {
                return {
                    question: "What will your offer be?",
                    options:
                    [
                        {
                            answer: "high",
                            redirect: 57,
                            new_room: true,
                            on_option: function()
                            {
                                game_vars.setCounter("57_offer", 20);
                                game_vars.setFlag("57_can_afford", player.getGold() >= 20);
                            }
                        },
                        {
                            answer: "low",
                            redirect: 57,
                            new_room: true,
                            on_option: function()
                            {
                                game_vars.setCounter("57_offer", 10);
                                game_vars.setFlag("57_can_afford", player.getGold() >= 10);
                            }
                        }
                    ]
                };
            }
            else
            {
                return undefined;
            }
        },
        locals: function()
        {
            if(game_vars.getFlag("162_luck_check"))
            {
                return undefined;
            }
            else
            {
                return [
                    {
                        command: "open",
                        redirect: 13,
                        new_room: true
                    }
                ];
            }
        }
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
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            player.modifyLuck(+1);
                            game_vars.setFlag("163_passage_discovered", true);
                            system.message("After defeating the monster, you learn that the fountain is now empty. You observe the walls of the cavern carefully. On the [c]north[/c]ern side you discover a hole that was covered up with a boulder. There's your exit. You gain 1 Luck.");
                        }
                    }
                ]
            }
        ]
    },
    event164:
    {
        description: function()
        {
            let desc = "The corridor leads to the west, then turns north and west again. After taking a dozen steps you see a staircase with a door at the end. The stairs lead down. You approach the door. ";

            if(game_vars.getFlag("302_visited"))
            {
                desc += "You know this place. This is [e]Garazan[/e]'s cave.";
            }
            else
            {
                desc += "You could [l]open[/l] the door to see what hides behind, or you could just [l]leave[/l].";
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("302_visited"))
            {
                return 290;
            }
            else
            {
                return undefined;
            }
        },
        new_room: true,
        locals: function()
        {
            if(game_vars.getFlag("302_visited"))
            {
                return undefined;
            }
            else
            {
                return [
                    {
                        command: "leave",
                        redirect: 253,
                        new_room: true
                    },
                    {
                        command: "open",
                        redirect: 302,
                        new_room: true
                    }
                ];
            }
        }
        
    },
    event166:
    {
        description: function()
        {
            player.modifyConstitution(+3);
            player.modifyAgility(+2);
            return "You banter with the [e]Gnome[/e] for a bit. This is strangely relaxing: you gain 3 Constitution and 2 Agility. Eventually, you give in and surrender the butterfly.";
        },
        yes_no_choice:
        {
            question: "Will you ask for gold in exchange for the butterfly?",
            no: 202,
            no_new_room: false,
            yes: 353,
            yes_new_room: false
        }
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
    event168:
    {
        description: "You can still [l]attack[/l] them with your sword. But if you don't want to fight, you'll have to [c]escape[/c].",
        escape_redirect: 320,
        locals:
        [
            {
                command: "attack",
                redirect: 213,
                new_room: false
            }
        ]
    },
    event169:
    {
        description: "The first [e]Demon[/e] flies towards you. You must fight.",
        redirect: 297,
        new_room: false,
        enemies:
        [
            {
                name: "Demon",
                agility: 8,
                constitution: 5,
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 1,
                        callback: function()
                        {
                            if(system.getCurrentPlayerScore() < system.getCurrentEnemyScore())
                            {
                                system.enableEnemyEscape(385);
                            }
                        }
                    },
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 2,
                        callback: function()
                        {
                            system.disableEnemyEscape();
                        }
                    }
                ]
            }
        ]
    },
    event170:
    {
        description: "You reach an intersection. It's shaped like the letter T. You can go [c]north[/c], [c]east[/c] or [c]south[/c].",
        north: 84,
        south: 357,
        east: 319
    },
    event171:
    {
        description: "You hurry out of the chamber. There are two exits. One to the [c]south[/c], which you originally came from, and one to the [c]west[/c].",
        south: 50,
        west: 99
    },
    event172:
    {
        description: function()
        {
            if(game_vars.getCounter("lake_crossed") === 2)
            {
                return "You managed to make it back to the side you originally came from.";
            }
            else
            {
                return "You are now on the other side.";
            }
        },
        redirect: function()
        {
            if(game_vars.getCounter("lake_crossed") === 2)
            {
                return 15;
            }
            else
            {
                return 365;
            }
        },
        new_room: false
    },
    event173:
    {
        description: "After some time, the corridor turns [c]west[/c].",
        west: 134
    },
    event174:
    {
        description: "Everywhere you step, the ground burns your feet!",
        redirect: 315,
        new_room: false,
        on_exit: function()
        {
            game_vars.setCounter("315_redirect", 210);
            game_vars.setFlag("315_new_room", true);
        }
    },
    event176:
    {
        description: "You approach an intersection. You may go [c]north[/c] or [c]east[/c].",
        north: 27,
        east: 230
    },
    event177:
    {
        description: function()
        {
            player.modifyLuck(+3);
            return "A [i]fireball[/i] is hidden under the stone. You gain 3 Luck. You can now [l]leave[/l].";
        },
        items:
        [
            "Fireball"
        ],
        item_limit: 1,
        locals:
        [
            {
                command: "leave",
                redirect: 330,
                new_room: false
            }
        ]
    },
    event178:
    {
        description: "It's getting more and more difficult to lift your feet from the muddy sludge. The air is getting humid. The corridor is gradually widening, until finally you reach the shore of an underground lake. The area is full of plants with thick, wide leaves. The roof is very high up. In a few places thin rays of light are piercing through it. You look around. Is this a dead end? You don't see any exits, other than the corridor you came from.",
        redirect: 15,
        new_room: false
    },
    event180:
    {
        description: "You search the room once again. In the [e]Orc[/e]'s bag, which you didn't have time to search, you find [i]Key#45[/i]. The number [k]45[/k] is engraved on the key. You may take it with you. You may now [l]leave[/l] the chamber, leaving the door wide open.",
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
    event181:
    {
        description: function()
        {
            let desc = "You throw a bunch of keys found in one of the chambers at the monster. You hit him, but it does no damage. The [e]Werewolf[/e] grabs the keys and runs away. You chase after it. The [e]Werewolf[/e] falls into a narrow but deep rift in the corner of the cavern. It falls to the bottom and dies.<br /><br />You light the chasm up with your lantern. At the bottom you can see the monster's bulky corpse, the keys shining next to it. ";
            
            if(player.hasItem("Fireproof Rope"))
            {
                desc += "You decide to use your rope to retrieve it.";
            }
            else
            {
                desc += "You could retrieve it if only you had a rope.";
            }

            return desc;
        },
        redirect: function()
        {
            if(player.hasItem("Fireproof Rope"))
            {
                return 329;
            }
            else
            {
                return 32;
            }
        },
        new_room: false
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
    event184:
    {
        description: "You wipe the blood from your sword using the hides at your feet. You advance.",
        enemies:
        [
            {
                name: "Demon",
                agility: 7,
                constitution: 6,
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 1,
                        callback: function()
                        {
                            game_vars.setCounter("demon_constitution", system.getCurrentEnemyConstitution());
                            system.stopCombat();
                            system.redirect(226, false);
                        }
                    }
                ]
            }
        ]
    },
    event186:
    {
        description: "You made it to the other edge. You see three exits: one leading to the [c]west[/c], one to the [l]northwest[/l] and one to the [c]north[/c].",
        north: 360,
        west: 368,
        locals:
        [
            {
                command: "northwest",
                redirect: 117,
                new_room: true
            }
        ]
    },
    event187:
    {
        description: "Unfortunately, the [e]Gnome[/e] is not interested in your emerald.",
        redirect: 81,
        new_room: false
    },
    event188:
    {
        description: "The corridor turns [c]south[/c].",
        south: 221
    },
    event189:
    {
        description: function()
        {
            let desc = "";
            let evils_left = game_vars.getCounter("189_evils_left");
            if(evils_left < 1)
            {
                desc += "There are no [e]Evils[/e] left.";
            }
            else
            {
                desc += `There are ${evils_left} [e]Evils[/e] left in the room.`;
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getCounter("189_evils_left") < 1)
            {
                return 156;
            }
            else
            {
                return 303;
            }
        },
        new_room: false
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
                            system.message("[i]Thin Sword[/i] added to your inventory.");
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
                            system.message("[i]Stone Sword[/i] added to your inventory.");
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
                            system.message("[i]Short Sword[/i] added to your inventory.");
                        }
                    }
                }
            ]
        },
    },
    event191:
    {
        description: "You march for a while, when suddenly you hear a hellish sound. Heavy metal bars fall down right behind you, cutting out your return route. A shiver runs down your back, but you keep going.",
        redirect: 386,
        new_room: true
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
                desc += " If you had a flask, you might also have been able to take some of the water...";
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
                    return "So: which item do you want? Remember that you can only take one thing.";
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
    event193:
    {
        description: function()
        {
            let gold = 5 * game_vars.getCounter("193_enemies_defeated");
            player.modifyGold(+gold);
            player.modifyAgility(+2);
            player.modifyLuck(+2);
            return `You are awarded ${gold} gold for the monsters you defeated. For this courageous deed, you gain 2 Agility and 2 Luck.`;
        },
        redirect: 51,
        new_room: true
    },
    event194:
    {
        description: "You walk back down the spacious footpath all the way to its end. You climb up to the opening. You squeeze through and end up at the shore.",
        redirect: 195,
        new_room: true
    },
    event195:
    {
        description: "You may try to [l]swim[/l] back to the other side of the lake, or [l]search[/l] around this side. Decide!",
        locals:
        [
            {
                command: "search",
                redirect: 46,
                new_room: false
            },
            {
                command: "swim",
                redirect: 113,
                new_room: true,
                on_command: function()
                {
                    game_vars.setCounter("lake_return_point", 195);
                }
            }
        ]
    },
    event196:
    {
        description: "You leave the chamber through the [c]north[/c]ern door.",
        north: 282
    },
    event197:
    {
        description: "A long pavement leads straight [c]north[/c].",
        north: 276
    },
    event199:
    {
        description: "You look for the scattered [i]gold[/i]. There's not as much left as what you saw in the urn! You manage to find 20 pieces. That's alright... You can pick it up. You may now finally [l]leave[/l].",
        gold: 20,
        locals:
        [
            {
                command: "leave",
                redirect: 385,
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
    event202:
    {
        description: function()
        {
            player.removeItem("Tin Butterfly");
            return "The [e]Gnome[/e] grants you a smile in exchange, but nothing else.";
        },
        redirect: 81,
        new_room: false
    },
    event203:
    {
        description: "You've been here already, give it up!",
        redirect: 129,
        new_room: false
    },
    event205:
    {
        description: "You approach the altar. You take the stone container and open the lid with the tip of your sword. Inside lies a green gem. It's an emerald! You pick it up and inspect, with the help of the oil lamp's light. It's wonderful. But... You drop it and it shatters on the stone floor.",
        redirect: 254,
        new_room: false
    },
    event206:
    {
        description: "The corridor turns [c]north[/c].",
        north: 348
    },
    event207:
    {
        description: function()
        {
            let desc = "One leg, both legs, then a deep breath, push your head through and finally you fall out of the narrow rock crevice onto a flat, stone floor, with all your equipment now scattered around you. Great Almanhagor, if only you could see this! Your entire palace would fit inside this cave. Including the towers! Everything around is purple and shiny. Steep rocky cliffs hang from the ceiling. Their shadows are reflected in the sparkly stone parquetry. You feel like an ant that's being squished by a hedgehog warming up its belly.<br /><br />\"I can see all of this... Why can I see? My lantern is only strong enough to light up a small cavern. Dear Zargaana, my goddess, this is hellfire!\" In the middle of the reflective floor, a deep chasm is open. That's where the bright red light is coming from. You crawl quietly, pulling yourself with hands that are now sweaty from fear. You cover your eyes with your hand, then peek into the abyss. The ground is on fire. \"Haruum, my dear father, I was so naive, thinking it is enough to tie a sword to your belt, pack the rations and dive deep into the corridors to tear out the mystery from the Dungeon.\" You return next to the wall.";

            if(player.hasItem("Magical Water"))
            {
                player.modifyAgility(+3);
                player.modifyConstitution(+3);
                player.removeItem("Magical Water");
                desc += " You decide this is a good time to drink the magical water. You gain 3 Constitution and 3 Agility.";
            }

            desc += "<br /><br />You look around the cave. You have to somehow overcome the hellish rift. This is the only path forward. On another end of the cavern you can see a bridge. So there is hope...<br /><br />You look through your equipment. ";

            let options = "three";
            if(player.hasItem("Fireproof Rope") || game_vars.getFlag("269_rope_present"))
            {
                options = "four";
                desc += "You have a rope with a hook, which just happens to be fireproof. Your chances of crossing the chasm suddenly aren't looking too bad. This thought gives you courage. ";
            }
            else
            {
                desc += "You can't find anything in your backpack that could help you cross the chasm. If only you had picked up a rope at any point... You immediately feel discouraged. ";
            }

            desc += "You get up and approach the rift once again. Looking at it while standing straight, it doesn't seem as wide as before. The fire also isn't looking that scary anymore. It's interesing: so huge, so bright, and yet... so quiet. But no. Can you hear singing? From another direction you can hear a deep voice that's getting louder and louder. A fat body covered with green and yellow stripes and red spikes on the back appears from behind the rocks. It's a [e]Dragon[/e]! Have you heard the tales of a crazy [e]Dragon[/e] from the Dungeon dwellers? It's him. You confidently approach the [e]Dragon[/e]. It's just hung a sign on the rock. The sign says:";
            desc += system.getFileContents("dragonwagon.txt");
            desc += "He's looking at you as if you came here everyday. You must make a decision. You have " + options + " options:<br />* [l]Pay[/l] for the dragon transport.<br />";

            if(player.hasItem("Fireproof Rope") || game_vars.getFlag("269_rope_present"))
            {
                desc += "* Attempt to [l]throw[/l] a rope to the other side and pull yourself on it.<br />";
            }

            desc += "* Risk [l]walk[/l]ing through the bridge.<br />* Make an enormous [l]jump[/l] at the expense of all your strength.";

            return desc;
        },
        locals: function()
        {
            let loc = [
                {
                    command: "jump",
                    redirect: 110,
                    new_room: false,
                    on_command: jumpCommandEvent110
                },
                {
                    command: "pay",
                    redirect: 35,
                    new_room: false,
                    on_command: payCommandEvent35
                },
                {
                    command: "walk",
                    redirect: 74,
                    new_room: false
                }
            ];

            if(player.hasItem("Fireproof Rope"))
            {
                loc.push({
                    command: "throw",
                    redirect: 269,
                    new_room: false
                });
            }
            else if(game_vars.getFlag("269_rope_present"))
            {
                loc.push({
                    command: "throw",
                    redirect: 358,
                    new_room: false
                });
            }

            return loc;
        }
    },
    event209:
    {
        description: "A long corridor leads north, then turns west with a deep arc only to abruptly change back to [c]north[/c]. It ends at a small opening, through which you can see red light.",
        north: 207
    },
    event210:
    {
        description: "The only way to leave to his chamber is the [c]north[/c]ern door.",
        north: 248
    },
    event211:
    {
        description: function()
        {
            let desc = "";
            let ante = game_vars.getCounter("211_ante");
            if(ante != 0)
            {
                let player_score = system.rollD6(1);
                let evil_score = system.rollD6(1);
                desc += `You scored ${player_score} hits and [e]Evil[/e] scored ${evil_score}.<br />`;

                if(player_score > evil_score)
                {
                    player.modifyGold(+ante);
                    game_vars.incrementCounter("211_evil_gold", -ante);
                    desc += `You won ${ante} gold.`;

                    if(game_vars.getCounter("211_evil_gold") < 1)
                    {
                        desc += "<br /><br />[e]Evil[/e] has no more gold, so it decides to end the game.";
                    }

                }
                else if(player_score < evil_score)
                {
                    player.modifyGold(-ante);
                    game_vars.incrementCounter("211_evil_gold", +ante);
                    desc += `You lost ${ante} gold.`;
                }
                else
                {
                    desc += "Since it's a draw, no one wins the gold.";
                }
            }
            else
            {
                let max_ante = 5;
                if(max_ante > game_vars.getCounter("211_evil_gold"))
                {
                    max_ante = game_vars.getCounter("211_evil_gold");
                }
                if(max_ante > player.getGold())
                {
                    max_ante = player.getGold();
                }

                desc += `[e]Evil[/e] reaches out with its hand. You can see it currently has ${game_vars.getCounter("211_evil_gold")} gold. You can bet anywhere between 1 and ${max_ante} gold.`;
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getCounter("211_evil_gold") < 1)
            {
                game_vars.incrementCounter("189_evils_left", -1);
                game_vars.incrementCounter("156_evils_defeated", +1);
                return 189;
            }
            else if(player.getGold() < 1)
            {
                return 367;
            }
            else
            {
                return undefined;
            }
        },
        yes_no_choice: function()
        {
            if(game_vars.getCounter("211_ante") == 0 || game_vars.getCounter("211_evil_gold") < 1 || player.getGold() < 1)
            {
                return undefined;
            }

            return {
                question: "Would you like to play again?",
                no: 189,
                no_new_room: false,
                on_no: function()
                {
                    game_vars.incrementCounter("189_evils_left", -1);
                },
                yes: 211,
                yes_new_room: false,
                on_yes: function()
                {
                    game_vars.setCounter("211_ante", 0);
                },
            };
        },
        choice: function()
        {
            if(game_vars.getCounter("211_ante") != 0 || game_vars.getCounter("211_evil_gold") < 1 || player.getGold() < 1)
            {
                return undefined;
            }

            let max_ante = 5;
            if(max_ante > game_vars.getCounter("211_evil_gold"))
            {
                max_ante = game_vars.getCounter("211_evil_gold");
            }
            if(max_ante > player.getGold())
            {
                max_ante = player.getGold();
            }

            let setAnteCallback = function(ante)
            {
                return function()
                {
                    game_vars.setCounter("211_ante", ante);
                };
            };

            let opt = [];
            for(let i = 1; i <= max_ante; ++i)
            {
                opt.push_back({
                    answer: i,
                    redirect: 211,
                    new_room: false,
                    on_option: setAnteCallback(i)
                });
            }

            return {
                question: "How much will you bet?",
                options: opt
            };
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
    event213:
    {
        description: "You will fight all the [e]Worms[/e] at once - it'd be impossible to count them anyway.",
        redirect: 320,
        new_room: true,
        enemies:
        [
            {
                name: "Worms",
                agility: 7,
                constitution: 8
            }
        ]
    },
    event214:
    {
        description: function()
        {
            game_vars.incrementCounter("lake_crossed", +1);
            return "You reach the shore.";
        },
        redirect: function()
        {
            if(game_vars.getCounter("lake_crossed") === 1)
            {
                return 65;
            }
            else
            {
                return 172;
            }
        },
        new_room: false
    },
    event215:
    {
        description: "You go south, until you reach the chamber with the fountain. The exit is on the [c]east[/c].",
        east: 39
    },
    event216:
    {
        description: "You hit the ceiling with the shield, using all your might. Rock fragments fall down on the monster's head. It loses 2 Agility.",
        redirect: 32,
        new_room: false,
        enemies:
        [
            {
                name: "Werewolf",
                agility: 7,
                constitution: 6
            }
        ]
    },
    event217:
    {
        description: function()
        {
            let desc = "You glance at the pranksters sitting at the table. Once again, some of them disappear, some of them appear again. The host disappeared completely. You've figured it out. This is an elixir of invisibility. You now have the advantage: the pranksters can't see you.<br /><br />";

            let pranksters_left = game_vars.getCounter("pranksters_left");
            for(let i = 0; i < 2; ++i)
            {
                desc += "You aim at prankster no. " + pranksters_left + ".<br />";
                let result1 = system.rollD6(1);
                let result2 = system.rollD6(1);
                if(result1 === 5 || result2 === 5)
                {
                    --pranksters_left;
                    desc += "You hit him! He's dead meat.<br /><br />";
                }
                else
                {
                    desc += "As your sword was approaching his head, he disappeared.<br /><br />";
                }
            }
            game_vars.setCounter("pranksters_left", pranksters_left);

            desc += "You decide to back off.";
            return desc;
        },
        redirect: 26,
        new_room: false
    },
    event218:
    {
        description: "You approach an intersection. You may go [c]west[/c] or [c]north[/c].",
        north: 333,
        west: 61
    },
    event219:
    {
        description: "So: are you taking the wooden stake and a jar of corrosive dust? Maybe it's not a bad idea? Think about it.",
        yes_no_choice:
        {
            question: "Do you want them?",
            no: 147,
            no_new_room: false,
            yes: 323,
            yes_new_room: false
        }
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
    event221:
    {
        description: "You reach an intersection which leads [c]north[/c], [c]east[/c] and [c]south[/c].",
        north: 339,
        south: 173,
        east: 41,
        on_direction: function(dir)
        {
            if(dir === Directions.East)
            {
                game_vars.setFlag("41_luck_check", player.performLuckCheck());
            }
        }
    },
    event223:
    {
        description: function()
        {
            player.removeItem("Wooden Stake");
            return "You've blown through all your chances. The [e]Gnome[/e] disappears, taking your stake with it. You're left alone in the room.";
        },
        redirect: 121,
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
    event225:
    {
        description: function()
        {
            player.modifyGold(-10);
            let desc = "You pay another 10 gold. The [e]Dragon[/e] does a huge split over the gap... And once again it begins.";

            if(game_vars.getFlag("225_luck_check"))
            {
                desc += "<br /><br />Luck check successful!<br />You get to the other side.";
            }
            else
            {
                desc += "<br /><br />Luck check failed!<br />The [e]Dragon[/e] throws you back.";
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("225_luck_check"))
            {
                return 186;
            }
            else
            {
                return 3;
            }
        },
        new_room: false
    },
    event226:
    {
        description: "The battle continues. The [e]Demon[/e] seems intimidated. If you ran away, it most likely wouldn't chase you.",
        enemies:
        [
            {
                name: "Demon",
                agility: 7,
                constitution: function()
                {
                    return game_vars.getCounter("demon_constitution");
                },
                escape_redirect: 385,
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundAction,
                        round: 2,
                        callback: function()
                        {
                            game_vars.setCounter("demon_constitution", system.getCurrentEnemyConstitution());
                            system.stopCombat();
                            system.redirect(101, false);
                        }
                    }
                ]
            }
        ]
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
    event231:
    {
        description: function()
        {
            game_vars.setFlag("125_door_open", true);
            return "You enter quietly. Oil lamps light up the room. All the walls from top to bottom have bundles of various herbs hanging from them. There is a strange, sickly odour in the air. Only now your eyes focus on a few silhouettes sitting in the other corner of the room. They are sitting on a gigantic skin spread on the ground. You approach them slowly. An old humanoid with long hair resting upon his shoulders appears to be the most important figure in the room. The other three are monsters, commonly referred to as [e]Evils[/e]. Wrinkly, sallow skin and bulging, intimidating eyes. They are wearing short coats made out of smoked, fleshy Menalois leaves. The coats are strapped with flexible tree roots, occasionally found piercing through the dungeon roof. Tied up with the roots by their tails, the green [e]Lizards[/e] who live in the underground lake can be seen hanging upside down. [e]Evils[/e] probably have just visited the lake and now they're preparing their meal. You see a happy spark in their round eyes. Are they inviting you to eat with them? No, they consider you a partner. The [e]Evils[/e]' biggest weakness is a game. Not cards, not marbles, and not mice catching. They love darts. Without making a sound, they get up and politely point you towards the southern exit. It leads to the next room.";
        },
        yes_no_choice:
        {
            question: "Will you accompany them?",
            no: 286,
            no_new_room: false,
            yes: 18,
            yes_new_room: true,
            on_yes: function()
            {
                game_vars.setFlag("313_played_darts", true);
            }
        }
    },
    event232:
    {
        description: function()
        {
            if(game_vars.getFlag("sword_upgraded"))
            {
                return "You've already upgraded your sword!";
            }
            else
            {
                return "You reach for the sword rack.";
            }
        },
        redirect: function()
        {
            if(game_vars.getFlag("sword_upgraded"))
            {
                return 68;
            }
            else
            {
                return 271;
            }
        },
        new_room: function()
        {
            return game_vars.getFlag("sword_upgraded");
        }
    },
    event233:
    {
        description: "Luck check successful!<br /><br />Suddenly, as if on a moving stage, the floor turns along with the wall. You end up in a corridor that runs from the north to the south. The secret passage is now nowhere to be found.",
        redirect: 78,
        new_room: true
    },
    event234:
    {
        description: "You decide to finish off the [e]Demon[/e].",
        enemies:
        [
            {
                name: "Demon",
                agility: 7,
                constitution: function()
                {
                    return game_vars.getCounter("demon_constitution");
                },
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            system.message("You may now [l]inspect[/l] the stone box on the altar or [l]collect[/l] the gold from the floor.");
                        }
                    }
                ]
            }
        ],
        locals:
        [
            {
                command: "collect",
                redirect: 199,
                new_room: false
            },
            {
                command: "inspect",
                redirect: 205,
                new_room: false
            }
        ]
    },
    event235:
    {
        description: "A [e]Minotaur[/e] stands in the door.",
        yes_no_choice:
        {
            question: "Is this enough?",
            no: 327,
            no_new_room: false,
            yes: 92,
            yes_new_room: false
        }
    },
    event236:
    {
        description: "You enter the chamber. Two [e]Dwarves[/e] run up to you.",
        redirect: 4,
        new_room: false
    },
    event238:
    {
        description: "You encounter a party of wandering monsters: [e]Gremlin[/e], [e]Lich[/e], [e]Brongo[/e], [e]Orcling[/e] and [e]Skinbones[/e]. You must fight them one by one.",
        redirect: function()
        {
            return game_vars.getCounter("238_redirect");
        },
        new_room: true,
        enemies:
        [
            {
                name: "Gremlin",
                agility: 5,
                constitution: 3
            },
            {
                name: "Lich",
                agility: 6,
                constitution: 5,
                escape_redirect: function()
                {
                    return game_vars.getCounter("238_redirect");
                },
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 1,
                        callback: function()
                        {
                            system.disableEnemyEscape();
                        }
                    }
                ]
            },
            {
                name: "Brongo",
                agility: 8,
                constitution: 4,
                escape_redirect: function()
                {
                    return game_vars.getCounter("238_redirect");
                },
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 1,
                        callback: function()
                        {
                            system.disableEnemyEscape();
                        }
                    }
                ]
            },
            {
                name: "Orcling",
                agility: 6,
                constitution: 4,
                escape_redirect: function()
                {
                    return game_vars.getCounter("238_redirect");
                },
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 1,
                        callback: function()
                        {
                            system.disableEnemyEscape();
                        }
                    }
                ]
            },
            {
                name: "Skinbones",
                agility: 6,
                constitution: 5,
                escape_redirect: function()
                {
                    return game_vars.getCounter("238_redirect");
                },
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 1,
                        callback: function()
                        {
                            system.disableEnemyEscape();
                        }
                    }
                ]
            }
        ]
    },
    event239:
    {
        description: "After only a dozen steps, the pavement turns left, then after another dozen you see a door ahead. You push your ear to it.",
        redirect: 125,
        new_room: false
    },
    event240:
    {
        description: function()
        {
            player.removeItem("Net");
            let desc = "You tread carefully. You can feel the strain on the net and hear its sinister crunches. Only one step left. You throw your body onto the rotten planks. The net catches onto your leg. It falls down and immediately catches on fire. You're almost on the other side. You're out of strength and grasping for air. You lean against the handrail, which breaks and falls into the abyss. You barely manage to regain your balance.";

            let damage = system.rollD6(1);
            const constitution = player.getConstitution();
            if(damage >= constitution)
            {
                damage = constitution - 1;
            }
            player.modifyConstitution(-damage);
            desc += " You take " + damage + " damage. Dragging on, you reach the desired edge of the rift.";

            return desc;
        },
        redirect: 288,
        new_room: true
    },
    event241:
    {
        description: "You may take some [i]lake water[/i] with you, if you wish. It's now time to [l]leave[/l].",
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
    event242:
    {
        description: "You take a bunch of steps and... The path is blocked by a stone wall.",
        redirect: function()
        {
            if(game_vars.getFlag("242_luck_check"))
            {
                return 233;
            }
            else
            {
                return 111;
            }
        },
        new_room: false
    },
    event243:
    {
        description: "You haven't explored this room before.",
        yes_no_choice:
        {
            question: "Would you like to enter?",
            no: 129,
            no_new_room: false,
            yes: 355,
            yes_new_room: true
        }
    },
    event244:
    {
        description: function()
        {
            player.modifyConstitution(-1);
            return "The [e]Werewolf[/e] paralyses you again, and then knocks the sword out of your hands - you take 1 damage. You pick your sword back up, but you're thinking that you might need a better weapon.";
        },
        redirect: 63,
        new_room: false
    },
    event245:
    {
        description: function()
        {
            player.modifyConstitution(-1);
            return "You hit it with your shoulder, using all of your strength. The door won't even budge. You take 1 damage.";
        },
        redirect: 108,
        new_room: true
    },
    event246:
    {
        description: "No can do. But the [e]Gnome[/e] changes its offer: You can take the 20 gold or the toy dragon, whichever one you prefer.",
        choice:
        {
            question: "You may choose the [o]gold[/o], the [o]toy[/o], or just give up on the transaction and [o]rest[/o].",
            options:
            [
                {
                    answer: "gold",
                    redirect: 289,
                    new_room: false
                },
                {
                    answer: "rest",
                    redirect: 81,
                    new_room: false
                },
                {
                    answer: "toy",
                    redirect: 369,
                    new_room: false
                }
            ]
        }
    },
    event247:
    {
        description: function()
        {
            let desc = "After a few steps you reach a door to some chamber. ";

            if(game_vars.getFlag("270_door_open"))
            {
                desc += "You've already been here, and you'd rather stay away. It's best to [l]leave[/l].";
            }
            else
            {
                desc += "It's closed. You should be able to [l]open[/l] it. Alternatively, you may [l]leave[/l].";
            }

            return desc;
        },
        locals: function()
        {
            let loc = [
                {
                    command: "leave",
                    redirect: 33,
                    new_room: true
                }
            ];

            if(!game_vars.getFlag("270_door_open"))
            {
                loc.push({
                    command: "open",
                    redirect: 5,
                    new_room: true
                });
            }

            return loc;
        }
    },
    event248:
    {
        description: "You walk north, down the corridor. It turns to the left. You can sit down here and [c]eat[/c] a ration. After you're done, go west. The corridor turns north and eventually you reach an opening in the rocks. You may try to [l]squeeze[/l] through it.",
        eat: true,
        locals:
        [
            {
                command: "squeeze",
                redirect: 207,
                new_room: true
            }
        ]
    },
    event249:
    {
        description: "\"How about some magical remedy for treating wounds?\" you ask. \"I think I can get something like that. What do we have here? Ah, there it is. A wooden stake and a jar of corrosive dust.\"",
        redirect: 7,
        new_room: false
    },
    event250:
    {
        description: "The [e]Goblins[/e] that ran away haven't actually given up yet. They are now attacking you, and only you, as your friend, barely breathing, is resting by the wall. They don't initiate combat, but rather try to get you with their elaborate traps.",
        yes_no_choice:
        {
            question: "Will you face them on their own terms?",
            no: 210,
            no_new_room: true,
            yes: 143,
            yes_new_room: false
        }
    },
    event251:
    {
        description: "You leave the way you came in.",
        redirect: 39,
        new_room: true
    },
    event253:
    {
        description: "You go back up the stairs, then walk through the corridor until you're back at the intersection.",
        redirect: 267,
        new_room: true
    },
    event254:
    {
        description: "Suddenly, from the other side of the chamber you hear a powerful roar. You have time to grab some [i]gold[/i] and then you must [c]escape[/c].",
        escape_redirect: 385
    },
    event256:
    {
        description: "Once again, you find nothing.",
        redirect: 378,
        new_room: true
    },
    event257:
    {
        description: "You ask your hosts about the beam of light in the middle of the chamber. They go quiet, and then suddenly explode in anger. Anticipating what will follow, you launch an attack.",
        redirect: 318,
        new_room: false
    },
    event258:
    {
        description: "You break the chains binding him to the rock with you sword. The poor thing can barely stand. You lead him into the room and lay down on top of the skin on the floor. You can finall open the tome. You can't make out even a single word. This book is written in the Gremlin language. You pull the unconscious creature's arm. He can't even lift his head. He whispers \"Water, water...\"",
        redirect: function()
        {
            if(player.hasItem("Filled Flask"))
            {
                return 122;
            }
            else
            {
                return 337;
            }
        },
        new_room: false
    },
    event259:
    {
        description: "You go back down the corridor, until you reach the pranksters' chamber. You open the door confidently. No one is there. You promptly reach the other door and come out to another corridor, continuing [c]south[/c].",
        south: 50
    },
    event261:
    {
        description: function()
        {
            if(game_vars.getFlag("261_looking_for_water") && player.hasItem("Filled Flask"))
            {
                return "This is the chamber where you left the [e]Gremlin[/e] as you left to look for water.";
            }
            else
            {
                return "This is the chamber where [e]Evils[/e] dwell.";
            }
        },
        redirect: function()
        {
            if(game_vars.getFlag("261_looking_for_water") && player.hasItem("Filled Flask"))
            {
                return 122;
            }
            else
            {
                return 313;
            }
        },
        new_room: false
    },
    event262:
    {
        description: function()
        {
            player.modifyGold(+game_vars.getCounter("262_offer"));
            player.removeItem("Tin Butterfly");
            return "You give him the butterfly and take his gold.";
        },
        redirect: 121,
        new_room: false
    },
    event263:
    {
        description: function()
        {
            player.modifyConstitution(-2);
            return "You leave the barely breathing monster and approach the altar. Doing as the [e]Demon[/e] said, you may take the [i]emerald[/i]. As you grab your backpack, you hear a terrifying scream behind you. The wounded [e]Demon[/e] charges at you with all its remaining strength. It pierces your back with its talons: you take 2 damage. You jump away and deal what turns out to be the final blow. You may now [l]collect[/l] the gold.";
        },
        items:
        [
            "Emerald"
        ],
        item_limit: 1,
        locals:
        [
            {
                command: "collect",
                redirect: 326,
                new_room: false
            }
        ]
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
                desc += "You aim at prankster no. " + pranksters_left + ".<br />";
                let result = system.rollD6(1);
                if(result === 5)
                {
                    --pranksters_left;
                    desc += "You hit him! He's dead meat.<br /><br />";
                }
                else
                {
                    desc += "As your sword was approaching his head, he disappeared.<br /><br />";
                }
            }
            game_vars.setCounter("pranksters_left", pranksters_left);

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
    event267:
    {
        description: "You approach an intersection. You may go [c]west[/c], [c]east[/c] or [c]south[/c].",
        south: 345,
        east: 164,
        west: 333
    },
    event268:
    {
        description: function()
        {
            let desc = "A short tunnel ends with a decrepit old door. ";
            if(game_vars.getFlag("268_door_open"))
            {
                desc += "It's open. You've already visited this place. You decide to go back [c]south[/c].";
            }
            else
            {
                desc += "It's closed. You should be able to [l]open[/l] it. Alternatively, you may go back [c]south[/c].";
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
    event269:
    {
        description: function()
        {
            player.modifyConstitution(-2);
            player.removeItem("Fireproof Rope");
            game_vars.setFlag("269_rope_present", true);
            return "You take the rope out of your backpack. It's fireproof and has a hook attached. You approach the edge. With a wide swing, you throw the hook in between the rocks on the other side. It's secured. You tie the other end to a rock next to you. You will attempt to go through the chasm, holding onto the rope with your hands. You grab the rope. Suddenly... Bang! The hook falls off. You climb back up. You take 2 damage. You can choose another way to cross the gap: [l]pay[/l] the dragon, [l]walk[/l] on the bridge or [l]jump[/l] over the chasm. The rope will remain here, so you could attempt to [l]throw[/l] it again. But first, you can [c]eat[/c] a ration.";
        },
        eat: true,
        locals:
        [
            {
                command: "jump",
                redirect: 110,
                new_room: false,
                on_command: jumpCommandEvent110
            },
            {
                command: "pay",
                redirect: 35,
                new_room: false,
                on_command: payCommandEvent35
            },
            {
                command: "throw",
                redirect: 358,
                new_room: false,
                on_command: function()
                {
                    game_vars.setFlag("358_elixir_present", player.hasItem("Elixir of Inviolability"));
                }
            },
            {
                command: "walk",
                redirect: 74,
                new_room: false
            }
        ]
    },
    event270:
    {
        description: function()
        {
            let desc = "After taking a few steps you find yourself in front of a door decorated with leather. ";
            if(game_vars.getFlag("270_door_open"))
            {
                desc += " You've already been here. You should [l]leave[/l].";
            }
            else
            {
                desc += " You can [l]open[/l] it or turn back and [l]leave[/l].";
            }

            return desc;
        },
        locals: function()
        {
            let loc = [
                {
                    command: "leave",
                    redirect: 134,
                    new_room: true
                }
            ];

            if(!game_vars.getFlag("270_door_open"))
            {
                loc.push({
                    command: "open",
                    redirect: 5,
                    new_room: true
                });
            }

            return loc;
        }
    },
    event271:
    {
        description: function()
        {
            game_vars.setFlag("sword_upgraded", true);
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
    event273:
    {
        description: "The corridor runs straight, only to eventually stretch out into an extensive hall. You may sit down and [c]eat[/c] a ration. Suddenly, you hear footsteps. It must be monsters. Get ready to [l]attack[/l].",
        eat: true,
        locals:
        [
            {
                command: "attack",
                redirect: 238,
                new_room: true,
                on_command: function()
                {
                    game_vars.setCounter("238_redirect", 103);
                }
            }
        ]
    },
    event274:
    {
        description: function()
        {
            let desc = "You suddenly feel waves in the air. You begin to lose your balance. The wind blows you away like a leaf.<br /><br />";

            if(game_vars.getFlag("274_luck_check"))
            {
                desc += "Luck check successful!<br />You fly straight to the exit.";
            }
            else
            {
                desc += "Luck check failed!<br />You bounce around the room a few times...";
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("274_luck_check"))
            {
                return 210;
            }
            else
            {
                return 174;
            }
        },
        new_room: function()
        {
            return game_vars.getFlag("274_luck_check");
        }
    },
    event275:
    {
        description: "You run out of this chamber through the [c]east[/c]ern door.",
        east: 279
    },
    event276:
    {
        description: "You reach a crossing. You may go [c]north[/c], [c]east[/c] or [c]south[/c].",
        north: 308,
        south: 215,
        east: 382
    },
    event277:
    {
        description: "Let's do this. First, the [e]Vampire[/e]. Then, the [e]Orc[/e].",
        enemies:
        [
            {
                name: "Vampire",
                agility: 9,
                constitution: 7,
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            game_vars.incrementCounter("193_enemies_defeated", +1);
                        }
                    }
                ]
            },
            {
                name: "Orc",
                agility: 7,
                constitution: 7,
                escape_redirect: 193,
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 1,
                        callback: function()
                        {
                            system.disableEnemyEscape();
                        }
                    },
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            game_vars.incrementCounter("193_enemies_defeated", +1);
                            system.enableRoomEscape(193);
                            system.message("If you don't think you can keep going, you may [c]escape[/c]. Otherwise, you [l]remain[/l] on the battlefield.");
                        }
                    }
                ]
            }
        ],
        locals:
        [
            {
                command: "remain",
                redirect: 312,
                new_room: false
            }
        ]
    },
    event278:
    {
        description: function()
        {
            player.removeItem("Small Shiny Key");
            player.addItem("Key#122");
            return "You inspect the key. It has the number [k]122[/k] engraved into it.<br />Item updated in inventory.";
        },
        redirect: 109,
        new_room: false
    },
    event279:
    {
        description: "The corridor leads east. You approach an intersection. You may turn [c]north[/c] or continue [c]east[/c].",
        north: 191,
        east: 47
    },
    event280:
    {
        description: function()
        {
            let desc = "\"Good morning. Oh, pardon me. Night good. How can I help you?\" A slouched [e]Orc[/e] is rubbing its spiky, wrinkly fingers. It points to a seat at a table and then sits down himself.<br /><br />";

            if(player.getGold() < 10)
            {
                desc += "Unfortunately, you don't have much money on you. You should get away from here as soon as you can!";
            }
            else
            {
                desc += "You have a feeling that the money you've collected up till now is about to come in handy. You sit down opposite the [e]Orc[/e].";
            }

            return desc;
        },
        redirect: function()
        {
            if(player.getGold() < 10)
            {
                return 196;
            }
            else
            {
                return 100;
            }
        },
        new_room: false
    },
    event282:
    {
        description: "The narrow tunnel runs north, only to turn east after a few steps, and finally end with a door.",
        redirect: 135,
        new_room: false
    },
    event283:
    {
        description: "\"Such a dangerous lake, and yet it was so easy to cross? I shall look for adventures\" you decide. You venture into the rushes. In a close vicinity of the shore you see red balls floating on the surface. Intriguing, isn't it? You enter the water slowly. You swim closer. You reach under the water. It turns out to be a net hanging on some cork buoys.",
        yes_no_choice:
        {
            question: "Would you like to pull the net to the shore?",
            no: 139,
            no_new_room: false,
            yes: 154,
            yes_new_room: true
        },
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
                desc += "Luck check failed!<br />You take 2 damage.";
            }

            return desc;
        },
        east: 50
    },
    event286:
    {
        description: function()
        {
            game_vars.setFlag("286_room_exited", true);
            return "You leave the [e]Evils[/e]' nest. There are exits on the [c]west[/c] and [c]east[/c].";
        },
        east: 148,
        west: 206
    },
    event287:
    {
        description: "After some time, you see an intersection in the distance. The corridor continues [c]west[/c].",
        west: 50
    },
    event288:
    {
        description: function()
        {
            if(game_vars.getFlag("288_bat_angry"))
            {
                return "The [e]Bat[/e] rushes at you in fury.";
            }
            else
            {
                return "Barely breathing, you lie on the smooth rocks. Out of nowhere, you're attacked by a [e]Bat[/e].";
            }
        },
        redirect: 186,
        new_room: false,
        enemies:
        [
            {
                name: "Bat",
                agility: 7,
                constitution: 6
            }
        ]
    },
    event289:
    {
        description: function()
        {
            player.modifyGold(+20);
            player.removeItem("Wooden Stake");
            return "You give him the stake and take his gold.";
        },
        redirect: 121,
        new_room: false
    },
    event290:
    {
        description: function()
        {
            if(game_vars.getFlag("347_key_clue"))
            {
                return "You realise this is the door that [e]Giant[/e] told you about.";
            }
            else
            {
                return "You've already had your chance to beat [e]Garazan[/e]. There is nothing else for you to do here.";
            }
        },
        redirect: function()
        {
            if(game_vars.getFlag("347_key_clue"))
            {
                return 96;
            }
            else
            {
                return 253;
            }
        },
        new_room: true
    },
    event291:
    {
        description: function()
        {
            player.modifyConstitution(-2);
            return "You approach the exit, when out of nowhere a small, blue dart hits you in the stomach. You take 2 damage.";
        },
        redirect: 330,
        new_room: false
    },
    event292:
    {
        description: function()
        {
            const result = system.rollD6(1);
            if(result < 4)
            {
                game_vars.setFlag("24_using_dust", true);
                player.removeItem("Jar of Corrosive Dust");
                return "You decide to use corrosive dust.";
            }
            else
            {
                game_vars.setFlag("24_using_dust", false);
                player.removeItem("Jar of All-Eaters");
                return "You decide to use All-Eaters.";
            }
        },
        redirect: 24,
        new_room: false,
        on_exit: function()
        {
            game_vars.setFlag("24_success", system.rollD6(1) < 4);
        }
    },
    event293:
    {
        description: "You can barely squeeze through scattered rock fragments. The corridor takes a turn. At the curve, there is a small stone bench. You can rest here and [c]eat[/c]. Then, get up and go east. After some time, the tunnel changes directions and goes north. You reach the end of the corridor. There is a small opening in the rocks. You will have to [l]squeeze[/l] through it.",
        eat: true,
        locals:
        [
            {
                command: "squeeze",
                redirect: 207,
                new_room: true
            }
        ]
    },
    event294:
    {
        description: function()
        {
            player.modifyLuck(+2);
            return "In a crevice in the wall you find the [i]Elixir of Inviolability[/i]. You gain 2 Luck. The only thing left is to [l]leave[/l] the room.";
        },
        items:
        [
            "Elixir of Inviolability"
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
        eat: true
    },
    event297:
    {
        description: "You can now [l]collect[/l] the gold from the floor. Or maybe you'd like to [l]inspect[/l] the stone container on the altar? Or, if you have enough strength and courage, you can [l]attack[/l] the other [e]Demon[/e].",
        locals:
        [
            {
                command: "attack",
                redirect: 184,
                new_room: false
            },
            {
                command: "collect",
                redirect: 254,
                new_room: false
            },
            {
                command: "inspect",
                redirect: 205,
                new_room: false
            }
        ]
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
    event299:
    {
        description: "The door is closed.",
        yes_no_choice:
        {
            question: "Would you like to open it?",
            no: 194,
            no_new_room: true,
            yes: 349,
            yes_new_room: false,
        }
    },
    event300:
    {
        description: "No means no.",
        redirect: 81,
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
    event302:
    {
        description: function()
        {
            game_vars.setFlag("302_visited", true);
            return "Have you ever seen a monster scarier than the [e]Garazan[/e]? Probably not, or at least not yet. It's no one else than [e]Garazan[/e] that lives in this cave. Grab your equipment, ready the sword. Forget about everything else. But maybe you don't want to do this?";
        },
        yes_no_choice:
        {
            question: "Will you fight [e]Garazan[/e]?",
            no: 372,
            no_new_room: false,
            yes: 2,
            yes_new_room: false
        }
    },
    event303:
    {
        description: "You can continue the game with the next opponent.",
        yes_no_choice:
        {
            question: "Do you want to play again?",
            no: 286,
            no_new_room: false,
            yes: 211,
            yes_new_room: false,
            on_yes: function()
            {
                game_vars.setCounter("211_evil_gold", 10);
                game_vars.setCounter("211_ante", 0);
            },
        }
    },
    event304:
    {
        description: "After some time, the tunnel turns south. A few more steps, and you notice a narrow passage in the eastern wall. It's probably the entrance to a cavern.",
        redirect: function()
        {
            if(game_vars.getFlag("355_visited"))
            {
                return 203;
            }
            else
            {
                return 243;
            }
        },
        new_room: true
    },
    event305:
    {
        description: "This chamber hides something extremely valuable. You will have to put a lot of effort in looking for it, but you'll also need luck. If you think your Luck stat is high, you could perform a luck check in hopes of finding it. Otherwise, you might be better off just searching everywhere, hoping to get lucky the old-fashioned way.",
        yes_no_choice:
        {
            question: "Do you want to perform a luck check?",
            no: 112,
            no_new_room: false,
            on_no: function()
            {
                game_vars.setFlag("112_search_success", system.rollD6(4) >= 18);
            },
            yes: 381,
            yes_new_room: false,
            on_yes: function()
            {
                game_vars.setFlag("381_luck_check", player.performLuckCheck());
            }
        }
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
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            player.modifyLuck(+2);
                            system.message("You succeeded. You make it to the other side of the lake. You gain 2 luck.");
                        }
                    }
                ]
            }
        ]
    },
    event308:
    {
        description: "A short tunnel ends in a dead end. You could [l]search[/l] for secret passages or turn back [c]south[/c].",
        south: 276,
        locals:
        [
            {
                command: "search",
                redirect: 114,
                new_room: false
            }
        ]
    },
    event309:
    {
        description: "[e]Werewolf[/e] approaches you.",
        escape_redirect: 275,
        enemies:
        [
            {
                name: "Werewolf",
                agility: 9,
                constitution: 6,
                invincible: true,
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 1,
                        callback: function()
                        {
                            system.stopCombat();
                            system.message("Your sword proves to be ineffective against the [e]Werewolf[/e]. You may either [c]escape[/c] or [l]search[/l] for another weapon.");
                        }
                    }
                ]
            }
        ],
        locals:
        [
            {
                command: "search",
                redirect: 63,
                new_room: false
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
    event312:
    {
        description: "[e]Man-Eater[/e], [e]Zombie[/e] and [e]Skeleton[/e] await you. You will fight them in this order.",
        enemies:
        [
            {
                name: "Man-Eater",
                agility: 7,
                constitution: 5,
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            game_vars.incrementCounter("193_enemies_defeated", +1);
                        }
                    }
                ]
            },
            {
                name: "Zombie",
                agility: 6,
                constitution: 5,
                escape_redirect: 193,
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 1,
                        callback: function()
                        {
                            system.disableEnemyEscape();
                        }
                    },
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            game_vars.incrementCounter("193_enemies_defeated", +1);
                        }
                    }
                ]
            },
            {
                name: "Skeleton",
                agility: 5,
                constitution: 4,
                escape_redirect: 193,
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 1,
                        callback: function()
                        {
                            system.disableEnemyEscape();
                        }
                    },
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            game_vars.incrementCounter("193_enemies_defeated", +1);
                        }
                    }
                ]
            }
        ],
        redirect: 193,
        new_room: false
    },
    event313:
    {
        description: function()
        {
            if(game_vars.getFlag("313_played_darts"))
            {
                return "You enter the darts room to challenge the [e]Evils[/e] once again.";
            }
            else
            {
                return "You've changed your mind, and decided to give the [e]Evil[/e]'s challenge a go.";
            }
        },
        redirect: function()
        {
            if(game_vars.getFlag("313_played_darts"))
            {
                return 97;
            }
            else
            {
                return 18;
            }
        },
        new_room: false
    },
    event314:
    {
        description: function()
        {
            let desc = "You're falling down. You start thinking that the only way for you to survive would be if you suddenly learned how to fly... ";

            if(player.hasItem("Emerald"))
            {
                desc += "As your thoughts focus strongly on the image of flight, your hand instinctively reaches out for the emerald you've been carrying this whole time.";
            }
            else
            {
                desc += "Alas, such miracles don't happen.";
            }

            return desc;
        },
        redirect: function()
        {
            if(player.hasItem("Emerald"))
            {
                return 12;
            }
            else
            {
                return 370;
            }
        },
        new_room: false
    },
    event315:
    {
        description: function()
        {
            const result = system.rollD6(1);
            if(result < 4)
            {
                return "You got lucky and avoided the damage!";
            }
            else
            {
                player.modifyConstitution(-3);
                player.modifyAgility(-1);
                return "You've been hit! You lose 3 Constitution and 1 Agility.";
            }
        },
        redirect: function()
        {
            return game_vars.getCounter("315_redirect");
        },
        new_room: function()
        {
            return game_vars.getFlag("315_new_room");
        }
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
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            system.message("[e]Ogre[/e] lies at your feet. Are you still disgusted? If so, at least [l]inspect[/l] the walls. If not, [l]loot[/l] the corpse.");
                        }
                    }
                ]
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
    event319:
    {
        description: "Going down a short, narrow corridor, you reach a door. It's open.",
        yes_no_choice:
        {
            question: "Do you want to see what's inside?",
            no: 170,
            no_new_room: true,
            yes: 69,
            yes_new_room: true
        }
    },
    event320:
    {
        description: "You leave the chamber through the door in the [c]north[/c]ern wall.",
        north: 137
    },
    event321:
    {
        description: "The [e]Gnome[/e] has taken a liking to the tin butterfly. He's now jockeying for it.",
        yes_no_choice:
        {
            question: "Will you give him the butterfly?",
            no: 81,
            no_new_room: false,
            yes: 166,
            yes_new_room: false
        }
    },
    event322:
    {
        description: "The chamber is completely empty. You may exit through the [c]east[/c] or [c]west[/c] door (where you came from).",
        east: function()
        {
            game_vars.setFlag("242_luck_check", player.performLuckCheck());
            return 242;
        },
        west: 194
    },
    event323:
    {
        description: "\"How much is this?\" you ask. \"It is but a trifle: 15 gold pieces for the stake and 10 gold pieces for the jar of dust. It's basically free.\"",
        choice:
        {
            question: function()
            {
                if(player.getGold() >= 25)
                {
                    return "You can buy the [o]stake[/o], the [o]jar[/o] or [o]both[/o]. You could also buy [o]nothing[/o]. What's your choice?";
                }
                else if(player.getGold() >= 15)
                {
                    return "You can buy the [o]stake[/o] or the [o]jar[/o]. You could also buy [o]nothing[/o]. What's your choice?";
                }
                else if(player.getGold() >= 10)
                {
                    return "Unfortunately, you can only afford the [o]jar[/o]. You could also buy [o]nothing[/o]. What's your choice?";
                }
                else
                {
                    return "Unfortunately, there is [o]nothing[/o] you can afford. What's your choice?";
                }
            },
            options: function()
            {
                let opt = [
                    {
                        answer: "nothing",
                        redirect: 196,
                        new_room: false
                    }
                ];

                if(player.getGold() >= 10)
                {
                    opt.push({
                        answer: "jar",
                        redirect: 55,
                        new_room: false,
                        on_option: function()
                        {
                            game_vars.setFlag("55_buy_jar", true);
                        }
                    });
                }

                if(player.getGold() >= 15)
                {
                    opt.push({
                        answer: "stake",
                        redirect: 55,
                        new_room: false,
                        on_option: function()
                        {
                            game_vars.setFlag("55_buy_stake", true);
                        }
                    });
                }

                if(player.getGold() >= 25)
                {
                    opt.push({
                        answer: "both",
                        redirect: 55,
                        new_room: false,
                        on_option: function()
                        {
                            game_vars.setFlag("55_buy_jar", true);
                            game_vars.setFlag("55_buy_stake", true);
                        }
                    });
                }

                return opt;
            }
        }
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
    event325:
    {
        description: "A few steps forward, and once again, there's a door.",
        redirect: 106,
        new_room: true
    },
    event326:
    {
        description: function()
        {
            player.modifyLuck(+3);
            return "You get down to collect the [i]gold[/i]. And there's a lot! You gain 3 Luck. You can now [l]leave[/l].";
        },
        gold: 30,
        locals:
        [
            {
                command: "leave",
                redirect: 385,
                new_room: true
            }
        ]
    },
    event327:
    {
        description: "Don't play hero, just run away as fast as you can. [c]Escape[/c] is your only option.",
        escape_redirect: 51
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
    event329:
    {
        description: function()
        {
            player.addItem("Key#70");
            player.removeItem("Fireproof Rope");
            return "You drop down to the bottom of the gap. You pick up the keys, and notice one of them has the number [k]70[/k] engraved on it.<br />[i]Key#70[/i] added to your inventory.<br />You pull yourself back up, but the rope slides into the chasm.";
        },
        redirect: 32,
        new_room: false
    },
    event330:
    {
        description: "There is only one exit from this chamber: The one you came from. You return to the corridor.",
        redirect: 170,
        new_room: true
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
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            player.modifyLuck(+1);
                            system.message("You gain 1 Luck.");
                        }
                    }
                ]
            }
        ]
    },
    event333:
    {
        description: "You approach an intersection. You may go in any of the four directions.",
        north: 176,
        south: 218,
        east: 267,
        west: 304
    },
    event334:
    {
        description: function()
        {
            const result = system.rollD6(2);
            let desc = "";

            if(result % 2 === 0)
            {
                desc += `You lost ${result} gold playing the game.`;
                if(result > player.getGold())
                {
                    desc += " Looks like you don't even have that much, so you just pay up all your gold.";
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
    event335:
    {
        description: function()
        {
            player.modifyGold(-game_vars.getCounter("57_offer"));
            let desc = "The [e]Bat[/e] takes you up on the offer. You pay " + game_vars.getCounter("57_offer") + " gold, then the [e]Bat[/e] leaves.";

            if(game_vars.getCounter("57_offer") == 10)
            {
                desc += " Now you have to find another way to get across the rift. You can [l]pay[/l] the [e]Dragon[/e], [l]walk[/l] on the bridge or attempt a [l]jump[/l].";
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getCounter("57_offer") === 20)
            {
                return 186;
            }
            else
            {
                return undefined;
            }
        },
        new_room: true,
        locals: function()
        {
            if(game_vars.getCounter("57_offer") === 20)
            {
                return undefined;
            }
            else
            {
                return [
                    {
                        command: "jump",
                        redirect: 110,
                        new_room: false,
                        on_command: jumpCommandEvent110
                    },
                    {
                        command: "pay",
                        redirect: 35,
                        new_room: false,
                        on_command: payCommandEvent35
                    },
                    {
                        command: "walk",
                        redirect: 74,
                        new_room: false
                    }
                ];
            }
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
    event337:
    {
        description: function()
        {
            game_vars.setFlag("261_looking_for_water", true);
            return "You will have to go look for some water if you want him to help you.";
        },
        redirect: 286,
        new_room: false
    },
    event338:
    {
        description: "The [e]Gnome[/e] offers 30 gold and his toy dragon.",
        yes_no_choice:
        {
            question: "Do you accept the offer?",
            no: 300,
            no_new_room: false,
            yes: 104,
            yes_new_room: false
        }
    },
    event339:
    {
        description: "After some time, the corridor turns [c]west[/c]. You can [c]eat[/c] a ration here.",
        west: 33,
        eat: true
    },
    event340:
    {
        description: "[e]Kormaa[/e] listens to your order and... runs away.",
        redirect: 251,
        new_room: false
    },
    event341:
    {
        description: "The monsters swim towards you. You attack.",
        enemies:
        [
            {
                name: "Green Lizards",
                agility: 7,
                constitution: 6,
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            player.modifyAgility(+1);
                            system.message("In a crazy fight you slice the lizards with your sword, but the net also gets cut. When you reach the shore after slaying the beasts, it turns out the net is in pieces. You throw it away. You gain 1 Agility.");
                        }
                    }
                ]
            }
        ],
        redirect: 195,
        new_room: true
    },
    event342:
    {
        description: "You didn't manage to find anything. You turn back.",
        redirect: 259,
        new_room: true
    },
    event343:
    {
        description: "With the rest of your strength, you reach the other side of the cave, but a surprise is waiting for you here...",
        redirect: 288,
        new_room: true
    },
    event345:
    {
        description: "You approach an intersection. You can go [c]west[/c] or [c]north[/c].",
        north: 267,
        west: 218
    },
    event346:
    {
        description: function()
        {
            player.modifyConstitution(-1);
            player.removeItem("Heavy Hammer");
            return "In one of the battles between trolls and goblins, the trolls stole an impressive war hammer. You found it in the armoury. It's time to try it out. You grab the stem, take a half-turn and... Bang! The wooden handle breaks and you take 1 damage. You have no choice other than to [c]escape[/c].";
        },
        escape_redirect: 275
    },
    event347:
    {
        description: function()
        {
            game_vars.setFlag("347_key_clue", true);
            return "The monster walks through the narrow passage effectively widening it. It points south and advises you to turn left twice, then right once, and then... It can't remember anymore. It knows for sure that there is a chamber nearby that hides a key. It's hidden on a stone shelf above the door. Listening to the monster's advice, you turn left at the nearest intersection. But after thinking about a bit, you decide to not turn at the following one. You march forward.";
        },
        redirect: 345,
        new_room: true
    },
    event348:
    {
        description: "The corridor ramifies. You can go [c]west[/c], [c]east[/c] or [c]south[/c].",
        south: 239,
        east: 79,
        west: 221
    },
    event349:
    {
        description: function()
        {
            game_vars.setFlag("53_door_open", true);
            return "You carefully slide your foot into a narrow crevice. With your hips you push the door and they open. What a tactic! You can smell a faint odour of dried herbs. There are two smooth pillars by the left wall. In between those, at eye level stretches a granite shelf. On top of it, two small lamps and a stone box between them.<br /><br />The floor is lined up with furry hides of animals and monsters. This could be an underground chapel! By the wall opposite to the altar site, you see a low table carved in stone. Something's on the table. You raise your lantern. Dear king Almanhagor, those are two urns filled with gold. They are identical, with an elaborate design. On one side they are decorated with monster heads, on the other - they have pairs of shiny wings attached.";
        },
        yes_no_choice:
        {
            question: "Do you want to take the gold?",
            no: 385,
            no_new_room: true,
            yes: 48,
            yes_new_room: false
        }
    },
    event350:
    {
        description: function()
        {
            if(game_vars.getFlag("286_room_exited"))
            {
                return "There's nothing left for you to do here.";
            }
            else
            {
                player.modifyLuck(+2);
                return "You gain 2 Luck as a reward.";
            }
        },
        redirect: function()
        {
            if(game_vars.getFlag("286_room_exited"))
            {
                return 286;
            }
            else
            {
                return 71;
            }
        },
        new_room: true
    },
    event351:
    {
        description: "You squeeze through the corridor, largely inhibited by the stone rubble lying around. You move further [c]south[/c].",
        south: 64
    },
    event353:
    {
        description: "The [e]Gnome[/e] offers 10 gold for the butterfly.",
        yes_no_choice:
        {
            question: "Do you accept the offer?",
            no: 60,
            no_new_room: false,
            yes: 262,
            yes_new_room: false,
            on_yes: function()
            {
                game_vars.setCounter("262_offer", 10);
            }
        }
    },
    event354:
    {
        description: "You walk north. Eventually the corridor turns east. You walk 50 steps and once again, you can hear strange sounds: laughs and squeaks. You may [l]search[/l] for hidden doors in the southern wall or just keep walking [c]east[/c].",
        east: 378,
        locals:
        [
            {
                command: "search",
                redirect: 256,
                new_room: false
            }
        ]
    },
    event355:
    {
        description: function()
        {
            game_vars.setFlag("355_visited", true);
            return "You barely manage to squeeze through the narrow opening. You stand up straight. Look up! In front of you there is a [e]Giant[/e]. Its head is touching the ceiling. Oh brother, there is no way out of this one. This will be a battle to the death.";
        },
        enemies:
        [
            {
                name: "Giant",
                agility: 10,
                constitution: 12,
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 0,
                        callback: function()
                        {
                            if(system.getCurrentPlayerScore() > system.getCurrentEnemyScore())
                            {
                                game_vars.setFlag("379_giant_persuaded", system.rollD6(1) < 4);
                                game_vars.setCounter("giant_constitution", system.getCurrentEnemyConstitution());
                                redirect(379, false);
                            }
                        }
                    }
                ]
            }
        ]
    },
    event356:
    {
        description: function()
        {
            player.addItem("Crushed Lettuce");
            return "You go without much care for what you step on. And, of course, you end up stepping on the lettuce. Twice. This time you definitely did not manage to win them over. They say good-bye in a cold tone and lead you to the eastern door. Oh, and on top of that they give you two lettuces. The ones you stepped on. With a bang, they close the door behind you.<br /><br />[i]Crushed Lettuce[/i] added to your inventory.";
        },
        redirect: 141,
        new_room: true
    },
    event357:
    {
        description: "After some time, you notice a door on the west wall of the corridor.",
        yes_no_choice:
        {
            question: "Do you want to break the door down?",
            no: 108,
            no_new_room: false,
            yes: 245,
            yes_new_room: false
        }
    },
    event358:
    {
        description: function()
        {
            game_vars.setFlag("269_rope_present", false);
            let desc = "You attach the rope again and proceed to pull yourself forward. Out of nowhere, pillars of fire start shooting out of the fissure. ";
            if(game_vars.getFlag("358_elixir_present"))
            {
                player.removeItem("Elixir of Inviolability");
                desc += "You drink the elixir of inviolability. The fire can't hurt you. The magical effects of this potion only last until you reach the other edge.";
            }
            else
            {
                desc += "You have nothing that could protect you. A flame shoots right next to you, throwing you off the rope...";
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("358_elixir_present"))
            {
                return 343;
            }
            else
            {
                game_vars.setFlag("162_luck_check", player.performLuckCheck());
                return 162;
            }
        },
        new_room: false
    },
    event359:
    {
        description: function()
        {
            let desc = "";
            let pranksters_left = game_vars.getCounter("pranksters_left");
            for(let i = 0; i < 2; ++i)
            {
                desc += "You aim at prankster no. " + pranksters_left + ".<br />";
                let result = system.rollD6(1);
                if(result === 5)
                {
                    --pranksters_left;
                    desc += "You hit him! He's dead meat.<br /><br />";
                }
                else
                {
                    desc += "As your sword was approaching his head, he disappeared.<br /><br />";
                }
            }
            game_vars.setCounter("pranksters_left", pranksters_left);

            desc += "You decide to back off.";
            return desc;
        },
        redirect: 26,
        new_room: false
    },
    event360:
    {
        description: "A short corridor leads to a door.",
        redirect: 135,
        new_room: false
    },
    event362:
    {
        description: "The grateful monster reveals a secret to you. In the stone box on the altar, there is an enchanted emerald. It's owner can gain the Gift of Flight, although it only works once. But you must be careful: you're not allowed to touch the emerald. You must tilt the box and drop the gem straight to your backpack.",
        yes_no_choice:
        {
            question: "Do you trust the monster?",
            no: 72,
            no_new_room: false,
            yes: 263,
            yes_new_room: false
        }
    },
    event363:
    {
        description: "A long corridor leads you straight to the [c]north[/c]. After some time, you notice an intersection ahead.",
        north: 170
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
    event365:
    {
        description: function()
        {
            if(game_vars.getCounter("lake_crossed") % 2 === 0)
            {
                return "You are now on the side you originally came from.";
            }
            else
            {
                return "You are now on the side you didn't originally come from.";
            }
        },
        redirect: function()
        {
            if(game_vars.getCounter("lake_crossed") % 2 === 0)
            {
                return 15;
            }
            else
            {
                return 195;
            }
        },
        new_room: false
    },
    event366:
    {
        description: "In the wall next to the entrance you came through, there is a lock.",
        yes_no_choice:
        {
            question: "Would you like to try using your newfound key?",
            no: 278,
            no_new_room: false,
            yes: 131,
            yes_new_room: false
        }
    },
    event367:
    {
        description: "The [e]Evil[/e] is taken over in a joyous frenzy at winning all of your money. You launch an assault.",
        redirect: 189,
        new_room: false,
        enemies:
        [
            {
                name: "Evil",
                agility: 6,
                constitution: 6,
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            game_vars.incrementCounter("189_evils_left", -1);
                            game_vars.incrementCounter("156_evils_defeated", +1);
                        }
                    }
                ]
            }
        ]
    },
    event368:
    {
        description: "You walk a few steps and the corridor turns north. After some time, you can hear cackling. You stick your ear to the eastern wall. It's true, someone is dying from laughter.",
        yes_no_choice:
        {
            question: "Would you like to look for a secret entrance?",
            no: 354,
            no_new_room: true,
            yes: 87,
            yes_new_room: false
        }
    },
    event369:
    {
        description: function()
        {
            player.removeItem("Wooden Stake");
            player.addItem("Toy Dragon");
            return "You give him the stake and take his toy dragon.";
        },
        redirect: 121,
        new_room: false
    },
    event370:
    {
        description: function()
        {
            player.modifyConstitution(-player.getConstitution());
            return "This is the end of your adventure. The red abyss engulfs you.";
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
    event372:
    {
        description: "You leave the room through the only door here - the one you came through.",
        redirect: 253,
        new_room: false
    },
    event374:
    {
        description: "This isn't a corridor - it feels more like a sewer. Your legs sink into some muddy substance. The tunnel changes direction: It turns south first, then east, then finally [c]north[/c]. You may [c]eat[/c] a ration while you navigate through the twists.",
        north: 178,
        eat: true
    },
    event375:
    {
        description: "You can try and [o]negotiate[/o] a higher price. You can [o]attack[/o] the creature to see if it's hiding even more gold. Or, if you just don't want gold, you can just [o]rest[/o].",
        choice:
        {
            question: "What's your decision?",
            options:
            [
                {
                    choice: "attack",
                    redirect: 223,
                    new_room: false
                },
                {
                    choice: "negotiate",
                    redirect: 246,
                    new_room: false
                },
                {
                    choice: "rest",
                    redirect: 81,
                    new_room: false
                }
            ]
        }
    },
    event376:
    {
        description: function()
        {
            player.modifyAgility(+1);
            player.modifyLuck(+2);
            return "The door opens on its own. You gain 1 Agility and 2 Luck.";
        },
        redirect: 16,
        new_room: true
    },
    event377:
    {
        description: function()
        {
            player.removeItem("Net");
            let desc = "You quickly pull a net out of your backpack. You spin it above your head and throw it at the monster. You succeed - the monster is now trapped. ";

            if(game_vars.getFlag("377_wooden_stake_available"))
            {
                player.removeItem("Wooden Stake");
                desc += "You throw your wooden stake at it, and it dies immediately.";
            }
            else
            {
                desc += "However, you don't have anything you could use to finish it off. It quickly bites through the net and frees itself. Now it's running towards you! ";

                if(player.hasItem("Bone Hunting Dagger") || player.hasItem("Heavy Hammer") ||
                   player.hasItem("Metal Shield") || player.hasItem("Bunch of Keys"))
                {
                    desc += "As the sword and net proved ineffective, you may use another weapon.";
                }
                else
                {
                    desc += "You have nothing else to attack the [e]Werewolf[/e] with - save yourself and [c]escape[/e].";
                }
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("377_wooden_stake_available"))
            {
                return 32;
            }
            else if(player.hasItem("Bone Hunting Dagger") || player.hasItem("Heavy Hammer") ||
                    player.hasItem("Metal Shield") || player.hasItem("Bunch of Keys"))
            {
                return 63;
            }
            else
            {
                return undefined;
            }
        },
        escape_redirect: function()
        {
            if(game_vars.getFlag("377_wooden_stake_available") ||
               player.hasItem("Bone Hunting Dagger") || player.hasItem("Heavy Hammer") ||
               player.hasItem("Metal Shield") || player.hasItem("Bunch of Keys"))
            {
                return undefined;
            }
            else
            {
                return 275;
            }
        }
    },
    event378:
    {
        description: "After a while, you reach a T-shaped intersection, of which the third branch leads south. After some time, it changes directions again and leads west. You reach a thick door and [l]open[/l] it.",
        locals:
        [
            {
                command: "open",
                redirect: 13,
                new_room: true
            }
        ]
    },
    event379:
    {
        description: function()
        {
            let desc = "\"Death or information\" you threaten the [e]Giant[/e]. ";
            if(game_vars.getFlag("379_giant_persuaded"))
            {
                desc += "It agrees to help you out.";
            }
            else
            {
                desc += "It's not listening, you have to keep fighting.";
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("379_giant_persuaded"))
            {
                return 347;
            }
            else
            {
                return 86;
            }
        },
        new_room: false
    },
    event380:
    {
        description: function()
        {
            player.modifyAgility(+1);
            return "You can now [l]search[/l] the room or [l]leave[/l]. You receive 1 Agility to reward your bravery.";
        },
        locals:
        [
            {
                command: "leave",
                redirect: 372,
                new_room: true
            },
            {
                command: "search",
                redirect: 118,
                new_room: false
            }
        ]
    },
    event381:
    {
        description: function()
        {
            let desc = "You decide to rely on luck...<br /><br />";
            if(game_vars.getFlag("381_luck_check"))
            {
                desc += "Luck check successful!";
            }
            else
            {
                desc += "Luck check failed!";
            }

            return desc;
        },
        redirect: function()
        {
            if(game_vars.getFlag("381_luck_check"))
            {
                return 28;
            }
            else
            {
                return 291;
            }
        },
        new_room: false
    },
    event382:
    {
        description: "At some point the corridor turns to the [c]north[/c]. At the turn, you may [c]eat[/c] a ration.",
        north: 134,
        eat: true
    },
    event383:
    {
        description: "You become agitated. You grab your sword and attack.",
        redirect: 318,
        new_room: false
    },
    event384:
    {
        description: "50 steps ahead, then turn left (to the [c]north[/c] and take 30 steps.",
        north: 221
    },
    event385:
    {
        description: "You can exit the [e]Demon[/e]'s chamber through the [c]east[/c] or [c]west[/c] door.",
        east: function()
        {
            game_vars.setFlag("242_luck_check", player.performLuckCheck());
            return 242;
        },
        west: 194
    },
    event386:
    {
        description: "You approach an intersection. You may go [c]west[/c] or [c]east[/c].",
        east: 273,
        west: 345
    }
};
