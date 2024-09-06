# Chess++

Chess++ is a 4-player chess game with a unique twist: fog of war. The fog obscures the board, but your pieces will clear the fog in the spaces directly around them, revealing the positions of other pieces. The objective is to gain as many points as possible by capturing opponent pieces, checking enemy kings, and checkmating opponents. Checkmated opponents can no longer play the game.

## Features

- **Fog of War**: Players can only see a limited area around their pieces.
- **4 Players**: Battle against 3 opponents at the same time.
- **Scoring System**: Points for checks, checkmates, and capturing pieces.

## Scoring System

- **5 points** per check
- **20 points** per checkmate
- **1 point** per pawn
- **3 points** per knight
- **5 points** per rook and bishop
- **9 points** per queen

## Getting Started

### Installation Instructions

1. Clone or download the project repository.
2. Navigate to the project directory.
3. Install all dependencies by running:

    ```bash
    npm install
    ```

4. Install Postgres if you don't already have it, then run the following command to delete the existing database and set up a new one:

    ```bash
    npm run setup:dev
    ```

    > **Note**: You need to rename `env.sample` to `.env` and replace the fields with your own credentials.

5. Start the server:

    ```bash
    npm run start:dev
    ```

## API Documentation

### Authentication Routes

- **`GET /auth/signup`**: Renders the signup page if the user is not logged in. If a valid session exists, redirects to the game dashboard.
- **`POST /auth/signup`**: Handles user registration, validates the input, hashes the password, and stores the new user in the database.
    - **Request Body**: `username`, `email`, `password`
- **`GET /auth/login`**: Renders the login page if the user is not logged in. If a valid session exists, redirects to the game dashboard.
- **`POST /auth/login`**: Handles user login, validates the credentials, and generates a session token.
    - **Request Body**: `username`, `password`
- **`POST /auth/logout`**: Logs out the user by deleting the session token and clearing the cookie.

### Game Routes

- **`GET /game/dashboard`**: Renders the dashboard for the authenticated user.
- **`POST /game/info`**: Returns the username of the user.
- **`POST /game/create`**: Creates a new game room with a unique 4-character room code and initializes the game state.
- **`GET /game/:roomId`**: Joins a game room specified by the `roomId` parameter. Returns a 404 error if the room does not exist.

### WebSocket Events

- **`connection`**: Handles a new WebSocket connection, assigns a player color, and sets up the game turn order.
- **`disconnect`**: Removes the player from the room and updates the turn order upon disconnection.
- **`gameUpdate`**: Broadcasts a move made by the current player to all other players and updates the turn.
- **`message`**: Sends messages between players in the game.
- **`checkMated`**: Marks a player as checkmated.

### Catch-All Route

- **`GET /*`**: Handles undefined routes and returns a 404 error page.

## Database Setup

The project requires a PostgreSQL database. You need to configure the database connection in the `.env` file as follows:
```bash
PGUSER=your_postgres_username
PGPORT=5432
PGHOST=localhost
PGPASSWORD=your_postgres_password
PGDATABASE=chesspp
```