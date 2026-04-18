const {
  ACTIONS,
  SCORE_MIN,
  SCORE_MAX,
  MIN_GROUP_COUNT,
  MAX_GROUP_COUNT,
  TIERS
} = require('../config');
const { loadData, saveData } = require('../services/data-store');
const { getFeedbackByAverage } = require('../services/feedback-service');
const { computeCheckinStats } = require('../services/stats-service');
const { generateId } = require('../utils/id-generator');
const { toIsoDate } = require('../utils/date-utils');
const { parseVoiceTextToScores } = require('../utils/score-parser');

function validateNickname(nickname) {
  return typeof nickname === 'string' && nickname.trim().length >= 2 && nickname.trim().length <= 24;
}

function registerUser(req, res) {
  const { nickname, tier } = req.body || {};
  const normalizedTier = Number(tier);

  if (!validateNickname(nickname)) {
    return res.status(400).json({ message: 'Nickname must be 2-24 characters.' });
  }

  if (!TIERS.includes(normalizedTier) || normalizedTier === 3) {
    return res.status(400).json({ message: 'Tier must be 1 or 2 for registration.' });
  }

  const data = loadData();
  data.user.nickname = nickname.trim();
  data.user.tier = normalizedTier;
  data.user.tier3Unlocked = computeCheckinStats(data.checkins).tier3Unlocked;

  saveData(data);
  return res.json({
    message: 'Registration saved.',
    user: data.user
  });
}

function createCheckin(req, res) {
  const { drillId, groupCount, scores, date, voiceText } = req.body || {};
  const normalizedGroupCount = Number(groupCount);
  const drill = ACTIONS.find((item) => item.id === drillId);

  if (!drill) {
    return res.status(400).json({ message: 'Invalid drill id.' });
  }

  if (!Number.isInteger(normalizedGroupCount) || normalizedGroupCount < MIN_GROUP_COUNT || normalizedGroupCount > MAX_GROUP_COUNT) {
    return res
      .status(400)
      .json({ message: `Group count must be ${MIN_GROUP_COUNT}-${MAX_GROUP_COUNT}.` });
  }

  const inputScores = Array.isArray(scores)
    ? scores.map((score) => Number(score))
    : parseVoiceTextToScores(voiceText);

  if (inputScores.length !== normalizedGroupCount) {
    return res.status(400).json({ message: 'Score count must match group count.' });
  }

  const hasInvalid = inputScores.some(
    (score) => !Number.isInteger(score) || score < SCORE_MIN || score > SCORE_MAX
  );

  if (hasInvalid) {
    return res.status(400).json({ message: `Each score must be integer ${SCORE_MIN}-${SCORE_MAX}.` });
  }

  const data = loadData();

  if (!data.user.nickname) {
    return res.status(400).json({ message: 'Please register before check-in.' });
  }

  if (drill.tier > data.user.tier && !data.user.tier3Unlocked) {
    return res.status(403).json({ message: 'Current tier cannot access this drill.' });
  }

  const averageScore = Number(
    (inputScores.reduce((sum, score) => sum + score, 0) / inputScores.length).toFixed(2)
  );

  const entry = {
    id: generateId('checkin'),
    nickname: data.user.nickname,
    tierAtCheckin: data.user.tier,
    drillId: drill.id,
    drillName: drill.name,
    drillTier: drill.tier,
    groupCount: normalizedGroupCount,
    scores: inputScores,
    averageScore,
    feedback: getFeedbackByAverage(averageScore),
    date: toIsoDate(date),
    createdAt: new Date().toISOString()
  };

  data.checkins.push(entry);
  const stats = computeCheckinStats(data.checkins);
  data.user.tier3Unlocked = stats.tier3Unlocked;
  if (data.user.tier3Unlocked) {
    data.user.tier = 3;
  }

  saveData(data);

  return res.status(201).json({
    message: 'Check-in saved.',
    entry,
    tier3Unlocked: data.user.tier3Unlocked,
    stats
  });
}

module.exports = {
  registerUser,
  createCheckin
};
