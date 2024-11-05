// preload.ts
import { contextBridge, ipcRenderer } from "electron";

// Espone una API sicura per il renderer tramite `contextBridge`
contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  receive: (channel: string, func: (...args: any[]) => void) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
});
