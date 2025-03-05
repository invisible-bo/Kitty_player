const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');

// MP3 플레이리스트 저장 파일 경로
const playlistFilePath = path.join(app.getPath("userData"), "playlist.json");

// 현재 플레이리스트 (원본 및 셔플)
let originalPlaylist = [];
let shuffledPlaylist = [];

// 메인 윈도우 생성 함수
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 331,
        height: 500,
        frame: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            sandbox: false
        }
    });

    mainWindow.loadFile('index.html');
}

// 배열을 랜덤하게 섞는 함수 (Fisher-Yates 알고리즘)
function shuffleArray(array) {
    if (!Array.isArray(array) || array.length === 0) return array;

    let shuffled = [...array]; // 원본 보호
    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// MP3 파일 탐색기 열기
ipcMain.handle("open-file-dialog", async () => {
    const result = await dialog.showOpenDialog({
        properties: ["openFile", "multiSelections"],
        filters: [{ name: "Music Files", extensions: ["mp3"] }]
    });

    if (result.filePaths.length > 0) {
        originalPlaylist = [...result.filePaths];
        shuffledPlaylist = [...originalPlaylist]; // 기본 리스트 동일하게 설정
        savePlaylist(originalPlaylist); // JSON 저장
    }


    return result.filePaths;
});

// MP3 파일 목록 불러오기
ipcMain.handle("get-mp3-files", async () => {
    if (!fs.existsSync(playlistFilePath)) {
        return [];
    }
    try {
        const playlistData = fs.readFileSync(playlistFilePath, "utf-8");
        originalPlaylist = JSON.parse(playlistData);
        shuffledPlaylist = [...originalPlaylist];

        return originalPlaylist;
    } catch (error) {

        return [];
    }
});

ipcMain.handle("shuffle-playlist", async (_, playlist) => {


  if (!playlist || !Array.isArray(playlist) || playlist.length === 0) {
      console.error("리스트가 비어 있음 원본 반환");
      return [];
  }

  let shuffledPlaylist = shuffleArray([...playlist]);
  return shuffledPlaylist;
});


// 변경된 플레이리스트 저장
function savePlaylist(playlist) {
    try {
        fs.writeFileSync(playlistFilePath, JSON.stringify(playlist, null, 2), "utf-8");

    } catch (error) {
        console.error("⚠ 플레이리스트 저장 중 오류 발생:", error);
    }
}

// 창 크기 조정
ipcMain.on("resize-window", (event, width, height) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.setBounds({ width: width, height: height, x: win.getBounds().x, y: win.getBounds().y });
    }
});

// 앱이 준비되면 창을 생성
app.whenReady()
    .then(createWindow)
    .catch(error => console.error("⚠ 앱 시작 중 오류 발생:", error));

// 창이 닫히면 앱 종료 (Mac 제외)
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
