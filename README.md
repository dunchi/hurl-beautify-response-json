# Hurl - Command Line Terminal

Electron 기반의 간단한 커맨드라인 터미널 애플리케이션

## 🚀 실행 방법

### 방법 1: macOS 앱으로 실행 (추천)

1. **Hurl.app 생성** (최초 1회만)
   ```bash
   cd 프로젝트폴더
   ./create-app.sh
   ```

2. **앱 실행**
   - 홈 디렉토리(`~`)에 생성된 `Hurl.app`을 더블클릭

### 방법 2: 터미널에서 직접 실행
```bash
npm start
```

## 📋 최초 설정

### 1. 의존성 설치 (최초 1회만)
```bash
npm install
```

### 2. macOS 앱 생성
```bash
./create-app.sh
```

## 🎮 사용법

- 상단 입력창에 커맨드를 입력하고 Enter
- 하단 영역에 실행 결과가 최신순으로 표시됩니다
- JSON 응답은 자동으로 예쁘게 포맷팅됩니다

## 🔧 기능

- 실제 시스템 커맨드 실행
- JSON 응답 자동 beautify
- 실행 결과 타임스탬프 표시
- 최신 결과가 위로 오는 정렬

---

*Command Line Terminal for Electron*
