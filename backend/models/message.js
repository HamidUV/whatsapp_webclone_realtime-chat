import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  wa_id: { type: String, required: true },
  from: { type: String, required: true },
  text: { type: String, required: true },
  message_id: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'pending'],
    default: 'sent',
  },
}, { timestamps: true });

messageSchema.index({ wa_id: 1, timestamp: -1 });

// Assign the model to a variable
const ProcessedMessage = mongoose.model('ProcessedMessage', messageSchema, 'processed_messages');

// Export the model
export default ProcessedMessage;
