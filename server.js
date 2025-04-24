const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const client = new MongoClient(process.env.MONGO_URI);

let db;

app.use(express.json());
app.use(express.static('public')); // serve journal.html, index.html, etc.

// Connect to MongoDB
client.connect()
  .then(() => {
    db = client.db('JumboHabits'); // this will be created automatically if it doesn’t exist
    console.log("✅ Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Journal entry POST route
app.post('/api/journal', async (req, res) => {
  const { userId, date, entry } = req.body;

  if (!userId || !date || !entry) {
    return res.status(400).json({ message: "Missing fields!" });
  }

  try {
    const result = await db.collection('journal').insertOne({
      userId,
      date,
      entry
    });
    res.status(200).json({ message: "✅ Journal entry saved!", id: result.insertedId });
  } catch (err) {
    console.error("❌ Error inserting journal entry:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

// Journal entry GET route – handles fetching one or all entries
app.get('/api/journal', async (req, res) => {
  const { userId, date } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in query." });
  }

  try {
    if (date) {
      // Return entry for specific date
      const entry = await db.collection('journal').findOne({ userId, date });
      if (!entry) return res.status(404).json({ entry: null });
      return res.status(200).json({ entry: entry.entry });
    } else {
      // Return all entries for user
      const entries = await db.collection('journal')
        .find({ userId })
        .sort({ date: -1 }) // most recent first
        .toArray();
      return res.status(200).json({ entries });
    }
  } catch (err) {
    console.error("❌ Error fetching journal entry:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

