#include "savestatemanager.h"
#include <sstream>
#include <QTextStream>

#include "Models/gamestate.h"

SaveStateManager::SaveStateManager():
    _save_dir("save"),
    _save_file_contents("")
{
    if(!_save_dir.exists())
    {
        bool result = _save_dir.mkdir(".");
        assert(result);
    }
}

bool SaveStateManager::saveFileExists(const std::string& save_slot) const
{
    QString fullFilePath(_save_dir.absolutePath() + "/" + QString::fromStdString(save_slot));
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
    std::ostringstream ss("");

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
    std::string log = game_state._log;
    size_t pos = log.find("\n\033[33m>\033m[0m save\n");
    if(pos != std::string::npos)
    {
        log = log.substr(0, pos);
    }
    ss << "LOG_START\n"
       << game_state._log
       << "LOG_END\n";

    _save_file_contents = ss.str();
}

GameState SaveStateManager::parseSaveFileContents()
{
    QString save_file(QString::fromStdString(_save_file_contents));
    QTextStream ts(&save_file);
    GameState game_state{};

    game_state._player_agility = ts.readLine().toInt();
    game_state._player_constitution = ts.readLine().toInt();
    game_state._player_luck = ts.readLine().toInt();
    game_state._player_start_agility = ts.readLine().toInt();
    game_state._player_start_constitution = ts.readLine().toInt();
    game_state._player_start_luck = ts.readLine().toInt();
    game_state._player_gold = ts.readLine().toInt();
    game_state._player_rations = ts.readLine().toInt();
    game_state._player_elixir_count = ts.readLine().toInt();
    game_state._player_elixir_type = ts.readLine().toInt();

    QString line = ts.readLine();
    assert(line == "INVENTORY_START");
    game_state._player_inventory = "";
    for(;;)
    {
        if(line != "INVENTORY_START")
        {
            game_state._player_inventory += "\n";
        }

        line = ts.readLine();
        if(line == "INVENTORY_END")
        {
            break;
        }
        else
        {
            game_state._player_inventory += line.toStdString();
        }
    }

    game_state._event_id = ts.readLine().toInt();
    bool enemy_present = ts.readLine().toInt() != 0;
    game_state._event_enemy_present = enemy_present;
    if(enemy_present)
    {
        game_state._event_enemy_name = ts.readLine().toStdString();
        game_state._event_enemy_constitution = ts.readLine().toInt();
    }

    bool items_present = ts.readLine().toInt() != 0;
    game_state._event_items_present = items_present;
    if(items_present)
    {
        game_state._event_item_limit = ts.readLine().toInt();
    }

    bool combat_in_progress = ts.readLine().toInt() != 0;
    game_state._combat_in_progress = combat_in_progress;
    if(combat_in_progress)
    {
        game_state._combat_round = ts.readLine().toInt();
        game_state._combat_enemy_score = ts.readLine().toInt();
        game_state._combat_player_score = ts.readLine().toInt();
    }

    line = ts.readLine();
    assert(line == "LOG_START");
    game_state._log = "";
    for(;;)
    {
        if(line != "LOG_START")
        {
            game_state._log += "\n";
        }

        line = ts.readLine();
        if(line == "LOG_END")
        {
            break;
        }
        else
        {
            game_state._log += line.toStdString();
        }
    }

    return game_state;
}

void SaveStateManager::deleteSaveFile(const std::string& save_slot)
{
    QString fullFilePath(_save_dir.absolutePath() + "/" + QString::fromStdString(save_slot));
    QFile save_file(fullFilePath);
    bool result = save_file.remove();
    assert(result);
}

void SaveStateManager::loadSaveFile(const std::string& save_slot)
{
    QString fullFilePath(_save_dir.absolutePath() + "/" + QString::fromStdString(save_slot));
    QFile save_file(fullFilePath);
    if(!save_file.open(QIODevice::ReadOnly))
    {
        throw std::system_error(std::make_error_code(std::errc::io_error), "File cannot be opened");
    }

    QTextStream ts(&save_file);
    _save_file_contents = ts.readAll().toStdString();
    save_file.close();
}

void SaveStateManager::saveCurrentGameState(const std::string& save_slot)
{
    QString fullFilePath(_save_dir.absolutePath() + "/" + QString::fromStdString(save_slot));
    QFile save_file(fullFilePath);
    if(!save_file.open(QIODevice::WriteOnly))
    {
        throw std::system_error(std::make_error_code(std::errc::io_error), "File cannot be opened");
    }

    QTextStream ts(&save_file);
    ts << QString::fromStdString(_save_file_contents);
    save_file.close();
}
