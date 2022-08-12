#include "savestatemanager.h"
#include <sstream>
#include <QTextStream>
#include <QDataStream>

#include "Models/gamestate.h"

SaveStateManager::SaveStateManager():
    _save_dir("save"),
    _save_file_contents("")
{
}

void SaveStateManager::initDirectories()
{
    if(!_save_dir.exists())
    {
        if(!_save_dir.mkpath("."))
        {
            throw std::system_error(std::make_error_code(std::errc::io_error),
                                    "Save directory cannot be created.");
        }
    }
}

bool SaveStateManager::saveFileExists(const std::string& save_slot) const
{
    QString fullFilePath = _save_dir.absolutePath() + "/" + QString::fromStdString(save_slot);
    QFile save_file(fullFilePath);
    return save_file.exists();
}

std::string SaveStateManager::listSaveFiles() const
{
    QStringList save_list = _save_dir.entryList(QDir::Files | QDir::NoDotAndDotDot);
    return save_list.join("\n").toStdString();
}

void SaveStateManager::createSaveFileContents(const GameState& game_state)
{
    std::ostringstream ss;

    // Player stats.
    ss << game_state._player_agility << "\n"
       << game_state._player_constitution << "\n"
       << game_state._player_luck << "\n"
       << game_state._player_start_agility << "\n"
       << game_state._player_start_constitution << "\n"
       << game_state._player_start_luck << "\n"
       << game_state._player_gold << "\n"
       << game_state._player_rations << "\n"
       << game_state._player_elixir_count << "\n"
       << game_state._player_elixir_type << "\n"
       << "INVENTORY_START\n"
       << game_state._player_inventory << "\n"
       << "INVENTORY_END\n";

    // Current event description.
    ss << game_state._event_id << "\n"
       << game_state._event_enemy_present << "\n";
    if(game_state._event_enemy_present)
    {
       ss << game_state._event_enemy_name << "\n"
          << game_state._event_enemy_constitution << "\n";
    }
    ss << game_state._event_items_present << "\n";
    if(game_state._event_items_present)
    {
       ss << game_state._event_item_limit << "\n";
    }

    // Combat status.
    ss << game_state._combat_in_progress << "\n";
    if(game_state._combat_in_progress)
    {
        ss << game_state._combat_round << "\n"
           << game_state._combat_enemy_score << "\n"
           << game_state._combat_player_score << "\n";
    }

    // Console log.
    ss << "LOG_START\n"
       << game_state._log
       << "LOG_END\n";

    // Game variables.
    ss << "VARS_START\n"
       << game_state._variables
       << "VARS_END\n";

    _save_file_contents = ss.str();
}

GameState SaveStateManager::parseSaveFileContents()
{
    std::istringstream ss(_save_file_contents);
    GameState game_state = {};

    ss >> game_state._player_agility
       >> game_state._player_constitution
       >> game_state._player_luck
       >> game_state._player_start_agility
       >> game_state._player_start_constitution
       >> game_state._player_start_luck
       >> game_state._player_gold
       >> game_state._player_rations
       >> game_state._player_elixir_count
       >> game_state._player_elixir_type;
    ss.get(); // eat the final newline

    std::string line;
    std::getline(ss, line);
    if(line != "INVENTORY_START")
    {
        throw std::runtime_error("Corrupted savefile. Error code: 9545");
    }
    game_state._player_inventory = "";
    bool first = true;
    for(;;)
    {
        std::getline(ss, line);
        if(line == "INVENTORY_END")
        {
            break;
        }
        else
        {
            if(!first)
            {
                game_state._player_inventory += "\n";
            }
            else
            {
                first = false;
            }
            game_state._player_inventory += line;
        }
    }

    ss >> game_state._event_id
       >> game_state._event_enemy_present;
    ss.get(); // eat the final newline
    if(game_state._event_enemy_present)
    {
        std::getline(ss, game_state._event_enemy_name);
        ss >> game_state._event_enemy_constitution;
    }

    ss >> game_state._event_items_present;
    if(game_state._event_items_present)
    {
        ss >> game_state._event_item_limit;
    }

    ss >> game_state._combat_in_progress;
    if(game_state._combat_in_progress)
    {
        ss >> game_state._combat_round
           >> game_state._combat_enemy_score
           >> game_state._combat_player_score;
    }
    ss.get(); // eat the final newline

    std::getline(ss, line);
    if(line != "LOG_START")
    {
        throw std::runtime_error("Corrupted savefile. Error code: 3670");
    }
    game_state._log = "";
    for(;;)
    {
        std::getline(ss, line);
        if(line == "LOG_END")
        {
            break;
        }
        else
        {
            game_state._log += line;
            game_state._log += "\n";
        }
    }

    std::getline(ss, line);
    if(line != "VARS_START")
    {
        throw std::runtime_error("Corrupted savefile. Error code: 4190");
    }
    game_state._variables = "";
    first = true;
    for(;;)
    {
        std::getline(ss, line);
        if(line == "VARS_END")
        {
          break;
        }
        else
        {
            if(!first)
            {
              game_state._variables += "\n";
            }
            else
            {
              first = false;
            }
            game_state._variables += line;
        }
    }

    return game_state;
}

void SaveStateManager::deleteSaveFile(const std::string& save_slot)
{
    QString fullFilePath = _save_dir.absolutePath() + "/" + QString::fromStdString(save_slot);
    QFile save_file(fullFilePath);
    if(!save_file.remove())
    {
        throw std::system_error(std::make_error_code(std::errc::io_error), "File cannot be deleted");
    }
}

void SaveStateManager::loadSaveFile(const std::string& save_slot)
{
    QString fullFilePath = _save_dir.absolutePath() + "/" + QString::fromStdString(save_slot);
    QFile save_file(fullFilePath);
    if(!save_file.open(QIODevice::ReadOnly))
    {
        throw std::system_error(std::make_error_code(std::errc::io_error), "File cannot be opened");
    }

#ifdef DEBUG_SAVE
    QTextStream ts(&save_file);
    _save_file_contents = ts.readAll().toStdString();
#else
    QDataStream ds(&save_file);
    QString contents = "";
    ds >> contents;
    _save_file_contents = contents.toStdString();
#endif

    save_file.close();
}

void SaveStateManager::saveCurrentGameState(const std::string& save_slot)
{
    QString fullFilePath = _save_dir.absolutePath() + "/" + QString::fromStdString(save_slot);
    QFile save_file(fullFilePath);
    if(!save_file.open(QIODevice::WriteOnly))
    {
        throw std::system_error(std::make_error_code(std::errc::io_error), "File cannot be opened");
    }

#ifdef DEBUG_SAVE
    QTextStream ts(&save_file);
    ts << QString::fromStdString(_save_file_contents);
#else
    QDataStream ds(&save_file);
    ds << QString::fromStdString(_save_file_contents);
#endif

    save_file.close();
}
