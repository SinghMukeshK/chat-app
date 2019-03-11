var express = require("express");
const mongo = require('./Utils/mongo');

var app = express();

mongo.connect();
var http = require("http");

var server = http.createServer(app);

var io = require("socket.io")(server);

let chatter = {
    name: '',
    messages: []
}
let onlineUsers = [];
let messages = [];

io.on("connection", client => {
    console.log("New client connected...", client.id);

    client.emit("acknowledge", {
        onlineUsers: onlineUsers
    });

    client.on("msgToServer", (chatterName, msg, onlineUsers) => {
        messages.push({
            clientId: client.id,
            chatter: chatterName,
            message: msg
        })
        client.broadcast.emit("msgToClient", chatterName, msg, messages);
        client.emit("msgToClient", 'Me', msg);

    })

    client.on("disconnect", () => {
        //if (messages.length <= 1)
        mongo.create(messages)
        let disconnectedUser = messages.filter(user => user.clientId == client.id)[0]

        if (disconnectedUser)
            client.broadcast.emit("msgToClient", disconnectedUser.chatter, `Got disconnected`);
        //Save data into DB
    })

})

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/socket-client.html');
})

server.listen(3000, () => {
    console.log("Socket server running on port 3000");
})