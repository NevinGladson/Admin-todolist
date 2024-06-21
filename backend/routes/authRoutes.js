const express = require('express');
const bcrypt = require('bcryptjs');
const UserDetail = require('../models/UserDetail');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Check if the email or username already exists
    const existingUser = await UserDetail.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log("Signup attempt with existing email or username:", req.body);
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user detail
    const newUserDetail = new UserDetail({
      username,
      email,
      password: hashedPassword
    });

    // Save the new user detail to the database
    await newUserDetail.save();
    res.status(201).json({ message: 'User detail created successfully' });
  } catch (error) {
    console.error("Error during signup:", error);  //Error Handling
    if (error.code === 11000) {
      console.error("MongoDB duplicate key error details:", error.keyValue);
      res.status(400).json({ error: "Email or username already exists", details: error.keyValue });
    } else {
      console.error("Error saving user detail:", error);
      res.status(500).json({ error: 'Error during signup', details: error.message });
    }
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { loginIdentifier, password } = req.body;

  try {
    // Try to find the user by email or username
    const user = await UserDetail.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate sessionId and check for uniqueness
    let sessionId;
    let isUnique = false;
    while (!isUnique) {
      sessionId = uuidv4();
      const existingSession = await UserDetail.findOne({ 'sessions.sessionId': sessionId });
      if (!existingSession) {
        isUnique = true;
      }
    }
    // Stores user sessions
    user.sessions.push({ sessionId: sessionId, loginTime: new Date() });
    await user.save();

    // Login was successful
    res.status(200).json({ message: 'Login successful', user: { id: user._id, username: user.username, email: user.email, sessionId: sessionId } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Error during login' });
  }
});


// Route to fetch all user details
router.get('/users', async (req, res) => {
  try {
    const userDetails = await UserDetail.find({});
    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).send('Error fetching user details');
  }
});


module.exports = router;
