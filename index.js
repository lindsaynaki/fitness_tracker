require('dotenv').config();
const {PORT = 3000} = process.env;

const express = require('express');
const cors = require('cors');

const server = express();

server.use(cors());

const bodyParser = require('body-parser')
server.use(express.json());

const morgan = require('morgan')
server.use(morgan ('dev'))

const client = require('./db/client')
const apiRouter = require('./api');
server.use('/api', apiRouter);

server.use("*", (req, res, next) =>{
    res.status(404).send("Page not found");
});

server.use((error, req, res, next) => {
    res.status(500).send(error);
});

server.listen( PORT, () => {
    client.connect();
    console.log("My server is up on:", PORT);
})