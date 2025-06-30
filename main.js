const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

let windows = [];

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
    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
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
