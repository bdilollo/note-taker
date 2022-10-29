// requiring all of the modules and npms being used in the application
const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqueID = require('generate-unique-id');
let notesList = [];

// setting a port--one that Heroku provides or 3001 on local machine
const PORT = process.env.PORT || 3001;

const app = express();

// middleware to parse JSON and HTML content
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// telling the server where to look for static assets
app.use(express.static('public'));

// GET request on the root route serves the index.html file
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET request on the /notes route serves the notes.html file
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// GET request on the /api/notes route reads and returns the existing db.json file
app.get('/api/notes', (req, res) => 
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if(err) {
            console.log(`Error (${err}): couldn't read file`);
        }
        notesList = JSON.parse(data);
        res.json(notesList);
    })
);

// GET request on the universal route (not sure what exactly it's called) simply serves the use the index.html file
app.get('*', (req, res) =>
res.sendFile(path.join(__dirname, 'public/index.html'))
);

// POST request on the api/notes route appends a new note (structured as a JSON object) to the existing object array in db.json, then returns it to be rendered on the notes.html page
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    const newNote = {
        title,
        text,
        id: uniqueID()
    };
    
    notesList.push(newNote);
    const notesListString = JSON.stringify(notesList, null, '\t');
    fs.writeFile('./db/db.json', notesListString, (err) =>
        err ? console.error(err) : console.log('success!')
    )
    res.json(notesList);
});

// DELETE request on the /api/notes route with a specific note id appended to the path
// deletes note with matching id and returns updated JSON object
app.delete('/api/notes/:id', (req, res) => {
    let deleteBtnId = req.params.id;
    for(let i=0; i<notesList.length; i++) {
        if(deleteBtnId === notesList[i].id) {
            notesList.splice(i,1);
        }
    }
    const notesListString = JSON.stringify(notesList, null, '\t');
    fs.writeFile('./db/db.json', notesListString, (err) =>
        err ? console.error(err) : console.log('success!')
    )
    res.json(notesList);
});
    
// listening on the appropriate port, with a message in the console when successful
app.listen(PORT, () => console.log(`Listening on ${PORT}`));