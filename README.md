# Hurl - Command Line Terminal with File Editor

Electron 기반의 커맨드라인 터미널과 hurl 파일 에디터가 통합된 개발 도구

## 🚀 주요 기능

### 💻 커맨드라인 터미널
- 실제 시스템 커맨드 실행
- JSON 응답 자동 beautify
- 실행 결과 타임스탬프 표시
- 최신 결과가 위로 오는 정렬
- 커맨드 히스토리 저장 및 검색

### 📝 통합 파일 에디터
- **Hurl 파일 편집**: Command+R로 hurl 파일을 사이드바에 로드
- **자동 파일 생성**: 존재하지 않는 파일 자동 생성 (권한 처리 포함)
- **실시간 편집**: 모노스페이스 폰트와 다크 테마
- **빠른 저장**: Command+S로 파일 저장

### ⌨️ 스마트 단축키
- **Command+1**: 커맨드창 포커스
- **Command+2**: 사이드바 에디터 포커스  
- **Command+3**: 결과창 포커스
- **Command+R**: Hurl 파일 로드
- **Command+S**: 파일 저장
- **↑/↓ 화살표**: 커맨드 히스토리 탐색

### 🔧 고급 기능
- **권한 자동 처리**: sudo 권한이 필요한 경우 비밀번호 모달 제공
- **재귀적 디렉토리 생성**: 중간 폴더들을 자동으로 생성
- **히스토리 관리**: 중복 제거 및 세션별 저장
- **클립보드 JSON 포맷팅**: 붙여넣기 시 JSON 자동 beautify

## 📋 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/dunchi/hurl-beautify-response-json.git
cd hurl-beautify-response-json
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 실행 방법

#### 방법 A: macOS 앱으로 실행 (추천)
```bash
# Hurl.app 생성 (최초 1회만)
./create-app.command
```
그 후 홈 디렉토리(`~`)에 생성된 `Hurl.app`을 더블클릭

#### 방법 B: 터미널에서 직접 실행
```bash
npm start
```

## 🎮 사용법

### 기본 워크플로우

1. **커맨드 실행**
   ```bash
   hurl /path/to/your/file.hurl
   ls -la
   curl -X POST http://localhost:3000/api/test
   ```

2. **파일 편집**
   - 커맨드창에 hurl 파일 경로 입력
   - `Command+R`로 파일을 사이드바에 로드
   - 사이드바에서 파일 편집
   - `Command+S`로 저장

3. **히스토리 관리**
   - `↑/↓` 화살표로 이전 커맨드 탐색
   - `clear` 입력으로 모든 히스토리 초기화

### 레이아웃 구성

```
┌─────────────────────────┬─────────────────────┐
│ (⌘+1) 커맨드 입력창     │ 파일명              │
├─────────────────────────┼─────────────────────┤
│                         │                     │
│ (⌘+3) 실행 결과창       │ (⌘+2) 파일 에디터   │
│                         │                     │
│ JSON 자동 포맷팅        │ Hurl 파일 편집      │
│ 타임스탬프 표시         │ 문법 하이라이팅     │
│                         │                     │
└─────────────────────────┴─────────────────────┘
```

### Hurl 파일 예시

파일을 로드하면 다음과 같은 템플릿이 placeholder로 표시됩니다:

```hurl
POST http://localhost:7081/api/saga/start
Content-Type: application/json
{
    "sagaType": "ORDER_PROCESSING",
    "sagaData": {
      "orderId": "ORD-001",
      "customerId": "CUST-001",
      "totalAmount": 100.0
    }
}
```

## 🔐 권한 처리

깊은 경로의 파일 생성 시 권한이 필요한 경우:

1. 자동으로 권한 필요 감지
2. 비밀번호 입력 모달 표시
3. sudo 권한으로 재귀적 폴더 생성
4. 파일 소유권을 사용자로 변경

## 📁 파일 구조

```
hurl-beautify-response-json/
├── index.html          # 메인 UI
├── main.js            # Electron 메인 프로세스
├── preload.js         # IPC 통신 브리지
├── assets/            # 아이콘 및 리소스
├── create-app.command # macOS 앱 생성 스크립트
├── create-icon.sh     # 아이콘 생성 스크립트
└── command_history.txt # 커맨드 히스토리 (자동생성, gitignore됨)
```

## 🛠️ 개발자 정보

- **주요 기술**: Electron, Node.js, HTML/CSS/JavaScript
- **IPC 통신**: 안전한 contextIsolation 환경
- **파일 시스템**: 권한 자동 처리 및 재귀적 생성
- **UI/UX**: VS Code 스타일 다크 테마

## 📝 버전 히스토리

- **v2.0**: 통합 파일 에디터, 권한 처리, 고급 단축키
- **v1.0**: 기본 커맨드라인 터미널, JSON beautify

---

**Hurl Command Line Terminal & File Editor**  
*개발자를 위한 통합 개발 환경*
