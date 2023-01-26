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

// Route to root
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/')));

// Route to notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'notes.html')));

// On request returns the json DB list of notes
app.get('/api/notes', (req, res) =>
{
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// Route to create new notes and add them to the json list
app.post('/api/notes', (req, res) =>
{
    const { title, text } = req.body;

    if (title && text)
    {
        // Add uuid here
        const newNote = { title, text, id: uuid() };

        // Helper tool fsUtil
        readAndAppend(newNote, './db/db.json');

        // Respond with 201 for successful creation
        response = { status: 'great success', data: req.body };
        res.status(201).json(response);
    } else
    {
        res.status(400).json('Bad request');
    }
});

// Route to delete notes using query params to specify based on uuid
app.delete('/api/notes/:id', (req, res) =>
{
    const requestedID = req.params.id;

    // Filter notes based on uuid and remove from list
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

// Catch 22 Route
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'index.html')));

let server = app.listen(PORT, function ()
{
    let host = server.address().address;
    let port = server.address().port;
    console.log("server is listening at http://%s:%s", host, port);
});