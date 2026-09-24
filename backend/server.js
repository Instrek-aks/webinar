import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Fix for Node.js querySrv ENOTFOUND on Windows / local ISP DNS resolvers
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();

const corsOptions = {
  origin: ['https://webinar-1-9f6q.onrender.com', 'http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the frontend/dist directory
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('ERROR: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    try {
      const del = await Registration.deleteMany({});
      console.log(`🗑️ Database reset for Webinar #009: Cleared ${del.deletedCount} previous registration(s).`);
    } catch (e) {
      console.error('Error clearing previous registrations:', e);
    }
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema
const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Added unique constraint
  timestamp: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

import { sendWebinarConfirmationEmail } from './emailService.js';

// API Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if email already exists
    const existingRegistration = await Registration.findOne({ email });
    if (existingRegistration) {
      // Re-send email in background for user's convenience if already registered
      sendWebinarConfirmationEmail({ name: existingRegistration.name, email }).catch(err => console.error('Email retry error:', err));
      return res.status(400).json({ message: 'This email is already registered for the webinar.' });
    }

    const newRegistration = new Registration({
      name,
      email
    });

    await newRegistration.save();

    // Trigger confirmation email asynchronously (does not block HTTP response)
    sendWebinarConfirmationEmail({ name, email }).catch(err => {
      console.error('Error sending confirmation email:', err);
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving registration', rawError: String(error) });
  }
});

app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ timestamp: -1 });
    res.status(200).json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching registrations' });
  }
});

app.delete('/api/registrations', async (req, res) => {
  try {
    const result = await Registration.deleteMany({});
    console.log(`🗑️ Cleared ${result.deletedCount} student registrations from database.`);
    res.status(200).json({ message: `Successfully deleted ${result.deletedCount} registrations.`, deletedCount: result.deletedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error clearing registrations', error: String(error) });
  }
});

// Catch-all route to serve index.html for any non-API routes (supports React Router)
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`Error sending file at ${indexPath}:`, err);
      if (req.path.startsWith('/api/')) {
        res.status(404).json({ message: 'API route not found' });
      } else {
        res.status(404).send(`
          <html>
            <body style="font-family: sans-serif; padding: 2rem; line-height: 1.6;">
              <h1 style="color: #e11d48;">Frontend Build Not Found</h1>
              <p>The backend is running, but it cannot find the built frontend files at:</p>
              <code style="background: #f1f5f9; padding: 0.5rem; border-radius: 4px;">${frontendPath}</code>
              <p><strong>To fix this:</strong></p>
              <ol>
                <li>Make sure your Render <b>Build Command</b> is set to <code>npm run build</code>.</li>
                <li>Check your Render logs to ensure the frontend build actually succeeded.</li>
              </ol>
            </body>
          </html>
        `);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
