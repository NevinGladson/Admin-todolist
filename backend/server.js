const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/authRoutes'); // Adjust the path as needed
const taskRoutes = require('./routes/taskRoutes'); // Import task-related routes
const path = require('path');


const app = express();


// CORS configuration to allow credentials and set the specific origin
app.use(cors({
  origin: '*****', // confidential 
  credentials: true, // Allow credentials such as cookies and authorization headers
}));

app.use(express.json()); // For parsing application/json
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes); // Use task routes in the API

// Serving static files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// MongoDB URI 
const mongoURI = "********"; // confidential

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.error('MongoDB connection error:', err));

// Awaiting MongoDB connection before starting the server
mongoose.connection.once('open', () => {

  //app.use('/api', userRoutes);
  
  // Start the server
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
