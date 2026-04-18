(function initApp() {
  const state = {
    meta: { actions: [] },
    user: null,
    records: [],
    stats: null
  };

  const toastEl = document.getElementById('toast');

  function showToast(message, timeout = 2000) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    window.setTimeout(() => toastEl.classList.remove('show'), timeout);
  }

  async function request(url, options = {}) {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || '请求失败。');
    }

    return body;
  }

  async function bootstrap() {
    try {
      const [meta, recordsData] = await Promise.all([request('/api/meta'), request('/api/records')]);
      state.meta = meta;
      state.user = recordsData.user;
      state.records = recordsData.records;
      state.stats = recordsData.stats;

      window.CheckinTab.mount({ state, request, showToast, refreshAll });
      window.RecordsTab.mount({ state });
      window.SettingsTab.mount({ state, request, showToast, refreshAll });
      bindNav();
    } catch (error) {
      showToast(error.message, 3500);
    }
  }

  async function refreshAll() {
    const recordsData = await request('/api/records');
    state.user = recordsData.user;
    state.records = recordsData.records;
    state.stats = recordsData.stats;

    window.CheckinTab.render(state);
    window.RecordsTab.render(state);
    window.SettingsTab.render(state);
    updateHeader();
  }

  function updateHeader() {
    const subtitle = document.getElementById('headerSubtitle');
    if (!state.user || !state.user.nickname) {
      subtitle.textContent = '请先在打卡或设置页面注册昵称';
      return;
    }
    subtitle.textContent = `${state.user.nickname}｜等级 ${state.user.tier}${
      state.user.tier3Unlocked ? '（等级 3 已解锁）' : ''
    }`;
  }

  function bindNav() {
    const buttons = document.querySelectorAll('.nav-btn');
    const panels = document.querySelectorAll('.tab-panel');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((item) => item.classList.remove('active'));
        panels.forEach((panel) => panel.classList.remove('active'));
        btn.classList.add('active');
        const panel = document.getElementById(btn.dataset.tab);
        panel.classList.add('active');
      });
    });

    updateHeader();
  }

  window.BilliardsApp = {
    request,
    showToast,
    state,
    refreshAll
  };

  bootstrap();
})();
