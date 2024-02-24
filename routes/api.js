import express from 'express';
var router = express.Router();

import usersRouter from './api/users.js';

router.use('/users', usersRouter);

export default router;
