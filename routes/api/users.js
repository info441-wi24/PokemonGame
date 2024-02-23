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

export default router;
