import express from 'express';
var router = express.Router();

router.post('/', async (req, res) => {
    const { pokemonName, found } = req.body;
    const username = req.session.account.username;
  
    try {
      console.log(`Querying for userId: ${username}`);
      console.log( `${pokemonName}`);
      let userPokedex = await req.models.UserPokedex.findOne({ playerId: username });
      console.log( `UserPokedex: ${userPokedex}`);

      if (!userPokedex) {
        const defaultPokemons = [
          { name: "bulbasaur", found: true },
          { name: "charmander", found: true },
          { name: "squirtle", found: true }
        ];

        userPokedex = new req.models.UserPokedex({
            playerId: username,
            pokemons: defaultPokemons
        });
      }

      const index = userPokedex.pokemons.findIndex(p => p.name === pokemonName);
      if (index !== -1) {
         userPokedex.pokemons[index].found = found;
      } else {
         userPokedex.pokemons.push({ name: pokemonName, found });
      }
      await userPokedex.save();
      res.json({ message: 'Pokedex updated successfully' });
    } catch (error) {
      console.error('Failed to update Pokedex:', error);
      res.status(500).json({ message: 'Failed to update Pokedex' });
    }
});

router.get('/getPokedex', async (req, res) => {
  const username = req.session.account.username;
  try {
      let userPokedex = await req.models.UserPokedex.findOne({ playerId: username });
      if (userPokedex) {
          res.json(userPokedex);
      } else {
          res.status(404).json({ message: 'Pokedex not found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
  