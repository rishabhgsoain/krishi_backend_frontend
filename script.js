const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const hbs = require('hbs');
const path = require('path');
const partialsPath = path.join(__dirname, './views/partials');
const http = require('http');
const hostname = '0.0.0.0';

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/farmers', require('./routes/farmers'));
hbs.registerPartials(partialsPath);
app = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('content-Type', 'text/plain');
    res.end('Zeet Node');
})
app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});

