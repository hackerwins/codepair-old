# Yorkie CodePair

Yorkie CodePair provides developers with real-time collaborative code editing.

## Developing Yorkie CodePair

Runs CodePair in the development mode.

#### client

```
cd webapp
npm run start
```

## Deploying

When PR is merged into main, it is automatically distributed by GitHub Actions.

### Layout

Yorkie CodePair is deployed to AWS and the configuration is shown below. This repository is used to distribute static pages.

```
[Route53]
 ㄴ codepair.yorkie.dev     [gh-pages]    # for serving static pages
 ㄴ codepair-api.yorkie.dev [EC2]         # for serving API (not yet)
 ㄴ codepair.yorkie.dev - [ELB] - [EC2]   # for serving yorkie API

# EC2
[nginx] - [grpc-web proxy, envoy] - [yorkie server] - [mongodb]
```
