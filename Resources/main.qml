import QtQuick 2.15
import QtQuick.Window 2.15
import QtQuick.Controls 2.15

Window
{
    id: main_window
    minimumWidth: 1100
    minimumHeight: 1000
    visible: true
    title: "Shiver"
    signal leftArrowReceived()
    signal rightArrowReceived()
    signal escapeReceived()

    Connections
    {
        target: terminalController

        function onChangeInputTextField(text)
        {
            user_input.text = text;
        }

        function onPrintText(text)
        {
            if(terminal_log.textToType !== "")
            {
                terminal_log.textToType += text;
            }
            else
            {
                terminal_log.counter = 0;
                terminal_log.textToType = text;
                timer.start();
            }
        }

        function onForceLogPrint()
        {
            forcePasteText();
        }
    }

    function scrollDown()
    {
        if(terminal.contentHeight + user_input.contentHeight >= main_window.height)
        {
            terminal.contentItem.contentY = terminal.contentHeight + user_input.contentHeight - main_window.height;
        }
    }

    function forcePasteText()
    {
        timer.stop()
        terminal_log.counter = 0;
        terminal_log.textToType = "";
        terminal_log.tempText = "";
        terminal_log.tempTextActive = false;
        terminalController.restoreLog();
        scrollDown();
    }

    ScrollView
    {
        id: terminal
        contentWidth: parent.width
        contentHeight: terminal_log.height + user_input.height
        anchors.fill: parent
        clip: true
        background: Rectangle
        {
            color: "black"
        }
        Component.onCompleted:
        {
            terminal_log.forceActiveFocus();
        }

        Keys.onReturnPressed:
        {
            if(terminalController.waitingForReturn && !timer.running)
            {
                terminalController.obtainReturn();
                scrollDown();
            }
            else if(timer.running)
            {
                forcePasteText();
            }
        }
        Keys.onUpPressed:
        {
            if(terminalController.waitingForInput && !timer.running)
            {
                terminalController.moveHistoryUp();
            }
        }
        Keys.onDownPressed:
        {
            if(terminalController.waitingForInput && !timer.running)
            {
                terminalController.moveHistoryDown();
            }
        }
        Keys.onLeftPressed:
        {
            if(terminalController.helpVisible)
            {
                leftArrowReceived();
            }
        }
        Keys.onRightPressed:
        {
            if(terminalController.helpVisible)
            {
                rightArrowReceived();
            }
        }
        Keys.onEscapePressed:
        {
            if(terminalController.helpVisible)
            {
                escapeReceived();
            }
        }

        Text
        {
            property int counter: 0
            property string textToType: ""
            property string tempText: ""
            property bool tempTextActive: false

            id: terminal_log
            width: main_window.width
            anchors.top: parent.top
            color: "white"
            font
            {
                family: "Consolas"
                pointSize: 16
            }
            textFormat: Text.StyledText
            wrapMode: Text.WordWrap
            text: terminalController.visibleText + tempText

            function type()
            {
                if(textToType[counter] === '<')
                {
                    while(textToType[counter] !== '>')
                    {
                        tempText += textToType[counter];
                        ++counter;
                    }
                    tempText += textToType[counter];
                    ++counter;

                    const selfClosingTag = textToType[counter - 2] === '/';

                    if(tempTextActive || selfClosingTag)
                    {
                        terminalController.visibleText += tempText;
                        tempText = "";
                    }

                    if(!selfClosingTag)
                    {
                        tempTextActive = !tempTextActive;
                    }
                }

                if(counter >= textToType.length)
                {
                    textToType = "";
                    return timer.stop();
                }

                if(tempTextActive)
                {
                    tempText += textToType[counter];
                }
                else
                {
                    terminalController.visibleText += textToType[counter];
                }

                ++counter;
                scrollDown();
            }

            Timer
            {
                id: timer
                interval: 50
                repeat: true
                running: false
                onTriggered: terminal_log.type()
            }
        }

        Text
        {
            id: carret
            anchors
            {
                top: terminal_log.bottom
                left: parent.left
            }
            color: "gold"
            font
            {
                family: "Consolas"
                pointSize: 16
            }
            textFormat: Text.RichText
            visible: terminalController.waitingForInput && !timer.running
            text: "> "
        }

        TextInput
        {
            id: user_input
            anchors
            {
                top: terminal_log.bottom
                left: carret.right
            }
            width: parent.width
            height: 25
            color: "white"
            font
            {
                family: "Consolas"
                pointSize: 16
            }

            visible: terminalController.waitingForInput && !timer.running
            focus: terminalController.waitingForInput && !timer.running

            Keys.onReturnPressed:
            {
                terminalController.obtainUserInput(text);
                text = "";
                scrollDown();
            }
        }

        Text
        {
            id: elipses
            anchors
            {
                top: terminal_log.bottom
                left: parent.left
            }
            color: "white"
            font
            {
                family: "Consolas"
                pointSize: 16
            }
            textFormat: Text.RichText
            visible: terminalController.waitingForReturn && !timer.running
            text: ""
            onVisibleChanged:
            {
                text = "";
            }

            Timer
            {
                id: elipses_timer
                interval: 200
                repeat: true
                running: terminalController.waitingForReturn && !timer.running
                onTriggered:
                {
                    if(elipses.text.length >= 3)
                    {
                        elipses.text = "";
                    }
                    else
                    {
                        elipses.text += ".";
                    }
                }
            }
        }
    }
}
