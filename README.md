# Chess++

Our project aims to create a 4-player game of chess with fog of war, with unexpected twists and extra features.

## How to Play

**Chess++** is a 4-player chess game with a unique twist: fog of war. The fog obscures the board, but your pieces will clear the fog in the spaces directly around them, revealing the positions of other pieces. The objective is to gain as many points as possible by capturing opponent pieces, checking enemy kings, and checkmating opponents. Checkmated opponents can no longer play the game.

### Scoring System:
- 5 points per check
- 20 points per checkmate
- 1 point per pawn
- 3 points per knight
- 5 points per rook and bishop
- 9 points per queen

## Getting Started Instructions

1. Clone or download the project repository.
2. Navigate to the project directory.
3. Run the following command to install all the dependencies required:

        npm install

4. Install postgres if you don't already have it, then run the following command to delete the existing database and set up an empty one:

        npm run setup:dev

**Note: You have to rename `env.sample` to `.env` and replace the fields with your own credentials.**

5. Start the server:

	npm run start:dev

## Routes

### Authentication Routes

- **`GET /auth/signup`**
  - Renders the signup page if the user is not logged in. If a valid session exists, redirects to the game dashboard.
  
- **`POST /auth/signup`**
  - Handles user registration. Validates the input, hashes the password, and stores the new user in the database.
  - Request Body: `username`, `email`, `password`
  
- **`GET /auth/login`**
  - Renders the login page if the user is not logged in. If a valid session exists, redirects to the game dashboard.
  
- **`POST /auth/login`**
  - Handles user login. Validates the username and password, generates a session token, and stores it in the database.
  - Request Body: `username`, `password`
  
- **`POST /auth/logout`**
  - Logs out the user by deleting the session token from the database and clearing the cookie.

### Game Routes

- **`GET /game/dashboard`**
  - Renders the game dashboard for the authenticated user.
  
- **`POST /game/username`**
  - Returns the username of the authenticated user.
  
- **`POST /game/create`**
  - Creates a new game room with a unique 4-character room code and initializes the game state.
  
- **`GET /game/:roomId`**
  - Joins a game room specified by the `roomId` parameter. If the room does not exist, returns a 404 error.

### WebSocket Events

- **`connection`**
  - Handles a new WebSocket connection. Assigns a color to the player, adds them to the game room, and sets up the game turn order.
  
- **`disconnect`**
  - Handles player disconnection by removing the player from the room and updating the turn order.
  
- **`gameUpdate`**
  - Broadcasts the move made by the current player to all other players in the room and updates the turn to the next player.

### Catch-All Route

- **`GET /*`**
  - Handles any undefined routes and returns a 404 error page.

