const express = require('express');
const path = require('path');
const routes = require('./routes');
const { APP_PORT } = require('./config');
const { loadData } = require('./services/data-store');

const app = express();

app.use(express.json());
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

loadData();

app.listen(APP_PORT, () => {
  console.log(`Billiards app running on http://localhost:${APP_PORT}`);
});
