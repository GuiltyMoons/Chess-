# Chess++

Our project aims to create a 4-player game of chess with fog of war, with unexpected twists and extra features.

## Instructions

1. Clone or download the project repository.
2. Navigate to the project directory.
3. Run the following command to install all the dependencies required:

        npm install

4. Install postgres if you don't already have it, then run the following command to set up an empty database:

        npm run setup:dev

**Note: You have to rename `env.sample` to `.env` and replace the fields with your own credentials.**

5. Start the server:

	npm run start:dev

6. See [Routes](#Routes) to see the available links.


## Routes

Deployed Routes:
https://chesspp.fly.dev/auth/signup
https://chesspp.fly.dev/auth/login
https://chesspp.fly.dev/game/play

Local Routes:
http://localhost:3000/auth/signup
http://localhost:3000/auth/login
http://localhost:3000/game/play

**Note: Undefined routes will default to the signup page.**