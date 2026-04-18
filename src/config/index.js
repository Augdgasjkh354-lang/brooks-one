const path = require('path');

const APP_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'app-data.json');

const SCORE_MIN = 0;
const SCORE_MAX = 15;
const MIN_GROUP_COUNT = 1;
const MAX_GROUP_COUNT = 20;

const TIERS = [1, 2, 3];

const ACTIONS = [
  { id: 'straight-shot', name: '定點直線球', tier: 1 },
  { id: 'angle-shot', name: '角度球', tier: 1 },
  { id: 'position-control', name: '走位控制', tier: 2 },
  { id: 'safety-drill', name: '防守練習', tier: 2 },
  { id: 'combo-pattern', name: '連續組合球', tier: 2 },
  { id: 'pressure-simulation', name: '壓力模擬局', tier: 3 }
];

const FEEDBACKS = {
  excellent: '頂尖表現！節奏穩定，建議增加高壓情境來保持上限。',
  strong: '狀態很不錯！可針對失誤點做微調，穩定度會再提升。',
  normal: '平均表現穩定，建議多做基本功並加強出桿一致性。',
  weak: '今天有點起伏，先放慢速度，聚焦姿勢與出桿路徑。'
};

module.exports = {
  APP_PORT,
  DATA_FILE,
  SCORE_MIN,
  SCORE_MAX,
  MIN_GROUP_COUNT,
  MAX_GROUP_COUNT,
  TIERS,
  ACTIONS,
  FEEDBACKS
};
