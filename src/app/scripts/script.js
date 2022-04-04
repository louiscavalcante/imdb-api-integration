const https = require('https') // or 'http' for http:// URLs
const fs = require('fs')
const gunzip = require('gunzip-file')
const readline = require('readline')
const cron = require('node-cron')
const EventEmitter = require('events')

const events = new EventEmitter()

const Titles = require('../models/titles_model.js')
const Ratings = require('../models/ratings_model.js')

function downloader(fileName, url, downloadRatings, processLines) {
	const file = fs.createWriteStream(`./src/assets/${fileName}`)

	https.get(`${url}`, function (response) {
		response.pipe(file)
		console.log('Downloading...')

		file.on('finish', () => {
			console.log(`File Downloaded: ${fileName}`)

			gunzip(`./src/assets/${fileName}`, `./src/assets/${fileName}`.slice(0, -3), () => {
				console.log(`File Extracted: ${fileName}`.slice(0, -3))
				console.log(`File Deleted: ${fileName}`)

				events.emit(downloadRatings)
				events.emit(processLines)
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
			await Titles.update(line)
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
			await Ratings.update(line)
		} else {
			await Ratings.create(line)
		}
	}
}

function startStep() {
	downloader(
		'title.basics.tsv.gz',
		'https://datasets.imdbws.com/title.basics.tsv.gz',
		'downloadRatings',
		null
	)
}

events.on('downloadRatings', () => {
	downloader(
		'title.ratings.tsv.gz',
		'https://datasets.imdbws.com/title.ratings.tsv.gz',
		null,
		'processLines'
	)
})

events.on('processLines', () => {
	if (fs.existsSync('./src/assets/title.basics.tsv')) {
		console.log('Warming Up...')
		processTitlesLines('title.basics.tsv')
		setTimeout(() => {
			processRatingsLines('title.ratings.tsv')
		}, 60000)
	}
})

// cron.schedule(
// 	'0 1 * * *',
// 	() => {
startStep()
// 		console.log('Cron Job Schedule: 1:00am, everyday at America/Sao_Paulo timezone')
// 	},
// 	{
// 		scheduled: true,
// 		timezone: 'America/Sao_Paulo',
// 	}
// )
