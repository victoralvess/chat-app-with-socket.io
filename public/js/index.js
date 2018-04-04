const username = prompt('Username') || 'anonymous' + Math.random();
const profileUrl =
  'https://robohash.org/' + username + Math.random() * 11 + '.png/?size=50x50';

const user = {
  username,
  profileUrl,
  isTyping: false
};

const socket = io({
  query: {
    user: JSON.stringify(user)
  }
});

document.querySelector('form').addEventListener('submit', submitMessage);

socket.on('user', handleConnection);

socket.on('message', handleMessage);

socket.on('user_is_typing', handleTyping);

socket.on('user_disconnected', handleDisconnection);

function submitMessage(ev) {
  ev.preventDefault();
  const input = document.querySelector('#message');
  socket.emit('message', {
    sender: {
      username,
      profileUrl
    },
    body: input.value
  });
  input.value = '';
  return false;
}
/*
        The current client creates a new 'Contact' in the 'Contacts List' whenever the new user is not on that list.

        @param {Object} newUser
      */
function handleConnection(newUser) {
  if (newUser.id != socket.id) {
    user.id = socket.id;
    socket.emit('me', user);
    if (!document.querySelector('#UID_' + newUser.id)) {
      createListItem(newUser);
    }
  }
}

function handleMessage(message) {
  const messageLi = document.createElement('li');
  const messageDiv = document.createElement('div');

  const senderP = document.createElement('p');
  senderP.innerText = message.sender.username;

  const messageSpan = document.createElement('span');
  messageSpan.innerText = message.body;

  const userImg = document.createElement('img');
  userImg.src = message.sender.profileUrl;
  userImg.alt = '@' + message.sender.username;

  messageLi.appendChild(userImg);
  messageDiv.appendChild(senderP);
  messageDiv.appendChild(messageSpan);
  messageLi.appendChild(messageDiv);

  document.querySelector('#messages').appendChild(messageLi);
}

function handleDisconnection(id) {
  const el = document.querySelector('#UID_' + id);
  if (el) {
    el.parentElement.remove();
  }
}

function sendTypingStatus() {
  if (document.querySelector('#message').value.length > 0) {
    user.isTyping = false;
  } else {
    user.isTyping = true;
  }

  socket.emit('user_is_typing', user);
}

function handleTyping(writer) {
  console.log(writer.username, 'is typing');
}

function createListItem(newUser) {
  const hiddenInput = document.createElement('input');
  hiddenInput.id = 'UID_' + newUser.id;
  hiddenInput.type = 'hidden';
  hiddenInput.value = newUser.id;

  const userLi = document.createElement('li');
  const userImg = document.createElement('img');
  userImg.src = newUser.profileUrl;
  userImg.alt = '@' + newUser.username;

  const usernameDiv = document.createElement('div');
  const usernameP = document.createElement('p');
  usernameP.innerText = newUser.username;
  usernameDiv.appendChild(usernameP);

  userLi.appendChild(hiddenInput);
  userLi.appendChild(userImg);
  userLi.appendChild(usernameDiv);

  document.querySelector('aside').appendChild(userLi);
}
