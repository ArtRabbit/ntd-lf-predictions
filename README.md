# NTD LF Projections

NTD LF Projections

## Install

You will need [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/) to install and run the project locally.

The project uses mapbox for the mapping functionality. To set up the map functionality, create a free [mapbox.com](https://www.mapbox.com/) account and add the contents of mapbox-style.zip from this repository to the new account. 

Generate a mapbox access key and create a '.env' and a '.env_development' file in the project directory and add your access key in the format: REACT_APP_MAPBOX_ACCESS_TOKEN=YOURKEYHERE to these files.

Then run `yarn` or `npm install` and `yarn start` or `npm start` to run the project.

## Available Scripts

In the project directory, you can run:

### `npm start` or `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test` or `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
