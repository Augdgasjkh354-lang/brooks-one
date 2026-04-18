window.RecordsTab = (function recordsTabModule() {
  function mount({ state }) {
    render(state);
  }

  function render(state) {
    const root = document.getElementById('recordsTab');
    const stats = state.stats || {
      totalEntries: 0,
      avgPerGroup: 0,
      totalHits: 0,
      bestSingleGroup: 0,
      tier3Unlocked: false
    };

    const list = state.records || [];

    root.innerHTML = `
      <div class="card">
        <h3>记录统计</h3>
        <div class="metric-grid">
          <div class="metric"><small>总条目</small><strong>${stats.totalEntries}</strong></div>
          <div class="metric"><small>每组平均</small><strong>${stats.avgPerGroup}</strong></div>
          <div class="metric"><small>总命中</small><strong>${stats.totalHits}</strong></div>
          <div class="metric"><small>单组最佳</small><strong>${stats.bestSingleGroup}</strong></div>
        </div>
        <p class="muted">等级 3 解锁：${stats.tier3Unlocked ? '已解锁 ✅' : '未解锁 ⏳'}</p>
      </div>

      <div class="card">
        <h3>历史记录</h3>
        <div class="list">
          ${
            list.length === 0
              ? '<p class="muted">暂无记录，先去打卡吧！</p>'
              : list
                  .map(
                    (entry) => `
                      <article class="entry">
                        <h4>${entry.drillName}｜平均 ${entry.averageScore}</h4>
                        <small>${entry.date} · ${entry.groupCount} 组 · 等级 ${entry.drillTier}</small>
                        <div>分数：${entry.scores.join(' / ')}</div>
                        <div class="feedback">${entry.feedback}</div>
                      </article>
                    `
                  )
                  .join('')
          }
        </div>
      </div>
    `;
  }

  return {
    mount,
    render
  };
})();
