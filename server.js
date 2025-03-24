const express = require('express');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose'); // Import mongoose
const { mergePdfs } = require('./merge');

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://tirthsapariya7773:N4mmIaBdVaEW3TRt@pdfmerger.1h1f2.mongodb.net/?retryWrites=true&w=majority&appName=pdfmerger', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check MongoDB connection status
const db = mongoose.connection;

db.on('connected', () => {
  console.log('MongoDB connection established successfully.');
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
  console.log('MongoDB connection disconnected.');
});

// Define a schema and model for storing PDF metadata
const pdfSchema = new mongoose.Schema({
  originalName: String,
  filePath: String,
  uploadDate: { type: Date, default: Date.now },
});

const Pdf = mongoose.model('Pdf', pdfSchema);

app.use('/static', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.post('/merge', upload.array('pdfs', 2), async (req, res, next) => {
  console.log(req.files);

  // Save uploaded files' metadata to the database
  const pdf1 = new Pdf({
    originalName: req.files[0].originalname,
    filePath: req.files[0].path,
  });
  const pdf2 = new Pdf({
    originalName: req.files[1].originalname,
    filePath: req.files[1].path,
  });

  await pdf1.save();
  await pdf2.save();

  const filePath1 = path.join(__dirname, req.files[0].path);
  const filePath2 = path.join(__dirname, req.files[1].path);

  await mergePdfs(filePath1, filePath2);
  res.redirect(`http://localhost:3000/static/merge.pdf`);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
