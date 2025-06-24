const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

let windows = [];

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // 외부 사이트 로드를 위해 필요
      webviewTag: true, // webview 태그 활성화
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
