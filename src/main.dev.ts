/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  screen,
  dialog,
  IpcMainEvent,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs';
import MenuBuilder from './menu';
import { connectDB, sqlExecute } from './electron/DBHandler';

const { format } = require('@fast-csv/format');

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
// Deep linked url
let deeplinkingUrl: string[] | string;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};
// Log both at dev console and at running node console instance
const logEverywhere = (s: string | number) => {
  console.log(s);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`console.log("${s}")`);
  }
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  console.log('>>>', JSON.stringify(screen.getPrimaryDisplay()));
  mainWindow = new BrowserWindow({
    show: false,
    width: Math.ceil(width * 0.7),
    height: Math.ceil(height * 0.7),
    icon: getAssetPath('icon.png'),
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Protocol handler for win32
  if (process.platform === 'win32') {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = process.argv.slice(1);
  }
  logEverywhere(`createWindow# ${deeplinkingUrl}`);
  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
      if (deeplinkingUrl) {
        mainWindow.webContents.executeJavaScript(
          `send("${deeplinkingUrl.toString().trim()}")`
        );
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on('ExportCSV', (_: IpcMainEvent, params) => {
  const { fileName, data } = params;

  dialog
    .showSaveDialog({
      title: 'Select the File Path to save',
      defaultPath: path.join(__dirname, `../downloads/${fileName}.csv`),
      buttonLabel: 'Save',
      // Restricting the user to only Text Files.
      filters: [{ name: 'CSV files', extensions: ['csv'] }],
      properties: [],
    })
    .then((file: Electron.SaveDialogReturnValue) => {
      // Stating whether dialog operation was cancelled or not.
      console.log(file.canceled);
      if (!file.canceled) {
        const items: unknown[] = [];

        const stream = format({ headers: true });
        const filePath = file?.filePath?.toString() ?? '/Downloads';
        const csvFile = fs.createWriteStream(filePath);
        stream.pipe(csvFile);
        data.forEach((el: Record<string, unknown>, i: number) => {
          const parsed: Record<string, unknown> = {};
          Object.entries(el).forEach(([key, value]: [string, unknown]) => {
            parsed[key] =
              typeof value === 'object' ? JSON.stringify(value) : value;
          });
          items.push(parsed);
          stream.write(items[i]);
        });
        stream.end();
        return 1;
      }
      return 0;
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.handle('connect', async (_, params) => {
  console.log('connect');
  // console.log(JSON.stringify({ params }, null, 2));
  const res = await connectDB({
    ...params,
    window: mainWindow,
  });
  return res;
});

ipcMain.handle('SQL_EXECUTE', sqlExecute);

// Define custom protocol handler.
// Deep linking works on packaged versions of the application!
app.setAsDefaultProtocolClient('postgresql');
app.setAsDefaultProtocolClient('postgres');

// Protocol handler for osx
app.on('open-url', (event, url) => {
  event.preventDefault();
  deeplinkingUrl = url;
  logEverywhere(`open-url# ${deeplinkingUrl}`);
  if (mainWindow === null) createWindow();
  // if (deeplinkingUrl) {
  //   mainWindow.webContents.executeJavaScript(`alert("${deeplinkingUrl}")`);
  // }
});
