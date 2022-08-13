import QtQuick 2.15
import QtQuick.Window 2.15
import QtQuick.Controls 2.15

Window
{
    id: main_window
    width: 800
    height: 1000
    visible: true
    title: "Shiver"
    signal inputReceived(input: string)
    signal returnReceived()
    signal leftArrowReceived()
    signal rightArrowReceived()
    signal escapeReceived()

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
                returnReceived();
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
                inputReceived(text);
                text = "";
                if(terminal.contentHeight >= main_window.height)
                {
                    terminal.contentItem.contentY = terminal.contentHeight - main_window.height;
                }
            }
        }
    }
}
