const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = 3001;
const app = express();
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const { uuid } = require('./helpers/uuid');
const notes = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/')));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html')));

// express.static is for serving static files = nothing generated on the fly
// app.use('/notes', express.static('public/notes.html'))

app.get('/api/notes', (req,res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);