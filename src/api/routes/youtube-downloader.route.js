const router = require('express').Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("+ Youtube-downloader command-route loaded");

router.post('/', async (req, res) => {
  const { url, format, title } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  if (!title) {
    return res.status(400).json({ error: 'No title provided' });
  }

  if (!format) {
    return res.status(400).json({ error: 'No format provided' });
  }

  const downloadsDir = path.join(__dirname, '..', '..', '..', 'downloads');

  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  try {
    let command, fileName;
    if (format === 'audio') {
      command = `yt-dlp -f 'ba/b' --audio-format mp3 -o "${downloadsDir}/${title}.mp3" --recode-video mp3 "${url}"`;
      fileName = `${downloadsDir}/${title}.mp3`;
    } else {
      command = `yt-dlp -f 'bv*+ba/b' -o "${downloadsDir}/${title}.mp4" --recode-video mp4 "${url}"`;
      fileName = `${downloadsDir}/${title}.mp4`;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: `Something went wrong: ${error.message}` });
      }

      res.download(fileName, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({ error: 'Error sending file' });
        }
        fs.unlinkSync(fileName);
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  }
});

module.exports = router;
