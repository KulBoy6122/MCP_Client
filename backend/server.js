const express = require('express');
const fs = require('fs-extra');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const BASE_DIR = path.join(__dirname, 'uploads');
fs.ensureDirSync(BASE_DIR);

app.post('/create-file', async (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(BASE_DIR, filename);
  await fs.outputFile(filePath, content);
  res.json({ message: 'File created' });
});

app.post('/edit-file', async (req, res) => {
  const { filename, newContent } = req.body;
  const filePath = path.join(BASE_DIR, filename);
  if (!await fs.pathExists(filePath)) return res.status(404).send('Not found');
  await fs.writeFile(filePath, newContent);
  res.json({ message: 'File updated' });
});

app.delete('/delete-file', async (req, res) => {
  const { filename } = req.body;
  const filePath = path.join(BASE_DIR, filename);
  await fs.remove(filePath);
  res.json({ message: 'File deleted' });
});

app.post('/read-file', async (req, res) => {
  const { filename } = req.body;
  const filePath = path.join(BASE_DIR, filename);
  if (!await fs.pathExists(filePath)) return res.status(404).send('File not found');
  const content = await fs.readFile(filePath, 'utf-8');
  res.json({ content });
});


app.listen(5000, () => console.log('MCP Server running on port 5000'));
