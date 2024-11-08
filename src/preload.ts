// preload.ts
import { contextBridge, ipcRenderer } from "electron";

// Espone una API sicura per il renderer tramite `contextBridge`
contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel: string, data: string | number | Record<string, unknown>) =>
    ipcRenderer.send(channel, data),
  receive: (
    channel: string,
    func: (...args: (string | number | Record<string, unknown>)[]) => void,
  ) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
});
