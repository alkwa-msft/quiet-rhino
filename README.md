# Getting Started with Azure Static Web apps using Create React App and Azure Functions (NodeJS)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and Azure Functions. 
It is designed to be a template for trying out as a starting point for Azure Static Web Apps using a typescript front-end
and an Azure Functions backend (in NodeJS).

## Available Scripts

In the project directory, you can run:

### `yarn start`

This is a customized yarn start which starts up the client side application in the "app" directory and the 
API in the "api" directory.

Runs the client side application in development mode.
The page will reload if you make edits.\
You will also see any lint errors in the console.

You will need to stop the server and start the server again if you make changes to your APIs built in the API directory.

Open [http://localhost:4280](http://localhost:4280) to view it in the browser.

If you have any issues starting it up. There is a chance the CRA dev server didn't start up in time. In a separate process start up the devserver (cd app && yarn start)
and then call yarn start in the root directory to trigger the swa cli

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

Understand what are Azure Static Web Apps [docs](https://docs.microsoft.com/en-us/azure/static-web-apps/overview)

Learn more about Azure functions in Azure Static Web Apps [docs](https://docs.microsoft.com/en-us/azure/static-web-apps/apis)

If you want to learn how to deploy to Azure using Github actions [workflow doc](https://docs.microsoft.com/en-us/azure/static-web-apps/github-actions-workflow)
