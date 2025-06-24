#!/usr/bin/osascript

tell application "Automator"
    activate
    
    set newWorkflow to make new workflow with properties {workflow type:application}
    
    tell newWorkflow
        set shellAction to make new action with properties {name:"Run Shell Script"}
        tell shellAction
            set value of setting "inputMethod" to 0
            set value of setting "shell" to "/bin/bash"
            set value of setting "source" to "cd /Users/hanju/electron-app
npm start"
        end tell
    end tell
    
    save newWorkflow in (path to applications folder as string) & "note.app"
    
    display dialog "Automator 앱 'note'가 Applications 폴더에 생성되었습니다!" buttons {"확인"} default button "확인"
    
end tell
