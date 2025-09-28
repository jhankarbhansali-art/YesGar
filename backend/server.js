const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const {
  GITHUB_TOKEN,
  GITHUB_REPO,
  GITHUB_OWNER,
  ADMIN_USERNAME,
  ADMIN_PASSWORD
} = process.env;

async function fetchMenu() {
  const res = await axios.get(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/menu.json`,
    { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
  );
  const content = Buffer.from(res.data.content, 'base64').toString();
  return { content: JSON.parse(content), sha: res.data.sha };
}

app.get('/api/menu', async (req, res) => {
  try {
    const menu = await fetchMenu();
    res.json(menu.content);
  } catch (e) {
    res.status(500).json({ error: 'Could not fetch menu.' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/menu', async (req, res) => {
  const { username, password, menu } = req.body;
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { sha } = await fetchMenu();
    const content = Buffer.from(JSON.stringify(menu, null, 2)).toString('base64');
    await axios.put(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/menu.json`,
      {
        message: 'Update menu via admin panel',
        content,
        sha
      },
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Menu update failed.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`)); 
