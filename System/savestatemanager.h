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
    void initDirectories();

    bool saveFileExists(const std::string& save_slot) const;
    std::string listSaveFiles() const;

    void createSaveFileContents(const GameState& game_state);
    GameState parseSaveFileContents();

    void deleteSaveFile(const std::string& save_slot);
    void loadSaveFile(const std::string& save_slot);
    void saveCurrentGameState(const std::string& save_slot);
};

#endif // SAVESTATEMANAGER_H
