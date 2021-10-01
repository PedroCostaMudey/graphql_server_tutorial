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

const startApolloServer = async (typeDefs, resolvers) => {

  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  const app = express();

  app.use(
    cors(),
    express.urlencoded({extended: true}),
    express.json(),
    expressJwt({
      secret: jwtSecret,
      credentialsRequired: false
    })
  );

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

  //Modified server startup
  await new Promise( resolve =>  app.listen({port: PORT}, resolve));
  
  console.log(`Server started on port ${PORT}`);
}

startApolloServer(typeDefs, resolvers);
