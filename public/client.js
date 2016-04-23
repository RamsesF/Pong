/* ---- GLOBAL VARIABLES ---- */
var socket = io.connect();
var timer;
var playerArray;
var spectators;
var readyPlayers;



/*
  ! TO DO LIST !
   -show player divs, zie showPlayers();
   -update them, zie refreshPositions
   this is what you get from the server:

 var normalData = {
 playerOneX: 50,
 playerTwoX: 50,
 ballX: 50,
 ballY: 50
 };

  -
  - WIN EVENT


 */

/* ---- WHEN THE DOM HAS BEEN LOADED ---- */
document.addEventListener("DOMContentLoaded", function() {
	//toon de twee divs en geef ze beide een eventhandler.
	toonChoice();
	//this refreshes the array every 25 ms.
	timer = setInterval(function() {
		refresh();
		/* FOR DEBUGGING */
		console.clear();
		console.log("Player 1: " + playerArray[0]);
		console.log("Player 2: " + playerArray[1]);
		console.log("Amount of spectators: " + spectators);
		console.log("Is player 1 ready? " + readyPlayers[0]);
		console.log("Is player 2 ready? " + readyPlayers[1]);

		if(readyPlayers[0] == true && readyPlayers[1] == true) {
			console.log("Are both players ready: true.");
			console.log("--------------------------------");
			console.log("Stopped timer for data");
			clearInterval(timer);
			startGame();
		} else {
			console.log("Are both players ready: false");
			console.log("--------------------------------");
		}



		//Check if both players are ready
		//if they are ready, start a countdown on both clients
		
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


/* ---- PLAYER EVENTS ---- */
//Event for when you choose to be a player.
function choosePlayer() {
	console.log("i want to be a player");
	socket.emit("pushMeAsPlayer");
	showReadyUpButton();
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
	console.log("You are ready!");
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
/* ----------------------- */



/* ---- SPECTATOR EVENTS ---- */
//Event for when you choose to be a spectator.
function chooseSpectator() {
	console.log("I chose to be a spectator!");
	socket.emit("pushMeAsSpectator");
	showFieldForSpectators();
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
/* --------------------------- */










//this function loops every 300ms, and will ask the pos of the players and ball
// to the server. This one is required for the startGame() function.
function refreshPositions() {
	socket.emit("askPositions");
	socket.on("givePositions", function(data) {
		//data will give you the object.
		/*
			This is how it should look when you get it:
			var normalData = {
			playerOneX: 50,
			playerTwoX: 50,
			ballX: 50,
			ballY: 50
		};
		*/



	});
}

/* MAIN GAME LOOP */
function startGame() {
	console.log("Game starting...");
	console.log("Showing field for players...");
	showFieldForPlayers();
	console.log("Resetting positoins in server...");
	resetPositionsAtServer();
	console.log("Showing players...");
	showPlayers();
	console.log("Starting Gameloop...");
	var timer2 = setInterval(function(){
		refreshPositions();
	}, 300);
}


function resetPositionsAtServer() {
	socket.emit("resetPos");
}




function showPlayers() {


	var field = document.getElementById("field");

	var player1 = document.createElement("div");
	var player2 = document.createElement("div");

	field.appendChild(player1);
	field.appendChild(player2);


	player1.id = "player1";
	player2.id = "player2";

	player1.style.height = field.offsetHeight / 100;
	player2.style.height = field.offsetHeight / 100;

	player1.style.width = field.offsetWidth / 10;
	player2.style.width = field.offsetWidth / 10;

	player1.style.float = "left";
	player2.style.float = "left";

	player1.style.backgroundColor = "yellow";
	player2.style.backgroundColor = "yellow";




};