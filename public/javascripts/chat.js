document.addEventListener('DOMContentLoaded', async (event) => {
  let socket = io(); 


  var form = document.getElementById('form');
  var input = document.getElementById('message');
  var messageArea = document.getElementById('messageArea');


  function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
  }


  function appendMessage(username, message) {
    let item = document.createElement('li');
    let messageContent = document.createElement('p');
    messageContent.classList.add('message');
    messageContent.innerHTML = `<span class="username">${username}:</span> ${message}`;
    item.appendChild(messageContent);
    messageArea.appendChild(item);
  }


  async function fetchAndDisplayMessages() {
    try {
      const response = await fetch('/api/users/allChats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allChats = await response.json();
      allChats.forEach(chat => {
        chat.conversations.forEach(convo => {
          appendMessage(convo.username, convo.chat);
        });
      });
      scrollToBottom();
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  }

  await fetchAndDisplayMessages();

  // Listen for the form to be submitted
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (input.value && globalusername) {
      const messageData = {
          username: globalusername,
          chat: input.value
      };

      socket.emit('chat message', messageData);
      //appendMessage(globalusername, input.value);
      input.value = '';
    }
  });


  socket.on('chat message', function(data) {
    appendMessage(data.username, data.chat);
    scrollToBottom();
  });
});
