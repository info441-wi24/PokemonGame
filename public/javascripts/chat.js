// Ensure the DOM is fully loaded before running the script

document.addEventListener('DOMContentLoaded', (event) => {
  let socket = io(); // Connect to the server using Socket.IO

  // Elements from the DOM
  var form = document.getElementById('form');
  var input = document.getElementById('message');
  var messageArea = document.getElementById('messageArea');

  // Listen for the form to be submitted
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting traditionally

    if (input.value && globalusername) {
        
        const messageData = {
            username: globalusername,
            message: input.value
        };


        socket.emit('chat message', messageData);

        input.value = '';
    }
  });

  socket.on('chat message', function(data) {

    let item = document.createElement('li');
    let messageContent = document.createElement('p');
    messageContent.classList.add('message');


    messageContent.innerHTML = `<span class="username">${data.username}:</span> ${data.message}`;


    item.appendChild(messageContent);
    messageArea.appendChild(item);


    window.scrollTo(0, document.body.scrollHeight);
});
});
