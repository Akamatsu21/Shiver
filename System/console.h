#ifndef CONSOLE_H
#define CONSOLE_H

#include <QObject>
#include <string>

class Console: public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString visibleText READ getVisibleText NOTIFY visibleTextChanged)
    Q_PROPERTY(bool waitingForInput READ isWatingForInput NOTIFY waitingForInputChanged)
    Q_PROPERTY(bool waitingForReturn READ isWatingForReturn NOTIFY waitingForReturnChanged)
    Q_PROPERTY(bool helpVisible READ isHelpVisible NOTIFY helpVisibleChanged)

    std::string _log;
    QString _visible_text;
    bool _waiting_for_input;
    bool _waiting_for_return;
    bool _help_visible;

    std::string replaceTag(const std::string& text,
                           const std::string& open_tag,
                           const std::string& close_tag,
                           const std::string& colour_code) const;
    std::string parseMarkup(const std::string& text) const;

    void clearVisibleText();

public:
    explicit Console(QObject* parent);

    std::string getLogContents() const;
    QString getVisibleText() const;
    bool isWatingForInput() const;
    bool isWatingForReturn() const;
    bool isHelpVisible() const;

    void setLog(const std::string& value);
    void setWaitingForInput(bool value);
    void setWaitingForReturn(bool value);
    void setHelpVisible(bool value);

    void clearScreen();
    void restoreLog();
    void showHelpPage(int page_number, int total_pages, const std::string& text);
    void writeError(const std::string& error);
    void writeLine();
    void writeText(const std::string& text);

public slots:
    void obtainUserInput(const QString& input);
    void obtainReturn();

signals:
    void visibleTextChanged();
    void waitingForInputChanged();
    void waitingForReturnChanged();
    void helpVisibleChanged();
    void inputReady(const QString& input);
    void returnReady();
};

#endif // CONSOLE_H
