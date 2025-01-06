import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../src/app.js';
import MessageModel from '../../src/models/messageModel.js';
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import config from '../../src/config.js';

const exampleMessage = {
  writerUserId: 'user1',
  receiverUserId: 'user2',
  messageContent: 'Hello, this is a test message',
  shippingDate: new Date().toISOString(),
  messageStatus: 'UNREAD'
};

const example2Message = {
    writerUserId: 'user1',
    receiverUserId: 'user2',
    messageContent: 'Hello, this is a test message',
};

const example3Message = {
    messageStatus: 'INVALID_STATUS'
};

const user1payload = {
  user: {
    userId: "user1",
    roles: ['admin', 'user'],
    plan: 'pro',
    addons: ['all'],
    name: 'John Doe',
    verifiedEmail: true,
  }
};

const token1 = jwt.sign(user1payload, config.jwtSecret, { expiresIn: '1h' });

describe('[Integration][Component] Message Tests', () => {
  let messageId;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    vi.restoreAllMocks();
  });

  beforeEach(async () => {
    const message = await MessageModel.create(exampleMessage);
    messageId = message._id.toString();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('[+] should CREATE a message', async () => {
    const response = await request(app)
      .post('/api/v1/message')
      .set('Authorization', `Bearer ${token1}`)
      .send(example2Message);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('writerUserId', 'user1');
  });

  it('[+] should GET chat between users', async () => {
    const response = await request(app)
      .get(`/api/v1/chat/${exampleMessage.writerUserId}/${exampleMessage.receiverUserId}`)
      .set('Authorization', `Bearer ${token1}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toHaveProperty('writerUserId', 'user1');
  });

  it('[+] should UPDATE message status', async () => {
    const response = await request(app)
      .put(`/api/v1/message/messageStatus/${messageId}`)
      .set('Authorization', `Bearer ${token1}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('messageStatus', 'READ');
  });

  it('[+] should DELETE a message', async () => {
    const response = await request(app)
      .delete(`/api/v1/message/${messageId}`)
      .set('Authorization', `Bearer ${token1}`);
    expect(response.status).toBe(204);

    const dbMessage = await MessageModel.findById(messageId);
    expect(dbMessage).toBeNull();
  });

  // Auth tests
  it('[-] [Auth] POST should return 401 if no token is provided', async () => {
    const response = await request(app)
      .post('/api/v1/message')
      .send(exampleMessage);
    expect(response.status).toBe(401);
  });

  it('[-] [Auth] PUT should return 401 if no token is provided', async () => {
    const response = await request(app)
      .put(`/api/v1/message/messageStatus/${messageId}`);
    expect(response.status).toBe(401);
  });

  it('[-] [Auth] DELETE should return 401 if no token is provided', async () => {
    const response = await request(app)
      .delete(`/api/v1/message/${messageId}`);
    expect(response.status).toBe(401);
  });

  // Validation tests
  it('[-] [Validation] POST should return 400 if writerUserId is missing', async () => {
    const invalidMessage = { ...exampleMessage, writerUserId: null };
    const response = await request(app)
      .post('/api/v1/message')
      .set('Authorization', `Bearer ${token1}`)
      .send(invalidMessage);
    expect(response.status).toBe(400);
    expect(response.body.appCode).toBe('VALIDATION_ERROR');
  });

  it('[-] [Validation] POST should return 400 if messageContent is missing', async () => {
    const invalidMessage = { ...exampleMessage, messageContent: null };
    const response = await request(app)
      .post('/api/v1/message')
      .set('Authorization', `Bearer ${token1}`)
      .send(invalidMessage);
    expect(response.status).toBe(400);
    expect(response.body.appCode).toBe('VALIDATION_ERROR');
  });
});
