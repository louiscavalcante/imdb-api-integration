const db = require('../config/db.js')

module.exports = {
	async create(data) {
		const query = `
            INSERT INTO ratings (
                averagerating,
                numvotes
            ) VALUES ($1, $2)
            RETURNING tconst
        `

		const values = [data.averagerating, data.numvotes]

		const results = await db.query(query, values)
		return console.log(`Added: ${results.rows[0].tconst}`)
	},

	async findId(id) {
		const query = `
            SELECT tconst
            FROM ratings
            WHERE ratings.tconst = $1
			`

		const values = [id]

		const results = await db.query(query, values)
		return results.rows[0]
	},

	async update(data, id) {
		const query = `
            UPDATE ratings SET
                averagerating=($1),
                numvotes=($2)
            WHERE tconst = $3
        `

		const values = [data.averagerating, data.numvotes, id]

		const results = await db.query(query, values)
		return console.log(`Updated: ${id}`)
	},
}
