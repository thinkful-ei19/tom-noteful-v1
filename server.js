'use strict';

// TEMP: Simple In-Memory Database
const express = require('express');

const data = require('./db/notes');

const app = express();
app.use(express.static('public'));

// Listen for incoming connections
app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
// INSERT EXPRESS APP CODE HERE...
//app.get('/api/notes', (req, res) => {

app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  searchTerm ?
    res.json(data.filter(item => item.title.includes(searchTerm))) :
    res.json(data);
});


app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  res.json(data.find(item => item.id === Number(id)));
});


