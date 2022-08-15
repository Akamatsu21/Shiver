#include "console.h"
#include <algorithm>
#include <iostream>
#include <limits>
#include <sstream>

#include "Utils/utils.h"

Console::Console(QObject* parent):
    QObject(parent),
    _log(""),
    _visible_text(""),
    _waiting_for_input(false),
    _waiting_for_return(false),
    _help_visible(false)
{

}

std::string Console::getLogContents() const
{
    return _log;
}

QString Console::getVisibleText() const
{
    return _visible_text;
}

bool Console::isWatingForInput() const
{
    return _waiting_for_input;
}

bool Console::isWatingForReturn() const
{
    return _waiting_for_return;
}

bool Console::isHelpVisible() const
{
    return _help_visible;
}

void Console::setLog(const std::string& value)
{
    _log = value;
}

void Console::setWaitingForInput(bool value)
{
    if(_waiting_for_input != value)
    {
        _waiting_for_input = value;
        emit waitingForInputChanged();
    }
}

void Console::setWaitingForReturn(bool value)
{
    if(_waiting_for_return != value)
    {
        _waiting_for_return = value;
        emit waitingForReturnChanged();
    }
}

void Console::setHelpVisible(bool value)
{
    if(_help_visible != value)
    {
        _help_visible = value;
        emit helpVisibleChanged();
    }
}

std::string Console::replaceTag(const std::string& text,
                                const std::string& open_tag,
                                const std::string& close_tag,
                                const std::string& colour_code) const
{
    std::stringstream ss;
    std::string buffer = text;
    std::string::iterator open_tag_pos = std::search(std::begin(buffer), std::end(buffer),
                                                     std::begin(open_tag), std::end(open_tag));
    while(open_tag_pos != std::end(buffer))
    {
        std::string::iterator close_tag_pos = std::search(open_tag_pos, std::end(buffer),
                                                          std::begin(close_tag), std::end(close_tag));
        ss << std::string(std::begin(buffer), open_tag_pos)
           << colour_code
           << std::string(open_tag_pos + open_tag.length(), close_tag_pos)
           << "</font>"
           << std::string(close_tag_pos + close_tag.length(), std::end(buffer));

        buffer = ss.str();
        ss.str("");
        open_tag_pos = std::search(std::begin(buffer), std::end(buffer),
                                   std::begin(open_tag), std::end(open_tag));
    }

    return buffer;
}

std::string Console::parseMarkup(const std::string& text) const
{
    std::string buffer = text;
    buffer = replaceTag(buffer, "[e]", "[/e]", "<font color=\"red\">"); // enemy name
    buffer = replaceTag(buffer, "[c]", "[/c]", "<font color=\"green\">"); // command
    buffer = replaceTag(buffer, "[i]", "[/i]", "<font color=\"blue\">"); // item
    buffer = replaceTag(buffer, "[l]", "[/l]", "<font color=\"yellow\">"); // local command
    buffer = replaceTag(buffer, "[o]", "[/o]", "<font color=\"purple\">"); // option
    buffer = replaceTag(buffer, "[p]", "[/p]", "<font color=\"cyan\">"); // player name
    return buffer;
}

void Console::clearVisibleText()
{
    _visible_text = "";
    emit visibleTextChanged();
}

void Console::clearScreen()
{
    clearVisibleText();
    _log = "";
}

void Console::restoreLog()
{
    _visible_text = QString::fromStdString(_log);
    emit visibleTextChanged();
}

void Console::showHelpPage(int page_number, int total_pages, const std::string& text)
{
    clearVisibleText();
    std::string page = utils::createString(parseMarkup(text),
                                           "<br/><br />Page ", page_number, "/", total_pages,
                                           "<br />Use arrow keys to navigate the pages.",
                                           "<br />Press escape to exit.");
    _visible_text = QString::fromStdString(page);
    emit visibleTextChanged();
}

void Console::writeError(const std::string& error)
{
    _log += "<font color=\"red\">" + error + "</font><br />";
    restoreLog();
}

void Console::writeLine()
{
    _log += "<br />";
    restoreLog();
}

void Console::writeText(const std::string &text)
{
    std::string parsed_text = parseMarkup(text);
    _log += parsed_text + "<br />";
    restoreLog();
}

void Console::obtainUserInput(const QString& input)
{
    setWaitingForInput(false);
    writeText("<br /><font color=\"gold\">></font> " + input.toStdString());
    emit inputReady(input);
}

void Console::obtainReturn()
{
    setWaitingForReturn(false);
    writeLine();
    emit returnReady();
}
