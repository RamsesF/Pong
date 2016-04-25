//Init all packages.
var express = require('express'), 
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');

//Make our HTTP-Server.
var server = http.createServer(app);
var io = socketIo.listen(server);
server.listen(8080);
//This will use the files in the folder /public
app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:8080");


var players = ["empty", "empty"];
var readyPlayers = [false, false];
var spectators = 0;

var positionData = {
    playerOnePercent: 44,
    playerTwoPercent: 44,
    ballX: 50,
    ballY: 50
};


io.on('connection', function(socket) {
    
    /* ---- CONNECTION EVENT ---- */
	console.log("User " + socket.id + " has connected.");
    spectators = spectators + 1;

    //this will push the array to the client if asked.
	socket.on("askArray", function() {
       socket.emit("giveArray", { playerArray: players, spectators : spectators, readyPlayers : readyPlayers } );
    });
    /* -------------------------- */
	
	
    
    
    /* ---- EVENTS FOR CLIENTS ---- */
	socket.on("pushMeAsPlayer", function() {
        spectators = spectators - 1;
        if(players[0] == "empty") {
            players[0] = socket.id;
        } else {
            if(players[1] == "empty") {
                players[1] = socket.id;
            }
        }
    });

    socket.on("pushMeReady", function() {
        if(players[0] == socket.id) {
            readyPlayers[0] = true;
        } else {
            readyPlayers[1] = true;
        }
    });

    
    socket.on("askPositions", function(){
        socket.emit("givePositions", { data : positionData } );
    });

    //MOVEMENT-EVENTS FOR CLIENT
    socket.on("movePlayerOneLeft", function() {
        if(positionData.playerOneX >= 2) {
            positionData.playerOneX = positionData.playerOneX - 2;
        }
    });
    socket.on("movePlayerOneRight", function() {
        if(positionData.playerOneX <= 88) {
            positionData.playerOneX = positionData.playerOneX + 2;
        }
    });
    socket.on("movePlayerTwoLeft", function() {
        if(positionData.playerTwoX >= 2) {
            positionData.playerTwoX = positionData.playerTwoX - 2;
        }
    });
    socket.on("movePlayerTwoRight", function() {
        if(positionData.playerTwoX <= 88) {
            positionData.playerTwoX = positionData.playerTwoX + 2;
        }
    });

        
    socket.on("resetPos", function() {
        var normalData = {
            playerOneX: 44,
            playerTwoX: 44,
            ballX: 50,
            ballY: 50
        };

        positionData = normalData;
        
    });
    /* ---------------------------- */
    
    
    
    
    
    /* ---- DISCONNECT EVENT ---- */
	socket.on('disconnect', function() {
        console.log("User " + socket.id + " has disconnected.");

        if(players[0] == socket.id) {
            players[0] = "empty";
            readyPlayers[0] = false;
        }
        else if(players[1] == socket.id) {
            players[1] = "empty";
            readyPlayers[1] = false;
        }
        else {
            spectators = spectators - 1;
        }
	}); 
    /* -------------------------- */

    
    
});

