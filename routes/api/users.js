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
          }
      });
  } else {
      // If not logged in, indicate the user is logged out
      res.json({ status: "loggedout" });
  }
});

router.post('/setOnlineStatus', async (req, res) => {
    const { userId, online } = req.body;
    try {
        // Assuming you have a User model and the user's online status is stored in an 'online' field
        await req.models.UserPokedex.findByIdAndUpdate(userId, { online: online });
        res.json({ message: 'User status updated successfully.' });
    } catch (error) {
        console.error('Failed to update user status:', error);
        res.status(500).json({ error: 'Failed to update user status.' });
    }
});

export default router;
