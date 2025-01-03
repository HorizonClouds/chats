import express from 'express';
import * as messageController from '../controllers/messageController.js';
import * as messageValidator from '../middlewares/messageValidator.js';

const router = express.Router();

router.post(
  '/message', 
  messageValidator.validateCreateMessage, 
  messageController.createMessage
);
router.put('/message/messageStatus/:id', 
  messageController.updateMessageStatus
);
router.delete('/message/:id', messageController.deleteMessage);
router.get(
  '/chat/:writerUserId/:receiverUserId', 
  messageController.getChatBetweenUsersByWriterUserIdAndReceiverUserId
);




export default router;
