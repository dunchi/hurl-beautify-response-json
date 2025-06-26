const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { exec } = require("child_process");
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
