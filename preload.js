const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  closeApp: () => ipcRenderer.send("close-app"), // 창 닫기 요청
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"), // 파일 탐색기 열기
  resizeWindow: (width, height) => ipcRenderer.send("resize-window", width, height), // 창 크기 조절
  send: (channel, data) => ipcRenderer.send(channel, data), // 일반적인 IPC 메시지 전송

  // MP3 파일 목록 가져오기
  getMP3Files: () => ipcRenderer.invoke("get-mp3-files"),

  // 플레이리스트 셔플 기능 (MP3 리스트를 함께 전달)
  shufflePlaylist: (playlist) => ipcRenderer.invoke("shuffle-playlist", playlist),


  // 현재 재생 목록 업데이트
  updatePlaylist: (playlist) => ipcRenderer.send("update-playlist", playlist)
});

window.addEventListener("DOMContentLoaded", () => {});
