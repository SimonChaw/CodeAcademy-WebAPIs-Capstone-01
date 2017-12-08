const express = require('express');
const seriesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

/*--------------
  SERIES
--------------*/

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
seriesRouter.delete('/:id', (req, res, next) => {
  db.get(`SELECT * FROM Issue WHERE series_id = ${req.params.id}`, (err, data) => {
    if(err){
      throw err;
    }
    if(data){
      res.sendStatus(400);
    }else{
      db.run(`DELETE FROM Series WHERE id = ${req.params.id}`, (err) => {
        if(err){
          res.sendStatus(404);
        }
        res.sendStatus(204);
      });
    }
  });
});


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

/*--------------
  ISSUES
--------------*/

//VALIDATOR
const validateIssue = (req, res, next) => {
  const issue = req.body.issue;
  if (!issue.name || !issue.issueNumber || !issue.publicationDate || !issue.artistId || !req.params.seriesId) {
    return res.sendStatus(400);
  }
  next();
}

//GET
seriesRouter.get('/:seriesId/issues', (req, res, next) => {
  db.all(`SELECT * FROM Issue WHERE series_id = ${req.params.seriesId}`, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else if(! data) {
      res.status(404).send('Issues not found');
    } else {
      res.send({issues: data});
    }
  });
});

//POST
seriesRouter.post('/:seriesId/issues', validateIssue, (req, res, next) => {
  const issue = req.body.issue;
  db.run(`INSERT INTO Issue(name, issue_number, publication_date, artist_id, series_id) VALUES($name, $issue_number, $publication_date, $artist_id, $series_id)`,
  {
    $name : issue.name,
    $issue_number: issue.issueNumber,
    $publication_date: issue.publicationDate,
    $artist_id: issue.artistId,
    $series_id: req.params.seriesId
  },
  function (err) {
    if(err){
      return res.sendStatus(500);
    }
    db.get(`SELECT * FROM Issue WHERE id = ${this.lastID}`, (err, data) => {
      if (!data) {
        return res.sendStatus(500);
      }
      res.status(201).send({issue : data});
    });
  });
});

//PUT
seriesRouter.put('/:seriesId/issues/:id', validateIssue, (req, res, next) => {
  const issue = req.body.issue;
  db.run(`UPDATE Issue
          SET name = $name, issue_number = $issue_number, publication_date = $publication_date, artist_id = $artist_id
          WHERE id = ${req.params.id} AND series_id = ${req.params.seriesId}`,
        {
          $name : issue.name,
          $issue_number: issue.issueNumber,
          $publication_date: issue.publicationDate,
          $artist_id: issue.artistId
        },
      (err) => {
        if(err){
          res.sendStatus(500);
        }
        db.get(`SELECT * FROM Issue WHERE id = ${req.params.id}`, (err, data) => {
          if (!data) {
            return res.sendStatus(404);
          }
          res.status(200).send({issue: data});
        });
      });
});

//DELETE
seriesRouter.delete('/:seriesId/issues/:id', (req, res, next) => {
  db.run(`DELETE FROM Issue
          WHERE id = ${req.params.id}`,
      (err) => {
        if(err){
          res.sendStatus(404);
        }
      res.sendStatus(204);
    });
});

module.exports = seriesRouter;
