import express from 'express';
import * as messageController from '../controllers/messageController.js';
import * as messageValidator from '../middlewares/messageValidator.js';

const router = express.Router();

router.post(
  '/v1/message', 
  messageValidator.validateCreateMessage, 
  messageController.createMessage
);
router.put('/v1/message/messageStatus/:id', 
  messageController.updateMessageStatus
);
router.get(
  '/v1/chat/:writerUserId/:receiverUserId', 
  messageController.getChatBetweenUsersByWriterUserIdAndReceiverUserId
);



export default router;
