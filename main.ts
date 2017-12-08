import {app, BrowserWindow} from 'electron'
import {initDataStore} from './data-provider'

initDataStore();

let mainWindow: BrowserWindow;

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});


app.on('ready', ()=> {

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600
  });

  mainWindow.loadURL('file://' + __dirname + '/app/dist/index.html')

  mainWindow.on('closed', () => {

    mainWindow = null;
  });
});