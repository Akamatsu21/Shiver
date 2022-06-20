export const events =
{
    event1:
    {
        description: "Starting room",
        north: 2
    },
    event2:
    {
        description: "Cave",
        south: 1,
        west: 3,
        east: 4
    },
    event3:
    {
        description: "Enemy fight",
        east: 2,
        enemies: [
            {
                name: "Orc",
                agility: 5,
                constitution: 10
            }
        ]
    },
    event4:
    {
        description: "Dead end",
        west: 2,
        enemies: [
            {
                name: "Goblin",
                agility: 1,
                constitution: 1
            },
            {
                name: "Griffon",
                agility: 20,
                constitution: 60
            }
        ]
    }
};
