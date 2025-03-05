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

    const currentSongTitle = document.getElementById("currentSongTitle");   
    const cover = document.querySelector(".cover");

    const mp3Files = [];

    let currentSongIndex = 0;


    // 플레이리스트 불러오기
    function loadPlaylist() {
        playlist.innerHTML = ""; // 기존 리스트 초기화
    
        mp3Files.forEach((file, index) => {
            const listItem = document.createElement("li");
    
            // 파일명만 추출 (폴더 경로 제거)
            const fileName = file.split(/(\\|\/)/g).pop().replace(".mp3", "");
    
            listItem.textContent = fileName;
            listItem.classList.add("playlist-item");
            listItem.dataset.src = file;  // 파일 경로 저장
    
            listItem.addEventListener("click", function () {
                playSelectedSong(index);
            });
    
            playlist.appendChild(listItem);
        });
    
        updateCurrentPlayingHighlight();
    }
    

    // 현재 재생 중인 곡 강조
    function updateCurrentPlayingHighlight() {
        document.querySelectorAll(".playlist-item").forEach(item => {
            item.classList.remove("current-playing");
        });

        const selectedItem = playlist.children[currentSongIndex];
        if (selectedItem) {
            selectedItem.classList.add("current-playing");
        }
    }

    // 선택한 노래 재생
    function playSelectedSong(index) {
        if (index >= mp3Files.length) index = 0;
        currentSongIndex = index;
    
        let src = mp3Files[currentSongIndex];  // 직접 파일 경로 사용
        console.log("🎵 재생할 파일:", src);
    
        audioPlayer.src = src;
        audioPlayer.play();
        playPauseBtn.style.backgroundImage = 'url("assets/pausebtn.png")';
    
        const fileName = src.split(/(\\|\/)/g).pop().replace(".mp3", "");
        currentSongTitle.textContent = fileName || "";
    
        updateCurrentPlayingHighlight();
        updateTitleScrollAnimation();
    }
    

    // 제목 스크롤 애니메이션 
    function updateTitleScrollAnimation() {
        setTimeout(() => {
            currentSongTitle.style.animation = "marquee 30s linear infinite";
        }, 200);
    }

    // 파일 추가 버튼 클릭 시 파일 탐색기 열기
    document.getElementById("addFilesBtn").addEventListener("click", async () => {
    
        try {
            const filePaths = await window.electronAPI.openFileDialog(); // 파일 탐색기 열기
            console.log("선택된 파일들:", filePaths);
    
            if (filePaths.length > 0) {
                // 기존 재생 중이던 음악 멈추기
                audioPlayer.pause();
                audioPlayer.src = "";  // 기존 음악 경로 초기화
                playPauseBtn.style.backgroundImage = 'url("assets/playbtn.png")';

                // 기존 파일 목록 초기화하고 새로 추가
                mp3Files.length = 0;  // 배열을 비워줌
                mp3Files.push(...filePaths); // 새로 선택한 파일들을 추가


                // 현재 추가한 인덱스를 첫 번째 곡으로 설정
                currentSongIndex = 0;

                // 첫 번째 곡을 자동으로 선택 (UI 업데이트)
                loadPlaylist();
                updateCurrentPlayingHighlight();

                // 자동으로 첫 번째 곡을 로드
                playSelectedSong(0);
    
                // 플레이리스트 UI 업데이트
                loadPlaylist();
            }
        } catch (error) {
            console.error("파일 선택 중 오류 발생:", error);
        }
    });
    


    audioPlayer.addEventListener("ended", function () {
        playNextSong();
    });

    backwardBtn.addEventListener("click", function () {
        playPreviousSong();
    });

    forwardBtn.addEventListener("click", function () {
        playNextSong();
    });

    // 이전 곡 재생
    function playPreviousSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = mp3Files.length - 1;
        }
        playSelectedSong(currentSongIndex);
    }

    // 다음 곡 재생
    function playNextSong() {
        currentSongIndex++;
        if (currentSongIndex >= mp3Files.length) {
            currentSongIndex = 0;
        }
        playSelectedSong(currentSongIndex);
    }

    function updatePopupPosition() {
        const playerRect = playerContainer.getBoundingClientRect();
        const popupMargin = -2.5;

        listPopup.style.left = `${playerRect.right + popupMargin}px`;  
        listPopup.style.top = `${playerRect.top}px`;

        const offsetFix = -8;
        listPopup.style.top = `${playerRect.top + offsetFix}px`; 
    }

    // 리스트 팝업시 윈도우 창
    document.getElementById("listBtn").addEventListener("click", function () {
        const listPopup = document.getElementById("listPopup");
    
        if (listPopup.classList.contains("active")) {
            listPopup.classList.remove("active");
            setTimeout(() => {
                listPopup.style.visibility = "hidden";
                listPopup.style.pointerEvents = "none";
            }, 300);
    
            // 리스트 닫을 때 창 크기를 줄이기 (스크롤 없이)
            window.electronAPI.resizeWindow(331, 500);
        } else {
            listPopup.style.visibility = "visible";
            listPopup.style.pointerEvents = "auto";
            listPopup.classList.add("active");
    
            // 리스트 열릴 때 창 크기 확장
            window.electronAPI.resizeWindow(629, 500);
        }
    });
    


    window.addEventListener("resize", function () {
        if (listPopup.classList.contains("active")) {
            updatePopupPosition();
        }
    });

    audioPlayer.addEventListener("loadedmetadata", function () {
        seekbar.max = audioPlayer.duration;
    });

    audioPlayer.addEventListener("timeupdate", function () {
        seekbar.value = audioPlayer.currentTime;
    });

    seekbar.addEventListener("input", function () {
        audioPlayer.currentTime = seekbar.value;
    });

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

    // Glow 애니메이션 (음악 재생 시 활성화)
    audioPlayer.addEventListener("play", function () {
        cover.classList.add("playing");
    });

    audioPlayer.addEventListener("pause", function () {
        cover.classList.remove("playing");
    });

    audioPlayer.addEventListener("ended", function () {
        cover.classList.remove("playing");
    });

    
   
    loadPlaylist();
});
