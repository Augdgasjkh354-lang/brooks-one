const CN_NUM_MAP = {
  零: 0,
  一: 1,
  二: 2,
  兩: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
  十一: 11,
  十二: 12,
  十三: 13,
  十四: 14,
  十五: 15
};

function normalizeToken(token) {
  return token.trim().replace(/分|球|次|組/g, '');
}

function parseChineseNumber(token) {
  if (Object.prototype.hasOwnProperty.call(CN_NUM_MAP, token)) {
    return CN_NUM_MAP[token];
  }

  if (/^十[一二三四五]$/.test(token)) {
    return 10 + CN_NUM_MAP[token.slice(1)];
  }

  return null;
}

function parseScoreToken(token) {
  const normalized = normalizeToken(token);
  if (!normalized) {
    return null;
  }

  if (/^\d{1,2}$/.test(normalized)) {
    return Number(normalized);
  }

  const chinese = parseChineseNumber(normalized);
  if (chinese !== null) {
    return chinese;
  }

  return null;
}

function parseVoiceTextToScores(text) {
  if (typeof text !== 'string' || !text.trim()) {
    return [];
  }

  return text
    .split(/[，,。\s]+/)
    .map(parseScoreToken)
    .filter((v) => Number.isInteger(v));
}

module.exports = {
  parseScoreToken,
  parseVoiceTextToScores
};
