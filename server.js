require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// Fetch polyfill for CommonJS
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

if (!NEWS_API_KEY) {
  console.error("❌ Missing NEWS_API_KEY in .env");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Route: Top headlines
app.get('/api/news/top-headlines', async (req, res) => {
  try {
    const country = req.query.country || 'us';
    const category = req.query.category || '';
    const q = req.query.q || '';

    let url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${NEWS_API_KEY}`;
    if (category) url += `&category=${category}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data.articles);
  } catch (error) {
    console.error('❌ Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news', details: error.message });
  }
});

// Catch-all: Serve frontend (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});