tell application "System Events"
	tell application "Automator" to activate
	delay 2
	tell application "System Events"
		tell process "Automator"
			-- 새 문서 생성
			if exists window 1 then
				click button "Application" of window 1
				delay 1
				click button "Choose" of window 1
				delay 2
			end if
		end tell
	end tell
end tell

-- Shell Script 액션 추가 및 설정
tell application "Automator"
	tell document 1
		-- Run Shell Script 액션 추가
		set shellAction to make new action at end of actions with properties {name:"Run Shell Script"}
	end tell
end tell

display dialog "Automator가 열렸습니다. 다음 단계를 수동으로 진행해주세요:

1. 왼쪽에서 'Utilities' → 'Run Shell Script' 더블클릭
2. 스크립트 내용 입력:
   cd /Users/hanju/electron-app
   npm start
3. Cmd+S → 이름: 'note' → Applications에 저장

완료 후 Spotlight에서 'note' 검색하여 실행하세요!" buttons {"확인"} default button "확인"
