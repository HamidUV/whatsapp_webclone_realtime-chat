import { Router } from 'express';
import ProcessedMessage from '../models/message.js';
const router = Router();

// POST /api/webhook - Process incoming webhook data
router.post('/webhook', async (req, res) => {
  const io = req.io; 
  try {
    // Defensive Check: Ensure the nested structure exists before trying to access it.
    if (req.body.entry && req.body.entry[0] && req.body.entry[0].changes && req.body.entry[0].changes[0] && req.body.entry[0].changes[0].value) {
      const payload = req.body.entry[0].changes[0].value;
      
      // It's a new message
      if (payload.messages && payload.contacts) {
        const msgData = payload.messages[0];
        const contactData = payload.contacts[0];
        const savedMessage = await ProcessedMessage.findOneAndUpdate(
          { message_id: msgData.id },
          {
            wa_id: contactData.wa_id,
            from: msgData.from,
            text: msgData.text.body,
            timestamp: new Date(parseInt(msgData.timestamp) * 1000),
            status: 'sent',
          },
          { upsert: true, new: true }
        );
        io.emit('newMessage', savedMessage);
      } 
      // It's a status update
      else if (payload.statuses) {
        const statusData = payload.statuses[0];
        const updatedMessage = await ProcessedMessage.findOneAndUpdate(
          { message_id: statusData.id },
          { status: statusData.status },
          { new: true }
        );
        if(updatedMessage) {
          io.emit('statusUpdate', updatedMessage);
        }
      }
    }
    
    // Always send a 200 OK response to WhatsApp/your script.
    // If the payload was not in the expected format, we just ignore it.
    res.status(200).send('Processed');

  } catch (error) {
    // This will now only catch major server errors, not TypeErrors from bad data.
    console.error('Webhook processing error:', error);
    res.status(500).send('Error');
  }
});

// --- Other routes remain the same ---

// GET /api/conversations
router.get('/conversations', async (req, res) => {
    try {
        const conversations = await ProcessedMessage.aggregate([
            { $sort: { timestamp: -1 } },
            { $group: {
                _id: "$wa_id",
                lastMessage: { $first: "$text" },
                lastMessageTimestamp: { $first: "$timestamp" },
                name: { $first: "$wa_id" }
            }},
            { $sort: { lastMessageTimestamp: -1 } }
        ]);
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/messages/:wa_id
router.get('/messages/:wa_id', async (req, res) => {
    try {
        const messages = await ProcessedMessage.find({ wa_id: req.params.wa_id }).sort({ timestamp: 'asc' });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/messages - Handle sending new messages from UI
router.post('/messages', async (req, res) => {
    const io = req.io;
    try {
        const { wa_id, text } = req.body;
        const newMessage = new ProcessedMessage({
            wa_id,
            text,
            from: 'me',
            message_id: `ui-${new Date().getTime()}`,
            status: 'sent'
        });
        const savedMessage = await newMessage.save();
        io.emit('newMessage', savedMessage);
        res.status(201).json(savedMessage);
    } catch (error) {
        console.error("Error in /api/messages:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;