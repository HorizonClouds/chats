import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import MessageModel from '../../src/models/messageModel.js';
import * as messageService from '../../src/services/messageService.js';
import { ValidationError, NotFoundError } from '../../src/utils/customErrors.js';

const exampleMessage = {
  writerUserId: 'user1',
  receiverUserId: 'user2',
  messageContent: 'Hello, this is a test message',
  shippingDate: new Date().toISOString(),
  messageStatus: 'UNREAD'
};

describe('(Integration) Message Service Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await MessageModel.deleteMany({});
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe('[+] Valid Operations', () => {
    it('should CREATE a message', async () => {
      const message = exampleMessage;
      const result = await messageService.createMessage(message);
      expect(result).toHaveProperty('writerUserId', 'user1');
      expect(result).toHaveProperty('receiverUserId', 'user2');
      expect(result).toHaveProperty('messageContent', 'Hello, this is a test message');
    });

    it('should GET chat between users', async () => {
      const message = exampleMessage;
      await messageService.createMessage(message);
      const messages = await messageService.getChatBetweenUsersByWriterUserIdAndReceiverUserId('user1', 'user2');
      expect(messages).toHaveLength(1);
      expect(messages[0]).toHaveProperty('writerUserId', 'user1');
      expect(messages[0]).toHaveProperty('receiverUserId', 'user2');
    });

    it('should UPDATE message status', async () => {
      const message = await messageService.createMessage(exampleMessage);
      const updatedMessage = await messageService.updateMessageStatus(message._id);
      expect(updatedMessage).toHaveProperty('messageStatus', 'READ');
    });

    it('should DELETE a message', async () => {
      const message = await messageService.createMessage(exampleMessage);
      const deletedMessage = await messageService.deleteMessage(message._id);
      expect(deletedMessage).toHaveProperty('_id', message._id);
    });
  });

  describe('[-] Invalid Operations', () => {
    it('should NOT CREATE a message with missing required fields messageContent', async () => {
      const message = { ...exampleMessage, messageContent: '' };
      let error;
      try {
        await messageService.createMessage(message);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ValidationError);
    });

    it('should NOT CREATE a message with invalid writerUserId', async () => {
      const message = { ...exampleMessage, writerUserId: '' };
      let error;
      try {
        await messageService.createMessage(message);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ValidationError);
    });

    it('should NOT CREATE a message with invalid receiverUserId', async () => {
      const message = { ...exampleMessage, receiverUserId: '' };
      let error;
      try {
        await messageService.createMessage(message);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(ValidationError);
    });

    it('should NOT UPDATE a non-existent message', async () => {
      let error;
      try {
        await messageService.updateMessageStatus('nonexistentMessageId');
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(NotFoundError);
    });

    it('should NOT UPDATE message status with invalid ID', async () => {
      let error;
      try {
        await messageService.updateMessageStatus('invalidMessageId');
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(NotFoundError);
    });

    it('should NOT DELETE message with invalid ID', async () => {
      let error;
      try {
        await messageService.deleteMessage('invalidMessageId');
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(NotFoundError);
    });
  });
});
