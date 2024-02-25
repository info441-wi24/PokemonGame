import express from 'express';
var router = express.Router();

import usersRouter from './api/users.js';
import gameResultsRouter from './api/gameResults.js';
import updatePokedexRouter from './api/updatePokedex.js';

router.use('/users', usersRouter);
router.use('/gameResults', gameResultsRouter);
router.use('/updatePokedex', updatePokedexRouter);

export default router;
