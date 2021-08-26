const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users')


//get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
// console.log(username, room);


const socket = io();



//join chatroom
socket.emit('joinRoom', { username, room });

//get room and users info
socket.on('RoomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);
    //scroll down
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get message text
    let msg = e.target.elements.msg.value;
    //emit message to server
    console.log(msg);
    socket.emit('chatmessage', msg);
    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    div.innerHTML = `<p class="meta">  ${message.username}<span>${message.time}</span></p>
    <p class="text">
    ${message.text}   
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
//Add room Name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}
//Add  Name to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user =>`<li>${user.username}</li>`).join('')}`;
}