async function init(){
  await loadIdentity();
}

"use strict";
(function() {
  const BASE_URL = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/pokedex.php";
  const PICTURE_URL = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/";
  const gameURL = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/game.php";
  let CurrentPokemon = "bulbasaur";
  let gameId = null;
  let playerId = 1;
  window.addEventListener("load", init);

  /**
   * this function starts the game with calling making pokemon request
   * and populate the game view page when it click on the choose this pokemon
   */
  function init() {
    makeRequest("?pokedex=all");
    const startButton = id("start-btn");
    startButton.addEventListener("click", gameView);
  }

  /**
   * this function after it gets called from init function it fetch the base url
   * then it process the data to get all of the pokemon on the view page
   */
  function makeRequest() {
    let url = BASE_URL + "?pokedex=all";
    fetch(url)
      .then(statusCheck)
      .then(resp => resp.text()) // use this if your data comes in text
      .then(processData)
      .catch(console.error); // define a user-friendly error-message function
  }

  /**
   * this function takes in a pokemon short name and populates the data for it
   * by calling the fetching request. It get response data for processPokemon
   * Data to process it
   * @param {string} para - the name of the pokemon short name
   */
  function getPokemon(para) {
    CurrentPokemon = para;
    let url = BASE_URL + "?pokemon=" + (CurrentPokemon);
    fetch(url)
      .then(statusCheck)
      .then(resp => resp.json()) // use this if your data comes in text
      .then(processPokemonData)
      .catch(console.error); // define a user-friendly error-message function
  }

  /**
   * This function process the data from the base url to populat all of the data
   * for pokemon. it updates the name and images for it. it will call get more
   * information for the starter pokemons like bulbasaur
   * @param {text} responseData - it returns the text data from base url
   */
  function processData(responseData) {
    responseData = responseData.split('\n');
    for (let i = 0; i < responseData.length; i++) {
      let shortName = (((responseData[i]).split(":"))[1]);
      let pokemonImg = gen("img");
      let imagePath = "sprites/" + shortName + ".png";
      pokemonImg.src = PICTURE_URL + imagePath;
      id('pokedex-view').appendChild(pokemonImg);
      pokemonImg.classList.add("sprite");
      if ((shortName === "bulbasaur") || (shortName === "charmander") ||
          (shortName === "squirtle")) {
        pokemonImg.classList.add("found");
      }
      if (pokemonImg.classList.contains("found")) {
        pokemonImg.addEventListener("click", function() {
          getPokemon(shortName);
        });
      }
    }
  }

  /**
   * this function process the data for a specific pokemne and make it's move method
   * clickable. More info will be by calling makingPokemon
   * @param {json} responseData - the data from the specific pokemon
   */
  function processPokemonData(responseData) {
    makingPokemon("p1", responseData);
    let newButton = qsa("#p1 button");
    for (let i = 0; i < responseData.moves.length; i++) {
      newButton[i].para = ((responseData.moves)[i]).name;
      newButton[i].addEventListener("click", pokemonBattle);
    }
    id("start-btn").classList.remove("hidden");
  }

  /**
   * This function takes the p1 or p2 data and making the more specific data for
   * the card
   * @param {string} pCard - p1 or p2 card
   * @param {json} responseData - the fech data
   */
  function makingPokemon(pCard, responseData) {
    qs("#" + pCard + " .name").textContent = responseData.name;
    qs("#" + pCard + " .pokepic").src = PICTURE_URL + responseData.images.photo;
    qs("#" + pCard + " .type").src = PICTURE_URL + responseData.images.typeIcon;
    qs("#" + pCard + " .weakness").src = PICTURE_URL + responseData.images.weaknessIcon;
    qs("#" + pCard + " .hp").textContent = responseData.hp + "HP";
    qs("#" + pCard + " .info").textContent = responseData.info.description;
    moves(pCard, responseData);
  }

  /**
   * this function takes p1 or p2 data and making the specific move data for the
   * card
   * @param {string} pCard - p1 or p2 card
   * @param {json} responseData - fetch data
   */
  function moves(pCard, responseData) {
    let newMove = qsa("#" + pCard + " .move");
    let Moveimage = qsa("#" + pCard + " .moves img");
    let MoveDp = qsa("#" + pCard + " .dp");
    let newButton = qsa("#" + pCard + " button");
    let numberOfMoves = responseData.moves.length;
    for (let i = numberOfMoves; i < newMove.length; i++) {
      newButton[i].classList.add("hidden");
    }
    if (numberOfMoves === newMove.length) {
      for (let i = 0; i < numberOfMoves; i++) {
        if (newButton[i].classList.contains("hidden")) {
          newButton[i].classList.remove("hidden");
        }
      }
    }
    for (let i = 0; i < numberOfMoves; i++) {
      newMove[i].textContent = ((responseData.moves)[i]).name;
      Moveimage[i].src = PICTURE_URL + "icons/" + ((responseData.moves)[i]).type + ".jpg";
      if (typeof (((responseData.moves)[i]).dp) !== 'undefined') {
        MoveDp[i].textContent = ((responseData.moves)[i]).dp + "dp";
      } else {
        MoveDp[i].textContent = "";
      }
    }
  }

  /**
   * this function takes in a parameter from the eventlisterner and move the selected
   * move name into pokemonResult
   * @param {Element} param - an attribute to get the move name
   */
  function pokemonBattle(param) {
    qs("#results-container img").classList.remove('hidden');
    let moveName = param.currentTarget.para;
    moveName = moveName.replace(/\s/g, '');
    moveName = moveName.toLowerCase();
    pokemonResult(moveName);
  }

  /**
   * The pokemonResult get the moveName from pokemonBattle and call the game fetch
   * result to process game result
   * @param {string} moveName - the name of the move
   */
  function pokemonResult(moveName) {
    let url = gameURL;
    let params = new FormData();
    params.append("guid", gameId);
    params.append("pid", playerId);
    params.append("movename", moveName);
    fetch(url, {method: "POST", body: params})
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processResult)
      .then(console.error);
  }

  /**
   * this funciton process the move results from player one and two's play
   * then it will push the results into the page
   * @param {json} responseData - the fetch data
   */
  function processResult(responseData) {
    qs("#results-container img").classList.add('hidden');
    qs("#results-container #p1-turn-results").classList.remove('hidden');
    qs("#results-container #p2-turn-results").classList.remove('hidden');
    let player1 = "Player 1 played " + responseData.results['p1-move'] + " and ";
    let player2 = "Player 2 played " + responseData.results['p2-move'] + " and ";
    qs("#p1-turn-results").textContent = player1 + responseData.results['p1-result'];
    qs("#p2-turn-results").textContent = player2 + responseData.results['p2-result'];
    let p1Percentage = (responseData.p1['current-hp']) / (responseData.p1['hp']);
    let p2Percentage = (responseData.p2['current-hp']) / (responseData.p2['hp']);
    if ((p1Percentage) < 0.2) {
      qs("#p1 .health-bar").classList.add('low-health');
    }
    if ((p2Percentage) < 0.2) {
      qs("#p2 .health-bar").classList.add('low-health');
    }
    processResult2(responseData);
    qs("#p1 .health-bar").style.width = p1Percentage * 100 + '%';
    qs("#p2 .health-bar").style.width = p2Percentage * 100 + '%';
    qs("#p1 .card .hp").textContent = (responseData.p1['current-hp']) + "HP";
    qs("#p2 .card .hp").textContent = (responseData.p2['current-hp']) + "HP";

    fetch('/api/battles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Indicate that the body is JSON
      },
      body: JSON.stringify({ // Convert the JavaScript object to a JSON string
        userId: playerId,
        pokemonChosen: CurrentPokemon,
        opponentPokemon: responseData.p2.name,
        movesUsed: responseData.results['p1-move'],
        outcome: responseData.p1['current-hp'] <= 0 ? 'lose' : 'win'
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the JSON response
    })
    .then(data => console.log('Battle data saved:', data))
    .catch((error) => {
      console.error('Error sending battle data:', error);
    });

  }



  /**
   * The part 2 of the process results
   * @param {element} responseData - fetch data
   */
  function processResult2(responseData) {
    if ((responseData.p1['current-hp']) <= 0) {
      qs("h1").textContent = "You lost!";
      endGame();
    }
    if ((responseData.p2['current-hp']) <= 0) {
      qs("h1").textContent = "You won!";
      collect(responseData.p2.shortname);
      endGame();
    }
    if ((responseData.results['p2-result']) === null) {
      qs("#results-container #p2-turn-results").classList.add('hidden');
    }
  }

  /**
   * this function takes in the pokemon short name and when the player defeat a
   * a new pokemon it makes the new pokemon availiable to use
   * @param {string} shortname - the pokemon short name
   */
  function collect(shortname) {
    let imagePath = "sprites/" + shortname + ".png";
    let pokemonImg = PICTURE_URL + imagePath;
    for (let i = 0; i < qsa(".sprite").length; i++) {
      if ((qsa(".sprite"))[i].src === pokemonImg) {
        if (!((qsa(".sprite"))[i]).classList.contains("found")) {
          ((qsa(".sprite"))[i]).classList.add("found");
          ((qsa(".sprite"))[i]).addEventListener("click", function() {
            getPokemon(shortname);
          });
        }
      }
    }
  }

  /**
   * The end game disabled the move button and flee button
   * makes the end button availiable to use
   */
  function endGame() {
    qs("#endgame").classList.remove('hidden');
    qs("#flee-btn").classList.add('hidden');
    let newButton = qsa("#p1 button");
    for (let i = 0; i < 4; i++) {
      newButton[i].disabled = true;
    }
    qs("#endgame").addEventListener("click", mainpage);
  }

  /**
   * when the end button was clicked it take the user back into the main page
   */
  function mainpage() {
    qs("#endgame").classList.add('hidden');
    qs("#results-container").classList.add('hidden');
    qs("#p2").classList.add('hidden');
    qs("#p1 .hp-info").classList.add('hidden');
    getPokemon(CurrentPokemon);
    qs("h1").textContent = "Your Pokedex";
    const pokedexView = id("pokedex-view");
    pokedexView.classList.remove("hidden");
    qs("#p1 .health-bar").style.width = 100 + '%';
    qs("#p2 .health-bar").style.width = 100 + '%';

    if ((qs("#p1 .health-bar")).classList.contains("low-health")) {
      ((qs("#p1 .health-bar")).classList.remove("low-health"));
    }
    if ((qs("#p2 .health-bar")).classList.contains("low-health")) {
      ((qs("#p2 .health-bar")).classList.remove("low-health"));
    }
  }

  /**
   * check the fecth call
   * @param {element} res - fetch response data
   * @returns {element} - return the res data
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * the games starts and the move button and p2 info is able to see
   * the flee button is also disabled
   */
  function gameView() {
    const pokedexView = id("pokedex-view");
    pokedexView.classList.add("hidden");
    id("p2").classList.remove("hidden");
    qs(".hp-info").classList.remove("hidden");
    qs("#results-container").classList.remove("hidden");
    id("start-btn").classList.add("hidden");
    id("flee-btn").classList.remove("hidden");
    qs("#flee-btn").addEventListener("click", flee);
    qs("header h1").textContent = "Pokemon Battle";
    let newButton = qsa("#p1 button");
    for (let i = 0; i < 4; i++) {
      newButton[i].disabled = false;
    }
    gamerequest(true, CurrentPokemon);
  }

  /**
   * when user clicked on the flee button the game ends
   * and player lost
   */
  function flee() {
    pokemonResult("flee");
    endGame();
  }

  /**
   * this method gte the game and pokemeon to get the player id/ game id
   * @param {boolean} startgame - true or false for the game
   * @param {string} mypokemon - the name of the pokemon
   */
  function gamerequest(startgame, mypokemon) {
    let url = gameURL;
    let params = new FormData();
    params.append("startgame", startgame);
    params.append("mypokemon", mypokemon);
    fetch(url, {method: "POST", body: params})
      .then(statusCheck)
      .then(resp => resp.json())
      .then(ProcessGame)
      .catch(console.error);
  }

  /**
   * the function takes in the pokemon data and set the game and player id
   * @param {element} responseData -fetch data
   */
  function ProcessGame(responseData) {
    makingPokemon("p2", responseData.p2);
    gameId = responseData.guid;
    playerId = responseData.pid;
  }

  /**
   * short function for get element by id
   * @param {string} id -The element id string
   * @returns {Element} -element
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * short function for queryselector
   * @param {string} selector -the element string
   * @returns {Element} - the element
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * short function for querySelectorAll
   * @param {string} selector -the element string
   * @returns {Element} - the element
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * short function for create element
   * @param {string} generate -the element string
   * @returns {Element} - the element
   */
  function gen(generate) {
    return document.createElement(generate);
  }

})();