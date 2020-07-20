# Dara-js

Dara-js is a simple single page vanilla javascript web game based on the African board game [Dara](https://en.wikipedia.org/wiki/Dara_(game)).

Current up-to-date build of the game is live at rajaste.ee

## Setting things up

To set up a local development webserver:

```
npm install webpack webpack-cli webpack-dev-server --save-dev
```

### Running the webserver

To run the local webserver:


```
npm start
```
__Default port is 8090!__

## Deployment

To produce a production build:

```
npm run build
```

This will generate a minified ```main.js``` file under the folder ```dist```. Place this file into ```wwwroot``` and move the contents of the folder into wherever you choose to deploy it, be it a virtual server or a docker container.

### Dependencies

* Node.js >= v12.18.2 LTS with NPM

### Authors

* Ranno Rajaste