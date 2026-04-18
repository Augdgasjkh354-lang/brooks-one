const { diffDays, sortIsoDatesAsc, toIsoDate } = require('../utils/date-utils');

function findMaxConsecutiveDays(dates) {
  if (dates.length === 0) {
    return 0;
  }

  const sorted = sortIsoDatesAsc(Array.from(new Set(dates.map((d) => toIsoDate(d)))));
  let max = 1;
  let run = 1;

  for (let i = 1; i < sorted.length; i += 1) {
    const gap = diffDays(sorted[i - 1], sorted[i]);
    if (gap === 1) {
      run += 1;
    } else if (gap > 1) {
      run = 1;
    }
    if (run > max) {
      max = run;
    }
  }

  return max;
}

function isTier3Qualified(checkins) {
  if (!Array.isArray(checkins) || checkins.length === 0) {
    return false;
  }

  const qualifiedEntries = checkins.filter(
    (entry) => entry.drillTier === 2 && Array.isArray(entry.scores) && entry.scores.every((score) => score >= 10)
  );

  const qualifiedDates = qualifiedEntries.map((entry) => entry.date);
  return findMaxConsecutiveDays(qualifiedDates) >= 7;
}

module.exports = {
  findMaxConsecutiveDays,
  isTier3Qualified
};
