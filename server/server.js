require('dotenv').config();
const cookieParser = require('cookie-parser');
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');

PORT = 4000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Cookies
const cookieController = require('./controllers/cookieController');

// Import Routes
const entryRouter = require('./routers/entryRouter');
const userRouter = require('./routers/userRouter');

// Handle requests for static files
app.use(express.static(path.join(__dirname, '../assets')));

//Home Page
app.get('/home', cookieController.setSSIDCookie, (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '/index.html'));
});

// Routers
app.use('/api/entries', entryRouter);
app.use('/api/users', userRouter);

// Catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send("This is not the page you're looking for..."));

// Express error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Environments
if (process.env.NODE_ENV === 'production') {
  // statically serve everything in the build folder on the route '/build'
  app.use('/build', express.static(path.join(__dirname, '../build')));

  // serve the index.html on a request to the root
  // app.get('/', (req, res) => {
  //     return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  // });
}
console.log('NODE_ENV: ', process.env.NODE_ENV);

// Start Server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
