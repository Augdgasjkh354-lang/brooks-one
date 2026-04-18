const express = require('express');
const { ACTIONS } = require('../config');
const { registerUser, createCheckin } = require('../controllers/checkin-controller');
const { getRecords } = require('../controllers/records-controller');
const {
  getSettings,
  updateProfile,
  exportData,
  clearAllData
} = require('../controllers/settings-controller');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

router.get('/meta', (req, res) => {
  res.json({ actions: ACTIONS });
});

router.post('/checkins/register', registerUser);
router.post('/checkins', createCheckin);
router.get('/records', getRecords);
router.get('/settings', getSettings);
router.put('/settings/profile', updateProfile);
router.post('/settings/export', exportData);
router.post('/settings/reset', clearAllData);

module.exports = router;
