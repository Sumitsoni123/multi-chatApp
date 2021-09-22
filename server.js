const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    // res.send("Hello World");
    res.sendFile(__dirname + '/public/index.html')
})

http.listen(port, () => {
    console.log(`listening to port number ${port}`);
})

//  socket connection with client.js

const io = require("socket.io")(http)
const users = {};

io.on('connection', (socket) => {
    console.log('connected..');

    // for new user joined chat
    socket.on('new-user-joined', (username) => {
        users[socket.id] = username;
        //console.log("he =>" + username);
        socket.broadcast.emit('new-user-joined', username);
    });

    // for user who send msg
    socket.on('message', (msg) => {
        //console.log(msg);
        socket.broadcast.emit('message', msg);
    });

    // for user who left chat
    socket.on('disconnect', (msg) => {
        //console.log(msg);
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});
