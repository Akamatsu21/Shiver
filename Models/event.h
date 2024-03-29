#ifndef EVENT_H
#define EVENT_H

#include <string>
#include <map>
#include <queue>

#include "choice.h"
#include "enemy.h"
#include "quiz.h"
#include "Enums/direction.h"

class Event
{
    int _id;
    int _redirect;
    bool _new_room;
    int _escape_redirect;
    std::string _description;
    std::map<Direction, int> _destinations;
    QJSValue _direction_callback;
    std::queue<Enemy> _enemies;
    int _gold;
    bool _has_gold;
    int _rations;
    bool _has_rations;
    std::vector<std::string> _items;
    int _item_limit;
    bool _eating_enabled;
    QJSValue _eating_callback;
    Choice _choice;
    Quiz _quiz;
    std::map<std::string, UserOption> _local_commands;
    QJSValue _exit_callback;

public:
    Event(int id);

    int getId() const;
    int getRedirect() const;
    bool leadsToNewRoom() const;
    int getEscapeRedirect() const;
    std::string getDescription() const;
    int getDestination(Direction direction) const;
    bool isDirectionAvailable(Direction direction) const;
    bool hasEnemies() const;
    bool hasGold() const;
    int getGold() const;
    bool hasRations() const;
    int getRations() const;
    bool hasItems() const;
    bool hasItem(const std::string& item) const;
    std::string getItemList() const;
    std::string findItem(const std::string& item) const;
    int getItemLimit() const;
    bool isEatingEnabled() const;
    bool hasEatingCallback() const;
    bool hasYesNoChoice() const;
    bool hasMultiChoice() const;
    std::string getChoiceQuestion() const;
    std::vector<std::string> getChoiceOptions() const;
    UserOption getChoiceOption(const std::string& option) const;
    bool hasQuiz() const;
    std::string getQuizQuestion() const;
    std::vector<std::string> getQuizAnswers() const;
    UserOption getQuizCorrectOption() const;
    UserOption getQuizIncorrectOption() const;
    bool hasLocalCommands() const;
    std::vector<std::string> getLocalCommands() const;
    UserOption getLocalCommand(const std::string& command) const;

    void setRedirect(int value);
    void setNewRoom(bool value);
    void setEscapeRedirect(int value);
    void setDescription(const std::string& value);
    void setDestination(Direction direction, int destination);
    void setDirectionCallback(QJSValue callback);
    void setHasGold(bool value);
    void setGold(int value);
    void setHasRations(bool value);
    void setRations(int value);
    void setItemLimit(int value);
    void setEatingEnabled(bool value);
    void setEatingCallback(QJSValue callback);
    void setExitCallback(QJSValue callback);

    Enemy getCurrentEnemy() const;
    Enemy& getCurrentEnemy();
    void addEnemy(const std::string& name,
                  int agility,
                  int constitution,
                  bool escape_enabled,
                  int escape_redirect,
                  bool invincible,
                  const std::vector<Callback>& callbacks);
    void defeatCurrentEnemy();
    void defeatAllEnemies();

    void addItem(const std::string& item);
    void takeItem();

    void setChoice(ChoiceType type, const std::string& question);
    void addChoiceOption(const std::string& answer, int redirect, bool new_room, QJSValue callback);
    void triggerChoiceOptionCallback(const std::string& option);

    void setQuizQuestion(const std::string& question);
    void addQuizAnswer(const std::string& answer);
    void setQuizCorrectOption(int redirect, bool new_room, QJSValue callback);
    void setQuizIncorrectOption(int redirect, bool new_room, QJSValue callback);
    void triggerQuizCorrectCallback();
    void triggerQuizIncorrectCallback();

    void addLocalCommand(const std::string& command, int redirect, bool new_room, QJSValue callback);
    void triggerLocalCommandCallback(const std::string& command);

    void triggerDirectionCallback(Direction direction);
    void triggerEatingCallback();
    void triggerExitCallback();
};

#endif // EVENT_H
