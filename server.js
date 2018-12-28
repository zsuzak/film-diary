const express = require('express');
const hbs = require('hbs')
const fs = require('fs');

const port = process.env.PORT || 3000;

let app = express();

let json;
let record;

app.set('view-engine', 'hbs');

app.use(express.static(__dirname + '/public'));

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

app.get('/', (req, res) => {
	res.render('home.hbs');
});

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});
