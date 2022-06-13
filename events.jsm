export const events =
{
    event1:
    {
        description: "Starting room",
        north: 2,
        agility: "player.getAgility()"
    },
    event2:
    {
        description: "Cave",
        south: 1,
        west: 3,
        east: 4,
        agility: "player.getAgility()"
    },
    event3:
    {
        description: "Enemy fight",
        east: 2,
        agility: "player.getAgility()"
    },
    event4:
    {
        description: "Dead end",
        west: 2,
        agility: "player.getAgility()"
    }
};
