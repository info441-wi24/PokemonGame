let globalUsername = '';
async function init(){
    await loadIdentity();
    loadUserInfo();
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
}