
import express from 'express';
const router = express.Router();

// @route   GET api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.get('/login', (req, res) => {
  // Authentication logic here
  res.send('Login route');
});

router.post('/login', (req, res) => {
  // Authentication logic here
  res.send('Login route');
});


// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public  
router.post('/register', (req, res) => {
  // Registration logic here
  res.send('Register route');
});

router.get('/register', (req, res) => {
  // Registration logic here
  res.send('Register route');
});


router.get('/logout', (req, res) => {
  // Logout logic here
  res.send('Logout route');
});

export default router;
