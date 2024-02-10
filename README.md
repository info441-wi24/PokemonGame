# Project Description
In the rapidly evolving landscape of online gaming, our development team has identified a unique opportunity to innovate within the Pokémon community by creating a multiplayer online Pokémon battle platform. This initiative is strategically designed to cater to competitive players who seek a rigorous and strategy-based platform where they can challenge themselves and others in real-time battles. Our target audience is unified by their passion for Pokémon and desire for a more immersive, interactive battle experience.

In the development of our multiplayer online Pokémon battle platform, we center on delivering an innovative and more immersive gameplay experience that emphasizes the depth of battle mechanics and strategy. We recognize that although there are many Pokémon games and related applications on the market, most of them lack the depth and complexity required to truly engage players in the nuances and enjoyment of battle. Therefore, our goal is to create a platform that not only recaptures the classic elements of Pokémon battles but also elevates the experience to a new level of strategic engagement through real-time battles and an advanced matchmaking system.

We believe that by offering a platform focused on battle strategy, we can meet the needs of players who are seeking a more challenging, engaging, and community-driven gaming experience. Players will not just be engaging in a simple Pokémon fight. Instead, they will need to think deeply about the strategic implications of each move, anticipate their opponent's actions, and develop tactics based on this analysis. This depth of battle will attract players who are truly passionate about Pokémon battles and are willing to invest time to improve their skills.

As developers, our desire to build such a platform is driven not only by our recognition of this gap in the market but also by our passion for creating a gaming platform that offers a truly immersive, strategic battle experience. Leveraging our in-depth understanding of Pokémon games and mastery of the development technologies, we believe we can create a platform that not only meets the current expectations of players but also evolves to adapt to future gaming trends.

# Architectural Diagram
![Diagram](https://github.com/info441-wi24/group-project-QinruoYang/blob/main/diagram.jpg?raw=true "Project Diagram")

# Summary table of user stories

| Priority | User Story | Description | Technical Implementation |
|----------|------------|-------------|--------------------------|
| P0 | As a player, I want to make a match with other players to start the game. | Matchmaking API will handle incoming matching requests by placing players into a matchmaking queue, pairing players based on available criteria, and then notifying both players' clients via WebSocket to initiate the game session. |  |
| P0 | As a player, I want to stay in the lobby while waiting for matching results. | Lobby API will manage player sessions in the lobby, including creating, joining, and waiting in lobbies. Matchmaking results will be communicated to players in the lobby via WebSocket, allowing them to proceed to the game once matched. | |
| P0 | As a player, I want to make a user account before starting the game. | User Authentication API will provide endpoints for account creation, login, and management. It will use JWT for secure authentication and session management in Azure. |  |
| P0 | As a player, I want to start a battle once matched with another player. | Start Battle API Endpoint will be triggered once matchmaking is successful, initializing the game state for both players. This endpoint will set up the battle arena and determine the turn order. WebSocket will notify both clients that the battle has started. |  |
| P0 | As a player, I want to select moves during my turn in the battle. | Make Move API Endpoint will accept move selections from the current player. It will validate the move, update the game state accordingly, and send the result of the move to both players via WebSocket. |  |
| P0 | As a player, I want to see the outcome of each move in real-time. | Real-time Update Mechanism via WebSocket will ensure that both players receive updates immediately after each move is made, including the move used, the damage dealt, and any status effects applied. |  |
| P0 | As a player, I want the battle to end when my or my opponent's Pokémon all faint. | End Battle API Endpoint will be called when all Pokémon of a player faint, determining the winner and updating both players' records. Game state information will be saved for match history purposes. |  |
| P1 | As a player, I want to store all my information and playing results in my account. | MongoDB will be used to securely store user profiles, game results, and possibly rankings. The User Data Management API will handle CRUD operations on this data. |  |
| P1 | As a player, I want to see real-time updates during the battle. | WebSocket technology will be used for full-duplex communication between the client and server, allowing for real-time updates of game state, player moves, and battle outcomes. |  |
| P1 | As a player, I want to surrender during a battle if I choose to. | Surrender Endpoint will allow a player to forfeit the match, automatically ending the game, updating the game state and player records accordingly. |  |
| P1 | As a player, I want to review my match history and statistics. | Extend the User Data Management API to include endpoints for retrieving match histories and calculating statistics. Data will be stored in MongoDB and retrieved as needed. |  |
| P1 | As a player, I want to participate in rankings to see how I compare to others. | Rankings API will calculate and update player rankings based on game outcomes, storing this information in MongoDB. Rankings will be displayed in the client UI. |  |
| P2 | As a player, I want to customize my profile and Pokémon team. | User Profile and Team Customization features will allow players to modify their profiles and manage their Pokémon teams, saving changes to the user's account in MongoDB. |  |
| P3 | As a player, I want to resume interrupted games. | Implement game state saving and resuming functionalities in the Game State Management API, using MongoDB to save ongoing game states. This will allow players to continue interrupted games. |  |



Database Schema:

Users
UserID (Primary Key): Unique identifier for each user.
Username: User's chosen name.
Email: User's email address.
PasswordHash: Hashed password for authentication.
CreatedAt: Account creation date.

Pokemon
PokemonID (Primary Key): Unique identifier for each Pokémon.
Name: Name of the Pokémon.
Type: Pokémon type (Water, Fire, etc).
BaseStats: Stores base statistics (HP, Attack, Defense, etc).

Moves
MoveID (Primary Key): Unique identifier for each move.
Name: Name of the move.
Type: Type of the move (matches Pokémon types).
Power: Power of the move.

Battles
BattleID (Primary Key): Unique identifier for each battle.
PlayerOneID: UserID.
PlayerTwoID: UserID.
StartTime: Timestamp when the battle started.
EndTime: Timestamp when the battle ended.
WinnerID: UserID, indicating the winner.

MovesUsed (to track moves used in battles)
MoveUsedID (Primary Key): Unique identifier.
BattleID: BattleID.
MoveID: MoveID.
UserID: UserID (the player who used the move).
Turn: Indicates the turn when the move was used.
Effectiveness: Outcome of the move.

PlayerPokemon (to track which Pokémon belong to which player in a battle)
PlayerPokemonID (Primary Key): Unique identifier.
UserID:UserID.
PokemonID: PokemonID.
BattleID: BattleID.

MatchmakingQueue (to manage the pool of players looking for matches)
QueueID (Primary Key): Unique identifier.
UserID: UserID.
JoinedAt: Timestamp when the user joined the matchmaking queue.

UserStatistics (to store wins, losses, and other statistics)
StatID (Primary Key): Unique identifier.
UserID:UserID.
Wins: Number of wins.
Losses: Number of losses.
Rank: User's rank based on performance.

Endpoints:

## Get All Users

- **Endpoint**: `/all/user`
- **Method**: GET
- **Description**: Retrieve a list of all available users.
- **Use case**: This endpoint is used to retrieve a list of all available users. It's useful for a list of users for administrators or for matchmaking algorithms to select opponents.
- **Request Format**: N/A
- **Response Format**: JSON


## User Login


- **Endpoint**: `/login`
- **Method**: POST
- **Description**: Authenticate a user by checking their email and password.
- **Request Format**: JSON
 - `name` (required): The user's email.
 - `password` (required): The user's password.
- **Response Format**: Text






## Get current User account


- **Endpoint**: `/current/user`
- **Method**: GET
- **Description**: Retrieve data for current user.
- **Use case**: This endpoint is used to retrieve data for the current user. It's typically used for accessing their profile details or game statistics.
- **Request Format**: N/A
- **Response Format**: JSON




## Update available status online
- **Endpoint**: `/current/user/online`
- **Method**: Update
- **Description**: update the user online status
- **Use case**: This endpoint allows the user to update their online status. It's useful for indicating to other users whether a particular user is currently available for matchmaking or other interactions within the system.
- **Request Format**: JSON
- **Response Format**: JSON




## create a new user account
- **Endpoint**: `/create/:userID/:digit`
- **Method**: POST
- **Description**: create a user account
- **Use case**: This endpoint is used for creating a new user account. It allows users to register and provide necessary information
- **Request Format**: JSON
 - `:userID` (required): The search keyword.
 - `:digit` (required): The type of search criteria (e.g., name, category).
- **Response Format**: JSON




## match making
- **Endpoint**: `/current/user/:user2` redirect to `/current/user/game`
- **Method**: POST
- **Description**: make a match for two online users
- **Use case**: This endpoint facilitates the matchmaking process by matching two online users for a battle.
- **Request Format**: JSON
 - `:user2` (required): The search keyword.
- **Response Format**: JSON




## game staus update
- **Endpoint**: `/current/user/game/update`
- **Method**: POST
- **Description**: update current game status
- **Use case**: This endpoint is used to update the current game status. It includes updating scores, game state for the match
- **Request Format**: JSON
- **Response Format**: JSON




## current user update
- **Endpoint**: `/current/user/game/user1/update`
- **Method**: POST
- **Description**: update user 1 game status
- **Use case**: This endpoint specifically updates the game status for user 1. It's useful for handling current user interaction in the game
- **Request Format**: JSON
- **Response Format**: JSON




## user2 update
- **Endpoint**: `/current/user/game/user2/update`
- **Method**: POST
- **Description**: update user 2 game status
- **Use case**: This endpoint specifically updates the game status for user 2. It's useful for handling current user 2 interaction in the game
- **Request Format**: JSON
- **Response Format**: JSON


