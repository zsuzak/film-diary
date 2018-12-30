const express = require('express');
const hbs = require('hbs')
const fs = require('fs');

const port = process.env.PORT || 3000;

let app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view-engine', 'hbs');

app.use(express.static(__dirname + '/public'));


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
	res.render('home.hbs');
});

app.get('/watchlist', (req, res) => {
	res.render('watchlist.hbs');
});

app.get('/2018favs', (req, res) => {
	res.render('2018favs.hbs');
});

app.get('/2019anticipated', (req, res) => {
	res.render('2019anticipated.hbs');
});

app.get('/posts', (req, res) => {
	res.render('posts.hbs');
});

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});