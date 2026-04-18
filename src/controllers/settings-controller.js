const { TIERS } = require('../config');
const { loadData, saveData, resetData } = require('../services/data-store');
const { computeCheckinStats } = require('../services/stats-service');

function getSettings(req, res) {
  const data = loadData();
  const stats = computeCheckinStats(data.checkins);

  return res.json({
    user: {
      ...data.user,
      tier3Unlocked: stats.tier3Unlocked || data.user.tier3Unlocked
    },
    stats
  });
}

function updateProfile(req, res) {
  const { nickname, tier } = req.body || {};
  const data = loadData();

  if (typeof nickname === 'string') {
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 24) {
      return res.status(400).json({ message: 'Nickname must be 2-24 characters.' });
    }
    data.user.nickname = trimmed;
  }

  if (tier !== undefined) {
    const normalizedTier = Number(tier);
    const stats = computeCheckinStats(data.checkins);

    if (!TIERS.includes(normalizedTier) || normalizedTier < 1 || normalizedTier > 2) {
      if (!(normalizedTier === 3 && (stats.tier3Unlocked || data.user.tier3Unlocked))) {
        return res.status(400).json({ message: 'Tier can only be 1 or 2 unless Tier 3 is unlocked.' });
      }
    }

    data.user.tier = normalizedTier;
  }

  saveData(data);

  return res.json({
    message: 'Settings updated.',
    user: data.user
  });
}

function exportData(req, res) {
  const data = loadData();
  return res.json({
    exportedAt: new Date().toISOString(),
    data
  });
}

function clearAllData(req, res) {
  const data = resetData();
  return res.json({
    message: 'Data reset complete.',
    user: data.user,
    records: data.checkins
  });
}

module.exports = {
  getSettings,
  updateProfile,
  exportData,
  clearAllData
};
