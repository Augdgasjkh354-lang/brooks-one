function toIsoDate(input) {
  const date = input ? new Date(input) : new Date();

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date.');
  }

  return date.toISOString().slice(0, 10);
}

function dateToDayIndex(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function diffDays(fromIsoDate, toIsoDate) {
  return dateToDayIndex(toIsoDate) - dateToDayIndex(fromIsoDate);
}

function sortIsoDatesAsc(dates) {
  return [...dates].sort((a, b) => diffDays(a, b));
}

module.exports = {
  toIsoDate,
  dateToDayIndex,
  diffDays,
  sortIsoDatesAsc
};
