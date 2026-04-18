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
        <h3>Records Stats</h3>
        <div class="metric-grid">
          <div class="metric"><small>總筆數</small><strong>${stats.totalEntries}</strong></div>
          <div class="metric"><small>每組平均</small><strong>${stats.avgPerGroup}</strong></div>
          <div class="metric"><small>總命中</small><strong>${stats.totalHits}</strong></div>
          <div class="metric"><small>單組最佳</small><strong>${stats.bestSingleGroup}</strong></div>
        </div>
        <p class="muted">Tier 3 解鎖：${stats.tier3Unlocked ? '已解鎖 ✅' : '尚未解鎖 ⏳'}</p>
      </div>

      <div class="card">
        <h3>歷史紀錄</h3>
        <div class="list">
          ${
            list.length === 0
              ? '<p class="muted">尚無紀錄，先去 Check-in 打卡吧！</p>'
              : list
                  .map(
                    (entry) => `
                      <article class="entry">
                        <h4>${entry.drillName}｜平均 ${entry.averageScore}</h4>
                        <small>${entry.date} · ${entry.groupCount} 組 · Tier ${entry.drillTier}</small>
                        <div>分數：${entry.scores.join(' / ')}</div>
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
