/* --- Doc Title Changer --- */
let docTitle = document.title;
window.addEventListener("blur", () => {
    document.title = "Play game instead! 😉";
});

window.addEventListener("focus", () => {
    document.title = docTitle;
});

/* -------------------------- Toggle Navbar ---------------------*/
const navToggler = document.querySelector(".nav-toggler");
navToggler.addEventListener("click", () => {
    hideSection();
    toggleNavbar();
    document.body.classList.toggle("hide-scrolling");
});
function hideSection() {
    document.querySelector("section.active").classList.toggle("fade-out");
}
function toggleNavbar() {
    document.querySelector(".header").classList.toggle("active");
}

/*--------------- Active Section -------------------------- */
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("link-item") && e.target.hash !== "") {
        // active the overlay to prevent multiple clicks
        document.querySelector(".overlay").classList.add("active");
        navToggler.classList.add("hide")
        if (e.target.classList.contains("nav-item")) {
            toggleNavbar();
        }
        else {
            hideSection();
            document.body.classList.add("hide-scrolling");
        }
        setTimeout(() => {
            document.querySelector("section.active").classList.remove("active", "fade-out");
            document.querySelector(e.target.hash).classList.add("active");
            window.scrollTo(0, 0);
            document.body.classList.remove("hide-scrolling");
            document.querySelector(".overlay").classList.add("active");
            navToggler.classList.remove("hide");
            document.querySelector(".overlay").classList.remove("active");
        }, 500);
    }
})

/*-------------About Tabs -------------*/
const tabsContainer = document.querySelector(".about-tabs"),
    aboutSelection = document.querySelector(".about-section");

tabsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("tab-item") && !e.target.classList.contains("active")) {
        tabsContainer.querySelector(".active").classList.remove("active");
        e.target.classList.add("active");
        const target = e.target.getAttribute("data-target");
        aboutSelection.querySelector(".tab-content.active").classList.remove("active");
        aboutSelection.querySelector(target).classList.add("active");
    };
});

/* ----------- Work Item Details Popup --------------- */
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-project-btn")) {
        toggleWorkPopup();
        document.querySelector(".work-popup").scrollTo(0, 0)
        workItemDetails(e.target.parentElement);
    }
})
function toggleWorkPopup() {
    document.querySelector(".work-popup").classList.toggle("open");
    document.body.classList.toggle("hide-scrolling");
    document.querySelector(".main").classList.toggle("fade-out");
}
document.querySelector(".pp-close").addEventListener("click", toggleWorkPopup);

/* hide popup when clicking outside of it */
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("pp-inner")) {
        toggleWorkPopup();
    }
})

function workItemDetails(workItem) {
    document.querySelector(".pp-thumbnail img").src =
        workItem.querySelector(".work-item-thumbnail img").src;

    document.querySelector(".pp-header h3").innerHTML =
        workItem.querySelector(".work-item-title").innerHTML;

    document.querySelector(".pp-body").innerHTML =
        workItem.querySelector(".work-item-details").innerHTML;
}

/*Clock Format*/

function showTime() {
    let date = new Date();
    let hours = date.getHours();     // 0 - 23
    let minuits = date.getMinutes(); // 0 - 59
    let seconds = date.getSeconds(); // 0 - 59

    let year = date.getFullYear();

    let formatHours = convertFormat(hours);

    hours = checkTime(hours);

    hours = addZero(hours);
    minuits = addZero(minuits);
    seconds = addZero(seconds);

    document.getElementById('clock').innerHTML = `😎 ${hours} : ${minuits} : ${seconds} : ${formatHours}`;
    document.getElementById('year').innerHTML = `&copy; ${year} `;
}

function convertFormat(time) {
    let format = 'AM 😎';

    if (time >= 12) {
        format = 'PM 😎';
    }
    return format;
}

function checkTime(time) {
    if (time > 12) {
        time = time - 12;
    }

    if (time === 0) {
        time = 12;
    }

    return time;
}


function addZero(time) {
    if (time < 10) {
        time = '0' + time;
    }
    return time;
}


showTime();
setInterval(showTime, 1000);

/* For Audio lets goo */

// var pause = document.querySelector(".pause");
// var audio = document.querySelector(".audio");

// function togglePlay() {
//     if (audio.paused) {
//         audio.play();
//         pause.innerHTML = "🔇";
//     } else {
//         audio.pause();
//         pause.innerHTML = "🔊";
//         pause.style.color = " #848484";
//     }
// }

// Preloader
var loader = document.getElementById("preloader");
window.addEventListener("load", function () {
    loader.style.display = "none"
})

// Gaming Console Start
const playerScore = document.getElementById("playerScore");
const playerChoice = document.getElementById("playerChoice");

const computerScore = document.getElementById("computerScore");
const computerChoice = document.getElementById("computerChoice");

const playerRock = document.getElementById("playerRock");
const playerPaper = document.getElementById("playerPaper");
const playerScissors = document.getElementById("playerScissors");

const computerRock = document.getElementById("computerRock");
const computerPaper = document.getElementById("computerPaper");
const computerScissors = document.getElementById("computerScissors");

const resultText = document.getElementById("resultText");

// const allGameImage = document.getElementById("playerRock", "playerPaper", "playerScissors", "computerRock", "computerPaper", "computerScissors");
const allGameImage = document.querySelectorAll('img');

const selections = {
    Rock: { name: 'Rock', defeat: 'Scissors' },
    Paper: { name: 'Papper', defeat: 'Rock' },
    Scissors: { name: 'Scissors', defeat: 'Paper' }
};

let computerSelect = '';
let playerScoreNumber = 0;
let computerScoreNumber = 0;

// Update Score
function updateScore(playerSelect) {
    // console.log(playerSelect, computerSelect);
    const select = selections[playerSelect]
    if (playerSelect === computerSelect) {
        resultText.textContent = "It's a Tie!";
        // document.body.style.backgroundColor = "white";
    }
    else if (select.defeat.indexOf(computerSelect) > -1) {
        resultText.textContent = "You Won!";
        playerScoreNumber++;
        playerScore.textContent = playerScoreNumber;
    } else {
        resultText.textContent = "You Lose!"
        computerScoreNumber++;
        computerScore.textContent = computerScoreNumber;
    }
}

// Random no. selection for computer
function computerRandomSelect() {
    const computerSelectNumber = Math.random();

    if (computerSelectNumber < 0.3) {
        computerSelect = 'Rock';
    }
    else if (computerSelectNumber <= 0.7) {
        computerSelect = 'Paper';
    }
    else {
        computerSelect = 'Scissor'
    }
    //  console.log(computerSelect);
    displayComputerSelect(computerSelect);

}

// Passing Computer selection
function displayComputerSelect(computerSelect) {
    switch (computerSelect) {
        case 'Rock':
            computerRock.classList.add('selected');
            computerChoice.textContent = '-- Rock';
            break;

        case 'Paper':
            computerPaper.classList.add('selected');
            computerChoice.textContent = '-- Paper';
            break;

        case 'Scissors':
            computerScissors.classList.add('selected');
            computerChoice.textContent = '-- Scissor';
            break;

        default:
            break;
    }
}

// Reset selected
function resetSelected() {
    allGameImage.forEach((img) => {
        img.classList.remove('selected')
    })
}

// Player Selection
function select(playerSelect) {
    resetSelected()
    // Styling the playerSelection
    switch (playerSelect) {
        case 'Rock':
            playerRock.classList.add('selected');
            playerChoice.textContent = '-- Rock';
            break;

        case 'Paper':
            playerPaper.classList.add('selected');
            playerChoice.textContent = '-- Paper';
            break;

        case 'Scissors':
            playerScissors.classList.add('selected');
            playerChoice.textContent = '-- Scissor';
            break;

        default:
            break;
    }
    computerRandomSelect();
    updateScore(playerSelect);
}

// Gaming Console End