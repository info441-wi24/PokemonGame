import express from 'express';
var router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, pokemonChosen, opponentPokemon, movesUsed, outcome } = req.body;


    const newBattle = new req.models.Battle({
      userId,
      pokemonChosen,
      opponentPokemon,
      movesUsed,
      outcome
    });

    await newBattle.save();

    res.status(201).json({
      message: 'Battle information successfully stored.',
      battle: newBattle
    });
  } catch (error) {
    console.error('Failed to store battle information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
