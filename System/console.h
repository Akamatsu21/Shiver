#ifndef CONSOLE_H
#define CONSOLE_H

#include <QObject>
#include <string>

class Console: public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString visibleText READ getVisibleText NOTIFY visibleTextChanged)
    Q_PROPERTY(bool waitingForInput READ isWatingForInput NOTIFY waitingForInputChanged)

    std::string _log;
    QString _visible_text;
    bool _waiting_for_input;

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

    void setLog(const std::string& value);
    void setWaitingForInput(bool value);

    void clearScreen();
    void restoreLog();
    int showHelpPage(int page_number, int total_pages, const std::string& text); //TODO
    void waitForAnyKey();   //TODO
    std::string waitForInput(); // To be removed
    void writeError(const std::string& error); //TODO
    void writeLine();
    void writeText(const std::string& text);

public slots:
    void obtainUserInput(const QString& input);

signals:
    void visibleTextChanged();
    void waitingForInputChanged();
    void inputReady(const std::string& input);
};

#endif // CONSOLE_H
