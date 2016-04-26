/* ---- GLOBAL VARIABLES ---- */
var socket = io.connect();
var timer;
var playerArray;
var spectators;
var readyPlayers;
var playerOneOrTwo;

var serverProcentUpper;
var serverProcentDown;

var player1, player2, ball, maxX, maxY, balkWidth, balkHeight, ballWidth, X1,Y1, X2, Y2, ballX, ballY, fieldWidth, fieldHeight;
var timer;




/* ---- WHEN THE DOM HAS BEEN LOADED ---- */
document.addEventListener("DOMContentLoaded", function() {
	//toon de twee divs en geef ze beide een eventhandler.
	toonChoice();
	//this refreshes the array every 25 ms.
	timer = setInterval(function() {
		refresh();
		/* FOR DEBUGGING */
		console.clear();
		console.log("--------------------------------");
		console.log("Player 1: " + playerArray[0]);
		console.log("Player 2: " + playerArray[1]);
		console.log("Amount of spectators: " + spectators);
		console.log("Is player 1 ready? " + readyPlayers[0]);
		console.log("Is player 2 ready? " + readyPlayers[1]);
		
		if(playerArray[0] != "empty" && playerArray[1] != "empty") {
			var playerButton = document.getElementById("playerChoice");
			playerButton.innerHTML = "";
			playerButton.innerHTML = "Cannot choose player, already two readying up. Spectate instead!";


			if (readyPlayers[0] == true && readyPlayers[1] == true) {
				if ("/#" + socket.id == playerArray[0] || "/#" + socket.id == playerArray[1]) {
					//If you're a player
					console.log("Are both players ready: true.");
					console.log("--------------------------------");
					console.log("Stopped timer for data");
					clearInterval(timer);
					showFieldForPlayers();
					resetPositionsAtServer();
					showPlayers();
					startGame();
				} else {
					//SPECTATOR
					//do nothing
					var playerButton2 = document.getElementById("playerChoice");
					playerButton2.innerHTML = "";
					playerButton2.innerHTML = "Cannot choose player, already two readying up. Spectate instead!";
				}
			}
		} else {
			var playerButton2 = document.getElementById("playerChoice");
			playerButton2.innerHTML = "";
			playerButton2.innerHTML = "Choose player!";

		}
	}, 250);
});
//this function asks for the array that fills in the global vars. Loops every 250ms.
function refresh() {
	socket.emit("askArray");
	socket.on("giveArray", function(data) {
		playerArray = data.playerArray;
		spectators = data.spectators;
		readyPlayers = data.readyPlayers;
	})
}
//Shows two buttons, spectator or player and gives them an eventlistener.
function toonChoice() {
	var choices = document.getElementById("choices");
	var playerChoice = document.getElementById("playerChoice");
	var spectatorChoice = document.getElementById("spectatorChoice");
	playerChoice.style.backgroundColor = "blue";
	spectatorChoice.style.backgroundColor = "grey";
	playerChoice.style.width = "50%";
	spectatorChoice.style.width = "50%";
	playerChoice.style.height = "100vh";
	spectatorChoice.style.height = "100vh";
	playerChoice.style.float = "left";
	spectatorChoice.style.float = "left";
	playerChoice.innerHTML = "Choose player!";
	spectatorChoice.innerHTML = "Choose spectator!";

	playerChoice.addEventListener("click", function() {
		choosePlayer();
	});

	spectatorChoice.addEventListener("click", function() {
		chooseSpectator();
	});
}
/* -------------------------------------- */



/* ---- PLAYER EVENTS ---- */
//Event for when you choose to be a player.
function choosePlayer() {
	console.log("i want to be a player");

	if(playerArray[0] == "empty" || playerArray[1] == "empty") {
		socket.emit("pushMeAsPlayer");
		showReadyUpButton();
	} else {
		//Sorry, but there are two players
	}

}
//When you selected to be a player, there needs to be a readybutton.
function showReadyUpButton() {
	var choices = document.getElementById("choices");
	var readyButton = document.getElementById("readyUpButton");
	choices.style.display = "none";
	readyButton.style.display = "block";
	readyButton.innerHTML = "NOT READY";

	readyButton.addEventListener("click", function() {
		readyUp();
	});
}
//when the player selects he's ready.
function readyUp() {
	var readyButton = document.getElementById("readyUpButton");
	readyButton.innerHTML = "";
	readyButton.style.backgroundColor = "green";
	readyButton.innerHTML = "READY";
	socket.emit("pushMeReady");
}
//When readied up, the players get to see the field too, but WITH buttons.
function showFieldForPlayers() {
	var readyUpButton = document.getElementById("readyUpButton");
	readyUpButton.style.display = "none";
	var playField = document.getElementById("playField");
	playField.style.display = "block";
}
//When the field has been shown, show the players.
function showPlayers() {
	var field = document.getElementById("field");


	maxX = fieldWidth = field.clientWidth;
	maxY = fieldHeight = field.clientHeight;

	balkWidth = fieldWidth/10;
	balkHeight = fieldWidth/100;

	player1 = document.createElement("div");
	player2 = document.createElement("div");
	ball = document.createElement('div');

	player1.style.width = balkWidth + "px";
	player2.style.width = balkWidth + "px";

	//set classes & id's
	player1.id = "player1";
	player2.id = "player2";
	ball.id = "ball";

	player1.className = "balk";
	player2.className = "balk";



	ballWidth = ball.clientWidth;

	X1 = maxX - balkWidth;
	Y1 = 0;

	X2 = maxX - balkWidth;
	Y2 = maxY;

	ballX = maxX/2 - ballWidth/2;
	ballY = maxY/2 - ballWidth/2;

	player1.style.backgroundColor = "yellow";
	player2.style.backgroundColor = "yellow";

	field.appendChild(player1);
	field.appendChild(player2);
	field.appendChild(ball);

	init();

	/*
	 document.addEventListener("keydown", move, false);
	 */
	// X1 of X2 sturen naar server

	if(playerArray[0] == "/#" + socket.id) {

		playerOneOrTwo = 1;
		document.getElementById("leftButton").addEventListener("mousedown", function() {
			movePlayerOne("left");
		}, false);
		document.getElementById("rightButton").addEventListener("mousedown", function() {
			movePlayerOne("right");
		}, false);

	} else {
		var field = document.getElementById("field");
		field.style.webkitTransform = "rotate(180deg)";
		field.style.webkitTransform = "scaleY(-1)";
		playerOneOrTwo = 2;
		document.getElementById("leftButton").addEventListener("mousedown",function() {
			movePlayerTwo("left")
		}, false);
		document.getElementById("rightButton").addEventListener("mousedown", function() {
			movePlayerTwo("right")
		}, false);

	}
}
//1) ask positions at server 2) updatePlayers their positions with the positions
function init(){
	refreshPositions();
	updatePlayers();
}
//Gets the info from the server and pushes them in global vars in our client.
function refreshPositions() {
    socket.emit("askPositions");
    socket.on("givePositions", function(data){
        serverProcentUpper = data.data.playerTwoX;
        serverProcentDown = data.data.playerOneX;
    });
    updatePlayers();
}
//update player when they get info from the server.
function updatePlayers(){
    if(playerOneOrTwo == 1) {
        player1.style.left = maxX / 100 * serverProcentUpper + "px";
        player1.style.top = Y1 + 20 +"px";

        player2.style.left = maxX / 100 * serverProcentDown - balkWidth +"px";
        player2.style.top = maxY- 20 +"px";
    } else {

        player1.style.left = maxX / 100 * serverProcentUpper + "px";
        player1.style.top = Y1 + 20 +"px";

        player2.style.left = maxX / 100 * serverProcentDown - balkWidth +"px";
        player2.style.top = maxY- 20 +"px";
    }
}
/* ----------------------- */



/* ---- MOVE EVENTS ---- */
function movePlayerOne(direction) {
    if(direction == "left") {
        socket.emit("movePlayerOneLeft");
        refreshPositions();
    }
    if(direction == "right") {
        socket.emit("movePlayerOneRight");
        refreshPositions();
    }
    updatePlayers();
}
function movePlayerTwo(direction) {
    if(direction == "left") {
        socket.emit("movePlayerTwoLeft");
    }
    if(direction == "right") {
        socket.emit("movePlayerTwoRight");
    }
    updatePlayers();
}
/* --------------------- */

/* ---- RESET EVENTS ---- */
function resetPositionsAtServer() {
	socket.emit("resetPos");
}
/* ---------------------- */


/* ---- SPECTATOR EVENTS ---- */
//Event for when you choose to be a spectator.
function chooseSpectator() {
	showFieldForSpectators();
	showPlayers();
	startSpectating();
}
//When a spectator goes to the spectator room, it has to show the spectator field.
//Ofcourse, the spectator has no buttons.
function showFieldForSpectators() {
	var choices = document.getElementById("choices");
	var playField = document.getElementById("playField");
	var buttons = document.getElementById("buttons");

	choices.style.display = "none";
	playField.style.display = "block";
	playField.style.height = "100vh";
	buttons.style.display = "none";
}
//Function that updates the spectating game
function startSpectating() {
	function mainLoop() {
		refreshPositions();
		updatePlayers();
		setTimeout(mainLoop, 25);
	}
	mainLoop();
}
/* --------------------------- */


/* ---- MAIN GAME LOOP ---- */
function startGame() {
	function mainLoop() {
		refreshPositions();
		updatePlayers();
		setTimeout(mainLoop, 25);
	}
	mainLoop();
}
/* ----------------------- */








