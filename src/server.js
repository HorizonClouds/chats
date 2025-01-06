import './utils/logger.js';
import { app, startServer } from './app.js'; // Import Express application
import { connectDB } from './connection.js'; // Import MongoDB connection function

connectDB()
  .then(() => {
    startServer(app);
  })
  .catch((error) => {
    logger.info('Error connecting to MongoDB:' + error.message);
  });