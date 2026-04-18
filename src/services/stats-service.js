const { isTier3Qualified } = require('./streak-service');

function computeCheckinStats(checkins) {
  const entries = Array.isArray(checkins) ? checkins : [];
  const totalEntries = entries.length;

  const totalHits = entries.reduce(
    (sum, entry) => sum + entry.scores.reduce((scoreSum, score) => scoreSum + score, 0),
    0
  );

  const totalGroups = entries.reduce((sum, entry) => sum + entry.scores.length, 0);
  const avgPerGroup = totalGroups > 0 ? Number((totalHits / totalGroups).toFixed(2)) : 0;
  const bestSingleGroup = entries.reduce(
    (best, entry) => Math.max(best, ...entry.scores),
    0
  );

  return {
    totalEntries,
    totalHits,
    totalGroups,
    avgPerGroup,
    bestSingleGroup,
    tier3Unlocked: isTier3Qualified(entries)
  };
}

module.exports = {
  computeCheckinStats
};
