console.log("jai mata di!");
let songs;
let currFolder;
let currentSong = new Audio();
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
  
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    console.log(as)
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])

        }
        

    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img id="list" class="invert " src="img/music.svg" alt="">
                        <div class="info">
                            <div>${(song.replaceAll("%20", " ")).replaceAll("mp3","")}</div>
                            <div></div>
                        </div>
                        <div class="playnow">
                        <span></span>
                        <img class="invert play2" src="img/play.svg" alt="">
                        </div></li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/song/"+track)
    currentSong.src = `/${currFolder}/` + track
   
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = ((decodeURI(track))).replaceAll("mp3","")
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}


async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".cardContainer")
    let array=Array.from(anchors)
    for(let index = 0; index<array.length ; index++){
        const e = array[index];

   
        
        if (e.href.includes("/songs")) {
            console.log(e.href)
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML=cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <div class="size"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30"
                                    height="30">
                                    <!-- Green Circle Background -->
                                    <circle cx="12" cy="12" r="12" fill="#1fdf64" />

                                    <!-- Original SVG Path with adjusted stroke color -->
                                    <path
                                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                        stroke="#1fdf64" stroke-width="1.5" stroke-linejoin="round" fill="black" />
                                </svg>
                            </div>


                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h4>${response.title}</h4>
                        <p>${response.description}</p>
                    </div>`
        }
    
    }
     //load the playlists when card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
}

async function main() {

    await getSongs("songs/arijit")
    playMusic(songs[0], true)
    console.log(songs)

await displayAlbums()
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })


    //to move circle 
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //ading eventlistener to hamburger
    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".cross").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-150%"
    })

    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
        else if (index == 0) {
            index = (songs.length) - 1;
            playMusic(songs[index])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    
        else if (index == (songs.length) - 1) {
            index = 0
            playMusic(songs[index])
       }
    })

   
}
main()