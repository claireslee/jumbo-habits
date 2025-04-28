const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const fetch = require('node-fetch'); // Needed for proxy
const path = require('path');

dotenv.config();
const app = express();
const client = new MongoClient(process.env.MONGO_URI);

let db;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve index.html, journal.html, etc. from /public

// Connect to MongoDB
client.connect()
  .then(() => {
    db = client.db('JumboHabits');
    console.log("✅ Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Journal Entry POST
app.post('/api/journal', async (req, res) => {
  const { userId, date, entry } = req.body;

  if (!userId || !date || !entry) {
    return res.status(400).json({ message: "Missing fields!" });
  }

  try {
    const result = await db.collection('journal').insertOne({ userId, date, entry });
    res.status(200).json({ message: "✅ Journal entry saved!", id: result.insertedId });
  } catch (err) {
    console.error("❌ Error inserting journal entry:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Journal Entry GET
app.get('/api/journal', async (req, res) => {
  const { userId, date } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in query." });
  }

  try {
    if (date) {
      const entry = await db.collection('journal').findOne({ userId, date });
      if (!entry) return res.status(404).json({ entry: null });
      return res.status(200).json({ entry: entry.entry });
    } else {
      const entries = await db.collection('journal')
        .find({ userId })
        .sort({ date: -1 })
        .toArray();
      return res.status(200).json({ entries });
    }
  } catch (err) {
    console.error("❌ Error fetching journal entries:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Habit Tracker POST
app.post('/api/habits', async (req, res) => {
  const { userId, date, habits } = req.body;

  if (!userId || !date || !habits) {
    return res.status(400).json({ message: "Missing fields!" });
  }

  try {
    const result = await db.collection('habits').updateOne(
      { userId, date },
      { $set: { habits } },
      { upsert: true }
    );
    res.status(200).json({ message: "✅ Habit data saved!", result });
  } catch (err) {
    console.error("❌ Error saving habits:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Habit Tracker GET
app.get('/api/habits', async (req, res) => {
  const { userId, date } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in query." });
  }

  try {
    if (date) {
      const entry = await db.collection('habits').findOne({ userId, date });
      if (!entry) return res.status(404).json({ entry: null });
      return res.status(200).json({ entry: entry.habits });
    } else {
      const entries = await db.collection('habits')
        .find({ userId })
        .sort({ date: -1 })
        .toArray();
      return res.status(200).json({ entries });
    }
  } catch (err) {
    console.error("❌ Error fetching habits:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Proxy Route for Affirmations API
app.get('/proxy-affirmation', async (req, res) => {
  try {
    const response = await fetch('https://www.affirmations.dev/');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching affirmation:", error);
    res.status(500).send('Error fetching affirmation');
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
