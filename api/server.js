const express = require('express'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
	  fs = require('file-system'),
	  shortId = require('shortid'),
	  dataFile = 'tasks.json',
      app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});


app.get('/api/tasks', (req, res) => {
	res.send({'tasks' : JSON.parse(fs.readFileSync(dataFile, 'utf8'))});
});

app.post('/api/tasks', (req, res) => {
	const data = JSON.parse(fs.readFileSync(dataFile, 'utf8')),
		task = req.body;

	task.id = shortId.generate();
	task.status = 'New';

	data.push(task);
	fs.writeFileSync(dataFile, JSON.stringify(data));
	res.send({'task' : task});
});

app.put('/api/tasks/:id', (req, res) => {
	const data = JSON.parse(fs.readFileSync(dataFile, 'utf8')),
		id = req.params.id,
		task = req.body;

	const updatedData = data.filter((task) => {
		return task.id !== id;
	});

	task.id = id;

	updatedData.push(task);
	fs.writeFileSync(dataFile, JSON.stringify(updatedData));
	res.sendStatus(204);
});

app.delete('/api/tasks/:id', (req, res) => {
	const data = JSON.parse(fs.readFileSync(dataFile, 'utf8')),
		id = req.params.id;

	const updatedData = data.filter((task) => {
		return task.id !== id;
	});

	fs.writeFileSync(dataFile, JSON.stringify(updatedData));
	res.sendStatus(204);
});

app.listen(9999, function () {
    console.log('Server has been started...');
});