import express from 'express';
import * as messageController from '../controllers/messageController.js';
import * as messageValidator from '../middlewares/messageValidator.js';
import { checkAuth, checkPlan, checkRole, checkAddon } from '../middlewares/authMiddelwares.js';

const router = express.Router();

router.post('/message', checkAuth(), messageValidator.validateCreateMessage, messageController.createMessage);
router.put('/message/messageStatus/:id', checkAuth(), messageController.updateMessageStatus);
router.delete('/message/:id', checkAuth(), messageController.deleteMessage);
router.get('/chat/:writerUserId/:receiverUserId', checkAuth(), messageController.getChatBetweenUsersByWriterUserIdAndReceiverUserId);

export default router;
