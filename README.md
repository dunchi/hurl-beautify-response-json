# Hurl - Command Line Terminal with File Editor

Electron 기반의 커맨드라인 터미널과 hurl 파일 에디터가 통합된 개발 도구

## 📋 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/dunchi/hurl-beautify-response-json.git
```

### 2. 의존성 설치
npm 이 없다면
```brew install --formulae npm```

```bash
npm install
```

### 3. macOS 앱으로 실행

```bash
# Hurl.app 생성 (최초 1회만)
./create-app.command
```
그 후 홈 디렉토리(`~`)에 생성된 `Hurl.app`을 더블클릭

## 🎮 사용법

### ⌨️ 단축키
- **Command+1**: 커맨드창 포커스
- **Command+2**: 사이드바 에디터 포커스  
- **Command+3**: 결과창 포커스
- **Command+R**: Hurl 파일 로드
- **Command+S**: 파일 저장
- **↑/↓ 화살표**: 커맨드 히스토리 탐색

### 기본 워크플로우

1. **커맨드 실행**
   ```bash
   hurl /path/to/your/file.hurl
   ls -la
   ..
   ```
   
2. **파일 편집**
   - 커맨드창에 hurl 파일 경로 입력
   - `Command+R`로 파일을 사이드바에 로드
   - 사이드바에서 파일 편집
   - `Command+S`로 저장

3. **히스토리 관리**
   - `↑/↓` 화살표로 이전 커맨드 탐색
   - `clear-history` 입력으로 모든 히스토리 초기화
  
4. **예약된 명령어**
   - `?` 사용할 수 있는 명령어 조회

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

### 🔧 고급 기능
- **권한 자동 처리**: sudo 권한이 필요한 경우 비밀번호 모달 제공
- **재귀적 디렉토리 생성**: 중간 폴더들을 자동으로 생성
- **히스토리 관리**: 중복 제거 및 세션별 저장
- **클립보드 JSON 포맷팅**: 붙여넣기 시 JSON 자동 beautify

## 📝 버전 히스토리

- **v2.0**: 통합 파일 에디터, 권한 처리, 고급 단축키
- **v1.0**: 기본 커맨드라인 터미널, JSON beautify

---

**Hurl Command Line Terminal & File Editor**  
*개발자를 위한 통합 개발 환경*
