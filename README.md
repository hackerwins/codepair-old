# Yorkie CodePair

## Developing Yorkie CodePair

### Running CodePair

Runs CodePair in the development mode.

```
npm start
```

### Testing CodePair

Launches the test runner in the interactive watch mode.

```
npm test
```

Yorkie CodePair was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
<details>
  <summary>For more details, click to expand details about Create React App</summary>

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

</details>

## Deploying

When PR is merged into main, it is automatically distributed by GitHub Actions.

### Layout

Yorkie CodePair is deployed to AWS and the configuration is shown below. This repository is used to distribute static pages.

```
[Route53]
 ㄴ codepair.yorkie.dev - [gh-pages] # for serving static pages
 ㄴ api.yorkie.dev - [ELB] - [EC2]   # for serving API

# EC2
[nginx] - [grpc-web proxy, envoy] - [yorkie server] - [mongodb]
```
