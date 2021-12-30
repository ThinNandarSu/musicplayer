// console.log(allMusic[1]);
const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    mainAudio = wrapper.querySelector("#main-audio"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = progressArea.querySelector(".progress-bar"),
    musicList = wrapper.querySelector(".music-list"),
    moreMusicBtn = wrapper.querySelector("#more-music"),
    closemoreMusic = musicList.querySelector("#close");

const ulTag = wrapper.querySelector("ul");
// console.log(ulTag);

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
// isMusicPaused = true;


loadAllMusic();

window.addEventListener("load", () => {
    // loadAllMusic();
    loadMusic(musicIndex);
    playingSong();
});

function loadMusic(indexNumb) {
    // console.log(allMusic[indexNumb - 1]);
    musicName.innerText = allMusic[indexNumb - 1].name;

    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;

    // console.log(musicName);
}

//play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//for paused
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//for previous
function prevMusic() {
    musicIndex--;
    //last music play when array start
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//for next
function nextMusic() {
    musicIndex++;
    // the first music play when array end
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// play or pause 
playPauseBtn.addEventListener("click", () => {
    const isMusicPlay = wrapper.classList.contains("paused");
    isMusicPlay ? pauseMusic() : playMusic(); //  isPlayMusic is true then call pauseMusic function
    playingSong();
});

//work only click prev btn
prevBtn.addEventListener("click", () => {
    prevMusic();
});

//work only click next btn
nextBtn.addEventListener("click", () => {
    nextMusic();
});

// update progress bar width
mainAudio.addEventListener("timeupdate", (e) => {

    const currentTime = e.target.currentTime; // current play song 
    const duration = e.target.duration; // current play song 

    let progressBarWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressBarWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current-time"),
        musicDuartion = wrapper.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", () => {

        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if (totalSec < 10) { // sec < 10 then add 0 => 05
            totalSec = `0${totalSec}`;
        }
        musicDuartion.innerText = `${totalMin}:${totalSec}`;
    });
    // playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) { // sec < 10 then add 0 => 05
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song of currentTime when click progress bar
progressArea.addEventListener("click", (e) => {
    let progressBarWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressBarWidth) * songDuration;
    playMusic();
    playingSong();
});


//show music list box when headphone icon click
moreMusicBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

//close music list box when cross icon click
closemoreMusic.addEventListener("click", () => {
    moreMusicBtn.click();
});



function loadAllMusic() {
    const liTag = ulTag.querySelectorAll("li");

    if (liTag.length != 0) {
        for (let i = 0; i < liTag.length; i++) {
            liTag[i].remove();
        }
    }

    for (let i = 0; i < allMusic.length; i++) {
        let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                    </div>
                    <span id="${allMusic[i].src}" class="audio-duration"></span>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                </li>`;
        ulTag.insertAdjacentHTML("beforeend", liTag); //insert to myplaylist

        let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
        let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
        liAudioTag.addEventListener("loadeddata", () => {
            let duration = liAudioTag.duration;
            let totalMin = Math.floor(duration / 60);
            let totalSec = Math.floor(duration % 60);
            if (totalSec < 10) { //if sec < 10 => add 0 before
                totalSec = `0${totalSec}`;
            };
            liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`;
            liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
        });
    }


}

//onclick of li tag and play song
function playingSong() {
    const allLiTag = ulTag.querySelectorAll("li");

    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-duration");

        if (allLiTag[j].classList.contains("playing")) {
            allLiTag[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }


        if (allLiTag[j].getAttribute("li-index") == musicIndex) {
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "Playing"; // add Playing text on current play song
        }

        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}

//li clicked function
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    // console.log(musicIndex);
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

const screenlist = document.querySelector(".list");
const trTag = screenlist.querySelector(".song");

for (let i = 0; i < todayhit.length; i++) {

    const imgtdy = todayhit[i].img;

    // add today list 
    let trTag = `<tr class="song">
                <td class="nr"><h5>${i + 1}</h5></td>
                <td class="tdyimg" style="width: 100px;"><img src="images/${imgtdy}.jpg" style="max-height:100%; max-width:100%"/>   
                <td class="title"><h6>${todayhit[i].name}</h6></td>
                <td class="length"><h5 style="width:100px">${todayhit[i].artist}</h5></td>
                <td style="width:56px;"><input type="checkbox" id="heart${i + 1}"><label for="heart${i + 1}" class="icons" tag="${i + 1}"></label></td>
            </tr>`;
    screenlist.insertAdjacentHTML("beforeend", trTag);
};



// for (let i = 0; i < allMusic.length; i++) {
//     const heartclick = document.getElementById(`heart${i + 1}`);
//     heartclick.addEventListener('click', (e) => {

//             // console.log(e.target); 
//             const heartid = e.target.id;
//             const heartindex = +heartid.charAt(heartid.length - 1);

//             // console.log(typeof heartindex);

//             // let addnew = `
//             // <li li-index="${allMusic.length + 1}">
//             //     <div class="row">
//             //         <span>${todayhit[i].name}</span><p>${todayhit[i].artist}</p>
//             //     </div>
//             //         <span id="${todayhit[i].src}" class="audio-duration">3:40</span>
//             //         <audio class="${todayhit[i].src}" src="songs/${todayhit[i].src}.mp3"></audio>
//             // </li>`;

//             // ulTag.insertAdjacentHTML("beforeend", addnew);

//             allMusic.push(todayhit[i]);
//             console.log(allMusic);
//             loadAllMusic();

//             loadMusic(allMusic.length);
//             playingSong();
//         }
//     )
// }
// ;

const heartclick = document.getElementsByClassName('icons');
for (let i = 0; i < heartclick.length; i++) {
    heartclick[i].addEventListener('click', (e) => {
        // const heartid = e.target.id;
        // const heartindex = +heartid.charAt(heartid.length - 1);
        // console.log(heartindex)


        allMusic.push(todayhit[i]); // add heartclick song to all music list 

        // console.log(allMusic);
        loadAllMusic();

        loadMusic(allMusic.length);
        playingSong();
    });
}