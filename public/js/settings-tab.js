window.SettingsTab = (function settingsTabModule() {
  let deps = null;

  function mount(incomingDeps) {
    deps = incomingDeps;
    render(deps.state);
  }

  function downloadJson(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `billiards-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function attachEvents(root) {
    const saveBtn = root.querySelector('#saveSettingsBtn');
    const exportBtn = root.querySelector('#exportBtn');
    const resetBtn = root.querySelector('#resetBtn');

    saveBtn.addEventListener('click', async () => {
      const nickname = root.querySelector('#settingsNickname').value;
      const tier = Number(root.querySelector('#settingsTier').value);
      try {
        await deps.request('/api/settings/profile', {
          method: 'PUT',
          body: JSON.stringify({ nickname, tier })
        });
        await deps.refreshAll();
        deps.showToast('設定已更新');
      } catch (error) {
        deps.showToast(error.message, 3200);
      }
    });

    exportBtn.addEventListener('click', async () => {
      try {
        const result = await deps.request('/api/settings/export', { method: 'POST' });
        downloadJson(result);
        deps.showToast('已匯出 JSON');
      } catch (error) {
        deps.showToast(error.message, 3200);
      }
    });

    resetBtn.addEventListener('click', async () => {
      const ok = window.confirm('確定要重置所有資料嗎？此操作無法復原。');
      if (!ok) {
        return;
      }

      try {
        await deps.request('/api/settings/reset', { method: 'POST' });
        await deps.refreshAll();
        deps.showToast('資料已重置');
      } catch (error) {
        deps.showToast(error.message, 3200);
      }
    });
  }

  function render(state) {
    const root = document.getElementById('settingsTab');
    const unlocked = state.user?.tier3Unlocked;

    root.innerHTML = `
      <div class="card">
        <h3>Settings</h3>
        <div class="form-control">
          <label>暱稱</label>
          <input id="settingsNickname" maxlength="24" value="${state.user?.nickname || ''}" />
        </div>
        <div class="form-control">
          <label>Tier 切換</label>
          <select id="settingsTier">
            <option value="1" ${state.user?.tier === 1 ? 'selected' : ''}>Tier 1</option>
            <option value="2" ${state.user?.tier === 2 ? 'selected' : ''}>Tier 2</option>
            <option value="3" ${state.user?.tier === 3 ? 'selected' : ''} ${
      unlocked ? '' : 'disabled'
    }>Tier 3 ${unlocked ? '' : '(未解鎖)'}</option>
          </select>
        </div>
        <div class="row">
          <button id="saveSettingsBtn">儲存設定</button>
          <button id="exportBtn" class="secondary">匯出 JSON</button>
        </div>
        <button id="resetBtn" class="danger">重置所有資料</button>
      </div>
    `;

    attachEvents(root);
  }

  return {
    mount,
    render
  };
})();
