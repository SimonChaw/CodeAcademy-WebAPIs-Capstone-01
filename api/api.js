const express = require('express');
const apiRouter = express.Router();

const artistRouter = require('./artistRouter')

apiRouter.use('/artists', artistRouter);

module.exports = apiRouter;
