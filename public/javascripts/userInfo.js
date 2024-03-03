let globalUsername = '';
async function init(){
    await loadIdentity();
    loadUserInfo();
    fetchAndDisplayRanking();
}


async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    globalUsername = username;
    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
    }else{
        document.getElementById("username-span").innerText=username;
    }
    fetchLatestBattleHistory(username);
}

async function fetchAndDisplayRanking() {
    console.log(document.getElementById('rankings-body'));
    fetch('/api/users/ranking')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('rankings-body');
            tableBody.innerHTML = '';

            data.forEach((player, index) => {
                const row = tableBody.insertRow();
                row.insertCell(0).innerText = index + 1;
                row.insertCell(1).innerText = player.playerId;
                row.insertCell(2).innerText = player.numbers;
                row.insertCell(3).innerText = player.rank;
            });
        })
        .catch(error => {
            console.error('Failed to fetch rankings:', error);
        });
}

async function fetchLatestBattleHistory(username) {
    if (!username) {
        console.error('Username is required to fetch battle history.');
        return;
    }
    console.log(`${username}`);
    try {
        const response = await fetch(`/api/users/battleHistory?username=${encodeURIComponent(username)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        console.log(`Battle history for ${username}:`, data);
        displayLatestBattleHistory(data);
    } catch (error) {
        console.error('Failed to fetch battle history:', error);
    }
}

function displayLatestBattleHistory(data) {
    const tableBody = document.getElementById('battle-history-body');
    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }
    tableBody.innerHTML = '';

    data.forEach((battle, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = index + 1;
        row.insertCell(1).innerText = battle.gameId;
        row.insertCell(2).innerText = battle.playerId;
        row.insertCell(3).innerText = battle.outcome;
        row.insertCell(4).innerText = battle.p1HpRemaining;
        row.insertCell(5).innerText = new Date(battle.timestamp).toLocaleString(); // Format timestamp for readability
    });
}



