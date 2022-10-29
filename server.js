const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('./public/assets/helpers/uuid')
let notesList = [];

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static('public'));

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => 
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if(err) {
            console.log(`Error (${err}): couldn't read file`);
            return;
        }
        notesList = JSON.parse(data);
        res.json(notesList);
    })
);

app.get('*', (req, res) =>
res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    const newNote = {
        title,
        text,
        id: uuid()
    };
    
    console.log(JSON.stringify(newNote));
    console.log('notesList: ' + JSON.stringify(notesList))
    notesList.push(newNote);
    console.log(notesList);
});
    

app.listen(PORT, () => console.log(`Listening on ${PORT}`));