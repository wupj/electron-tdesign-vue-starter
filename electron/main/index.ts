const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 980,
    height: 680,
    icon: 'public/favicon.ico',
    show:false,
    webPreferences: {
      contextIsolation: false, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      preload: path.join(__dirname, '../preload/index.ts'), // 需要引用js文件
    },
  });
  Menu.setApplicationMenu(null); // 禁用默认菜单

  // 如果打包了，渲染index.html
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  } else {
    const url = 'http://localhost:3001'; // 本地启动的vue项目路径
    win.webContents.openDevTools(); // 开发者工具
    win.loadURL(url);
    win.on('ready-to-show',()=>{
        win.show()
    })
  }
};

app.whenReady().then(() => {
  createWindow(); // 创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 关闭窗口
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
