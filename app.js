(function () {
  const $app = document.getElementById('app');

  const STORAGE_KEYS = {
    forum: 'ln_forum_posts_v1',
    community: 'ln_community_feed_v1',
    qa: 'ln_qa_items_v1',
    lawUpdates: 'ln_law_updates_v1',
    lawyers: 'ln_lawyers_v1',
    films: 'ln_films_v1',
    news: 'ln_news_v1'
  };

  const readStorage = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn('readStorage error', e);
      return fallback;
    }
  };
  const writeStorage = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.warn('writeStorage error', e); }
  };

  function seedIfEmpty() {
    if (!readStorage(STORAGE_KEYS.films)) {
      writeStorage(STORAGE_KEYS.films, [
        { id: nid(), title: '丰收在望——力农纪录片第一集', category: '力农', desc: '乡村振兴·农业新技术应用纪实', duration: '24:10' },
        { id: nid(), title: '普法文园·民法典走进生活', category: '普法文园', desc: '以案说法，知行合一', duration: '18:22' },
        { id: nid(), title: '守望田野——力农系列之二', category: '力农', desc: '合作社带动产业升级', duration: '21:05' },
        { id: nid(), title: '校园普法·未成年人保护', category: '普法文园', desc: '你我都是法治的守护者', duration: '16:48' }
      ]);
    }
    if (!readStorage(STORAGE_KEYS.news)) {
      writeStorage(STORAGE_KEYS.news, [
        { id: nid(), title: '全国人大审议部分法律修订草案', date: '2025-03-12', tags: ['立法', '时政'], summary: '聚焦完善相关条款，提升制度效能。' },
        { id: nid(), title: '多地推出涉企合规指引', date: '2025-02-26', tags: ['合规', '营商环境'], summary: '以公开透明促高质量发展。' },
        { id: nid(), title: '最高法发布司法解释', date: '2025-01-08', tags: ['司法解释', '法院'], summary: '统一裁判尺度，回应社会关切。' }
      ]);
    }
    if (!readStorage(STORAGE_KEYS.forum)) {
      writeStorage(STORAGE_KEYS.forum, [
        { id: nid(), title: '如何理解居住权？', content: '居住权与所有权的关系如何把握？', createdAt: Date.now() - 86400000, replies: [ { id: nid(), content: '可参考民法典权利体系章节。', createdAt: Date.now() - 86000000 } ] },
      ]);
    }
    if (!readStorage(STORAGE_KEYS.community)) {
      writeStorage(STORAGE_KEYS.community, [
        { id: nid(), text: '法治宣传周活动顺利开展！', tags: ['活动'], likes: 3, createdAt: Date.now() - 3600_000 },
      ]);
    }
    if (!readStorage(STORAGE_KEYS.qa)) {
      writeStorage(STORAGE_KEYS.qa, [
        { id: nid(), question: '劳动合同到期公司不续签怎么办？', answers: [ { id: nid(), text: '依法支付经济补偿，注意证据留存。' } ], createdAt: Date.now() - 7200_000 }
      ]);
    }
    if (!readStorage(STORAGE_KEYS.lawUpdates)) {
      writeStorage(STORAGE_KEYS.lawUpdates, [
        { id: nid(), name: '公司法（修订）', effectiveDate: '2025-07-01', summary: '注册资本与公司治理规则优化。' },
        { id: nid(), name: '行政处罚法（修订）', effectiveDate: '2025-04-01', summary: '程序规则完善，强调比例原则。' }
      ]);
    }
    if (!readStorage(STORAGE_KEYS.lawyers)) {
      writeStorage(STORAGE_KEYS.lawyers, [
        { id: nid(), name: '张三', firm: '某某律师事务所', email: 'zhangsan@example.com', phone: '13800000000', areas: ['民商事', '合规'], bio: '专注企业合规与商事争议解决。' }
      ]);
    }
  }

  function nid() {
    return 'id_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  const routes = {
    '/': renderHome,
    '/films': renderFilms,
    '/news': renderNews,
    '/forum': renderForum,
    '/community': renderCommunity,
    '/qa': renderQA,
    '/law-updates': renderLawUpdates,
    '/lawyers': renderLawyers
  };

  function navigate() {
    const hash = location.hash.slice(1) || '/';
    const path = hash.split('?')[0];
    const view = routes[path] || renderNotFound;
    view();
  }

  window.addEventListener('hashchange', navigate);
  window.addEventListener('DOMContentLoaded', () => { seedIfEmpty(); navigate(); });

  function html(strings, ...values) {
    return strings.reduce((acc, s, i) => acc + s + (values[i] ?? ''), '');
  }

  function setApp(content) {
    $app.innerHTML = content;
  }

  function renderHome() {
    setApp(html`
      <section class="section">
        <h1>欢迎来到 法律新媒体</h1>
        <p class="small">聚焦普法传播与法律服务：影视（力农、普法文园）、时政、论坛、社区、在线回答与法律时效。</p>
        <div class="grid cols-3" style="margin-top:12px;">
          ${[
            { href: '#/films', title: '影视', desc: '力农 · 普法文园' },
            { href: '#/news', title: '时政', desc: '政务要闻 · 法治热词' },
            { href: '#/forum', title: '论坛', desc: '发帖讨论 · 专题交流' },
            { href: '#/community', title: '社区', desc: '动态发布 · 活动播报' },
            { href: '#/qa', title: '在线回答', desc: '提问解答 · 经验分享' },
            { href: '#/law-updates', title: '法律时效', desc: '变更时间线 · 要点速览' },
          ].map(x => html`
            <a class="card" href="${x.href}">
              <div class="card-title">${x.title}</div>
              <div class="small">${x.desc}</div>
            </a>
          `).join('')}
        </div>
      </section>
    `);
  }

  function renderFilms() {
    const all = readStorage(STORAGE_KEYS.films, []);
    let active = sessionStorage.getItem('films_tab') || '力农';

    const renderList = (category, keyword) => {
      const list = all.filter(x => x.category === category && (!keyword || x.title.includes(keyword) || x.desc.includes(keyword)));
      if (list.length === 0) return `<div class="empty">暂无内容</div>`;
      return `<div class="grid cols-2">${list.map(x => html`
        <div class="card">
          <div class="card-title">${x.title}</div>
          <div class="small">分类：${x.category} · 时长：${x.duration}</div>
          <div style="margin-top:8px;">${x.desc}</div>
          <div class="hr"></div>
          <button class="btn">播放预告</button>
        </div>
      `).join('')}</div>`;
    };

    setApp(html`
      <section class="section">
        <h2>影视</h2>
        <div class="tabs" role="tablist">
          ${['力农', '普法文园'].map(name => html`
            <button class="tab ${active === name ? 'active' : ''}" data-tab="${name}" role="tab">${name}</button>
          `).join('')}
        </div>
        <div class="toolbar">
          <input id="filmSearch" class="search-input" placeholder="搜索影片标题或简介..." />
          <button id="addFilm" class="btn">新增条目</button>
        </div>
        <div id="filmList">${renderList(active)}</div>
      </section>
    `);

    const $filmList = document.getElementById('filmList');
    document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
      active = btn.dataset.tab;
      sessionStorage.setItem('films_tab', active);
      $filmList.innerHTML = renderList(active, document.getElementById('filmSearch').value.trim());
      document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === active));
    }));
    document.getElementById('filmSearch').addEventListener('input', (e) => {
      $filmList.innerHTML = renderList(active, e.target.value.trim());
    });
    document.getElementById('addFilm').addEventListener('click', () => {
      const title = prompt('影片标题');
      if (!title) return;
      const category = active;
      const desc = prompt('简介') || '';
      const duration = prompt('时长（如 20:00）') || '';
      writeStorage(STORAGE_KEYS.films, [...all, { id: nid(), title, category, desc, duration }]);
      renderFilms();
    });
  }

  function renderNews() {
    const list = readStorage(STORAGE_KEYS.news, []).slice().sort((a, b) => b.date.localeCompare(a.date));
    setApp(html`
      <section class="section">
        <h2>时政</h2>
        <div class="toolbar">
          <input id="newsSearch" class="search-input" placeholder="搜索标题、摘要或标签...（按 Enter 提交）" />
          <button id="addNews" class="btn">新增要闻</button>
        </div>
        <div id="newsList" class="list"></div>
      </section>
    `);

    const $list = document.getElementById('newsList');
    const render = (kw = '') => {
      const k = kw.trim();
      const filtered = list.filter(n => !k || n.title.includes(k) || n.summary.includes(k) || (n.tags||[]).some(t => t.includes(k)));
      $list.innerHTML = filtered.map(n => html`
        <div class="list-item">
          <div class="title">${n.title}</div>
          <div class="meta">日期：${n.date} · 标签：${(n.tags||[]).join('、') || '—'}</div>
          <div style="margin-top:6px;">${n.summary}</div>
        </div>
      `).join('') || `<div class="empty">未找到匹配的时政信息</div>`;
    };
    render('');

    document.getElementById('newsSearch').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') render(e.target.value);
    });

    document.getElementById('addNews').addEventListener('click', () => {
      const data = readStorage(STORAGE_KEYS.news, []);
      const title = prompt('标题'); if (!title) return;
      const date = prompt('日期（YYYY-MM-DD）', new Date().toISOString().slice(0,10)) || '';
      const tags = (prompt('标签（用逗号分隔）') || '').split(',').map(s => s.trim()).filter(Boolean);
      const summary = prompt('摘要') || '';
      writeStorage(STORAGE_KEYS.news, [...data, { id: nid(), title, date, tags, summary }]);
      renderNews();
    });
  }

  function renderForum() {
    const data = readStorage(STORAGE_KEYS.forum, []);
    setApp(html`
      <section class="section">
        <h2>论坛</h2>
        <form id="newPost" class="card" autocomplete="off">
          <label>标题</label>
          <input name="title" required placeholder="请输入标题">
          <label>内容</label>
          <textarea name="content" required placeholder="说点什么...（支持纯文本）"></textarea>
          <div style="margin-top:10px; display:flex; gap:8px; justify-content:flex-end;">
            <button class="btn primary" type="submit">发帖</button>
          </div>
        </form>
        <div class="hr"></div>
        <div class="list" id="postList"></div>
      </section>
    `);

    const $list = document.getElementById('postList');
    const render = () => {
      const posts = readStorage(STORAGE_KEYS.forum, []).slice().sort((a,b)=>b.createdAt-a.createdAt);
      $list.innerHTML = posts.map(p => html`
        <div class="list-item">
          <div class="title">${p.title}</div>
          <div class="meta">发表于 ${new Date(p.createdAt).toLocaleString()}</div>
          <div style="margin-top:6px; white-space:pre-wrap;">${p.content}</div>
          <div class="hr"></div>
          <div class="small">${(p.replies||[]).length} 条回复</div>
          <div class="list" style="margin-top:8px;">
            ${(p.replies||[]).map(r => html`<div class="card small"><div>${r.text||r.content}</div><div class="small">${new Date(r.createdAt).toLocaleString()}</div></div>`).join('')}
          </div>
          <form class="replyForm" data-id="${p.id}" style="margin-top:8px;">
            <label class="small">回复</label>
            <input name="reply" placeholder="写下你的看法..." required>
            <div style="margin-top:6px; display:flex; justify-content:flex-end;">
              <button class="btn" type="submit">提交回复</button>
            </div>
          </form>
        </div>
      `).join('') || `<div class="empty">还没有帖子，快来发第一个吧！</div>`;

      document.querySelectorAll('.replyForm').forEach(f => f.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = f.dataset.id;
        const text = new FormData(f).get('reply');
        if (!text) return;
        const items = readStorage(STORAGE_KEYS.forum, []);
        const idx = items.findIndex(x => x.id === id);
        if (idx >= 0) {
          items[idx].replies = [...(items[idx].replies||[]), { id: nid(), text, createdAt: Date.now() }];
          writeStorage(STORAGE_KEYS.forum, items);
          render();
        }
        f.reset();
      }));
    };

    render();

    document.getElementById('newPost').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const title = fd.get('title');
      const content = fd.get('content');
      if (!title || !content) return;
      const items = readStorage(STORAGE_KEYS.forum, []);
      items.push({ id: nid(), title, content, createdAt: Date.now(), replies: [] });
      writeStorage(STORAGE_KEYS.forum, items);
      e.target.reset();
      render();
    });
  }

  function renderCommunity() {
    setApp(html`
      <section class="section">
        <h2>社区</h2>
        <form id="newFeed" class="card">
          <label>动态</label>
          <textarea name="text" required placeholder="分享观点、活动播报或普法小贴士..."></textarea>
          <label>标签（可选，逗号分隔）</label>
          <input name="tags" placeholder="如：活动, 普法">
          <div style="margin-top:10px; display:flex; gap:8px; justify-content:flex-end;">
            <button class="btn primary" type="submit">发布</button>
          </div>
        </form>
        <div class="hr"></div>
        <div class="list" id="feedList"></div>
      </section>
    `);

    const $list = document.getElementById('feedList');
    const render = () => {
      const items = readStorage(STORAGE_KEYS.community, []).slice().sort((a,b)=>b.createdAt-a.createdAt);
      $list.innerHTML = items.map(x => html`
        <div class="list-item">
          <div style="white-space:pre-wrap;">${x.text}</div>
          <div class="small" style="margin-top:6px;">${(x.tags||[]).map(t=>`#${t}`).join(' ')} · ${new Date(x.createdAt).toLocaleString()}</div>
          <div style="margin-top:8px;">
            <button class="btn" data-like="${x.id}">👍 ${x.likes||0}</button>
          </div>
        </div>
      `).join('') || `<div class="empty">还没有动态，快来发布吧！</div>`;
      document.querySelectorAll('[data-like]').forEach(btn => btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-like');
        const items = readStorage(STORAGE_KEYS.community, []);
        const idx = items.findIndex(i => i.id === id);
        if (idx >= 0) { items[idx].likes = (items[idx].likes||0) + 1; writeStorage(STORAGE_KEYS.community, items); render(); }
      }));
    };
    render();

    document.getElementById('newFeed').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const text = fd.get('text');
      const tags = (fd.get('tags')||'').split(',').map(s=>s.trim()).filter(Boolean);
      if (!text) return;
      const items = readStorage(STORAGE_KEYS.community, []);
      items.unshift({ id: nid(), text, tags, likes: 0, createdAt: Date.now() });
      writeStorage(STORAGE_KEYS.community, items);
      e.target.reset();
      render();
    });
  }

  function renderQA() {
    setApp(html`
      <section class="section">
        <h2>在线回答</h2>
        <form id="newQ" class="card">
          <label>问题</label>
          <textarea name="question" required placeholder="请描述你的问题（不含隐私信息）"></textarea>
          <div style="margin-top:10px; display:flex; gap:8px; justify-content:flex-end;">
            <button class="btn primary" type="submit">提问</button>
          </div>
        </form>
        <div class="hr"></div>
        <div class="list" id="qList"></div>
      </section>
    `);

    const $list = document.getElementById('qList');
    const render = () => {
      const items = readStorage(STORAGE_KEYS.qa, []).slice().sort((a,b)=>b.createdAt-a.createdAt);
      $list.innerHTML = items.map(q => html`
        <div class="list-item">
          <div class="title">Q：${q.question}</div>
          <div class="list" style="margin-top:8px;">
            ${(q.answers||[]).map(a => html`<div class="card small">A：${a.text}</div>`).join('')}
          </div>
          <form class="answerForm" data-id="${q.id}" style="margin-top:8px;">
            <label class="small">回答</label>
            <input name="answer" placeholder="写下你的解答..." required>
            <div style="margin-top:6px; display:flex; justify-content:flex-end;">
              <button class="btn" type="submit">提交回答</button>
            </div>
          </form>
        </div>
      `).join('') || `<div class="empty">暂无问题，来提第一个吧！</div>`;

      document.querySelectorAll('.answerForm').forEach(f => f.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = f.dataset.id;
        const text = new FormData(f).get('answer');
        if (!text) return;
        const items = readStorage(STORAGE_KEYS.qa, []);
        const idx = items.findIndex(x => x.id === id);
        if (idx >= 0) {
          items[idx].answers = [...(items[idx].answers||[]), { id: nid(), text }];
          writeStorage(STORAGE_KEYS.qa, items);
          render();
        }
        f.reset();
      }));
    };
    render();

    document.getElementById('newQ').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const question = fd.get('question');
      if (!question) return;
      const items = readStorage(STORAGE_KEYS.qa, []);
      items.unshift({ id: nid(), question, answers: [], createdAt: Date.now() });
      writeStorage(STORAGE_KEYS.qa, items);
      e.target.reset();
      render();
    });
  }

  function renderLawUpdates() {
    setApp(html`
      <section class="section">
        <h2>法律时效</h2>
        <form id="newLaw" class="card">
          <label>法律/法规名称</label>
          <input name="name" required placeholder="如：公司法（修订）">
          <label>生效日期</label>
          <input type="date" name="date" required>
          <label>摘要</label>
          <textarea name="summary" required placeholder="简要说明主要变更点"></textarea>
          <div style="margin-top:10px; display:flex; gap:8px; justify-content:flex-end;">
            <button class="btn primary" type="submit">添加</button>
          </div>
        </form>
        <div class="hr"></div>
        <div id="lawList" class="list"></div>
      </section>
    `);

    const $list = document.getElementById('lawList');
    const render = () => {
      const items = readStorage(STORAGE_KEYS.lawUpdates, []).slice().sort((a,b)=>b.effectiveDate.localeCompare(a.effectiveDate));
      $list.innerHTML = items.map(x => {
        const today = new Date().toISOString().slice(0,10);
        const status = x.effectiveDate > today ? '即将生效' : '已生效';
        return html`<div class="list-item">
          <div class="title">${x.name}</div>
          <div class="meta">生效日期：${x.effectiveDate} <span class="badge">${status}</span></div>
          <div style="margin-top:6px;">${x.summary}</div>
        </div>`;
      }).join('') || `<div class="empty">暂无数据，添加第一条法律变更吧。</div>`;
    };
    render();

    document.getElementById('newLaw').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name = fd.get('name');
      const date = fd.get('date');
      const summary = fd.get('summary');
      const items = readStorage(STORAGE_KEYS.lawUpdates, []);
      items.unshift({ id: nid(), name, effectiveDate: date, summary });
      writeStorage(STORAGE_KEYS.lawUpdates, items);
      e.target.reset();
      render();
    });
  }

  function renderLawyers() {
    setApp(html`
      <section class="section">
        <h2>律师推广</h2>
        <form id="newLawyer" class="card">
          <label>姓名</label>
          <input name="name" required placeholder="如：张三">
          <label>律所</label>
          <input name="firm" placeholder="如：XX律师事务所">
          <label>业务领域（逗号分隔）</label>
          <input name="areas" placeholder="如：民商事, 合规">
          <label>邮箱（可选）</label>
          <input type="email" name="email" placeholder="example@law.com">
          <label>电话（可选）</label>
          <input name="phone" placeholder="手机号或座机">
          <label>简介</label>
          <textarea name="bio" placeholder="一句话介绍你的专长"></textarea>
          <div style="margin-top:10px; display:flex; gap:8px; justify-content:flex-end;">
            <button class="btn primary" type="submit">添加名片</button>
          </div>
        </form>
        <div class="hr"></div>
        <div id="lawyerList" class="grid cols-2"></div>
      </section>
    `);

    const $list = document.getElementById('lawyerList');
    const render = () => {
      const items = readStorage(STORAGE_KEYS.lawyers, []);
      $list.innerHTML = items.map(p => html`
        <div class="card">
          <div class="card-title">${p.name}</div>
          <div class="small">${p.firm||'—'}</div>
          <div class="hr"></div>
          <div>${p.bio||''}</div>
          <div class="small" style="margin-top:6px;">业务领域：${(p.areas||[]).join('、')||'—'}</div>
          <div class="small" style="margin-top:6px;">${p.email||''} ${p.phone? ' · '+p.phone: ''}</div>
        </div>
      `).join('') || `<div class="empty">暂无律师名片，添加第一位吧。</div>`;
    };
    render();

    document.getElementById('newLawyer').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name = fd.get('name'); if (!name) return;
      const firm = fd.get('firm')||'';
      const email = fd.get('email')||'';
      const phone = fd.get('phone')||'';
      const bio = fd.get('bio')||'';
      const areas = (fd.get('areas')||'').split(',').map(s=>s.trim()).filter(Boolean);
      const items = readStorage(STORAGE_KEYS.lawyers, []);
      items.unshift({ id: nid(), name, firm, email, phone, bio, areas });
      writeStorage(STORAGE_KEYS.lawyers, items);
      e.target.reset();
      render();
    });
  }

  function renderNotFound() {
    setApp(html`<section class="section"><h2>页面未找到</h2><p class="small">链接无效或页面尚未实现。</p></section>`);
  }
})(); 