/* ==========================================================
   Restaurant Template — content loader  内容加载器
   All site content lives in /data/*.txt — edit those files,
   push to GitHub, and the site updates automatically.
   网站全部内容存放在 /data/*.txt 中 — 修改这些 txt 文件并
   上传到 GitHub,网站即自动更新。日常运营无需改动本文件。
   ========================================================== */
(function () {
  'use strict';

  // Cache-busting query so visitors always get the latest txt content.
  // 在请求后加时间戳参数,确保访客总是读到最新的 txt 内容(绕过浏览器缓存)。
  const bust = () => '?v=' + Date.now();

  const fetchText = (path) =>
    fetch(path + bust()).then((r) => {
      if (!r.ok) throw new Error(path + ' → HTTP ' + r.status);
      return r.text();
    });

  const stripComments = (text) =>
    text
      .split(/\r?\n/)
      .filter((line) => !line.trim().startsWith('#'))
      .join('\n');

  /* ---------------- 解析 info.txt:每行 "键: 值"(about/hours/social 可重复出现) ----------------
     info.txt: "key: value" lines (keys may repeat) */
  function parseInfo(text) {
    const info = {};
    stripComments(text)
      .split('\n')
      .forEach((line) => {
        const m = line.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.+)$/);
        if (!m) return;
        const key = m[1].toLowerCase();
        const val = m[2].trim();
        if (info[key] === undefined) info[key] = val;
        else if (Array.isArray(info[key])) info[key].push(val);
        else info[key] = [info[key], val];
      });
    return info;
  }

  /* ---------------- 解析 menu.txt:[分类名] 之后每行 "菜名 | 价格 | 描述 | 标签" ----------------
     menu.txt: [Section] then "Name | price | desc | tags" */
  function parseMenu(text) {
    const sections = [];
    let current = null;
    stripComments(text)
      .split('\n')
      .forEach((raw) => {
        const line = raw.trim();
        if (!line) return;
        const sec = line.match(/^\[(.+)\]$/);
        if (sec) {
          current = { title: sec[1].trim(), items: [] };
          sections.push(current);
          return;
        }
        if (!current) return; // items must belong to a section 菜品必须写在某个 [分类] 之下
        const parts = line.split('|').map((p) => p.trim());
        if (!parts[0]) return;
        current.items.push({
          name: parts[0],
          price: parts[1] || '',
          desc: parts[2] || '',
          tags: parts[3] ? parts[3].split(',').map((t) => t.trim()).filter(Boolean) : [],
        });
      });
    return sections.filter((s) => s.items.length > 0);
  }

  /* ---------------- 解析 announcements.txt:公告之间用单独一行 "---" 分隔 ----------------
     First line:  [YYYY-MM-DD] Title            (append "| pinned" to pin)
     首行格式:[年-月-日] 标题   (标题后加 "| pinned" 表示置顶)
     Remaining lines: body (blank line = new paragraph)
     其余行为正文(空行 = 分段);自动按 置顶优先、日期从新到旧 排序 */
  function parseAnnouncements(text) {
    return stripComments(text)
      .split(/^\s*---\s*$/m)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => {
        const lines = block.split('\n');
        const head = lines[0].match(/^\[([^\]]+)\]\s*(.*)$/);
        if (!head) return null;
        let title = head[2].trim();
        let pinned = false;
        if (/\|\s*pinned\s*$/i.test(title)) {
          pinned = true;
          title = title.replace(/\|\s*pinned\s*$/i, '').trim();
        }
        const paragraphs = lines
          .slice(1)
          .join('\n')
          .split(/\n\s*\n/)
          .map((p) => p.replace(/\n/g, ' ').trim())
          .filter(Boolean);
        return { date: head[1].trim(), title, pinned, paragraphs };
      })
      .filter(Boolean)
      .sort((a, b) => (b.pinned - a.pinned) || (new Date(b.date) - new Date(a.date)));
  }

  /* ---------------- DOM 辅助函数(使用 textContent 写入,天然防注入,安全) ----------------
     small DOM helpers (safe: uses textContent) */
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const asArray = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

  function showError(container, msg) {
    container.innerHTML = '';
    container.appendChild(el('p', 'error-note', msg));
  }

  function formatDate(iso) {
    const d = new Date(iso + 'T12:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  /* ---------------- 渲染函数 renderers:把解析结果填入页面 ---------------- */
  function renderInfo(info) {
    // Bind every [data-bind] element to its key.
    // 把页面上所有带 data-bind 属性的元素填入 info.txt 中对应键的值。
    document.querySelectorAll('[data-bind]').forEach((node) => {
      const v = info[node.getAttribute('data-bind')];
      if (v !== undefined) node.textContent = Array.isArray(v) ? v[0] : v;
    });
    if (info.name) document.title = info.name + (info.tagline ? ' — ' + info.tagline : '');

    // About paragraphs 「关于我们」段落(每条 about: 一段)
    const aboutBox = document.getElementById('aboutParagraphs');
    const abouts = asArray(info.about);
    if (abouts.length) {
      aboutBox.innerHTML = '';
      abouts.forEach((p) => aboutBox.appendChild(el('p', null, p)));
    }

    // Hours table (+ highlight today) 营业时间表(自动高亮今天,支持 "Mon – Thu" 这类范围写法)
    const table = document.getElementById('hoursTable');
    table.innerHTML = '';
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const today = dayNames[new Date().getDay()];
    asArray(info.hours).forEach((line) => {
      const [label = '', time = ''] = line.split('|').map((s) => s.trim());
      const tr = el('tr');
      const low = label.toLowerCase();
      // direct match, or range match like "Mon – Thu" / "Mon-Thu" 精确匹配或星期范围匹配
      let isToday = low.includes(today);
      const range = low.match(/(sun|mon|tue|wed|thu|fri|sat)[a-z]*\s*[–-]\s*(sun|mon|tue|wed|thu|fri|sat)/);
      if (!isToday && range) {
        const a = dayNames.indexOf(range[1]);
        const b = dayNames.indexOf(range[2]);
        const t = dayNames.indexOf(today);
        isToday = a <= b ? t >= a && t <= b : t >= a || t <= b;
      }
      if (isToday) tr.className = 'today';
      tr.appendChild(el('td', null, label));
      tr.appendChild(el('td', null, time));
      table.appendChild(tr);
    });

    // Links 电话/邮箱/地图/预订按钮链接(没填预订链接时,预订按钮自动改为拨打电话)
    if (info.phone) document.getElementById('phoneLink').href = 'tel:' + String(info.phone).replace(/[^\d+]/g, '');
    if (info.email) document.getElementById('emailLink').href = 'mailto:' + info.email;
    const mapLink = document.getElementById('mapLink');
    mapLink.href = info.map_link || 'https://www.google.com/maps/search/' + encodeURIComponent(info.address || '');
    const reserveBtn = document.getElementById('reserveBtn');
    if (info.reservation_link) reserveBtn.href = info.reservation_link;
    else if (info.phone) { reserveBtn.href = 'tel:' + String(info.phone).replace(/[^\d+]/g, ''); reserveBtn.removeAttribute('target'); }

    // Social links: "social: Label | URL" 页脚社交链接,格式 "名称 | 网址"
    const social = document.getElementById('footerSocial');
    social.innerHTML = '';
    asArray(info.social).forEach((line) => {
      const [label, url] = line.split('|').map((s) => s.trim());
      if (!label || !url) return;
      const a = el('a', null, label);
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      social.appendChild(a);
    });
  }

  function renderMenu(sections) {
    const tabs = document.getElementById('menuTabs');
    const panels = document.getElementById('menuPanels');
    tabs.innerHTML = ''; panels.innerHTML = '';
    if (!sections.length) {
      showError(panels, 'No menu sections found. Check the format of data/menu.txt.');
      return;
    }
    sections.forEach((section, i) => {
      const tab = el('button', 'menu-tab' + (i === 0 ? ' active' : ''), section.title);
      tab.setAttribute('role', 'tab');
      tab.addEventListener('click', () => {
        tabs.querySelectorAll('.menu-tab').forEach((t) => t.classList.remove('active'));
        panels.querySelectorAll('.menu-panel').forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');
        panel.classList.add('active');
      });
      tabs.appendChild(tab);

      const panel = el('div', 'menu-panel' + (i === 0 ? ' active' : ''));
      section.items.forEach((item) => {
        const row = el('div', 'menu-item');
        const head = el('div', 'menu-item-head');
        const name = el('span', 'menu-item-name', item.name);
        item.tags.forEach((tag) => {
          const slug = tag.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
          name.appendChild(el('span', 'menu-tag tag-' + slug, tag));
        });
        head.appendChild(name);
        head.appendChild(el('span', 'menu-item-dots'));
        head.appendChild(el('span', 'menu-item-price', item.price));
        row.appendChild(head);
        if (item.desc) row.appendChild(el('p', 'menu-item-desc', item.desc));
        panel.appendChild(row);
      });
      panels.appendChild(panel);
    });
  }

  function renderAnnouncements(items) {
    const grid = document.getElementById('announceGrid');
    grid.innerHTML = '';
    if (!items.length) {
      grid.appendChild(el('p', 'loading-note', 'No announcements right now — check back soon.'));
      return;
    }
    items.forEach((a) => {
      const card = el('article', 'announce-card');
      if (a.pinned) card.appendChild(el('span', 'announce-pinned', 'Pinned'));
      card.appendChild(el('p', 'announce-date', formatDate(a.date)));
      card.appendChild(el('h3', 'announce-title', a.title));
      const body = el('div', 'announce-body');
      a.paragraphs.forEach((p) => body.appendChild(el('p', null, p)));
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  /* ---------------- 启动:加载三个 txt 文件并渲染 load everything ---------------- */
  fetchText('data/info.txt').then((t) => renderInfo(parseInfo(t)))
    .catch((e) => { console.error(e); });

  fetchText('data/menu.txt').then((t) => renderMenu(parseMenu(t)))
    .catch((e) => {
      console.error(e);
      showError(document.getElementById('menuPanels'),
        'Could not load the menu. If you opened this file directly, run it from a web server (GitHub Pages works automatically).');
    });

  fetchText('data/announcements.txt').then((t) => renderAnnouncements(parseAnnouncements(t)))
    .catch((e) => {
      console.error(e);
      showError(document.getElementById('announceGrid'), 'Could not load announcements.');
    });

  /* ---------------- 界面交互 UI behavior:滚动变色、手机端菜单开关、年份 ---------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );

  /* Expose parsers for testing 导出解析函数,便于自动化测试 */
  window.__site = { parseInfo, parseMenu, parseAnnouncements };
})();
