const express = require('express');
const artistRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
//const dbHandler = require('../dbHandler')

// VALIDATION MIDDLEWARE

const validateArtist = (req, res, next) => {
  const artist = req.body.artist;
  if (!artist.name || !artist.dateOfBirth|| !artist.biography) {
    return res.sendStatus(400);
  }
  next();
}

// ROUTES

// GET
artistRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Artist', (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else if(! data) {
      res.status(404).send('Artists not found');
    } else {
      res.send({artists: data});
    }
  });
});

artistRouter.get('/:id', (req, res, next) => {
  db.get(`SELECT * FROM Artist WHERE id = ${req.params.id}`, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else if(! data) {
      res.status(404).send('Artist not found');
    } else {
      console.log(data);
      res.send({ artist : data });
    }
  });
});

//POST
artistRouter.post('/', validateArtist, (req, res, next) => {
  const artist = req.body.artist;
  db.run(`INSERT INTO Artist(name, date_of_birth, biography, is_currently_employed) VALUES($name, $date_of_birth, $biography, $is_currently_employed)`,
  {
    $name : artist.name,
    $date_of_birth : artist.dateOfBirth,
    $biography : artist.biography,
    $is_currently_employed : artist.isCurrentlyEmployed
  },
  function (err) {
    if(err){
      return res.sendStatus(500);
    }
    db.get(`SELECT * FROM Artist WHERE id = ${this.lastID}`, (err, data) => {
      if (!data) {
        return res.sendStatus(500);
      }
      res.status(201).send({artist : data});
    });
  });
});

//DELETE
artistRouter.delete('/:id', (req, res, next) => {
  const artist = req.body.artist;
  db.run(`UPDATE Artist
          SET is_currently_employed = 0
          WHERE id = ${req.params.id}`,
      (err) => {
        if(err){
          res.sendStatus(404);
        }
        db.get(`SELECT * FROM Artist WHERE id = ${req.params.id}`, (err, data) => {
          if (!data) {
            return res.sendStatus(500);
          }
          res.status(200).send({artist: data});
        });
    });
});

//PUT
artistRouter.put('/:id', validateArtist, (req, res, next) => {
  const artist = req.body.artist;
  db.run(`UPDATE Artist
          SET name = $name, date_of_birth = $date_of_birth, biography = $biography, is_currently_employed = $is_currently_employed
          WHERE id = ${req.params.id}`,
        {
          $name : artist.name,
          $date_of_birth : artist.dateOfBirth,
          $biography : artist.biography,
          $is_currently_employed : artist.isCurrentlyEmployed
        },
      (err) => {
        if(err){
          res.sendStatus(500);
        }
        db.get(`SELECT * FROM Artist WHERE id = ${req.params.id}`, (err, data) => {
          if (!data) {
            return res.sendStatus(404);
          }
          res.status(200).send({artist: data});
        });
      });
});


module.exports = artistRouter;
