document.addEventListener("DOMContentLoaded", function () {
    const audioPlayer = document.getElementById("audioPlayer");
    const playerContainer = document.querySelector(".player-container");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const seekbar = document.getElementById("seekbar");

    const listBtn = document.getElementById("listBtn");
    const listPopup = document.getElementById("listPopup");
    const playlist = document.getElementById("playlist");

    const backwardBtn = document.getElementById("backwardbtn");
    const forwardBtn = document.getElementById("forwardbtn");

    const addFilesBtn = document.getElementById("addFilesBtn");
    const shuffleBtn = document.getElementById("shuffleBtn");

    const currentSongTitle = document.getElementById("currentSongTitle");
    const cover = document.querySelector(".cover");

    const volumeSlider = document.createElement("input");

    let mp3Files = []; // 현재 재생할 MP3 파일 리스트
    let originalMp3Files = []; // 원본 MP3 파일 리스트 (셔플 해제 시 원래 순서 복원용)
    let currentSongIndex = 0;
    let isShuffled = false;

    // 볼륨 조절 슬라이더 설정
    volumeSlider.type = "range";
    volumeSlider.id = "volumeSlider";
    volumeSlider.min = "0";
    volumeSlider.max = "1";
    volumeSlider.step = "0.05";
    volumeSlider.value = "1";
    listPopup.prepend(volumeSlider);
    audioPlayer.volume = 1;

    volumeSlider.addEventListener("input", function () {
        audioPlayer.volume = volumeSlider.value;
    });

    // MP3 파일 리스트를 불러와 표시
    async function loadPlaylist() {
        playlist.innerHTML = ""; // 기존 리스트 초기화
    
        mp3Files.forEach((file, index) => {
    
            const listItem = document.createElement("li");
            const fileName = file.split(/(\\|\/)/g).pop().replace(".mp3", "");
            listItem.textContent = fileName;
            listItem.classList.add("playlist-item");
            listItem.dataset.index = index;
    
            listItem.addEventListener("click", function () {
                playSelectedSong(index);
            });
    
            playlist.appendChild(listItem);
        });
    
        updateCurrentPlayingHighlight();
    }
    
    // 현재 재생 중인 곡 리스트에서 강조 표시
    function updateCurrentPlayingHighlight() {
        document.querySelectorAll(".playlist-item").forEach(item => {
            item.classList.remove("current-playing");
        });

        const selectedItem = playlist.children[currentSongIndex];
        if (selectedItem) {
            selectedItem.classList.add("current-playing");
        }
    }

    // 선택한 곡 재생
    function playSelectedSong(index) {
        if (index >= mp3Files.length) index = 0;
        currentSongIndex = index;
        let src = mp3Files[currentSongIndex];
        audioPlayer.src = src;
        audioPlayer.play();
        playPauseBtn.style.backgroundImage = 'url("assets/pausebtn.png")';
        currentSongTitle.textContent = src.split(/(\\|\/)/g).pop().replace(".mp3", "");
        updateCurrentPlayingHighlight();
    }

    // 파일 추가 버튼 클릭 시 파일 탐색기 열기
    addFilesBtn.addEventListener("click", async () => {
        try {
            const filePaths = await window.electronAPI.openFileDialog();
            if (filePaths.length > 0) {
                audioPlayer.pause();
                audioPlayer.src = "";
                playPauseBtn.style.backgroundImage = 'url("assets/playbtn.png")';
                mp3Files = [...filePaths];
                originalMp3Files = [...filePaths];
                currentSongIndex = 0;
                loadPlaylist();
                playSelectedSong(0);
            }
        } catch (error) {
            console.error("파일 선택 중 오류 발생:", error);
        }
    });

    shuffleBtn.addEventListener("click", async () => {
        if (mp3Files.length === 0) {
            console.warn("⚠ MP3 리스트가 비어 있어서 셔플을 실행할 수 없음!");
            return;
        }
    
        isShuffled = !isShuffled;
        console.log(`🎵 셔플 상태 변경: ${isShuffled}`);
    
        try {
            const updatedPlaylist = await window.electronAPI.shufflePlaylist(mp3Files); // MP3 리스트 전달
    
            if (updatedPlaylist && Array.isArray(updatedPlaylist) && updatedPlaylist.length > 0) {
                mp3Files = updatedPlaylist;
                loadPlaylist(); // UI 업데이트
    
                shuffleBtn.style.backgroundImage = isShuffled
                    ? `url("assets/shuffleBtn.png")`
                    : `url("assets/shuffleBtn.png")`;
    
            } else {
                isShuffled = false;
            }
        } catch (error) {
            isShuffled = false;
        }
    });
    
    
    

    // 리스트 팝업 
    listBtn.addEventListener("click", function () {
        if (listPopup.classList.contains("active")) {
            listPopup.classList.remove("active");
            setTimeout(() => {
                listPopup.style.visibility = "hidden";
                listPopup.style.pointerEvents = "none";
            }, 300);

            window.electronAPI.resizeWindow(331, 500);
        } else {
            listPopup.style.visibility = "visible";
            listPopup.style.pointerEvents = "auto";
            listPopup.classList.add("active");

            window.electronAPI.resizeWindow(629, 500); //팝업될때는 윈도우창 크기 넓게
        }
    });

    // 이전 곡 재생
    backwardBtn.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex - 1 + mp3Files.length) % mp3Files.length;
        playSelectedSong(currentSongIndex);
    });

    // 다음 곡 재생
    forwardBtn.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex + 1) % mp3Files.length;
        playSelectedSong(currentSongIndex);
    });

    // 오디오 종료 시 자동으로 다음 곡 재생
    audioPlayer.addEventListener("ended", () => {
        currentSongIndex = (currentSongIndex + 1) % mp3Files.length;
        playSelectedSong(currentSongIndex);
    });

    // 재생/일시정지 버튼
    playPauseBtn.addEventListener("click", function () {
        if (audioPlayer.paused) {
            if (!audioPlayer.src) {
                playSelectedSong(0);
            } else {
                audioPlayer.play();
            }
            playPauseBtn.style.backgroundImage = 'url("assets/pausebtn.png")';
        } else {
            audioPlayer.pause();
            playPauseBtn.style.backgroundImage = 'url("assets/playbtn.png")';
        }
    });

    // Seekbar
    audioPlayer.addEventListener("loadedmetadata", () => {
        seekbar.max = audioPlayer.duration; // 오디오 길이를 seekbar의 최대값으로 설정
    });
    
    // 오디오가 재생될 때마다 seekbar 업데이트
    audioPlayer.addEventListener("timeupdate", () => {
        seekbar.value = audioPlayer.currentTime; // 현재 재생 위치 동기화
    });
    
    // 유저가 seekbar를 조작했을 때 오디오 위치 변경
    seekbar.addEventListener("input", () => {
        audioPlayer.currentTime = seekbar.value;
    });

    // 음악 재생 시 cover.playing css효과 적용
    audioPlayer.addEventListener("play", () => {
        cover.classList.add("playing"); // 음악 재생 시 playing 클래스 추가
    });

    audioPlayer.addEventListener("pause", () => {
        cover.classList.remove("playing"); // 음악 멈출 때 playing 클래스 제거
    });

    audioPlayer.addEventListener("ended", () => {
        cover.classList.remove("playing"); // 음악 끝날 때 playing 클래스 제거
    });


    // 초기 플레이리스트 로드
    loadPlaylist();
});
