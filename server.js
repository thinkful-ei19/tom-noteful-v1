'use strict';

const express = require('express');
// Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this
const morgan = require('morgan');
const { PORT } = require('./config');


const app = express();


app.use(express.static('public'));
app.use(express.json());
app.use(morgan('combined'));

// INSERT EXPRESS APP CODE HERE...

// Depreciated 
// app.get('/api/notes', (req, res) => {
//   const searchTerm = req.query.searchTerm;
//   searchTerm ?
//     res.json(notes.filter(item => item.title.includes(searchTerm))) :
//     res.json(notes);
// });

//NEW
app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

//Depreciated
// app.get('/api/notes/:id', (req, res) => {
//   const id = req.params.id;
//   res.json(notes.find(item => item.id === Number(id)));
// });

//NEW
app.get('/api/notes/:id' , (req, res, next) => {
  const id = req.params.id;
  notes.find(id, (err, list) => {
    if (err) {
      return next(err); 
    }
    res.json(list);
  });
});

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});


app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});



app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


// Listen for incoming connections
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
