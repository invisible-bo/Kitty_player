document.addEventListener("DOMContentLoaded", function () {
    const audioPlayer = document.getElementById("audioPlayer");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const seekbar = document.getElementById("seekbar");
    const closePopup = document.getElementById("closePopup");
    const listBtn = document.getElementById("listBtn");
    const listPopup = document.getElementById("listPopup");

    function updatePopupPosition() {
        listPopup.style.left = "100%"; // 🔥 player-container 오른쪽에 위치
        listPopup.style.top = "10px"; 
    }

    // 🔹 창이 로드되거나 크기가 변경될 때 위치 업데이트
    window.onload = updatePopupPosition;
    window.addEventListener("resize", updatePopupPosition);




    // list popup open & close with toggle
    listBtn.addEventListener("click", function () {
        listPopup.classList.toggle("active");
        
    });

    // X btn popup close
    closePopup.addEventListener("click", function () {
        listPopup.classList.remove("active");
    });



    //audio 로드, 길이에 맞춰서 seekbar max값 설정
    audioPlayer.addEventListener("loadedmetadata", function() {
        seekbar.max = audioPlayer.duration;
    });

    //audio 재생중일 때 seekbar 자동 업데이트
    audioPlayer.addEventListener("timeupdate", function() {
        seekbar.value = audioPlayer.currentTime;
    });

    //user가 seekbar 움직이면, 음악 재생 위치 변경
    seekbar.addEventListener("input", function() {
        audioPlayer.currentTime = seekbar.value;
    });


    playPauseBtn.addEventListener("click", function () {
        console.log(" 플레이 버튼 클릭됨");
        if (audioPlayer.paused) {
            // 음악 재생 & 버튼 변경
            audioPlayer.play();
            playPauseBtn.style.backgroundImage = 'url("assets/pausebtn.png")';
        } else {
            // 음악 일시 정지 & 버튼 변경
            audioPlayer.pause();
            playPauseBtn.style.backgroundImage = 'url("assets/playbtn.png")';
        }
    });
});

