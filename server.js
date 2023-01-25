const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = 3001;
const app = express();
const { readFromFile, writeToFile, readAndAppend, readAndRemove } = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');
const notesDB = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/')));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html')));

// express.static is for serving static files = nothing generated on the fly
// app.use('/notes', express.static('public/notes.html'))

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

    if (title && text) {
        // can add uuid here
        const newNote = { title, text, id: uuid() };

        console.log(`New Note saved: ${newNote.noteID}`)
        readAndAppend(newNote, './db/db.json');

        response = { status: 'great success', data: req.body };
        res.status(201).json(response);
    } else {
        res.status(400).json('Bad request, try again!');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id);
    const requestedID = req.params.id;

    if(requestedID){
        readAndRemove(requestedID, './db/db.json')
    }
})

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);