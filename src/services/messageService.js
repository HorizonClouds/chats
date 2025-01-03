import MessageModel from '../models/messageModel.js';
import { NotFoundError, ValidationError } from '../utils/customErrors.js';

export const createMessage = async (data) => {
  let newMessage;
  try {
    data.shippingDate = new Date().toISOString();
    data.messageStatus = "UNREAD";
    newMessage = new MessageModel(data);
    await newMessage.validate();
  } catch (error) {
    throw new ValidationError('Mongoose validation exception while creating message', error);
  }
  return await newMessage.save();
};

export const getChatBetweenUsersByWriterUserIdAndReceiverUserId = async (writerUserId, receiverUserId) => {
  try {
    const messages = await MessageModel.find({
      $or: [
        { writerUserId: writerUserId, receiverUserId: receiverUserId },
        { writerUserId: receiverUserId, receiverUserId: writerUserId },
      ],
    })
    .sort({shippingDate: 1 }) 
    .exec();

    return messages;
  } catch (error) {
    throw new ValidationError(`Chat not found between writerUserId: ${writerUserId} and receiverUserId: ${receiverUserId} while getting`, error)
  }
};

export const updateMessageStatus = async (id) => {
  try {
    const data = { messageStatus: "READ" }
    const updatedMessage = await MessageModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedMessage) {
      throw new NotFoundError('Message not found');
    }
    return updatedMessage;
  } catch (error) {
    throw new NotFoundError('Error updating messageStatus', error);
  }
};

export const deleteMessage = async (id) => {
  try {
    const deletedMessage = await MessageModel.findByIdAndDelete(id);
    if (!deletedMessage)
      throw new NotFoundError(`Message with id: ${id} not found while deleting`);
    return deletedMessage;
  } catch (error) {
    throw new NotFoundError(`Error deleting Message with id ${id}`, error);
  }
};

export default {
  createMessage,
  getChatBetweenUsersByWriterUserIdAndReceiverUserId,
  updateMessageStatus,
  deleteMessage,
};
