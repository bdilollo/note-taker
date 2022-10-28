const express = require('express');
const fs = require('fs');
const path = require('path');

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
        let notesJSON = JSON.parse(data);
        console.log(notesJSON);
        return notesJSON;
    })
);

app.post('/api/notes', (req, res) => 
    console.log(res)
);
    

app.listen(PORT, () => console.log(`Listening on ${PORT}`));