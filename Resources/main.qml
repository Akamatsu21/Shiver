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
    }

    function scrollDown()
    {
        if(terminal.contentHeight >= main_window.height)
        {
            terminal.contentItem.contentY = terminal.contentHeight - main_window.height;
        }
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
            if(terminalController.waitingForReturn)
            {
                terminalController.obtainReturn();
                scrollDown();
            }
        }
        Keys.onUpPressed:
        {
            if(terminalController.waitingForInput)
            {
                terminalController.moveHistoryUp();
            }
        }
        Keys.onDownPressed:
        {
            if(terminalController.waitingForInput)
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
            text: terminalController.visibleText
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
            visible: terminalController.waitingForInput
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

            visible: terminalController.waitingForInput
            focus: terminalController.waitingForInput

            Keys.onReturnPressed:
            {
                terminalController.obtainUserInput(text);
                text = "";
                scrollDown();
            }
        }
    }
}
