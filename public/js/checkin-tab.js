window.CheckinTab = (function checkinTabModule() {
  let deps = null;

  function mount(incomingDeps) {
    deps = incomingDeps;
    render(deps.state);
  }

  function getScoresFromInputs(container) {
    const inputs = container.querySelectorAll('.score-input');
    return Array.from(inputs).map((input) => Number(input.value));
  }

  function renderScoreInputs(container, count, values = []) {
    const html = Array.from({ length: count }, (_, index) => {
      const value = Number.isInteger(values[index]) ? values[index] : '';
      return `
        <div class="form-control">
          <label>第 ${index + 1} 组分数（0-15）</label>
          <input class="score-input" type="number" min="0" max="15" value="${value}" />
        </div>
      `;
    }).join('');

    container.innerHTML = `<div class="score-list">${html}</div>`;
  }

  function buildRegistrationCard(state) {
    return `
      <div class="card">
        <h3>1）用户注册</h3>
        <div class="form-control">
          <label>昵称</label>
          <input id="nicknameInput" maxlength="24" value="${state.user?.nickname || ''}" />
        </div>
        <div class="form-control">
          <label>初始等级</label>
          <select id="tierInput">
            <option value="1" ${state.user?.tier === 1 ? 'selected' : ''}>等级 1</option>
            <option value="2" ${state.user?.tier === 2 ? 'selected' : ''}>等级 2</option>
          </select>
        </div>
        <button id="registerBtn">保存注册</button>
      </div>
    `;
  }

  function buildCheckinCard(state) {
    const actions = state.meta.actions || [];
    const actionOptions = actions
      .map(
        (action) =>
          `<option value="${action.id}">${action.name}（等级 ${action.tier}）</option>`
      )
      .join('');

    return `
      <div class="card">
        <h3>2）今日打卡</h3>
        <div class="form-control">
          <label>选择训练项目</label>
          <select id="drillSelect">${actionOptions}</select>
        </div>
        <div class="row">
          <div class="form-control" style="flex: 1;">
            <label>组数</label>
            <input id="groupCountInput" type="number" min="1" max="20" value="3" />
          </div>
          <div class="form-control" style="flex: 1;">
            <label>日期</label>
            <input id="checkinDateInput" type="date" value="${new Date().toISOString().slice(0, 10)}" />
          </div>
        </div>

        <div class="row">
          <button id="genScoreInputsBtn" class="secondary">生成分数输入框</button>
          <button id="voiceInputBtn" class="ghost">语音输入（普通话）</button>
        </div>

        <div id="voiceHint" class="muted"></div>
        <div id="scoreInputsWrap"></div>

        <button id="submitCheckinBtn">提交打卡</button>
      </div>
    `;
  }

  function attachEvents(root) {
    const registerBtn = root.querySelector('#registerBtn');
    const groupBtn = root.querySelector('#genScoreInputsBtn');
    const submitBtn = root.querySelector('#submitCheckinBtn');
    const voiceBtn = root.querySelector('#voiceInputBtn');
    const scoreWrap = root.querySelector('#scoreInputsWrap');

    renderScoreInputs(scoreWrap, 3);

    registerBtn.addEventListener('click', async () => {
      const nickname = root.querySelector('#nicknameInput').value;
      const tier = Number(root.querySelector('#tierInput').value);

      try {
        await deps.request('/api/checkins/register', {
          method: 'POST',
          body: JSON.stringify({ nickname, tier })
        });
        await deps.refreshAll();
        deps.showToast('注册已保存');
      } catch (error) {
        deps.showToast(error.message, 3200);
      }
    });

    groupBtn.addEventListener('click', () => {
      const count = Number(root.querySelector('#groupCountInput').value);
      if (!Number.isInteger(count) || count < 1 || count > 20) {
        deps.showToast('组数需为 1-20');
        return;
      }
      renderScoreInputs(scoreWrap, count);
    });

    voiceBtn.addEventListener('click', () => {
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const hint = root.querySelector('#voiceHint');

      if (!Recognition) {
        hint.textContent = '当前浏览器不支持语音识别，请改用手动输入。';
        return;
      }

      const recognition = new Recognition();
      recognition.lang = 'zh-CN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      hint.textContent = '正在听取分数，请说出例如“10 12 9”';
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript || '';
        hint.textContent = `识别结果：${transcript}`;

        const tokens = transcript.split(/[，,。\s]+/).filter(Boolean);
        const scores = tokens
          .map((token) => {
            const map = { 零: 0, 一: 1, 二: 2, 兩: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
            if (/^\d{1,2}$/.test(token)) {
              return Number(token);
            }
            if (token in map) {
              return map[token];
            }
            if (/^十[一二三四五]$/.test(token)) {
              return 10 + map[token[1]];
            }
            return null;
          })
          .filter((n) => Number.isInteger(n));

        if (scores.length === 0) {
          deps.showToast('未解析到分数，请再试一次。');
          return;
        }

        root.querySelector('#groupCountInput').value = String(scores.length);
        renderScoreInputs(scoreWrap, scores.length, scores);
      };

      recognition.onerror = () => {
        hint.textContent = '语音识别失败，请再试一次。';
      };
    });

    submitBtn.addEventListener('click', async () => {
      const payload = {
        drillId: root.querySelector('#drillSelect').value,
        groupCount: Number(root.querySelector('#groupCountInput').value),
        date: root.querySelector('#checkinDateInput').value,
        scores: getScoresFromInputs(scoreWrap)
      };

      try {
        const result = await deps.request('/api/checkins', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        await deps.refreshAll();
        deps.showToast(`已提交，平均 ${result.entry.averageScore} 分`);
      } catch (error) {
        deps.showToast(error.message, 3200);
      }
    });
  }

  function render(state) {
    const root = document.getElementById('checkinTab');
    root.innerHTML = `${buildRegistrationCard(state)}${buildCheckinCard(state)}`;
    attachEvents(root);
  }

  return {
    mount,
    render
  };
})();
