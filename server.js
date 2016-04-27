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
var score = [0,0];
var spectators = 0;

var positionData = {
    playerOnePercent: 45,
    playerTwoPercent: 45,
    ballX: 49.5,
    ballY: 74.5
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
        socket.emit("givePositions", { data : positionData, score: score, spectators : spectators } );
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


    socket.on('moveBall', function(){
        moveBall();
    });

    var hor = "O";
    var ver = "Z";
    //socket.on("moveBall", function(){
    function moveBall(){
            var richting;
            if(positionData.ballY >= 161.5 && positionData.ballY < 164)
            {
                if(positionData.ballX-0.5 >= positionData.playerOneX && positionData.ballX+0.5 <= positionData.playerOneX+10)
                {
                    ver = "N";
                }
            }
            else if(positionData.ballY <= 4 && positionData.ballY > 2)
            {
                if(positionData.ballX-0.5 >= 90-positionData.playerTwoX && positionData.ballX+0.5 <= 100-positionData.playerTwoX)
                {
                    ver = "Z";
                }
            }
            else if (positionData.ballY <= 2) {
                //player 1 wins
                resetData();
                score[0] = score[0] + 1;
            }
                else if(positionData.ballY >= 164){
                //player 2 wins
                resetData();
                score[1] = score[1] + 1;

            }
            else{
                if(positionData.ballX >= 99)
                {
                    hor = "W";
                }
                if(positionData.ballX <= 1) {
                    hor = "O";
                }
            }

            richting = ver + hor;



            if(richting == "ZO"){
                positionData.ballY +=0.5;
                positionData.ballX +=0.5;
            }
            else if(richting == "NO"){
                positionData.ballY -=0.5;
                positionData.ballX +=0.5;
            }
            else if(richting == "ZW"){
                positionData.ballY +=0.5;
                positionData.ballX -=0.5;
            }
            else if(richting == "NW"){
                positionData.ballY -=0.5;
                positionData.ballX -=0.5;
            }
    }//);

        
    socket.on("resetPos", function() {
    resetData();
    resetScore();
    });
    function resetScore() {
        score = [0,0];
    }
    function resetData() {
        var normalData = {
            playerOneX: 45,
            playerTwoX: 45,
            ballX: 74.5,
            ballY: 74.5
        };

        positionData = normalData;
    }
    /* ---------------------------- */
    
    
    
    
    
    /* ---- DISCONNECT EVENT ---- */
	socket.on('disconnect', function() {
        if("#/" + socket.id == players[1] || "/#" + socket.id == players[0])
        resetData();
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

