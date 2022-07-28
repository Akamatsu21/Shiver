export const help_pages =
[
	"----------\n|COMMANDS|\n----------\n\n\nYou are an Adventurer trying to reach the treasure in the depths of a dungeon.\nDuring the game, you will explore the dungeon and move between rooms using directional commands: [c]north[/c], [c]south[/c], [c]east[/c], [c]west[/c]. Each location will specify which directions are available for travel.\n\nYour basic equipment includes: a sword, a shield, backpack with rations, and a lantern. Travelling through the dungeon you will find other types of weapons and items, which will be highlighted in [i]blue[/i]. When you encounter one of those, use the [c]take[/c] command followed by the name of the item to pick it up. Remember that each weapon other than the sword can be used only once. Likewise, all the items you find are singular use only. You can view your equipment at any point by entering the [c]stats[/c] command.\n\nYour backapck contains 8 rations. You can consume them using the [c]eat[/c] command to restore 4 Constitution. This command is only enabled in certain rooms, and you can only eat once per room (if you re-enter the room, you can eat again).\n\nYou have one bottle containing an elixir. When creating your character, you have to choose between the Elixir of Agility, Constitution or Luck. You can drink it at any time by entering the [c]drink[/c] command, but you only have enough to drink twice throughout the whole adventure.",

	"-------\n|STATS|\n-------\n\n\nYour statistics include Agility, Constitution and Luck. When creating your character, the starting level of each statistic will be determined randomly. Your statistics will keep changing throughout your journey, but they can never exceed the starting level. You can view your statistics at any point by entering the [c]stats[/c] command.\n\n1) Agility\n* Used to determine your combat strength.\n* Generally won't change very often.\n* You may occasionally lose Agility due to rough fighting conditions.\n* You can regain Agility by using magic weapons or performing heroic feats.\n* Elixir of Agility will restore your Agility back to the starting value.\n\n2) Constitution\n* Represents your character's health.\n* Will constantly change as you play the game. \n* You will inevitably lose Constitution during battles.\n* You may regain Constitution by eating a ration (you start the game with 8 of them).\n* Elixir of Constitution will restore your Constitution back to the starting value.\n\n3) Luck\n* Determines how likely you are to get lucky throughout the game.\n* Your luck will decrease with every luck check, regardless of whether it was successful.\n* Certain lucky events may restore your Luck.\n* Elixir of Luck will increase your Luck's starting value by 1, and then restore your Luck to the new starting value. This is the only instance where a stat can exceed its original starting value.",

	"--------\n|COMBAT|\n--------\n\n\nYou will fight many monsters. Their stats (Agility and Constitution) will be given at the beginning of combat. The combat system works as follows:\n1) Both the enemy and player roll their combat scores. The combat score is rolled by the game automatically. The combat score is equal to Agility + 2d6.\n2) If the scores are equal, the game will reroll until they are different. The character with the higher score will be the one that deals damage this round.\n3) You enter a command to resolve this round of combat. You have two main options for commands you can enter.\n\t* Using the [c]fight[/c] command resolves the combat round normally. The winner deals 2 damage to the loser's Constitution.\n\t* Using the [c]lucky[/c] command allows you to perform a luck check to take a chance to deal more damage or receive less damage, depending on whether you won or lost. Luck checks are explained on page 5.\n4) Repeat steps 1-3 until one of the characters dies by reaching 0 Constitution.\nYou must fight if you encounter an enemy, unless the game allows you to escape.",

	"--------\n|ESCAPE|\n--------\n\n\nIn some fights the game will give you an option to run away from combat. In those fights, when you get an option to enter a command, you may enter [c]escape[/c], which will end the combat at the cost of losing 2 Constitution. You cannot avoid that damage, but you will have an option to perform a luck check to try to lower the damage.",

	"------\n|LUCK|\n------\n\n\nDuring your journey, there will be many times you will have to test your luck. The higher your Luck stat, the higher your chance to succeed. After every luck check, your Luck is decreased by 1.\n\nAt some points in the story, the game will automatically perform a luck check for you. You cannot avoid those.\nYou may also invoke a luck check by yourself during combat, by entering the [c]lucky[/c] command (see page 3). The luck check result will only apply to this one round of combat.\n1) If you won the round:\n1a) If the luck check succeeded, you deal 2 extra damage to the monster (4 damage in total).\n1b) If the luck check failed, you only deal 1 damage.\n2) If you lost the round:\n* If the luck check succeeded, you receive only 1 damage.\n* If the luck check failed, you receive 3 damage.",
]