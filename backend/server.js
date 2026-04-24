import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const corsOptions = {
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'].filter(Boolean),
  credentials: true,
};

app.use(cors(process.env.FRONTEND_URL ? corsOptions : cors()));
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
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schema
const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  college: { type: String, required: true },
  pincode: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Added unique constraint
  contact: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

// API Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, college, pincode, email, contact } = req.body;
    
    // Check if email already exists
    const existingRegistration = await Registration.findOne({ email });
    if (existingRegistration) {
      return res.status(400).json({ message: 'This email is already registered for the webinar.' });
    }

    const newRegistration = new Registration({
      name,
      college,
      pincode,
      email,
      contact
    });

    await newRegistration.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving registration' });
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
