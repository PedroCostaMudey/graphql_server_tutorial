// this server uses the Apollo 2.15 version please
// confirm if the correct Apollo version is installed
const fs = require('fs')

const {ApolloServer, gql} = require('apollo-server-express')
const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT;

const db = require('./db/db');

const user = require('./routes/user/user.js')

//const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');
const jwtSecret = Buffer.from(process.env.HASH_KEY, process.env.HASH_BASE);


const typeDefs = gql(fs.readFileSync('./models/schema.graphql', {encoding: 'utf8'}));
const resolvers = require('./resolvers/job_board/job_board.js');


const app = express();

app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({limit: "30mb", extended: true}));
app.use(expressJwt({ secret: jwtSecret, credentialsRequired: false }));

//ROUTING
app.use('/user', user);

//function that using the req.user.sub
const context = ({ req }) => ({ user: req.user && db.users.get(req.user.sub) });

const server = new ApolloServer({ typeDefs, resolvers, context});

server.applyMiddleware({ app, path:'/graphql' });

app.listen({port: PORT}, ()=> console.info(`Server started on port ${PORT}`));