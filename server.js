const express = require('express'); 
const app = express();
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 3000;
const cors = require('cors');

// Allow CORS (frontend hosted elsewhere)
app.use(cors());

// Serve static images from jest, nsfw, fun folders
app.use('/jest', express.static(path.join(__dirname, 'jest')));
app.use('/nsfw', express.static(path.join(__dirname, 'nsfw')));
app.use('/fun', express.static(path.join(__dirname, 'fun')));

// Random image response function
function serveRandomImage(folderPath, folderUrl) {
  return (req, res) => {
    const dirPath = path.join(__dirname, folderPath);
    try {
      const images = fs.readdirSync(dirPath)
        .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
        .sort((a, b) => {
          if (a.endsWith('.gif') && !b.endsWith('.gif')) return -1;
          if (!a.endsWith('.gif') && b.endsWith('.gif')) return 1;
          return 0;
        });

      if (images.length === 0) {
        return res.status(404).send(`No images found in "${folderUrl}"`);
      }

      const randomImage = images[Math.floor(Math.random() * images.length)];
      const imageUrl = `${req.protocol}://${req.get('host')}${folderUrl}/${randomImage}`;

      res.json({
        success: true,
        message: "Image fetched successfully.",
        imageUrl
      });

    } catch (err) {
      res.status(500).send(`Error accessing the ${folderUrl} folder.`);
    }
  };
}

// JEST Categories
const jestCategories = ['8ball', 'avatar', 'cuddle', 'feed', 'fox_girl', 'gasm', 'gecy', 'goose', 'hug', 'kiss', 'lewd', 'lizard', 'meow', 'ngif', 'pat', 'slap', 'smug', 'spank', 'tickle', 'wallpaper', 'woof'];
jestCategories.forEach(category => {
  app.get(`/jest/${category}`, serveRandomImage(`jest/${category}`, `/jest/${category}`));
});
app.get('/jest', (req, res) => {
  res.json({ success: true, message: "Available jest categories.", categories: jestCategories });
});

// NSFW Categories
const nsfwCategories = ['neko', 'waifu', 'shemale', 'blowjob'];
nsfwCategories.forEach(category => {
  app.get(`/nsfw/${category}`, serveRandomImage(`nsfw/${category}`, `/nsfw/${category}`));
});
app.get('/nsfw', (req, res) => {
  res.json({ success: true, message: "Available nsfw categories.", categories: nsfwCategories });
});

// FUN Categories
const jokes = require('./fun/joke');
const facts = require('./fun/fact');
const quotes = require('./fun/quote');
const truths = require('./fun/truth');
const dares = require('./fun/dare');
const riddles = require('./fun/riddle');
const compliments = require('./fun/compliment');
const funnyQuotes = require('./fun/whatIf');
const wouldYourathers = require('./fun/wouldYourather');
const tongueTwisters = require('./fun/tongueTwister');
const quotesfunnys = require('./fun/quotesfunny');
const knockKnockJokes = require('./fun/knockknock');
const limericks = require('./fun/limericks');
const pickuplines = require('./fun/pickuplines');
const puns = require('./fun/puns');

const funCategories = {
  joke: jokes,
  fact: facts,
  quote: quotes,
  truth: truths,
  dare: dares,
  riddle: riddles,
  compliment: compliments,
  whatIf: funnyQuotes,
  wouldYourather: wouldYourathers,
  tongueTwister: tongueTwisters,
  quotesfunny: quotesfunnys,
  knockknock: knockKnockJokes,
  limericks: limericks,
  pickuplines: pickuplines,
  puns: puns
};

Object.entries(funCategories).forEach(([key, values]) => {
  app.get(`/fun/${key}`, (req, res) => {
    const randomIndex = Math.floor(Math.random() * values.length);
    res.json({
      success: true,
      message: `${key.charAt(0).toUpperCase() + key.slice(1)} fetched successfully.`,
      content: values[randomIndex]
    });
  });
});
app.get('/fun', (req, res) => {
  res.json({ success: true, message: "Available fun categories.", categories: Object.keys(funCategories) });
});

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// Start server
app.listen(port, () => {
  console.log(`✅ API-only server running on http://localhost:${port}`);
});
