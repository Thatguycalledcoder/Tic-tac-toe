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
    
        const addMarker = function(index, marker) {
            board.splice(index, 1, marker);
        }
    
        const display = function() {
            console.log(
                `
                 ${board[0]} || ${board[1]} || ${board[2]}
                ---||---||---
                 ${board[3]} || ${board[4]} || ${board[5]}
                ---||---||---
                 ${board[6]} || ${board[7]} || ${board[8]}
                `
            );
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

        return { getPosition, addMarker, display, checkBoard }
    })();
}

// Player - factory function
function createPlayer(name, marker) {
    return {name, marker};
}

// player move
function playerMove(board, player) {
    let index = parseInt(prompt("Choose position to play[0-8]"));
    while (board.getPosition(index) === "O" || board.getPosition(index) === "X") {
        index = parseInt(prompt("Incorrect position. Choose position to play"));
    }
    board.addMarker(index, player.marker);
}

// Game flow - factory function
function startGame() {

    const gameBoard = game();

    // Create first player
    const player1Name = prompt("Enter your name:")
    let player1Marker = prompt("Choose your marker (O or X):");
    console.log(player1Marker);
    while ((player1Marker !== "O") && (player1Marker !== "X")) {
        player1Marker = prompt("Marker must either be 'X' or 'O'. Choose your marker (O or X):");
        console.log(player1Marker);
    }
    const player1 = createPlayer(player1Name, player1Marker);

    // Create second player
    const player2Name = prompt("Enter 2 your name:");
    const player2Marker = player1.marker === "X" ? "O" : "X";
    console.log(player2Marker);
    const player2 = createPlayer(player2Name, player2Marker);

    console.log(`Welcome to the game ${player1.name}. Your marker is ${player1.marker}`);
    console.log(`Welcome to the game ${player2.name}. Your marker is ${player2.marker}`);

    gameBoard.display();

    let isOver = false;
    let message = "";
    let playerTurn = 1;
    while (!isOver) {
        if (playerTurn === 1) {
            playerMove(gameBoard, player1);
            gameBoard.display();
            let check = gameBoard.checkBoard(player1);
            message = check[1]
            isOver = check[0];
            playerTurn = 2;
        }
        else {
            playerMove(gameBoard, player2);
            gameBoard.display();
            let check = gameBoard.checkBoard(player2);
            message = check[1]
            isOver = check[0];
            playerTurn = 1;
        }
        
        
    }
    console.log(message);
}

// startGame();