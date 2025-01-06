import express from 'express'; // Import Express framework
import { swaggerSetup } from './swagger.js'; // Import Swagger setup
import messageApiRouter from './routes/messageRoute.js'; // Import API routes
import standardizedResponse from './middlewares/standardResponse.js'; // Import custom response middleware
import errorHandler from './middlewares/errorHandler.js';
import cors from 'cors'; // Import CORS middleware
import './utils/logger.js';
import config from './config.js';

export const app = express(); // Create an Express application
const port = config.backendPort; // Define port

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(standardizedResponse); // Use custom response middleware
app.use(cors());

// Routes
app.use('/api/v1', messageApiRouter); // Use API routes

app.get('/', (req, res) => {
  // Redirect to API documentation
  res.redirect('/api-docs');
});

app.use(errorHandler);

// Swagger configuration
swaggerSetup(app);

export async function startServer(app) {
  return new Promise((resolve, reject) => {
    app.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
      logger.info(`API documentation is available at http://localhost:${port}/api-docs`);
      logger.debug(`Debug logs are enabled`);
      resolve();
    }).on('error', (err) => {
      reject(err);
    });
  });
}

export default app; // Export the Express application

