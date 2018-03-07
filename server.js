'use strict';

const express = require('express');
const morgan = require('morgan');



const app = express();

app.use(morgan('dev'));

app.use(express.static('public'));
app.use(express.json());

const notesRouter = require('./routers/notes.router');

const { PORT } = require('./config');

app.use('/v1', notesRouter);

// INSERT EXPRESS APP CODE HERE...

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

