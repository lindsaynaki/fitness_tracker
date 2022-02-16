// build and export your unconnected client here
const { Client } = require('pq')
const client = new Client('postgres://localhost:5432/fitness-dev')

module.exports = { client }