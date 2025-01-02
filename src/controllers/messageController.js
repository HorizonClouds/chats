import messageService from '../services/messageService.js';

const removeMongoFields = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => {
      const { __v, ...rest } = item.toObject();
      return rest;
    });
  } else {
    const { __v, ...rest } = data.toObject();
    return rest;
  }
};

export const createMessage = async (req, res, next) => {
  try {
    const newMessage = await messageService.createMessage(req.body);
    logger.info(`Creating message with id: ${newMessage._id}`)
    res.sendSuccess(
      removeMongoFields(newMessage),
      'Message created successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getChatBetweenUsersByWriterUserIdAndReceiverUserId = async (req, res, next) => {
  try {
    const chat = await messageService.getChatBetweenUsersByWriterUserIdAndReceiverUserId(req.params.writerUserId, req.params.receiverUserId);
    logger.info(`Getting chat between users: ${req.params.writerUserId} and ${req.params.receiverUserId}`)
    res.sendSuccess(removeMongoFields(chat));
  } catch (error) {
    next(error);
  }
};

export const updateMessageStatus = async (req, res, next) => {
  try {
    const updatedMessage = await messageService.updateMessageStatus(req.params.id);
    logger.info(`Updating messageStatus with id: ${updatedMessage._id}`)
    res.sendSuccess(
      removeMongoFields(updatedMessage),
      'MessageStatus updated successfully'
    );
  } catch (error) {
    next(error);
  }
};