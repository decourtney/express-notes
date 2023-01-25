const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const { readFromFile, readAndAppend, readAndRemove } = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');
// const notesDB = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/')));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'notes.html')));

app.get('/api/notes', (req, res) =>
{
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) =>
{
    const { title, text } = req.body;

    if (title && text)
    {
        // Add uuid here
        const newNote = { title, text, id: uuid() };

        readAndAppend(newNote, './db/db.json');

        response = { status: 'great success', data: req.body };
        res.status(201).json(response);
    } else
    {
        res.status(400).json('Bad request');
    }
});

app.delete('/api/notes/:id', (req, res) =>
{
    const requestedID = req.params.id;

    if (requestedID)
    {
        readAndRemove(requestedID, './db/db.json');

        response = { status: 'Successfully Deleted' }
        res.status(201).json(response);
    } else
    {
        res.status(400).json('Bad request');
    }
})

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);