import express from 'express';
var router = express.Router();

// Endpoint to get the identity of the logged-in user
router.get('/myIdentity', (req, res) => {
  // Check if the user is logged in
  if (req.session.isAuthenticated) {
      // If logged in, return the user's information
      res.json({
          status: "loggedin",
          userInfo: {
              name: req.session.account.name,
              username: req.session.account.username
          },
      });
  } else {
      // If not logged in, indicate the user is logged out
      res.json({ status: "loggedout" });
  }
});

router.post('/setOnlineStatus', async (req, res) => {
    const { userId, online } = req.body;

    try {
        const userPokedex = await req.models.UserPokedex.findOne({ playerId: userId });

        if (userPokedex) {
            userPokedex.online = online;
            await userPokedex.save();
            res.json({ message: 'User status updated successfully.' });
        } else {
            // If no document exists for this userId, create a new one
            const newUserPokedex = new req.models.UserPokedex({
                playerId: userId,
                online: online
            });
            await newUserPokedex.save();
            res.json({ message: 'UserPokedex created and status updated successfully.' });
        }
    } catch (error) {
        console.error('Failed to update user status:', error);
        res.status(500).json({ error: 'Failed to update user status.' });
    }
});


router.get('/allChats', async (req, res) => {
    try {
      const allChats = await req.models.OnlineChat.find({});
      res.json(allChats);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      res.status(500).send('Error fetching conversations');
    }
  });


router.get('/ranking', async (req, res) => {
    try {
        const players = await req.models.UserPokedex.find({}).populate('pokemons');

        const filteredPlayers = players.filter(player => player.pokemons.length > 0);

        let rankings = filteredPlayers.map(player => ({
            playerId: player.playerId,
            numbers: player.pokemons.length
        }));

        rankings.sort((a, b) => b.numbers - a.numbers);
        let rank = 1;
        for (let i = 0; i < rankings.length; i++) {
            // If it's not the first player and their Pokémon count is different from the previous one, increment the rank
        if (i > 0 && rankings[i].numbers < rankings[i - 1].numbers) {
            rank = i + 1;
            }
            rankings[i].rank = rank;
        }
        res.json(rankings);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/battleHistory', async (req, res) => {
    try {
        const username = req.session.account.username;
        if (!username) {
          return res.status(400).send("Username is required");
        }

        // Fetch the latest result for each gameId for the specified username
        const latestResults = await req.models.GameResult.aggregate([
          { $match: { playerId: username } },
          { $sort: { gameId: 1, timestamp: -1 } },
          {
            $group: {
              _id: "$gameId",
              playerId: { $first: "$playerId" },
              outcome: { $first: "$outcome" },
              p1HpRemaining: { $first: "$p1HpRemaining" },
              timestamp: { $first: "$timestamp" }
            }
          },
          { $sort: { timestamp: -1 } },
          {
            $project: {
              _id: 0,
              gameId: "$_id",
              playerId: 1,
              outcome: 1,
              p1HpRemaining: 1,
              timestamp: 1
            }
          }
        ]);

        res.json(latestResults);
      } catch (error) {
        console.error("Failed to fetch battle history for username:", error);
        res.status(500).send(error.message);
      }
});


export default router;
