const express = require('express');
const path = require('path');

const fs = require('fs');
const {v4:uuidv4} = require('uuid'); 
const { application } = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const addNote = req.body;
    addNote.id = uuidv4();
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    notes.push(addNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(notes);
}); 

app.delete('/api/notes/:id', (req, res) => {
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    for (let i = 0; i < notes.length; i++)
      if (notes[i].id === req.params.id) {
        notes.splice(i, 1);
        fs.writeFileSync('./db/db.json', JSON.stringify(notes));
        return res.json(notes);
      }
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
)
