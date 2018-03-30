const express = require('express');
app = express();

app.get('/', (req, res) => {
	res.send('<h1>Hello World</h1>');
});

app.listen(3000, () => {
	console.log('Running at http://localhost:3000');
});