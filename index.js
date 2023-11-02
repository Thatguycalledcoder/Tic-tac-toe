// Targetting the elements
const twoPlayerButton = document.querySelector("#p2");
const vsCPUButton = document.querySelector("#cpu");
const player1Name = document.querySelector("#player1-name");
const player2Info = document.querySelector("#player2");
const player2Name = document.querySelector("#player2-name");
const startButton = document.querySelector("#start");
const message = document.querySelector("#game-message");
const gridBoard = document.querySelector("#game-board");
const positions = document.querySelectorAll("#pos");
const markerX1 = document.querySelector("#X");
const markerX2 = document.querySelector("#X2");
const markerO1 = document.querySelector("#O");
const markerO2 = document.querySelector("#O2");
const restartButton = document.querySelector("#restart");

let markers = [];
let markerSelection = false;

for (const marker of [markerX2, markerO2]) {
    marker.style["opacity"] = 0.6;
}

startButton.setAttribute("disabled", true);

const selectGameMode = function(e) {
    if (e.target.id === "p2") {
        vsCPUButton.style["opacity"] = 0.6;
        twoPlayerButton.style["opacity"] = 1;

        if(getComputedStyle(player2Info).visibility == "hidden") {
            player2Info.style["visibility"] = "visible";
            player2Info.style["opacity"] = 1;
        }   
        if ((player2Name.value !== "" && player2Name.value !== null) && markerSelection) {
            startButton.removeAttribute("disabled");
        }
        else {
            startButton.setAttribute("disabled", true);
        }
    }
    else if(e.target.id === "cpu") {
        twoPlayerButton.style["opacity"] = 0.6;
        vsCPUButton.style["opacity"] = 1;

        if(getComputedStyle(player2Info).visibility == "visible") {
            player2Info.style["visibility"] = "hidden";
            player2Info.style["opacity"] = 0;
        }
        if ((player1Name.value !== "" && player1Name.value !== null) && markerSelection) {
            startButton.removeAttribute("disabled");
        }
        else {
            startButton.setAttribute("disabled", true);
        }
    } 
}

const selectMarker = function(e) {
    e.stopPropagation();
    markerSelection = true;
    if (e.target.id === "X") {
        markerX1.style["opacity"] = 1;
        markerO2.style["opacity"] = 1;

        markerO1.style["opacity"] = 0.6;
        markerX2.style["opacity"] = 0.6;
        markers = ["X", "O"];
    }
    else if(e.target.id === "O") {
        markerO1.style["opacity"] = 1;
        markerX2.style["opacity"] = 1;

        markerX1.style["opacity"] = 0.6;
        markerO2.style["opacity"] = 0.6;
        markers = ["O", "X"];
    }

    if(getComputedStyle(player2Info).visibility == "hidden") {
        if ((player1Name.value !== "" && player1Name.value !== null) && markerSelection) {
            startButton.removeAttribute("disabled");
        }
        else {
            startButton.setAttribute("disabled", true);
        }
    }
    else if(getComputedStyle(player2Info).visibility == "visible") {
        if ((player2Name.value !== "" && player2Name.value !== null) && markerSelection) {
            if ((player1Name.value !== "" && player1Name.value !== null) && markerSelection) {
                startButton.removeAttribute("disabled");
            }
            else {
                startButton.setAttribute("disabled", true);
            }
        }
    } 
}

const enableStart = function(e) {
    e.stopPropagation();
    if (player1Name.value !== null && player1Name.value !== "") {
        if (getComputedStyle(player2Info).visibility == "hidden") {
            startButton.removeAttribute("disabled");
        }
        else if (getComputedStyle(player2Info).visibility == "visible" ) {
            if (player2Name.value !== "" && player2Name.value !== null) {
                startButton.removeAttribute("disabled");
            }
            else {
                startButton.setAttribute("disabled", true);
            }
        }
    }
    else if (player1Name.value == null || player1Name.value == "") {
        startButton.setAttribute("disabled", true);
    }
}

const restart = function(e) {
    e.stopPropagation();
    message.textContent = "";
    for (const position of positions) {
        position.removeAttribute("disabled");
        position.innerText = "";
    }
    restartButton.setAttribute("hidden", true);
    startGame(message, positions, markers[0], markers[1]);
}

const start = function (e) {
    e.stopPropagation();
    startButton.setAttribute("disabled", true);
    startGame(message, positions, markers[0], markers[1]);
}

for (const button of [twoPlayerButton, vsCPUButton]) {
    button.addEventListener("click", selectGameMode, false)
}
for (const input of [player1Name, player2Name]) {
    input.addEventListener("input", enableStart);
}
for (const marker of [markerX1, markerO1]) {
    marker.addEventListener("click", selectMarker);
}

startButton.addEventListener("click", start);
restartButton.addEventListener("click", restart);
// Creating the objects
// Gameboard - module
const game = function () {
    return (function GameBoard() {
        const board = [];
        for (let i = 0; i < 9; i++) {
            board.push("-")
        }
    
        const getPosition = function(index) {
            return board[index];
        }
    
        const addMarker = function(index, marker, positions) {
            board.splice(index, 1, marker);
            positions[index].innerText = marker;
            if (marker == "X") {
                positions[index].style["color"] = "blue";
            }
            else {
                positions[index].style["color"] = "orange";
            }
        }
    
        const checkBoard = function(player) {
            let isThree = false;
            let message = "";
    
            // Check if every spot on the board has a marker = draw
            if (!board.includes("-")) {
                isThree = "Draw";
                message = "It's a draw!";
                return [ isThree, message ];
            }
            else if (
                // Check rows
                [board[0], board[1], board[2]].every(checkMarker) ||
                [board[3], board[4], board[5]].every(checkMarker) ||
                [board[6], board[7], board[8]].every(checkMarker) ||
                // Check columns
                [board[0], board[3], board[6]].every(checkMarker) ||
                [board[1], board[4], board[7]].every(checkMarker) ||
                [board[2], board[5], board[8]].every(checkMarker) ||
                // Check diagonals
                [board[0], board[4], board[8]].every(checkMarker) ||
                [board[2], board[4], board[6]].every(checkMarker) 
            ) {
                isThree = true;
                message = `${player.name} wins!!`;
                return [ isThree, message ];
            }
            return [ isThree ];

            function checkMarker(position) {
                return position === player.marker;
            }
        }

        return { getPosition, addMarker, checkBoard }
    })();
}

// Player - factory function
function createPlayer(name, marker) {
    return {name, marker};
}

// player move
function playerMove(board, player, positions) {
    let index = parseInt(prompt("Choose position to play[0-8]"));
    while (board.getPosition(index) === "O" || board.getPosition(index) === "X") {
        index = parseInt(prompt("Incorrect position. Choose position to play"));
    }
    board.addMarker(index, player.marker, positions);
}

// Game flow - factory function
function startGame(message, positions, player1Marker, player2Marker) {

    const gameBoard = game();

    // Create first player
    const player1 = createPlayer(player1Name.value, player1Marker);

    // Create second player
    const player2 = createPlayer(player2Name.value, player2Marker);

    message.textContent = `Welcome to the game ${player1.name}. Your marker is ${player1.marker}\nWelcome to the game ${player2.name}. Your marker is ${player2.marker}`;
    
    let isOver = false;
    let playerTurn = 1;
    
    function playerMove2(e) {
        e.stopPropagation();
        let player = null;
        if (playerTurn === 1) {
           player = player1;
           playerTurn = 2;
        }
        else {
            player = player2;
            playerTurn = 1;
        }

        let index = e.target.dataset.index;
        gameBoard.addMarker(index, player.marker, positions);
        let check = gameBoard.checkBoard(player);
        isOver =  check[0];

        if (isOver) {
            message.textContent = check[1];
            
            for (const position of positions) {
                position.setAttribute("disabled", true);
            }
            restartButton.removeAttribute("hidden");
        }
        else {
            if (playerTurn === 1) {
                message.textContent = `${player1.name}'s turn to make a move.`;
            }
            else {
                message.textContent = `${player2.name}'s turn to make a move.`;
            }
        }
    }

    for (const position of positions) {
        position.addEventListener("click", playerMove2);
    }

    message.textContent = `${player1.name}'s turn to make a move.`;
}
