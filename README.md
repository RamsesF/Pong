# Pong Multiplayer
Pong with multiplayer, using Node.js and socket.io. Only two players, and unlimited spectators.

## What did I use
- Node.js
- Express
- Socket.io

## How to get this thing working?
1. Download my project as a ZIP here: https://github.com/RamsesF/Pong/archive/master.zip.
2. UnZIP my project and paste it where you can access it easily.
3. Make sure you have npm & node.js installed. https://nodejs.org/en/. Downloading node.js will have npm automatically installed. I personally used v4.4.0. Maybe I should update.
4. Open up your console/CMD and navigate to the project. You need to be in the Pong folder. (cd is your friend)
5. When you have npm installed, use "npm install" to install all my used packages.
6. When the packages are installed, use "node server.js" to get the server up and running!
7. Navigate to the HOST-IP ADDRESS via your favorite browser. You can look this up by typing "ipconfig" on the machine that is hosting the server. The server runs on port 8080. (hint: type :8080 after your host-ip adress in your browser).
8. Have fun!

## TO DO
- Holding controls instead of tapping.
- Showing amount of spectators and score in HTML
- CSS layout
- speedup ball

## Versions
### V 0.1 (23-04-2016) 
- Basic login system.
- Choosing between player and spectator.
- Showing the playfield.
- refresh-event which will update how many players and spectators there are.
 
### V 0.2 (26-04-2016) (CURRENT)
- Movement made possible!
- Spectating works
- Players are now unable to choose Player when there are already two present.
- Updated some faulty functions that were updating server vars (unwanted).

## Important contributors:
- FlouwR: https://github.com/RamsesF https://twitter.com/FlouwRamses
- GregoireAmeye https://github.com/gregoireameye
 

## Important testers:
- Mathias https://github.com/dallian354
- Esteban from GLADOS Workgroup https://github.com/thecodewizard http://estebandenis.ddns.net/
