import express from 'express';
var router = express.Router();

import usersRouter from './api/users.js';
import recordBattle from './api/battles.js';

router.use('/users', usersRouter);
router.use('/battles', recordBattle);
export default router;
