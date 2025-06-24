#!/bin/bash

# 기존 note 앱 삭제 (있는 경우)
if [ -d "/Applications/note.app" ]; then
    echo "기존 note 앱을 삭제합니다..."
    rm -rf "/Applications/note.app"
fi

echo "Automator 앱 생성 가이드:"
echo "========================"
echo ""
echo "1. Spotlight (Cmd+Space) → 'Automator' 검색 → 실행"
echo "2. 'Application' 선택 → 'Choose' 클릭"
echo "3. 왼쪽에서 'Utilities' → 'Run Shell Script' 더블클릭"
echo "4. 스크립트 내용을 다음으로 교체:"
echo ""
echo "export PATH=\"/opt/homebrew/bin:\$PATH\""
echo "cd /Users/hanju/electron-app"
echo "npm start"
echo ""
echo "5. Cmd+S → 이름: 'note' → Applications 폴더에 저장"
echo "6. Spotlight (Cmd+Space) → 'note' 검색하여 테스트"
echo ""
echo "문제가 있으면 README.md의 '문제 해결' 섹션을 확인하세요."
