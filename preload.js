const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("electronAPI", {
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"), // 파일 탐색기 열기
  resizeWindow: (width, height) => ipcRenderer.send("resize-window", width, height), // 창 크기 조절
  send: (channel, data) => ipcRenderer.send(channel, data) // 일반적인 IPC 메시지 전송
});

window.addEventListener("DOMContentLoaded", () => {
});
