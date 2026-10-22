const { app, BrowserWindow, Menu, nativeTheme, session } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const windowControlsPosition = { x: 17, y: 17 };

app.setName('Computer');
// Shared builds start with their own examples and never reuse the developer's profile.
app.setPath('userData', path.join(app.getPath('appData'), app.isPackaged ? 'Computer-prototype' : 'Computer-app'));

const developmentUrl = !app.isPackaged && process.env.COMPUTER_RENDERER_URL;
if (developmentUrl && new URL(developmentUrl).origin !== 'http://127.0.0.1:5175') {
  throw new Error('The renderer development server must be http://127.0.0.1:5175.');
}

const rendererPath = app.isPackaged
  ? path.join(process.resourcesPath, 'renderer/index.html')
  : path.join(__dirname, '../../web/dist/index.html');

function mayNavigate(url) {
  try {
    const target = new URL(url);
    if (developmentUrl) return target.origin === new URL(developmentUrl).origin;
    target.hash = '';
    return target.href === pathToFileURL(rendererPath).href;
  } catch {
    return false;
  }
}

async function createWindow() {
  const window = new BrowserWindow({
    title: 'Computer',
    width: 1180,
    height: 800,
    minWidth: 560,
    minHeight: 420,
    show: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1d1b1d' : '#faf9f9',
    ...(process.platform === 'darwin' ? {
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: windowControlsPosition,
    } : {}),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      devTools: !app.isPackaged,
    },
  });

  if (process.platform === 'darwin') {
    const alignWindowControls = () => {
      if (!window.isDestroyed() && !window.isFullScreen()) {
        window.setWindowButtonPosition(windowControlsPosition);
      }
    };
    // AppKit can reset custom traffic-light placement during window transitions.
    for (const event of ['ready-to-show', 'show', 'resize', 'restore', 'leave-full-screen']) {
      window.on(event, alignWindowControls);
    }
  }

  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, url) => {
    if (!mayNavigate(url)) event.preventDefault();
  });
  window.webContents.on('will-redirect', (event, url) => {
    if (!mayNavigate(url)) event.preventDefault();
  });
  window.webContents.on('will-attach-webview', (event) => event.preventDefault());
  window.webContents.on('render-process-gone', (_event, details) => {
    console.error('Computer renderer stopped:', details.reason);
  });
  window.once('ready-to-show', () => window.show());

  if (developmentUrl) await window.loadURL(developmentUrl);
  else await window.loadFile(rendererPath);
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const window = BrowserWindow.getAllWindows()[0];
    if (!window) return void createWindow().catch(failStartup);
    if (window.isMinimized()) window.restore();
    window.show();
    window.focus();
  });

  app.whenReady().then(async () => {
    if (process.platform === 'darwin' && !app.isPackaged) {
      app.dock.setIcon(path.join(__dirname, '../build/icon.png'));
    }
    session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    session.defaultSession.setPermissionCheckHandler(() => false);
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
      { role: 'editMenu' },
      { role: 'viewMenu' },
      { role: 'windowMenu' },
    ]));
    await createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) void createWindow().catch(failStartup);
    });
  }).catch(failStartup);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

function failStartup(error) {
  console.error('Computer could not open its window:', error);
  app.exit(1);
}
