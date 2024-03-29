export const eventX =
{
    description: "Description of the event, and also a place to put the function that executes on entry.",
    redirect: 20,   // Automatically moves to that event - movement commands redundant
    new_room: true, // if false, won't clear screen
    escape_redirect: 10,    // Destination of the escape command
    north: 1,   // destination of the north command
    south: 2,   // destination of the south command
    east: 3,    // destination of the east command
    west: 4,    // destination of the west command
    on_direction: function(direction)
    {
        // Trigger when choosing one of the direction commands
        // Use the provided argument to check which direction was selected
    },
    enemies:
    [
        {
            name: "Enemy Name",
            agility: 10,
            constitution: 10,
            escape_redirect: 50,
            invincible: true,   // Won't lose any constitution
            callbacks:
            [
                {
                    timing: CallbackTiming.RoundEnd,
                    round: 1,   // 0 means every round
                    callback: function()
                    {
                        // Trigger to execute on end of round 1.
                    }
                },
                {
                    timing: CallbackTiming.RoundStart,
                    round: 3,   // 0 means every round
                    callback: function()
                    {
                        // Trigger to execute on start of round 3.
                    }
                },
                {
                    timing: CallbackTiming.CombatEnd,
                    callback: function()
                    {
                        // Trigger to execute on defeat.
                        // This will not trigger when escaping or ending combat through the system.stopCombat() function.
                    }
                }
            ]
        }
    ],
    gold: 100,  // collected with the "take gold" command
    rations: 1, // collected with the "take ration" command
    items:      // collected with the take command
    [
        "Item1",
        "Item2"
    ],
    item_limit: 1,  // only one of the items from the list can be taken
    eat: true,  // can use the eat command
    on_eat: function()
    {
        // Trigger to execute instead of the normal eat command.
    },
    yes_no_choice:
    {
        question: "Make a choice",
        no: 11,
        no_new_room: true,
        on_no: function()
        {
            // Trigger to execute on no.
        },
        yes: 12,
        yes_new_room: false,
        on_yes: function()
        {
            // Trigger to execute on yes.
        },
    },
    choice:
    {
        question: "What do you choose?",
        options:
        [
            {
                answer: "option1",
                redirect: 13,
                new_room: false
            },
            {
                answer: "option2",
                redirect: 14,
                new_room: true,
                on_option: function()
                {
                    // Trigger to execute on option selected.
                }
            }
        ]
    },
    locals:
    [
        {
            command: "local_command",
            redirect: 100,
            new_room: true,
            on_command: function()
            {
                // Trigger to execute on command typed.
            }
        }
    ],
    on_exit: function()
    {
        // Trigger to execute on room exit.
    },
    quiz:
    {
        question: "What do you thing the answer is?",
        answers:
        [
            "correct1",
            "correct2"
        ],
        correct: 10,
        correct_new_room: true,
        on_correct: function()
        {
            // Trigger to execute if user gave one of the accepted answers.
        },
        incorrect: 13,
        incorrect_new_room: true,
        on_incorrect: function()
        {
            // Trigger to execute if user gave a wrong answer.
        }
    }
};