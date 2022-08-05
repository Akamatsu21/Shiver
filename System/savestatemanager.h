#ifndef SAVESTATEMANAGER_H
#define SAVESTATEMANAGER_H

#include <string>
#include <QDir>

struct GameState;

class SaveStateManager
{
    QDir _save_dir;
    std::string _save_file_contents;

public:
    SaveStateManager();

    void createSaveFileContents(const GameState& game_state);
    void loadGameState(const std::string& save_slot);
    GameState parseSaveFileContents();
    void saveCurrentGameState(const std::string& save_slot);
};

#endif // SAVESTATEMANAGER_H
