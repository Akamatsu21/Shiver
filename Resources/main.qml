import QtQuick 2.15
import QtQuick.Window 2.15
import QtQuick.Controls 2.15

Window
{
    width: 800
    height: 800
    visible: true
    title: "Shiver"
    signal inputReceived(input: string)

    Rectangle
    {
        id: terminal
        anchors.fill: parent
        color: "black"

        Text
        {
            id: terminal_log
            anchors.top: parent.top
            color: "white"
            font
            {
                family: "Consolas"
                pointSize: 16
            }
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
            }
        }
    }
}
