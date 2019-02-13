const express = require('express');
const hbs = require('hbs')
const fs = require('fs');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator/check');

const port = process.env.PORT || 3000;

let app = express();
hbs.registerPartials(__dirname + '/views/partials');
app.set('view-engine', 'hbs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

let json;
let record;
let json2;
let record2;

hbs.registerHelper('getTable', () => {
	var html = "<table> <thead> <tr> <th>Watched</th> <th>Name</th> <th>Year</th> <th>Rating</th> <th>Rewatch</th> </tr> </thead> <tbody>";
	
	fs.readFile('data-json.json', (err, data) => {
		if (err) throw err;
		json = JSON.parse(data);
	});

	for (var i in json) {
		record = json[i];
		html += "<tr>";
		html += `<td>${record.Watched}</td>`;
		html += `<td>${record.Name}</td>`;
		html += `<td>${record.Year}</td>`;
		html += `<td>${record.Rating}</td>`;
		html += `<td>${record.Rewatch}</td>`;
		html += "</tr>";
	}
	
	html += "</tbody> </table>";

	return html;
});

hbs.registerHelper('getWatchlist', () => {
	var html2 = "<table> <thead> <tr> <th>Name</th> <th>Year</th> </tr> </thead> <tbody>";

	fs.readFile('watchlist-json.json', (err, data) => {
		if (err) throw err;
		json2 = JSON.parse(data);
	});

	for (var j in json2) {
		record2 = json2[j];
		html2 += "<tr>";
		html2 += `<td>${record2.Name}</td>`;
		html2 += `<td>${record2.Year}</td>`;
		html2 += "</tr>";
	}

	html2 += "</tbody> </table>";

	return html2;
})


app.get('/', (req, res) => {
	res.render('home.hbs', {pageTitle: 'ZSU Film Diary'});
});

app.get('/watchlist', (req, res) => {
	res.render('watchlist.hbs', {pageTitle: 'Watchlist'});
});

app.get('/posts/2018favs', (req, res) => {
	res.render('2018favs.hbs', {pageTitle: '2018 Favourites'});
});

app.get('/posts/2019anticipated', (req, res) => {
	res.render('2019anticipated.hbs', {pageTitle: '2019 Anticipated'});
});

app.get('/posts', (req, res) => {
	res.render('posts.hbs', {pageTitle: 'Posts'});
});

app.get('/add', (req, res) => {
	res.render('add.hbs', {pageTitle: 'Add Diary Entry'});
});

app.post('/add', async (req, res) => {
	let errors = validationResult(req);
	if(!errors.isEmpty()) {
		console.log(errors);
	}

	console.log(`watched: ${req.body.watched} - name: ${req.body.title} - year: ${req.body.year} - rating: ${req.body.rating} - rewatch: ${req.body.rewatch}`);

	let rewatch = ""
	if (req.body.rewatch === 'yes') {
		rewatch = "Yes";
	}

	let date = req.body.watched;
	let dateArr = date.split("-");
	let newDate = dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0];

	let title = req.body.title;
	title = title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

	let obj = JSON.parse(`{"Watched": "${newDate}","Name": "${title}","Year": ${req.body.year},"Rating": ${req.body.rating},"Rewatch": "${rewatch}"}`);
	
	await fs.readFile('data-json.json', (err, data) => {
		let array = JSON.parse(data);
		array.push(obj);
		fs.writeFile('data-json.json', JSON.stringify(array), 'utf8', (err) => {
			if (err) throw err;
		});
	});

	res.render('add.hbs', {pageTitle: 'ZSU Add'});
});

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});