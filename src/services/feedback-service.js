const { FEEDBACKS } = require('../config');

function getFeedbackByAverage(avgScore) {
  if (avgScore >= 13) {
    return FEEDBACKS.excellent;
  }
  if (avgScore >= 10) {
    return FEEDBACKS.strong;
  }
  if (avgScore >= 7) {
    return FEEDBACKS.normal;
  }
  return FEEDBACKS.weak;
}

module.exports = {
  getFeedbackByAverage
};
