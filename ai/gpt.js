


// File: ai/GPT.js
const expressAI = require('express');
const routerAI = expressAI.Router();

routerAI.get('/', async (req, res) => {
  const text = req.query.text;
  if (!text) return res.status(400).json({ success: false, error: 'Missing ?text= query param.' });

  try {
    const apiUrl = `https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(text)}`;
    const upstream = await fetch(apiUrl);
    const data = await upstream.json();

    res.json({
      success: true,
      input: text,
      result: data.result,
      source: 'HANS TECH'
    });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Upstream error', details: e.message });
  }
});

module.exports = routerAI;
