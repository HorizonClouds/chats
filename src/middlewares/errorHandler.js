// This will catch errors thrown by the application and send a response to the client with the error message and status code.
import config from '../config.js';
import { sendError } from '../utils/standardResponse.js';

const errorHandler = (error, req, res, next) => {
  if (config.nodeEnv !== 'test') {
    console.error(error.message);
  }
  sendError(res, error);
};

export default errorHandler;