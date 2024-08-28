# Chess++

Our project aims to create a 4-player game of chess with fog of war, with unexpected twists and extra features.

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

6. See [Routes](#Routes) to see the available links.


## Deployment Instructions

1. Run the following command:

        fly deploy
