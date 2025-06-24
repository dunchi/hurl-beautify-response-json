# nicemso note

GitHub 이슈 페이지를 위한 맞춤형 브라우저

## 🚀 실행 방법

### 방법 1: Spotlight 실행 (Automator 사용) ⭐️ 추천
1. **Automator 앱 생성** (최초 1회만)
   - Spotlight (`Cmd + Space`) → "Automator" 검색 → 실행
   - "Application" 선택
   - 왼쪽에서 "Utilities" → "Run Shell Script" 더블클릭
   - Shell 스크립트 내용:
     ```
     export PATH="/opt/homebrew/bin:$PATH"
      cd ~/electron-app
      npm start
     ```
   - `Cmd + S` → 이름: "note" → Applications 폴더에 저장

2. **Spotlight로 실행**
   - `Cmd + Space` → "note" 입력 → Enter

### 방법 2: 스크립트 실행
- 프로젝트 폴더에서 `run.sh` 더블클릭
- "터미널에서 열기" 선택

## 📋 최초 설정

### 1. 의존성 설치 (최초 1회만)
```bash
cd /프로젝트/폴더/경로
npm install
```

### 2. 앱 실행
```bash
npm start
```

## 🎮 단축키

앱이 실행되면 다음 단축키들을 사용할 수 있습니다:

- **`Command + N`**: 새 윈도우 생성 (새로운 웹뷰)
- **`Command + E`** (또는 `E`): UI 수정 로직 실행
- **`Command + S`**: 저장 버튼 클릭  
- **`Command + R`**: 웹뷰 새로고침
- **`Enter`** (주소창에서): 페이지 이동



## 🚨 문제 해결

### 일렉트론이 열리지 않을 때
```bash
npm install electron --save-dev
npm start
```

### 보안 경고 (macOS)
- "시스템 환경설정 → 보안 및 개인 정보 보호"에서 앱 실행 허용


### GitHub 이슈 페이지 최적화
- 특정 요소 자동 클릭
- UI 요소 제거 및 수정
- 커스텀 스타일 적용

### 브라우저 기능
- 주소창을 통한 페이지 이동
- 웹뷰 새로고침
- 키보드 단축키 지원

---

**상세한 실행 방법은 `HOW_TO_RUN.html` 파일을 브라우저에서 열어보세요.**

*최종 업데이트: 2025년 6월 24일*
