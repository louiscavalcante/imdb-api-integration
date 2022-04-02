const db = require('../config/db.js')

module.exports = {
	async create(data) {
		const query = `
            INSERT INTO titles (
                titletype,
                primarytitle,
                originaltitle,
                isadult,
                startyear,
                endyear,
                runtimeminutes,
                genres
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING tconst
        `

		const values = [
			data.titletype,
			data.primarytitle,
			data.originaltitle,
			data.isadult,
			data.startyear,
			data.endyear || '\\N',
			data.runtimeminutes,
			data.genres,
		]

		const results = await db.query(query, values)
		return console.log(`Added: ${results.rows[0].tconst}`)
	},

	async findId(id) {
		const query = `
            SELECT tconst
            FROM titles
            WHERE titles.tconst = $1
			`

		const values = [id]

		const results = await db.query(query, values)
		return results.rows[0]
	},

	async update(data, id) {
		const query = `
            UPDATE titles SET
                titletype=($1),
                primarytitle=($2),
                originaltitle=($3),
                isadult=($4),
                startyear=($5),
                endyear=($6),
                runtimeminutes=($7),
				genres=($8)
            WHERE tconst = $9
        `

		const values = [
			data.titletype,
			data.primarytitle,
			data.originaltitle,
			data.isadult,
			data.startyear,
			data.endyear || '\\N',
			data.runtimeminutes,
			data.genres,
			id,
		]

		const results = await db.query(query, values)
		return console.log(`Updated: ${id}`)
	},
}
