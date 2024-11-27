// MesaggeModel.js

import mongoose from 'mongoose'; // Import Mongoose

// Create a schema for Mesagge with validation
const messageSchema = new mongoose.Schema({
  writerUserId: {
    type: String,
    required: [true, 'writerUserId is required'],
  },
  receiverUserId: {
    type: String,
    required: [true, 'receiverUserId is required'],
  },
  messageContent: {
    type: String,
    required: [true, 'messageContent is required'],
    minlength: [1, 'Mesagge content must be at least 1 characters long'], 
    maxlength: [500, 'Message content must be at most 500 characters long'],
  },
  shippingDate: {
    type: Date,
    required: [true, 'shippingDate is required'],
  },
  messageStatus: {
    type: String,
    required: [true, 'messageStatus is required'],
    enum: {
        values: ['READ', 'UNREAD'], 
        message: '{VALUE} is not a valid message status', 
      }
  }, 
});

// Create the model from the schema
const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel; // Export the model