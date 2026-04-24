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
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      // Don't send 404 for the root if build is missing, just log it
      if (req.path === '/') {
        res.status(404).send('Welcome to the API. Frontend build not found.');
      } else {
        res.status(404).json({ message: 'Route not found' });
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
