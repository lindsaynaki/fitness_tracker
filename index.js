require('dotenv').config();
const { PORT = 3000 } = process.env;

const express = require('express');
const server = express();

const cors = require('cors');
server.use(cors());

const bodyParser = require('body-parser');
server.use(express.json());

const morgan = require('morgan');
server.use(morgan('dev'));

const client = require('./db/client');

const apiRouter = require('./api');
server.use('/api', apiRouter);

// Error Handling
server.use("*", (req, res, next) => {
    res.status(404).send("Page not found");
});

server.use((error, req, res, next) => {
    res.status(500).send(error);
});

server.listen(PORT, () => {
    client.connect();
    console.log('The server is up on port', `http://localhost:${PORT}`)
});