const { Pool, Client } = require('pg')

const dbDocker = new Pool({
	user: 'postgres',
	password: '123',
	host: '172.17.0.1',
	port: 5555,
	database: 'imdbapi',
})

console.log('Connected to Docker Database!')
module.exports = dbDocker
