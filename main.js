const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

let windows = [];
let currentWorkingDirectory = process.cwd(); // 현재 작업 디렉토리 유지

function createWindow() {
  // 아이콘 파일 경로 확인
  const iconPath = path.join(__dirname, 'assets/icon.icns');
  console.log('Icon path:', iconPath);
  
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: iconPath, // 아이콘 설정
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // 외부 사이트 로드를 위해 필요
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile("index.html");

  // 개발자 도구 열기
  // mainWindow.webContents.openDevTools();

  // 윈도우 배열에 추가
  windows.push(mainWindow);

  // 윈도우가 닫힐 때 배열에서 제거
  mainWindow.on('closed', () => {
    const index = windows.indexOf(mainWindow);
    if (index > -1) {
      windows.splice(index, 1);
    }
  });

  // Command+N 단축키 등록
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.meta && input.key === 'n' && input.type === 'keyDown') {
      createWindow();
    }
  });

  return mainWindow;
}

// IPC 핸들러 - 커맨드 실행
ipcMain.handle('execute-command', (event, command) => {
  return new Promise((resolve, reject) => {
    const trimmedCommand = command.trim();
    
    // cd 명령어 처리
    if (trimmedCommand.startsWith('cd ')) {
      const newPath = trimmedCommand.substring(3).trim();
      let targetPath;
      
      // 절대 경로인지 확인
      if (path.isAbsolute(newPath)) {
        targetPath = newPath;
      } else {
        // 상대 경로면 현재 작업 디렉토리 기준으로 해석
        targetPath = path.resolve(currentWorkingDirectory, newPath);
      }
      
      // 디렉토리 존재 여부 확인
      try {
        const stats = fs.statSync(targetPath);
        if (stats.isDirectory()) {
          currentWorkingDirectory = targetPath;
          resolve(`Changed directory to: ${currentWorkingDirectory}`);
        } else {
          resolve(`Error: '${newPath}' is not a directory`);
        }
      } catch (error) {
        resolve(`Error: Directory '${newPath}' does not exist`);
      }
      return;
    }
    
    // pwd 명령어 처리
    if (trimmedCommand === 'pwd') {
      resolve(currentWorkingDirectory);
      return;
    }
    
    // 다른 명령어들은 현재 작업 디렉토리에서 실행
    exec(command, { 
      timeout: 30000, 
      cwd: currentWorkingDirectory 
    }, (error, stdout, stderr) => {
      if (error) {
        resolve(`Error: ${error.message}`);
      } else if (stderr) {
        resolve(`${stdout}${stderr}`);
      } else {
        resolve(stdout || '(no output)');
      }
    });
  });
});

// IPC 핸들러 - 현재 작업 디렉토리 가져오기
ipcMain.handle('get-current-directory', () => {
  return currentWorkingDirectory;
});

// 히스토리 파일 경로
const historyFilePath = path.join(__dirname, 'command_history.txt');

// IPC 핸들러 - 히스토리 로드
ipcMain.handle('load-history', () => {
  return new Promise((resolve) => {
    try {
      if (fs.existsSync(historyFilePath)) {
        const historyData = fs.readFileSync(historyFilePath, 'utf8');
        const lines = historyData.split('\n').filter(line => line.trim() !== '');
        
        // 중복 제거하고 최신순으로 정렬
        const uniqueHistory = [];
        lines.forEach(line => {
          const existingIndex = uniqueHistory.indexOf(line);
          if (existingIndex !== -1) {
            uniqueHistory.splice(existingIndex, 1);
          }
          uniqueHistory.push(line);
        });
        
        resolve(uniqueHistory);
      } else {
        resolve([]);
      }
    } catch (error) {
      console.error('히스토리 로드 오류:', error);
      resolve([]);
    }
  });
});

// IPC 핸들러 - 히스토리 저장 (append)
ipcMain.handle('save-history', (event, newHistory) => {
  return new Promise((resolve) => {
    try {
      if (newHistory.length > 0) {
        const dataToAppend = newHistory.join('\n') + '\n';
        fs.appendFileSync(historyFilePath, dataToAppend, 'utf8');
      }
      resolve(true);
    } catch (error) {
      console.error('히스토리 저장 오류:', error);
      resolve(false);
    }
  });
});

// IPC 핸들러 - 히스토리 클리어
ipcMain.handle('clear-history', () => {
  return new Promise((resolve) => {
    try {
      // 히스토리 파일 삭제
      if (fs.existsSync(historyFilePath)) {
        fs.unlinkSync(historyFilePath);
      }
      resolve(true);
    } catch (error) {
      console.error('히스토리 클리어 오류:', error);
      resolve(false);
    }
  });
});

// IPC 핸들러 - 파일 읽기
ipcMain.handle('read-file', (event, filePath) => {
  return new Promise((resolve) => {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        resolve({ success: true, content });
      } else {
        resolve({ success: false, error: '파일을 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error('파일 읽기 오류:', error);
      resolve({ success: false, error: error.message });
    }
  });
});

// IPC 핸들러 - 파일 쓰기
ipcMain.handle('write-file', (event, filePath, content) => {
  return new Promise((resolve) => {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      resolve({ success: true });
    } catch (error) {
      console.error('파일 쓰기 오류:', error);
      resolve({ success: false, error: error.message });
    }
  });
});

// IPC 핸들러 - 파일 생성
ipcMain.handle('create-file', (event, filePath) => {
  return new Promise((resolve) => {
    try {
      // 파일이 이미 존재하는지 확인
      if (fs.existsSync(filePath)) {
        resolve({ success: false, error: '파일이 이미 존재합니다.' });
        return;
      }
      
      // 디렉토리 경로 확인 및 생성
      const dir = path.dirname(filePath);
      
      // 먼저 일반적인 방법으로 시도
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
        }
        // 빈 파일 생성
        fs.writeFileSync(filePath, '', 'utf8');
        resolve({ success: true });
        return;
      } catch (error) {
        // 권한 오류가 발생한 경우 비밀번호가 필요함을 알림
        if (error.code === 'EACCES') {
          resolve({ success: false, needsPassword: true, error: '관리자 권한이 필요합니다.' });
        } else {
          resolve({ success: false, error: error.message });
        }
      }
    } catch (error) {
      console.error('파일 생성 오류:', error);
      resolve({ success: false, error: error.message });
    }
  });
});

// IPC 핸들러 - 비밀번호와 함께 파일 생성
ipcMain.handle('create-file-with-password', (event, filePath, password) => {
  return new Promise((resolve) => {
    try {
      // 파일이 이미 존재하는지 확인
      if (fs.existsSync(filePath)) {
        resolve({ success: false, error: '파일이 이미 존재합니다.' });
        return;
      }
      
      const dir = path.dirname(filePath);
      
      // 비밀번호와 함께 sudo 명령 실행
      const sudoCommand = `echo '${password}' | sudo -S mkdir -p "${dir}" && echo '${password}' | sudo -S chmod 755 "${dir}" && echo '${password}' | sudo -S touch "${filePath}" && echo '${password}' | sudo -S chmod 644 "${filePath}" && echo '${password}' | sudo -S chown $USER "${filePath}"`;
      
      exec(sudoCommand, (error, stdout, stderr) => {
        if (error) {
          console.error('sudo 명령 실패:', error);
          if (stderr.includes('Sorry, try again') || stderr.includes('incorrect password')) {
            resolve({ success: false, error: '비밀번호가 올바르지 않습니다.' });
          } else {
            resolve({ success: false, error: `파일 생성 실패: ${error.message}` });
          }
          return;
        }
        
        resolve({ success: true });
      });
      
    } catch (error) {
      console.error('파일 생성 오류:', error);
      resolve({ success: false, error: error.message });
    }
  });
});

// 메뉴 생성 (Command+N 단축키 포함)
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            createWindow();
          }
        },
        {
          label: 'Close Window',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          role: 'quit'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createMenu();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
