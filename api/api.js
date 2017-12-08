const express = require('express');
const apiRouter = express.Router();

const artistRouter = require('./artistRouter');
const seriesRouter = require('./seriesRouter');

apiRouter.use('/artists', artistRouter);
apiRouter.use('/series', seriesRouter);

module.exports = apiRouter;
