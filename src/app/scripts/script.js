const https = require('https') // or 'http' for http:// URLs
const fs = require('fs')
const gunzip = require('gunzip-file')
const readline = require('readline')
const cron = require('node-cron')

const Titles = require('../models/titles_model.js')
const Ratings = require('../models/ratings_model.js')

async function downloader(fileName, url) {
	const file = fs.createWriteStream(`./src/assets/${fileName}`)

	https.get(`${url}`, function (response) {
		response.pipe(file)

		file.on('finish', () => {
			console.log(`File Downloaded: ${fileName}`)

			gunzip(`./src/assets/${fileName}`, `./src/assets/${fileName}`.slice(0, -3), () => {
				console.log(`File Extracted: ${fileName}`.slice(0, -3))
				console.log(`File Deleted: ${fileName}`)
			})

			file.close()
		}).on('close', () => {
			fs.unlinkSync(`./src/assets/${fileName}`)
		})
	})
}

async function processTitlesLines(fileName) {
	const lines = readline.createInterface({
		input: fs.createReadStream(`./src/assets/${fileName}`),
		crlfDelay: Infinity,
	})

	let data = []

	for await (let line of lines) {
		const dataSplit = line.split('\t')

		data.push({
			tconst: dataSplit[0],
			titletype: dataSplit[1],
			primarytitle: dataSplit[2],
			originaltitle: dataSplit[3],
			isadult: dataSplit[4],
			startyear: dataSplit[5],
			endyear: dataSplit[6],
			runtimeminutes: dataSplit[7],
			genres: dataSplit[8],
		})
	}

	for await (let line of data.slice(1)) {
		if (!(await Titles.findId(line.tconst)) == []) {
			await Titles.update(line, line.tconst)
		} else {
			await Titles.create(line)
		}
	}
}

async function processRatingsLines(fileName) {
	const lines = readline.createInterface({
		input: fs.createReadStream(`./src/assets/${fileName}`),
		crlfDelay: Infinity,
	})

	let data = []

	for await (let line of lines) {
		const dataSplit = line.split('\t')

		data.push({
			tconst: dataSplit[0],
			averagerating: dataSplit[1],
			numvotes: dataSplit[2],
		})
	}

	for await (let line of data.slice(1)) {
		if (!(await Ratings.findId(line.tconst)) == []) {
			await Ratings.update(line, line.tconst)
		} else {
			await Ratings.create(line)
		}
	}
}

async function asynchronousController() {
	await downloader('title.ratings.tsv.gz', 'https://datasets.imdbws.com/title.ratings.tsv.gz')
	await downloader('title.basics.tsv.gz', 'https://datasets.imdbws.com/title.basics.tsv.gz')
	setTimeout(async () => {
		await processTitlesLines('title.basics.tsv')
	}, 90000)
	setTimeout(async () => {
		await processRatingsLines('title.ratings.tsv')
	}, 180000)
}

cron.schedule(
	'0 1 * * *',
	() => {
		asynchronousController()
		console.log('Cron Job Schedule: 1:00am, everyday at America/Sao_Paulo timezone')
	},
	{
		scheduled: true,
		timezone: 'America/Sao_Paulo',
	}
)
