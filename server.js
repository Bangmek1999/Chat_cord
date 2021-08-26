const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const part = require('path');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./utils/messages')
const { userjoin, getCurrentUser, userLeves, GetroomUsers } = require('./utils/users')

//set static folder
app.use(express.static(part.join(__dirname, 'public')));

//run when client connect
const botname = "chatcord bot ";
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {

        const user = userjoin(socket.id, username, room);

        socket.join(user.room);
        //welcom current user
        // console.log("new user connection...");
        socket.emit('message', formatMessage(botname, 'Welcome to ChatCord'));

        //broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botname, ` ${user.username}  has join the chat`));

        //send users and room info
        io.to(user.room).emit('RoomUsers', {
            room: user.room,
            users: GetroomUsers(user.room)
        });

    });


    //listen for chatMessage
    socket.on('chatmessage', msg => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //run when client disconnects
    socket.on('disconnect', () => {
        const user = userLeves(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botname, `${user.username} has lift the chat`));
        };

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: GetroomUsers(user.room)
        });

    });
})

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`server running on port ${ PORT }`));