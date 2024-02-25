
import express from 'express';
var router = express.Router();

router.post('/', async (req, res) => {
    const gameResultData = req.body;
    const username = req.session.account.username;

    const gameResult = new req.models.GameResult({
        gameId: gameResultData.gameId,
        playerId: username,
        outcome: gameResultData.outcome,
        p1Move: gameResultData.p1Move,
        p2Move: gameResultData.p2Move,
        p1HpRemaining: gameResultData.p1HpRemaining,
        p2HpRemaining: gameResultData.p2HpRemaining
    });

    try {
        await gameResult.save();
        res.send({ message: 'Game result stored successfully' });
    } catch (error) {
        console.error('Error storing game result:', error);
        res.status(500).send('Error storing game result');
    }
});

export default router;
