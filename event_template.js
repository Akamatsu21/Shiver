eventX:
{
    description: "Description of the event, and also a place to put the function that executes on entry.",
    redirect: 20, // Automatically moves to that event - movement commands redundant
    new_room: true, // if false, won't clear screen
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
            on_death: function()
            {
                // Trigger to execute on death.
            },
            on_round_end:
            [
                {
                    round: 1,
                    callback: function()
                    {
                        // Trigger to execute on end of round 1.
                    }
                }
            ]
        }
    ],
    gold: 100,
    items:
    [
        "Item1",
        "Item2"
    ],
    item_limit: 1,
    rations: true,
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
    ]
}