export const events =
{
    event1:
    {
        description: function()
        {
            return `Starting room.<br />Agility: ${PlayerStat.Agility}<br />Constitution: ${PlayerStat.Constitution}<br />Luck: ${PlayerStat.Luck}<br />CombatEnd: ${CallbackTiming.CombatEnd}`;
        },
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
        },
        south: 20
    },
    event2:
    {
        description: "Cave",
        north: 17,
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
                constitution: 6,
                escape_redirect: 2,
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            game_vars.incrementCounter("orc_kills", +1);
                        }
                    }
                ]
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
                constitution: 1,
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            system.message("Suddenly, you hear another monster approaching...");
                        }
                    }
                ]
            },
            {
                name: "Griffon",
                agility: 20,
                constitution: 60,
                callbacks:
                [
                    {
                        timing: CallbackTiming.RoundEnd,
                        round: 1,
                        callback: function()
                        {
                            system.enableEscape(2);
                        }
                    }
                ]
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
            let desc = "You encounter the [e]Kicker Troll[/e]. He kicks you in the nuts.<br />";
            if(player.hasItem("Cock Shield"))
            {
                desc += "Your shield protects you. You may proceed.";
            }
            else
            {
                desc += "You die.";
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
            let desc = "You find a decrepit old man sitting on a rock. He stares you down.<br />\"Have you been to the dead end up north?\" he asks.<br />";
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
            return "You approach a dodgy man, sitting at a table inside a cave.<br />\"I am the orc counting guy\" he introduces himself.<br />\"Thus far, in your adventure you have killed " + game_vars.getCounter("orc_kills") + " Orcs!\"";
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
            return "The fairy hands you a pot full of gold coins. It then bows and disappears.";
        },
        redirect: 11,
        new_room: true
    },
    event14:
    {
        description: function()
        {
            player.modifyConstitution(+100);
            return "The fairy performs a few mysterious gestures. You feel like you're in a trance. Your body feels lighter than air, and when you reconnect with reality you realise all your wounds have been healed, but the fairy is nowhere to be found.";
        },
        redirect: 11,
        new_room: true
    },
    event15:
    {
        description: function()
        {
            player.addItem("Magical Sword");
            return "The fairy hands you a huge sword covered in runes. You thank her and she bids you farewell.";
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
    },
    event17:
    {
        description: "You face a Triceratops!",
        enemies:
        [
            {
                name: "Triceratops",
                agility: 1,
                constitution: 4,
                callbacks:
                [
                    {
                        timing: CallbackTiming.CombatEnd,
                        callback: function()
                        {
                            if(system.getCurrentRound() % 2 == 0)
                            {
                                system.message("Defeated in an even number of rounds - you may proceed to the treasure!");
                                system.redirect(19, false);
                            }
                            else
                            {
                                system.message("Defeated in an odd number of rounds - you're going to hell!");
                                system.redirect(18, true);
                            }
                        }
                    }
                ]
            }
        ]
    },
    event18:
    {
        description: "You're in hell!",
        north: 18,
        south: 18,
        east: 18,
        west: 18
    },
    event19:
    {
        description: "You see a big pile of treasure. Feel free to take the [i]gold[/i].",
        gold: 100
    },
    event20:
    {
        description: "Choose status: [o]gloves[/o], [o]sword[/o], [o]fireball[/o], [o]goblin[/o], [o]helmet[/o].",
        choice:
        {
            question: "What do you choose?",
            options:
            [
                {
                    answer: "gloves",
                    redirect: 21,
                    new_room: false
                },
                {
                    answer: "goblin",
                    redirect: 22,
                    new_room: false
                },
                {
                    answer: "sword",
                    redirect: 23,
                    new_room: false
                },
                {
                    answer: "helmet",
                    redirect: 24,
                    new_room: false
                },
                {
                    answer: "fireball",
                    redirect: 25,
                    new_room: false
                }
            ]
        },
    },
    event21:
    {
        description: function()
        {
            player.addItem("Cursed Gloves (-1 Agility)");
            system.addCondition("cursed_gloves");
            return "The evil gloves imprison you! You will lose agility in your next battle.";
        },
        north: 26,
        south: 27
    },
    event22:
    {
        description: function()
        {
            system.addCondition("goblin_follower");
            return "A Goblin wants to help you in the next fight! He has 3 Agility.";
        },
        north: 26,
        south: 27
    },
    event23:
    {
        description: function()
        {
            player.addItem("Enchanted Sword (+1 Combat Score)");
            system.addCondition("enchanted_sword");
            return "This sword is better than your old one! It will improve your combat rolls.";
        },
        north: 26,
        south: 27
    },
    event24:
    {
        description: function()
        {
            player.addItem("Helmet (+3 Constitution)");
            system.addCondition("helmet");
            return "This is a tough helmet! It will give you more defense in your next fight.";
        },
        north: 26,
        south: 27
    },
    event25:
    {
        description: function()
        {
            player.addItem("Fireball");
            system.addCondition("fireball");
            return "You wield the power of the mighty fireball for one fight.";
        },
        north: 26,
        south: 27
    },
    event26:
    {
        description: "Time to fight!",
        north: 1,
        enemies:
        [
            {
                name: "Gorgonzola",
                agility: 100,
                constitution: 100,
                escape: 1
            }
        ]
    },
    event27:
    {
        description: "Time to fight!",
        north: 1,
        enemies:
        [
            {
                name: "Mozarella",
                agility: 1,
                constitution: 1,
                escape: 1
            }
        ]
    }
};
