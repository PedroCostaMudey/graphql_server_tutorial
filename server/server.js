// this server uses the Apollo 2.15 version please
//confirm is the correct Apollo version is installed
const fs = require('fs')

const {ApolloServer, gql} = require('apollo-server-express')
const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser')
const db = require('./db');


const PORT = 9000;
const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');


const typeDefs = gql(fs.readFileSync('./schema.graphql', {encoding: 'utf8'}));

const resolvers = require('./resolvers.js');

const app = express();

app.use(
  cors(),
  bodyParser.json(),
  expressJwt({
    secret: jwtSecret,
    credentialsRequired: false
  })
);

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path:'/graphql' });

app.post('/login', (req, res) => {
  console.log(req);
  const {email, password} = req.body;
  const user = db.users.list().find((user) => user.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({sub: user.id}, jwtSecret);
    res.send({token});
  });

  app.listen({port: PORT}, ()=> console.info(`Server started on port ${PORT}`));