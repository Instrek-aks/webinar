# MongoDB Backend Setup

We have transitioned from Google Sheets to a dedicated Node.js/MongoDB backend.

## 1. Prerequisites
- **Node.js** installed on your machine.
- A **MongoDB Atlas** account (or local MongoDB).

## 2. Environment Configuration
1. Open `backend/.env`.
2. Replace the `MONGODB_URI` placeholder with your actual MongoDB connection string.
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/webinar`

## 3. Installation
Open a terminal in the `backend` folder and run:
```bash
npm install
```

## 4. Running the Backend
In the `backend` folder, run:
```bash
npm start
```
The server will start on `http://localhost:5000`.

## 5. Connecting Frontend
The frontend is already configured to point to `http://localhost:5000/api/register`.
Make sure both the frontend and backend are running simultaneously.

### 📊 To View Data:
1. Log in to your **MongoDB Atlas** dashboard.
2. Go to **Browse Collections**.
3. You will see a `webinar` database with a `registrations` collection containing all student data.
