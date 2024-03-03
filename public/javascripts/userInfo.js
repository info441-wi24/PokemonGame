async function init(){
    await loadIdentity();
    loadUserInfo();
    fetchAndDisplayRanking();
}


async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
    }else{
        document.getElementById("username-span").innerText=username;
    }
}

async function fetchAndDisplayRanking() {
    console.log(document.getElementById('rankings-body'));
    fetch('/api/users/ranking') // Adjust this URL to your actual API endpoint
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('rankings-body'); // Ensure this is the correct ID for your rankings table body
            tableBody.innerHTML = ''; // Clear any existing rows

            data.forEach((player, index) => { // Corrected: Use player object and index from forEach
                const row = tableBody.insertRow();
                row.insertCell(0).innerText = index + 1; // Displaying index as a serial number
                row.insertCell(1).innerText = player.playerId; // Corrected: Access playerId from player object
                row.insertCell(2).innerText = player.numbers; // Corrected: Access numbers from player object
                row.insertCell(3).innerText = player.rank; // Access rank from player object
            });
        })
        .catch(error => {
            console.error('Failed to fetch rankings:', error); // Corrected the error message to reflect the correct operation
        });
}

