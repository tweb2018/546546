// link to tuorial
https://medium.freecodecamp.org/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e

https://auth0.com/docs/quickstart/webapp/nodejs/01-login

https://www.youtube.com/watch?v=yvmy5u3PkeM&index=10&list=PLJm7_t7JnSjn__VC3sK86o2YlUuwlPKkO

# TWEB_Projet_2018

This project is part of the TWEB 2018 cours. The goal was to use the github API and create an app with a Backend server and a frontend (GUI).

Our project is a standard use of the github API. With this app, you can search for user and display a lot of info on a specific user.
Like a Who Is but for github user. This github Repo is in fact the backend that call the github API and send back the Json value used in the frontend.
This project can be fork and updated if you want it to display more or less infos on the user. You will find a tutorial to deploy the app on Heroku, or your local server.

This app is the backend part.
You can find the front endpart here: https://github.com/bouda19/TWEB_Projet_2018_Front_End

## Prepare for local environnement

Create a folder named "data" in the root of the directory

Install [mongodb](https://www.mongodb.com/download-center?initial=true#community) and run the following command. You need to be in the root of the project otherwise the command wont find the /data/ folder.
(On Windows you must Add MongoDB binaries to the System PATH "C:\Program Files\MongoDB\Server\4.0\bin" and restart Visual Studio Code)

```shell
mongod --dbpath=./data/ --port 12345
```

Not that the local DB is running on port: 12345.

Rename the .env.default in the root directory to .env file and edit the following configuration
(You must install dotenv Visual Studio Code plugin)

```java
PORT='3000'
ACCESS_TOKEN='xxx'
GITHUB_URL='https://api.github.com/'
NODE_MODE='xxx'
```

## Before first Run of server

Run this command on a terminal to install all dependencies.

```shell
npm install
```

## Run server

Then you can run this command in an other terminal to start the server.

```shell
npm start
```

## Api Call

You can use this route to ask for the github info on a user.

/user/:username where username is the github login of the one you want to stalk.

exemple:

```shell
localhost:3000/user/testuser
```

This call will return you a Json table with multiple information about 'testuser'.

Exemple of Json response:

```javascript

}
```

This Json object will be saved the first time into the MongoDb using the Mongoose dependecy.

This will also generate a cache user value saved in the db using the date the first query on this user was made.
If the cache time (you can change it to suits your needs) is still less than the query date, the Json will be served from the DB.

Otherwise if the cache time is more, then a new call to the Github API will be made and the user will be updated in the DB.

## Deployement of Backend Node.js Server with use of github API and Mongo DB (Production)

A simple way to deploy this app is using Heroku.

1. First fork this github repo
2. Go to Heroku website and register or login in
3. Create a new app in heroku admin panel and link it to your github repo (forked)
4. A good thing to do is: in the package.json file add in the start scirpt (npm install)

Exemple of package.json

```shell
  "scripts": {
    "start": "node index.js",
    "test": "nyc --reporter=text --reporter=html mocha"
  },
```

5. Go into the app setting into heroku. From here you need to set the env variables for your heroku app.
6. You need to add one by one those env. variables with your personal token

Variable Needed

```java

```

Exemple :

![alt text](http://image.noelshack.com/fichiers/2018/43/7/1540740419-capture.png)

7. You can now enable the automatic deploy or deploy the app manualy.
8. Go to your app website and check the app with a user.

Info: To deploy the app in production, you need to have also a prod mongoDB. For this you can use Mlab

## Dependencies

### Appollo Server Express

See [https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-express](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-express)

### Google book search

See [https://www.npmjs.com/package/google-books-search](https://www.npmjs.com/package/google-books-search)
