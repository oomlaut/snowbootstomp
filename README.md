# Snowboot Stomp

The web-app companion for the 1st Annual [Stallis Snowboot Stomp](http://snowbootstomp.herokuapp.com)

[![endorse](https://api.coderwall.com/oomlaut/endorsecount.png)](https://coderwall.com/oomlaut)

## node.js on Heroku

A barebones Node.js app using [Express 4](http://expressjs.com/).

This application support the [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone git@github.com:heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```

To use Grunt with Bower and Compass, set the configuration variables:

| Config Var      | Value        |
|-----------------|--------------|
| `BUILDPACK_URL` | `https://github.com/stephanmelzer/heroku-buildpack-nodejs-grunt-compass.git` |
| `NODE_ENV`      | `production` |

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
