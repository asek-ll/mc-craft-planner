import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable()
export class DataRequester {
  private queue: { [key: string]: Function } = {};
  private uid = 0;

  constructor(private electron: ElectronService) {
    this.electron.ipcRenderer.on('requestedData', (event, uid, data) => {
      const callback = this.queue[uid];
      if (callback) {
        delete this.queue[uid];
        callback(data);
      }
    });
  }

  private generateId() {
    return Math.random().toString(16).slice(2);
  }

  private generateUid() {
    return this.uid++;
  }

  requestData(key: string, params: object, callback: Function) {
    const uid = this.generateUid();
    this.electron.ipcRenderer.send('requestData', uid, key, params);
    this.queue[uid] = callback;
  }

}
