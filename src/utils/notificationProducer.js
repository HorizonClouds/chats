import { Kafka } from 'kafkajs';
import config from '../config.js';

let kafkaIsReady = false;
let retryInterval = 1000;
process.env.KAFKAJS_NO_PARTITIONER_WARNING=1;

const kafka = new Kafka({
  clientId: 'chats-service',
  brokers: [config.kafkaBroker], // Broker de Kafka
});

const producer = kafka.producer();

const runProducer = async () => {
  try {
    await producer.connect();
    kafkaIsReady = true;
  } catch (error) {
    logger.info('Notification producer connecting error:', error);
  }
};

runProducer();

const sendNotificationToKafka = async (notificationData, retryCount = 5) => {
  try {

    if (!kafkaIsReady) {
        if (retryCount > 0) {
          retryCount--;  // Decrementamos el contador de reintentos
          logger.info(`Producer not ready, retrying in ${retryInterval}ms. Retries left: ${retryCount}`);
          await new Promise(resolve => setTimeout(resolve, retryInterval));  // Esperamos el intervalo de tiempo
          return sendNotificationToKafka(notificationData, retryCount);  // Llamada recursiva con el nuevo retryCount
        } else {
          logger.info('Producer not ready, no retries left');
          return;  // Si no hay reintentos restantes, salimos
        }
      }
    
    await producer.send({
      topic: 'notification',  // Tema de Kafka
      messages: [{ value: JSON.stringify(notificationData) }], // Mensaje de notificación
    });
    
    logger.info('Notification sent successfully after creating message');
  } catch (error) {
    logger.info('Error sending notification after creating message');
  }
};

export {sendNotificationToKafka};