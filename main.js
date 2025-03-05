// electron default main.js
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('node:path');  //파일경로를 다루는 Node.js모듈

// 메인 윈도우 생성 함수
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 331, 
    height: 500,
    frame: false, // 윈도우 기본 타이틀 바 숨기기
    resizable: false, // 크기 조절 비활성화
    transparent: true, // 배경을 투명하게 설정
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 보안 강화를 위해 Preload 사용
      contextIsolation: true, // Renderer가 `require` 직접 접근 못 함
      enableRemoteModule: false, // Remote 모듈 비활성화 (보안 강화)
      sandbox: false
       // 샌드박스 환경 활성화, Renderer 프로세스를 샌드박스 모드에서 실행하도록 강제, 보안 강화
       // 이렇게 설정하면, Renderer 프로세스는 Node.js API를 직접 사용할 수 없고, 
       // Preload 스크립트를 통해서만 가능하게 됨
       //이 방식은 Electron 공식 문서에서도 권장하는 보안 설정
    }
  })

  // and load the index.html of the app. HTML 파일을 로드하여 UI를 표시
  mainWindow.loadFile('index.html')



// 파일 탐색기 열기 (렌더러 요청 받기)
ipcMain.handle("open-file-dialog", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"], // 여러 개 파일 선택 가능
    filters: [{ name: "Music Files", extensions: ["mp3"] }] // MP3 파일만 선택 가능
  });

  return result.filePaths; // 선택한 파일 경로를 렌더러에 반환
});  

}

ipcMain.on("resize-window", (event, width, height) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
      win.setBounds({ width: width, height: height, x: win.getBounds().x, y: win.getBounds().y });
  }
});


// 앱이 준비되면 창을 생성
app.whenReady().then(() => {
  createWindow()  // 앱이 실행될 때 브라우저 창 생성

  app.on('activate', function () {
    //    MacOS에서는 창을 닫아도 앱이 종료되지 않음.
    //    Dock 아이콘을 클릭하면 새 창을 만들어야 함.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 모든 창이 닫히면 앱 종료 (Mac 제외)
app.on('window-all-closed', function () {
  // Mac에서는 Cmd + Q를 누르기 전까지 앱이 완전히 종료되지 않음
  if (process.platform !== 'darwin') app.quit()  // Mac이 아닐 경우 앱을 종료
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
