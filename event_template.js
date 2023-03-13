eventX:
{
    description: "Description of the event, and also a place to put the function that executes on entry.",
    redirect: 20, // Automatically moves to that event - movement commands redundant
    new_room: true, // if false, won't clear screen
    escape_redirect: 10,
    north: 1,
    south: 2,
    east: 3,
    west: 4,
    enemies:
    [
        {
            name: "Enemy Name",
            agility: 10,
            constitution: 10,
            escape_redirect: 50,
            callbacks:
            [
                {
                    timing: CallbackTiming.RoundEnd,
                    round: 1,
                    callback: function()
                    {
                        // Trigger to execute on end of round 1.
                    }
                },
                {
                    timing: CallbackTiming.RoundStart,
                    round: 3,
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
    gold: 100,
    rations: 1,
    items:
    [
        "Item1",
        "Item2"
    ],
    item_limit: 1,
    eat: true,
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
    }
}