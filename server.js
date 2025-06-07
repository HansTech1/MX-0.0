// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (or restrict via origin: 'https://your-frontend.com')
app.use(cors());

// Serve static files
app.use('/jest', express.static(path.join(__dirname, 'jest')));
app.use('/nsfw', express.static(path.join(__dirname, 'nsfw')));
app.use('/fun', express.static(path.join(__dirname, 'fun')));

// Helper to serve a random image from a folder
function serveRandomImage(folderPath, folderUrl) {
  return (req, res) => {
    const dirPath = path.join(__dirname, folderPath);
    console.log(`Looking for images in: ${dirPath}`);

    try {
      const images = fs.readdirSync(dirPath)
        .filter(f => /\.(jpe?g|png|gif)$/i.test(f))
        .sort((a, b) => {
          if (a.endsWith('.gif') && !b.endsWith('.gif')) return -1;
          if (!a.endsWith('.gif') && b.endsWith('.gif')) return 1;
          return 0;
        });

      if (!images.length) {
        return res.status(404).json({
          success: false,
          message: `No images found in "${folderUrl}".`
        });
      }

      const file = images[Math.floor(Math.random() * images.length)];
      const imageUrl = `${req.protocol}://${req.get('host')}${folderUrl}/${file}`;

      res.json({
        success: true,
        message: 'Image fetched successfully.',
        imageUrl
      });
    } catch (err) {
      console.error(`Error reading ${folderUrl}:`, err);
      res.status(500).json({
        success: false,
        message: `Error accessing "${folderUrl}".`
      });
    }
  };
}

// ---- JEST endpoints ----
const jestCategories = [
  '8ball','avatar','cuddle','feed','fox_girl','gasm','gecy',
  'goose','hug','kiss','lewd','lizard','meow','ngif','pat',
  'slap','smug','spank','tickle','wallpaper','woof'
];

jestCategories.forEach(cat => {
  app.get(`/jest/${cat}`, serveRandomImage(`jest/${cat}`, `/jest/${cat}`));
});

app.get('/jest', (_, res) => {
  res.json({
    success: true,
    message: 'Available jest categories.',
    categories: jestCategories
  });
});

// ---- NSFW endpoints ----
const nsfwCategories = ['neko','waifu','shemale','blowjob'];

nsfwCategories.forEach(cat => {
  app.get(`/nsfw/${cat}`, serveRandomImage(`nsfw/${cat}`, `/nsfw/${cat}`));
});

app.get('/nsfw', (_, res) => {
  res.json({
    success: true,
    message: 'Available nsfw categories.',
    categories: nsfwCategories
  });
});

// ---- FUN endpoints ----
const funCategories = {
  joke:        require('./fun/joke'),
  fact:        require('./fun/fact'),
  quote:       require('./fun/quote'),
  truth:       require('./fun/truth'),
  dare:        require('./fun/dare'),
  riddle:      require('./fun/riddle'),
  compliment:  require('./fun/compliment'),
  whatIf:      require('./fun/whatIf'),
  wouldYourather: require('./fun/wouldYourather'),
  tongueTwister:   require('./fun/tongueTwister'),
  quotesfunny:     require('./fun/quotesfunny'),
  knockknock:      require('./fun/knockknock'),
  limericks:       require('./fun/limericks'),
  pickuplines:     require('./fun/pickuplines'),
  puns:            require('./fun/puns')
};

Object.entries(funCategories).forEach(([key, arr]) => {
  app.get(`/fun/${key}`, (_, res) => {
    const item = arr[Math.floor(Math.random() * arr.length)];
    res.json({
      success: true,
      message: `${key.charAt(0).toUpperCase() + key.slice(1)} fetched successfully.`,
      content: item
    });
  });
});

app.get('/fun', (_, res) => {
  res.json({
    success: true,
    message: 'Available fun categories.',
    categories: Object.keys(funCategories)
  });
});

// ---- Serve Frontend ----

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
