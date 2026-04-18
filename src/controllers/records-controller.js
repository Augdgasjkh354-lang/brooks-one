const { loadData } = require('../services/data-store');
const { computeCheckinStats } = require('../services/stats-service');

function getRecords(req, res) {
  const data = loadData();
  const sortedCheckins = [...data.checkins].sort((a, b) => {
    if (a.date === b.date) {
      return a.createdAt > b.createdAt ? -1 : 1;
    }
    return a.date < b.date ? 1 : -1;
  });

  const stats = computeCheckinStats(data.checkins);

  return res.json({
    user: {
      ...data.user,
      tier3Unlocked: stats.tier3Unlocked || data.user.tier3Unlocked
    },
    stats,
    records: sortedCheckins
  });
}

module.exports = {
  getRecords
};
