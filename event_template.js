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
            death_text: "This is what you see when you beat it.",
            on_death: function()
            {
                // Trigger to execute on death.
            }
        }
    ],
    gold: 100,
    items:
    [
        "Item1",
        "Item2"
    ],
    item_limit: 1,
    yes_no_choice:
    {
        question: "Make a choice",
        no: 11,
        yes: 12
    },
    choice:
    {
        question: "What do you choose?",
        options:
        [
            {
                answer: "option1",
                redirect: 13
            },
            {
                answer: "option2",
                redirect: 14
            }
        ]
    },
    locals:
    [
        {
            command: "local_command",
            redirect: 100
        }
    ]
}