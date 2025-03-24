// filepath: d:\code\Node_JS\pdfmerger\server.js
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { mergePdfs } = require('./merge');

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

app.use('/static', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.post('/merge', upload.array('pdfs', 2), async (req, res, next) => {
  console.log(req.files);

  const filePath1 = path.join(__dirname, req.files[0].path);
  const filePath2 = path.join(__dirname, req.files[1].path);
  const outputPath = path.join(__dirname, 'public', 'merge.pdf');

  await mergePdfs(filePath1, filePath2, outputPath);

  const mergedFilePath = path.join(__dirname, 'public', 'merge.pdf');
  if (fs.existsSync(mergedFilePath)) {
      console.log('Merged file exists:', mergedFilePath);
      res.redirect(`http://localhost:3000/static/merge.pdf`);
  } else {
      console.error('Merged file not found:', mergedFilePath);
      res.status(500).send('Error generating merged PDF');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});