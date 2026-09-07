// SRE Survival — App Init & Navigation

const fs   = new FileSystem();
const pkg  = new PackageManager(fs);
const term = new Terminal(fs, pkg);
const game = new GameEngine();

let inputHistory = [], histIdx = -1;

// ── ANSI color parser ──────────────────────────────────────────────
function ansiToHtml(text) {
  const map = {
    '0':'', '1':'font-weight:bold', '2':'opacity:0.6',
    '30':'color:#1a1a1a','31':'color:#ff5555','32':'color:#50fa7b',
    '33':'color:#f1fa8c','34':'color:#6272a4','35':'color:#ff79c6',
    '36':'color:#8be9fd','37':'color:#f8f8f2',
    '1;30':'color:#555;font-weight:bold','1;31':'color:#ff5555;font-weight:bold',
    '1;32':'color:#50fa7b;font-weight:bold','1;33':'color:#f1fa8c;font-weight:bold',
    '1;34':'color:#8be9fd;font-weight:bold','1;36':'color:#8be9fd;font-weight:bold',
    '1;37':'color:#fff;font-weight:bold',
  };
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\x1b\[([0-9;]+)m/g, (_, code) => {
      if (code === '0') return '</span>';
      const style = map[code] || '';
      return style ? `<span style="${style}">` : '';
    });
}

function appendOutput(html, cssClass = '') {
  const out = document.getElementById('terminal-output');
  const div = document.createElement('div');
  div.className = 'output-line ' + cssClass;
  div.innerHTML = html;
  out.appendChild(div);
  out.scrollTop = out.scrollHeight;
}

function appendPromptLine(cmd) {
  const user = `<span class="prompt-user">sre@ops-center</span>`;
  const sep  = `<span class="prompt-sep">:</span>`;
  const path = `<span class="prompt-path">${fs.promptPath()}</span>`;
  const sign = `<span class="prompt-sign">$</span>`;
  appendOutput(`${user}${sep}${path}${sign} <span class="prompt-cmd">${cmd.replace(/</g,'&lt;')}</span>`, 'prompt-line');
}

function runCommand(cmd) {
  appendPromptLine(cmd);
  const result = term.run(cmd);
  if (result === '__CLEAR__') {
    document.getElementById('terminal-output').innerHTML = '';
    return;
  }
  if (result === '__EXIT__') {
    appendOutput('<span style="color:#f1fa8c">Session ended. Refresh to restart.</span>');
    document.getElementById('terminal-input').disabled = true;
    return;
  }
  if (result) appendOutput(ansiToHtml(result));
}

function submitInput() {
  const input = document.getElementById('terminal-input');
  const cmd = input.value.trim();
  input.value = '';
  histIdx = -1;
  if (cmd) { inputHistory.unshift(cmd); runCommand(cmd); }
  updatePromptDisplay();
}

function updatePromptDisplay() {
  document.getElementById('prompt-user-disp').textContent = 'sre@ops-center';
  document.getElementById('prompt-path-disp').textContent = fs.promptPath();
}

// Tab autocomplete
function autocomplete(val) {
  const parts = val.split(' ');
  const last = parts[parts.length - 1];
  if (!last) return val;
  const dir = last.includes('/') ? last.substring(0, last.lastIndexOf('/') + 1) : '';
  const prefix = last.includes('/') ? last.substring(last.lastIndexOf('/') + 1) : last;
  const basePath = dir ? fs.resolvePath(dir) : fs.cwd;
  const node = fs.fs[basePath];
  if (!node || node.type !== 'dir') return val;
  const matches = (node.children || []).filter(c => c.startsWith(prefix));
  if (matches.length === 1) {
    const completed = dir + matches[0];
    const childPath = (basePath === '/' ? '' : basePath) + '/' + matches[0];
    const isDir = fs.fs[childPath] && fs.fs[childPath].type === 'dir';
    parts[parts.length - 1] = completed + (isDir ? '/' : '');
    return parts.join(' ');
  }
  if (matches.length > 1) {
    appendOutput(matches.map(m => `<span style="color:#8be9fd">${m}</span>`).join('  '));
  }
  return val;
}

// ── Terminal banner ───────────────────────────────────────────────
function initTerminal() {
  const banner = `\x1b[1;31m
  ███████╗██████╗ ███████╗    ███████╗██╗   ██╗██████╗ ██╗   ██╗██╗██╗   ██╗ █████╗ ██╗
  ██╔════╝██╔══██╗██╔════╝    ██╔════╝██║   ██║██╔══██╗██║   ██║██║██║   ██║██╔══██╗██║
  ███████╗██████╔╝█████╗      ███████╗██║   ██║██████╔╝██║   ██║██║██║   ██║███████║██║
  ╚════██║██╔══██╗██╔══╝      ╚════██║██║   ██║██╔══██╗╚██╗ ██╔╝██║╚██╗ ██╔╝██╔══██║██║
  ███████║██║  ██║███████╗    ███████║╚██████╔╝██║  ██║ ╚████╔╝ ██║ ╚████╔╝ ██║  ██║███████╗
  ╚══════╝╚═╝  ╚═╝╚══════╝    ╚══════╝ ╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝╚══════╝
\x1b[0m\x1b[2m  SRE Operations Center — Secure Terminal\x1b[0m
\x1b[33m  ⚠  Simulated environment — commands are sandboxed, not a real Linux OS\x1b[0m
\x1b[2m  Use missions in HQ tab to guide your practice. Type \x1b[0m\x1b[32mhelp\x1b[0m\x1b[2m to see commands.\x1b[0m
\x1b[2m  Session: ${new Date().toUTCString()}\x1b[0m
`;
  appendOutput(ansiToHtml(banner));
  updatePromptDisplay();
}

// ── DOMContentLoaded ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Register service worker
  if ('serviceWorker' in navigator) {
    const swPath = location.hostname === 'localhost' || location.protocol === 'file:'
      ? './sw.js' : '/DevOps-Gurukul/sw.js';
    navigator.serviceWorker.register(swPath).catch(() => {});
  }

  // Init game systems
  initTerminal();
  if (document.getElementById('office-canvas')) {
    window.officeGame = new OfficeGame('office-canvas');
  }
  if (typeof initAmongUsUI === 'function') {
    initAmongUsUI();
  }

  // Cache refresh button
  const btnRefresh = document.getElementById('btn-refresh');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      btnRefresh.style.transform = 'rotate(360deg)';
      btnRefresh.style.transition = 'transform 0.5s ease';
      const promises = [];
      if ('caches' in window)
        promises.push(caches.keys().then(names => Promise.all(names.map(n => caches.delete(n)))));
      if ('serviceWorker' in navigator)
        promises.push(navigator.serviceWorker.getRegistrations().then(rs => Promise.all(rs.map(r => r.unregister()))));
      Promise.all(promises).then(() => setTimeout(() => window.location.reload(), 200))
        .catch(() => setTimeout(() => window.location.reload(), 200));
    });
  }

  // Terminal input events
  const inp      = document.getElementById('terminal-input');
  const termArea = document.getElementById('terminal-area');

  termArea.addEventListener('click', () => inp.focus());

  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { submitInput(); }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < inputHistory.length - 1) { histIdx++; inp.value = inputHistory[histIdx]; }
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; inp.value = inputHistory[histIdx]; }
      else { histIdx = -1; inp.value = ''; }
    }
    else if (e.key === 'Tab') {
      e.preventDefault();
      inp.value = autocomplete(inp.value);
    }
    else if (e.key === 'c' && e.ctrlKey) {
      appendPromptLine(inp.value + '^C');
      inp.value = ''; histIdx = -1;
    }
    else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      document.getElementById('terminal-output').innerHTML = '';
    }
  });

  // Mission back button: return to building view
  const mdBack = document.getElementById('md-back') || document.getElementById('md-back-btn');
  if (mdBack) {
    mdBack.addEventListener('click', () => {
      showView('view-building');
      if (typeof renderBuildingTabs === 'function') renderBuildingTabs();
      if (typeof renderBuildingMap === 'function')  renderBuildingMap();
      if (typeof streamTasksForFloor === 'function' && typeof currentFloorId !== 'undefined') {
        streamTasksForFloor(currentFloorId, false);
      }
    });
  }

  // Bottom Nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const sec = item.dataset.section;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      const secEl = document.getElementById('section-' + sec);
      if (secEl) secEl.classList.add('active');

      if (sec === 'linux') setTimeout(() => inp.focus(), 100);
      if (sec === 'agent') renderAgentProfile();
      if (sec === 'game') {
        if (window.officeGame) {
          window.officeGame.resizeCanvas();
        }
        if (window.gameUI) {
          window.gameUI.updateTaskBar();
          window.gameUI.renderPinnedTasks();
          window.gameUI.updateHUD();
        }
      }
    });
  });
});

// Expose for game-ui.js (terminal bridge, legacy compat)
window.submitInput = submitInput;
window.game = game;
