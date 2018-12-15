# TWEB_Projet_2018

This project is part of the TWEB 2018 cours. The goal was to implement a social network website

Our project is a book social network based on [Google Book API](https://developers.google.com/books/).

Functionnalities

- Subribe to the site
- Search a book
- Show the details and the users comments of the book
- Add a comment if the user sign in

The website link [https://book-book-rzcinxdwsz.now.sh/](https://book-book-rzcinxdwsz.now.sh/)

Backend repository [https://github.com/tweb2018/Backend_BookBook](https://github.com/tweb2018/Backend_BookBook)

Frontend repository [https://github.com/tweb2018/Backend_BookBook](https://github.com/tweb2018/Backend_BookBook)

## Firebase tutorial

[https://medium.freecodecamp.org/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e](https://medium.freecodecamp.org/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e)

[https://auth0.com/docs/quickstart/webapp/nodejs/01-login](https://auth0.com/docs/quickstart/webapp/nodejs/01-login)

[https://www.youtube.com/watch?v=yvmy5u3PkeM&index=10&list=PLJm7_t7JnSjn\_\_VC3sK86o2YlUuwlPKkO](https://www.youtube.com/watch?v=yvmy5u3PkeM&index=10&list=PLJm7_t7JnSjn__VC3sK86o2YlUuwlPKkO)

## Prepare for local environnement

Install [mongodb](https://www.mongodb.com/download-center?initial=true#community) and run the following command. You need to be in the root of the project otherwise the command wont find the /data/ folder.
(On Windows you must Add MongoDB binaries to the System PATH `C:\Program Files\MongoDB\Server\4.0\bin` and restart Visual Studio Code)

```shell
mongod --dbpath=./data/ --port 12345
```

Not that the local DB is running on port: `12345`.

### .env

You can use the `.env` file given in the `.env.zip` file

Password : `Heig$2018`

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

## Endpoint

## Graphql

You can use graphql endpoint on `http://host_name:port/graphql` (work only in local dev)

The existing endpoint

```{shell}
  books(text: String, limit: Int): [Book]
  book(id: String!): Book
  profile: User
```

## Express

TODO

exemple:

```shell

```

## Responses

The endpoint return you a Json table with multiple information about 'books, users and comments'.

Exemple of Json response:

```{javascript}
  Book {
    id: ID!
    title: String
    authors: [String]
    summary: String
    published_date: String
    thumbnail: URL
    comments: [Comment]
  }

  User {
    id: ID!
    login: String
    first_name: String
    last_name: String
    email: Email
    comments: [Comment]
  }

  Comment {
    id:ID!
  }
}
```

The book Json object will be saved the first time into the MongoDB using mongoose dependency.
This will also genereate a cache book value saved int the db using the timestamp date to resfresh the data for every book search query
If there are data on the cache, the Json will be served from the DB and the server will make a new asynchrone search to refresh the book data.

The user Json object will saved user's informations that are not stored on firebase (firebase store only the login and the password).

## Deployement of Backend Node.js Server with use of github API and Mongo DB (Production)

A simple way to deploy this app is using Heroku.

1. First fork this github repo
2. Go to Heroku website and register or login in
3. Create a new app in heroku admin panel and link it to your github repo (forked)
4. Go into the app setting into heroku. From here you need to set the env variables for your heroku app.
5. You need to add one by one those env. variables with your personal token (you can use .env.zip file info)

Exemple :

[http://image.noelshack.com/fichiers/2018/43/7/1540740419-capture.png](http://image.noelshack.com/fichiers/2018/43/7/1540740419-capture.png)

7. You can now enable the automatic deploy or deploy the app manualy.
8. Go to your app website and check the app with a user.

Info: To deploy the app in production, you need to have also a prod mongoDB. For this you can use Mlab

## Tests

TODO

To run tests use the following command

```{shell}
npm run test
```

The tests used mocha
