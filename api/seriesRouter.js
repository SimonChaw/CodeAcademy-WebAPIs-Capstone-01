const express = require('express');
const seriesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//MIDDLEWARE
const validateSeries = (req, res, next) => {
  const series = req.body.series;
  if (!series.name || !series.description) {
    return res.sendStatus(400);
  }
  next();
}

//ROUTES

//GET
seriesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Series', (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else if(! data) {
      res.status(404).send('Series not found');
    } else {
      res.send({series: data});
    }
  });
});

seriesRouter.get('/:id', (req, res, next) => {
  db.get(`SELECT * FROM Series WHERE id = ${req.params.id}`, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else if(! data) {
      res.status(404).send('Series not found');
    } else {
      res.send({series: data});
    }
  });
});

//POST
seriesRouter.post('/', validateSeries, (req, res, next) => {
  const series = req.body.series;
  db.run(`INSERT INTO Series(name, description) VALUES($name, $description)`,
  {
    $name : series.name,
    $description: series.description
  },
  function (err) {
    if(err){
      return res.sendStatus(500);
    }
    db.get(`SELECT * FROM Series WHERE id = ${this.lastID}`, (err, data) => {
      if (!data) {
        return res.sendStatus(500);
      }
      res.status(201).send({series : data});
    });
  });
});

//DELETE

//PUT
seriesRouter.put('/:id', validateSeries, (req, res, next) => {
  const series = req.body.series;
  db.run(`UPDATE Series
          SET name = $name, description = $description
          WHERE id = ${req.params.id}`,
        {
          $name : series.name,
          $description : series.description
        },
      (err) => {
        if(err){
          res.sendStatus(500);
        }
        db.get(`SELECT * FROM Series WHERE id = ${req.params.id}`, (err, data) => {
          if (!data) {
            return res.sendStatus(404);
          }
          res.status(200).send({series: data});
        });
      });
});


module.exports = seriesRouter;
