require('dotenv').config();
const jwt = require('jsonwebtoken');
const graphqlHTTP = require('express-graphql');
const { graphQLschema } = require('./graphql-schema.js');

const express = require('express');
const app = express();
// database connection
const mongoose = require("mongoose");
const db = mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const theSecretKey = process.env.JWT_SECRET;

const {
  promptsGetAll,
  promptSearch
} = require("./controllers/promptsController.js");

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
const cors = require("cors");

// Middlewares
app.use(bodyParser.json());

// check for cors
app.use(cors({
  domains: '*',
  methods: "*"
}));

// expose in the root element the different entry points of the
// graphQL service
const graphqlResolvers = {
  getPrompt:(args,req) =>  promptsGetAll(args,req),
  searchPrompt: (args,req) => promptSearch(args,req),
  version: function () { return "1.0" }
};

// JWT Authentication middleware
app.use(function (req, res, next) {
  if (req.headers["authorization"]) {
    const authToken = req.headers['authorization'].split(' ')[1];
    try {
      jwt.verify(authToken, theSecretKey, (err, decodedToken) => {
        if (err || !decodedToken) {
          res.status(401);
          res.json({
            error: "Unauthorized 1"
          });
        }
        req.user = decodedToken.userId;// Almacena el token decodificado en req.user
        next();
      });
    } catch (e) {
      res.status(401);
      res.send({
        error: "Unauthorized 2"
      });
    }
  } else {
    res.status(401);
    res.send({
      error: "Unauthorized 3"
    });
  }
});


app.use('/graphql', graphqlHTTP({
  schema: graphQLschema,
  rootValue: graphqlResolvers,
  graphiql: true,
}));

app.listen(3001, () => console.log(`Example app listening on port 3001!`))
