
// media controllers
const playPause = document.querySelector("#play-stop");
const backward = document.querySelector("#backward");
const forward = document.querySelector("#forward");

// record player animation
const circleBig = document.querySelector("#circle-bg");
const circleSm = document.querySelector("#circle-sm");

// playing song
const songName = document.querySelector("#song-name");
const author = document.querySelector("#author");
const audio = document.querySelector("#player_audio");
const coverArt = document.querySelector("#cover");
const musicbox = document.querySelector("#musicbox");

// control button images
let playImg = "./assets/images/play.svg";
let pauseImg = "./assets/images/pause.svg";

function dataplay() {
    $("#circle-bg").addClass("animate");
    $("#circle-sm").addClass("animate");
    playPause.src = pauseImg;
    /*  audio.play($('#player_audio').attr('data-src'));*/
}
function datapause() {
    playPause.src = playImg;
    $("#circle-bg").removeClass("animate");
    $("#circle-sm").removeClass("animate");
     pause();
}
function data_play() {
    var button_play = $('#play-stop').attr('data-val');
    if (button_play == 1) {
        dataplay();
        $('#play-stop').attr('data-val', '2');
        Metro.getPlugin("#player_audio", "audio-player").play();
    }
    else {
        datapause();
        $('#play-stop').attr('data-val', '1');
        Metro.getPlugin("#player_audio", "audio-player").pause();
    }
}


$(document).ready(function () {
    addEventListener("keypress", function (event) {
        if (event.keyCode == 32) {
            data_play()
        }
    });
    var search = window.location.search;
    var arrAudio = [];
    if (search) {
        var parameters = search.slice(1).split("&");
        parameters.forEach(function (p) {
            var split = p.split("=");
            var name = split[0];
            var value = split[1] || '';
            if (name != '') {
                arrAudio.push({
                    name: name,
                    value: decodeURIComponent(value)
                })
            }
        });
    }
    console.log(arrAudio)
    for (var i = 0; i < arrAudio.length; i++) {
        if (arrAudio[i].name == 'url') {
            $("#player_audio").attr('data-src', arrAudio[i].value ? JSON.stringify(arrAudio[i].value) : '');
        }
         if (arrAudio[i].name == 'image') {
             coverArt.src = arrAudio[i].value ? arrAudio[i].value : './assets/images/Share_Fb.jpg';
        }
         if (arrAudio[i].name == 'title') {
            songName.innerText = arrAudio[i].value ? arrAudio[i].value : '';
        }
         if (arrAudio[i].name == 'author') {
            author.innerText = arrAudio[i].value ? arrAudio[i].value : '';
        }
    }
});

// default controls
playPause.src = playImg;
let isPlaying = true;

// helper function
function createEle(ele) {
    return document.createElement(ele);
}
function append(parent, child) {
    return parent.append(child);
}

function playSong() {
    playPause.src = pauseImg;
    circleBig.classList.add("animate");
    circleSm.classList.add("animate");
}

function pauseSong() {
    playPause.src = playImg;
    circleBig.classList.remove("animate");
    circleSm.classList.remove("animate");
}

function playHandler() {
    isPlaying = !isPlaying;
    isPlaying ? pauseSong() : playSong();
}


// player event 
playPause.addEventListener("click", playHandler);

