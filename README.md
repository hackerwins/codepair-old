# Yorkie CodePair

Yorkie CodePair provides developers with real-time collaborative code editing.

## Developing Yorkie CodePair

CodePair requires local applications such as Envoy, Yorkie and MongoDB. To start them:

```
docker-compose -f docker/docker-compose.yml up --build -d
```

Next, Let's starts CodePair in the development mode.

```
cd webapps

# Install related package
npm install
# if you using yarn
yarn

# Start development server
npm start
# if you using yarn
yarn start
```

## Deploying

When PR is merged into main, it is automatically distributed by GitHub Actions.

### Layout

Yorkie CodePair is deployed to AWS and the configuration is shown below. This repository is used to distribute static pages.

```
[Route53]
 ㄴ codepair.yorkie.dev     [gh-pages] # for serving static pages
 ㄴ codepair-api.yorkie.dev [EKS]      # for serving API (not yet)
 ㄴ api.yorkie.dev          [EKS]      # for serving yorkie API
```
