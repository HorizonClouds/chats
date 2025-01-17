import dotenv from 'dotenv';
dotenv.config(); 

export default {
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  backendPort: parseInt(process.env.BACKEND_PORT) || 6103,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:6102/chats',
  logLevel: process.env.LOGLEVEL || 'INFO',
  infrastructureIntegration: process.env.INFRASTRUCTURE_INTEGRATION || false,
  // JWT secret
  jwtSecret: process.env.JWT_SECRET || 'horizon-secret',
  // Kafka configuration
  kafkaEnabled: process.env.KAFKA_ENABLED || false,
  kafkaBroker: process.env.KAFKA_BROKER || 'localhost:9092',
  kafkaTopic: process.env.KAFKA_TOPIC || 'logs',
  kafkaServiceName: process.env.KAFKA_SERVICE_NAME || 'CHATS',
  // Throttling configuration
  throttleWindowMs: parseInt(process.env.THROTTLE_WINDOW_MS) || 10000,
  throttleMax: parseInt(process.env.THROTTLE_MAX) || 100,
};
