/* ---- GLOBAL VARIABLES ---- */
var socket = io.connect();
var timer;
var playerArray;
var spectators;
var readyPlayers;
var playerOneOrTwo;

var serverProcentUpper;
var serverProcentDown;

var score = [0,0];

var player1, player2, ball, scoreDiv, spectatorsDiv;
var maxX, maxY, balkWidth, balkHeight, ballWidth, X1,Y1, X2, Y2, ballX, ballY, fieldWidth, fieldHeight;
var timer;
var gameRunning = false;




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
			playerButton.innerHTML = "Players full!";


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
					gameRunning = true;
					startGame();
				} else {
					//SPECTATOR
					//do nothing
					var playerButton2 = document.getElementById("playerChoice");
					playerButton2.innerHTML = "";
					playerButton2.innerHTML = "Players full!";
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
	playerChoice.style.width = "100%";
	spectatorChoice.style.width = "100%";
	playerChoice.style.height = "50vh";
	spectatorChoice.style.height = "50vh";
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
var movePlayerTimeOut;
function showPlayers() {
	var field = document.getElementById("field");


	maxX = fieldWidth = field.clientWidth;
	maxY = fieldHeight = field.clientHeight;

	balkWidth = fieldWidth/10;
	balkHeight = fieldHeight/100;

	player1 = document.createElement("div");
	player2 = document.createElement("div");
	ball = document.createElement('div');
	scoreDiv = document.createElement('div');
	spectatorsDiv = document.createElement('div');

	spectatorsDiv.innerHTML = spectators + " spectators";
	spectatorsDiv.id = "spectators";

	spectatorsDiv.style.left = maxX/33+"px";
	spectatorsDiv.style.top = maxY/100+"px";


	player1.style.width = balkWidth + "px";
	player2.style.width = balkWidth + "px";
	player1.style.height = balkHeight + "px";
	player2.style.height = balkHeight + "px";

	//set classes & id's
	player1.id = "player1";
	player2.id = "player2";
	ball.id = "ball";
	scoreDiv.id = "score";

	player1.className = "balk";
	player2.className = "balk";



	if(playerOneOrTwo == 1)	scoreDiv.innerHTML = score[0] + "-" +score[1];
	else scoreDiv.innerHTML = score[1] + "-" +score[0];

	scoreDiv.style.marginTop = maxY/2-10+"px";

	ballWidth = maxX / 100;


	ball.style.height = ballWidth+"px";
	ball.style.width = ballWidth+"px";

	X1 = maxX - balkWidth;
	Y1 = 0;

	X2 = maxX - balkWidth;
	Y2 = maxY;


	document.getElementsByTagName("html")[0].appendChild(spectatorsDiv);
	field.appendChild(player1);
	field.appendChild(player2);
	field.appendChild(ball);
	field.appendChild(scoreDiv);

	init();

	/*
	 document.addEventListener("keydown", move, false);
	 */
	// X1 of X2 sturen naar server

	if(playerArray[0] == "/#" + socket.id) {

		playerOneOrTwo = 1;
		document.getElementById("leftButton").addEventListener("mousedown", function() {
			movePlayerTimeOut = setInterval(function(){movePlayerOne("left");}, 100);
			movePlayerOne("left");

		}, false);
		document.getElementById("rightButton").addEventListener("mousedown", function() {
			movePlayerTimeOut = setInterval(function(){movePlayerOne("right");}, 100);
			movePlayerOne("right");
		}, false);

	} else {
		var field = document.getElementById("field");
		field.style.webkitTransform = "rotate(180deg)";
		field.style.webkitTransform = "scaleY(-1)";

		scoreDiv.style.webkitTransform = "rotate(180deg)";
		scoreDiv.style.webkitTransform = "scaleY(-1)";

		playerOneOrTwo = 2;
		document.getElementById("leftButton").addEventListener("mousedown",function() {
			movePlayerTimeOut = setInterval(function(){movePlayerTwo("left");}, 100);
			movePlayerTwo("left");

		}, false);
		document.getElementById("rightButton").addEventListener("mousedown", function() {
			movePlayerTimeOut = setInterval(function(){movePlayerTwo("right");}, 100);
			movePlayerTwo("right");

		}, false);
	}

	document.addEventListener("touchend",function() {
		clearTimeout(movePlayerTimeOut);
	}, false);
	document.addEventListener("touchend", function() {
		clearTimeout(movePlayerTimeOut);
	}, false);
	document.addEventListener("mouseup",function() {
		clearTimeout(movePlayerTimeOut);
	}, false);
	document.addEventListener("mouseup", function() {
		clearTimeout(movePlayerTimeOut);
	}, false);

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
		
		ballX = data.data.ballX;
		ballY = data.data.ballY;
		
		score = data.score;
		spectators = data.spectators;
		
    });
    updatePlayers();
	updateBall();
}
//update player when they get info from the server.
function updatePlayers(){
    if(playerOneOrTwo == 1) {
        player1.style.left = maxX - (maxX * serverProcentUpper / 100 ) - balkWidth + "px";
        player1.style.top = Y1 + balkHeight +"px";


        player2.style.left = maxX * serverProcentDown / 100 - balkWidth +"px";
        player2.style.top = maxY- balkHeight*2 +"px";
    } else {

        player1.style.left = maxX * serverProcentUpper / 100 + "px";
        player1.style.top = Y1 + balkHeight +"px";

        player2.style.left = maxX - (maxX * serverProcentDown / 100)-balkWidth-balkWidth+"px";
        player2.style.top = maxY- balkHeight*2 +"px";
    }
}
function updateBall(){

	if(playerOneOrTwo == 1) {
		ball.style.left = ballX/100*maxX + "px";
		ball.style.top = ballY/166*maxY + "px";
	}
	else {
		ball.style.left = (maxX - ballX/100*maxX - ballWidth) + "px";
		ball.style.top = ballY/166*maxY + "px";
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
	mainLoop();
}
/* --------------------------- */


/* ---- MAIN GAME LOOP ---- */
function startGame() {

	if(gameRunning == true) {
		mainLoop();
	} else {
		console.log("Gameloop stopped");
	}

}
/* ----------------------- */
function mainLoop() {
	refreshPositions();
	updatePlayers();
	showScoreAndSpectators();

	if(playerOneOrTwo == 1) {
		socket.emit("moveBall");
	}
	setTimeout(mainLoop, 25);

	socket.on("winPlayerOne", function() {
		gameRunning = false;
	});

	socket.on("winPlayerTwo", function() {
		gameRunning = false;
	});

}


function showScoreAndSpectators() {
	if(playerOneOrTwo == 1) {
		//PLAYER ONE OFCOURSE
		console.clear();
		console.log("player1");
		console.log("You: " + score[0] + " - P2: " + score[1]);
		scoreDiv.innerHTML = score[0] + "-" +score[1];

		console.log(spectators);
		spectatorsDiv.innerHTML = spectators + " spectators";
	} else {
		//PLAYER TWO
		console.clear();
		console.log("player2");
		console.log("You: " + score[1] + " - " + score[0] );
		scoreDiv.innerHTML = score[1] + "-" +score[0];

		console.log(spectators);
		spectatorsDiv.innerHTML = spectators + " spectators";

	}
}







