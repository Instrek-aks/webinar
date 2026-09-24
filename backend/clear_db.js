import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Fix for Node.js querySrv ENOTFOUND on Windows / local ISP DNS resolvers
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environmental variables from .env
dotenv.config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ ERROR: MONGODB_URI is not defined in your backend/.env file');
  process.exit(1);
}

console.log('Connecting to MongoDB Atlas...');
try {
  await mongoose.connect(mongoURI);
  console.log('✅ Connected to MongoDB successfully.');

  // Define schema & model
  const registrationSchema = new mongoose.Schema({
    name: String,
    college: String,
    pincode: String,
    email: String,
    contact: String,
    timestamp: Date
  });

  const Registration = mongoose.model('Registration', registrationSchema);

  // Check the number of registration records
  const countBefore = await Registration.countDocuments();
  console.log(`Found ${countBefore} previous student registration record(s) in database.`);

  if (countBefore > 0) {
    console.log('Clearing registrations collection...');
    const result = await Registration.deleteMany({});
    console.log(`🎉 SUCCESS: Successfully deleted all ${result.deletedCount} previous student registration record(s).`);
  } else {
    console.log('ℹ️ Database is already completely clear. No records to remove!');
  }

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
  process.exit(0);
} catch (error) {
  console.error('❌ Error executing database cleanup:', error);
  process.exit(1);
}
