import { contextBridge, ipcRenderer } from 'electron';
//import * from '../types/electron-api';

contextBridge.exposeInMainWorld('electronAPI', {
  insertPatient: (args: any) => ipcRenderer.invoke('database:insert', args),
  search: (args: { keyword: string }) => ipcRenderer.invoke('database:search', args),
  fetchAll: () => ipcRenderer.invoke('database:fetchall'),
} as any);
