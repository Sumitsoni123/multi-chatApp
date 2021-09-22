const socket = io();

let username;
let textarea = document.querySelector('#textArea');
let messageArea = document.querySelector('.message__area');
const form = document.getElementById('send-container');
const msgInput = document.getElementById('textArea');

do {
    username = prompt('Enter your Name');
} while (!username);
document.getElementById("naam").innerHTML = username;

socket.emit('new-user-joined', username);


// textarea.addEventListener('keyup', (e) => {
//     if (e.key === 'Enter') {
//         let chat = e.target.value;
//         if (chat !== "")
//             sendMessage(chat);
//     }
// })

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = textarea.value;
    if (text.length > 0)
        sendMessage(text);
})

const sendMessage = (message) => {
    let msg = {
        user: username,
        message: message.trim()
    }

    // append
    appendMessage(msg, 'outgoing')
    textarea.value = "";
    scrollToBtm();

    // send to server
    socket.emit('message', msg);
}

const appendMessage = (msg, type) => {
    let mainDiv = document.createElement('div');
    mainDiv.classList.add(type, 'message');

    let markup = `<h4>${msg.user}</h4> <p>${msg.message}</p>`

    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

const appendNotify = (message, type) => {
    let mainDiv = document.createElement('div');
    mainDiv.classList.add(type, 'message');
    mainDiv.innerHTML = message;
    messageArea.appendChild(mainDiv);
}

// receive message from server
socket.on('new-user-joined', (username) => {
    //console.log(username);
    appendNotify(`${username} joined the chat`, 'notification');
    scrollToBtm();
})

socket.on('message', (msg) => {
    //console.log(msg);
    appendMessage(msg, 'incoming');
    scrollToBtm();
})

socket.on('left', (username) => {
    //console.log(username);
    appendNotify(`${username} left the chat`, 'leave');
    scrollToBtm();
})


// automatically scroll to bottom of msg
const scrollToBtm = () => {
    messageArea.scrollTop = messageArea.scrollHeight;
}


const handleLogout = () => {
    window.localStorage.clear();
    window.location.reload(true);
    window.location.replace('/');
  };