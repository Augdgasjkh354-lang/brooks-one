const fs = require('fs');
const path = require('path');
const { DATA_FILE } = require('../config');

const DEFAULT_DATA = {
  user: {
    nickname: '',
    tier: 1,
    tier3Unlocked: false
  },
  checkins: []
};

function ensureStorageFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf8');
  }
}

function loadData() {
  ensureStorageFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');

  if (!raw.trim()) {
    return { ...DEFAULT_DATA, checkins: [] };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      user: {
        ...DEFAULT_DATA.user,
        ...(parsed.user || {})
      },
      checkins: Array.isArray(parsed.checkins) ? parsed.checkins : []
    };
  } catch (error) {
    return { ...DEFAULT_DATA, checkins: [] };
  }
}

function saveData(data) {
  ensureStorageFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function resetData() {
  saveData(DEFAULT_DATA);
  return loadData();
}

module.exports = {
  DEFAULT_DATA,
  loadData,
  saveData,
  resetData
};
