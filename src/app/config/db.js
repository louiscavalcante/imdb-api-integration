const { Pool, Client } = require('pg')

const dbDocker = new Pool({
	user: 'postgres',
	password: '123',
	host: 'localhost',
	port: 5555,
	database: 'imdbapi',
})

console.log('Connected to Docker Database!')
module.exports = dbDocker
