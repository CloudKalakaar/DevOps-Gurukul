// SRE Survival — Among Us Style IT Office UI Manager
// Connects canvas spatial game to Among Us Task Bar, Pinned Tasks, [USE] button, Admin Map, and Task Modal

class GameUIManager {
  constructor() {
    this.activeStation = null;
    this.activeLab     = null;
    this.currentStepIdx= 0;

    // Cache elements
    this.taskBarFill   = document.getElementById('among-task-fill');
    this.taskPctText   = document.getElementById('among-task-pct');
    this.pinnedList    = document.getElementById('among-task-list');
    this.useBtn        = document.getElementById('btn-use-action');
    this.mapBtn        = document.getElementById('btn-map-action');
    this.adminMapModal = document.getElementById('admin-map-modal');
    this.taskModal     = document.getElementById('station-task-modal');
    this.emergencyModal= document.getElementById('emergency-meeting-modal');

    // Bind event listeners
    this.bindEvents();

    // Initial render
    this.updateTaskBar();
    this.renderPinnedTasks();
    this.updateHUD();

    // Broadcast current incident alert on start
    setTimeout(() => {
      if (window.incidentEngine && typeof window.incidentEngine.broadcastIncidentAlert === 'function') {
        window.incidentEngine.broadcastIncidentAlert();
      }
    }, 600);
  }

  // ── PagerDuty Incident Alert Banners ─────────────────────────────
  showIncidentAlertBanner(inc) {
    const banner = document.getElementById('incident-alert-banner');
    if (!banner) return;

    banner.className = 'incident-alert-banner show alert';
    banner.innerHTML = `
      <div class="iab-inner">
        <div class="iab-meta-row">
          <div class="iab-left">
            <span class="iab-siren">🚨</span>
            <span class="iab-sev">${inc.severity}</span>
            <span class="iab-ticket">#${inc.ticketId}</span>
          </div>
          <div class="iab-right">
            <button class="iab-map-btn" onclick="gameUI.toggleAdminMap(true)" title="Open Admin Map">
              <span class="iab-map-ico">🗺️</span>
              <span class="iab-map-txt">MAP</span>
              <span class="iab-hotkey">[M]</span>
            </button>
          </div>
        </div>
        <div class="iab-body-row">
          <span class="iab-room">${inc.room}:</span>
          <span class="iab-title">${inc.title}</span>
        </div>
      </div>
    `;

    this.renderPinnedTasks();
  }

  showIncidentResolvedBanner(inc) {
    const banner = document.getElementById('incident-alert-banner');
    if (!banner) return;

    banner.className = 'incident-alert-banner show resolved';
    banner.innerHTML = `
      <div class="iab-inner">
        <div class="iab-meta-row">
          <div class="iab-left">
            <span class="iab-siren">✅</span>
            <span class="iab-sev" style="color:#00ff41;background:rgba(0,255,65,0.2);">RESOLVED</span>
            <span class="iab-ticket">#${inc.ticketId}</span>
          </div>
          <div class="iab-right">
            <span class="iab-next-lbl">NEXT ALERT INCOMING...</span>
          </div>
        </div>
        <div class="iab-body-row">
          <span class="iab-title" style="color:#00ff41;font-weight:700;">Incident Cleared! System Health Restored. +200 XP</span>
        </div>
      </div>
    `;

    setTimeout(() => {
      if (banner.classList.contains('resolved')) {
        banner.classList.remove('show');
      }
    }, 4200);
  }

  bindEvents() {
    // [USE] Button Click
    if (this.useBtn) {
      this.useBtn.addEventListener('click', () => {
        if (window.officeGame && window.officeGame.nearStation) {
          window.officeGame.triggerStationAction(window.officeGame.nearStation);
        }
      });
    }

    // [MAP] Button Click
    if (this.mapBtn) {
      this.mapBtn.addEventListener('click', () => {
        this.toggleAdminMap();
      });
    }

    // Close buttons
    const closeTaskBtn = document.getElementById('btn-close-task');
    if (closeTaskBtn) {
      closeTaskBtn.addEventListener('click', () => this.closeTaskModal());
    }

    const closeMapBtn = document.getElementById('btn-close-map');
    if (closeMapBtn) {
      closeMapBtn.addEventListener('click', () => this.toggleAdminMap(false));
    }

    const closeEmergencyBtn = document.getElementById('btn-close-emergency');
    if (closeEmergencyBtn) {
      closeEmergencyBtn.addEventListener('click', () => {
        if (this.emergencyModal) this.emergencyModal.style.display = 'none';
      });
    }
  }

  // ── Header HUD Update ───────────────────────────────────────────
  updateHUD() {
    if (typeof game === 'undefined') return;
    const rank = game.rank;
    const rankEl = document.getElementById('hud-rank');
    const xpEl   = document.getElementById('hud-xp');
    const barEl  = document.getElementById('hud-xp-bar');
    if (rankEl) { rankEl.textContent = `${rank.icon} ${rank.title}`; rankEl.style.color = rank.color; }
    if (xpEl)   { xpEl.textContent   = `${game.xp.toLocaleString()} XP`; }
    if (barEl)  { barEl.style.width  = `${game.xpProgressPct}%`; }
  }

  // ── Among Us Green Task Bar ─────────────────────────────────────
  updateTaskBar() {
    if (typeof game === 'undefined' || typeof LABS === 'undefined') return;
    const totalMissions = LABS.length;
    const completedCount= Object.keys(game._state.completed).length;
    const pct = totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : 0;

    if (this.taskBarFill) {
      this.taskBarFill.style.width = `${Math.max(2, pct)}%`;
    }
    if (this.taskPctText) {
      this.taskPctText.textContent = `TOTAL TASKS COMPLETED (${completedCount}/${totalMissions})`;
    }
  }

  // ── Left Pinned Task List ───────────────────────────────────────
  renderPinnedTasks() {
    if (!this.pinnedList || typeof LABS === 'undefined') return;

    let headerEl = this.pinnedList.querySelector('.atl-header');
    let itemsEl  = this.pinnedList.querySelector('.atl-items');

    if (!headerEl || !itemsEl) {
      this.pinnedList.innerHTML = `
        <div class="atl-header" id="atl-toggle-btn" title="Toggle Lab Tasks Checklist">
          <span class="atl-title">📋 LAB TASKS</span>
          <span class="atl-chevron">▾</span>
        </div>
        <div class="atl-items" id="atl-items-list"></div>
      `;
      headerEl = this.pinnedList.querySelector('.atl-header');
      itemsEl  = this.pinnedList.querySelector('.atl-items');
      headerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.pinnedList.classList.toggle('expanded');
      });
    }

    itemsEl.innerHTML = '';

    // Sample active tasks from key IT office stations
    const samples = [
      { room: 'Datacenter', title: 'Triage Runaway Process', cat: 'Linux Intermediate', id: 'i03' },
      { room: 'Breakroom',  title: 'Navigate Root Filesystem', cat: 'Linux Beginner', id: 'b01' },
      { room: 'Dev Floor',  title: 'Set Shell Permissions (chmod)', cat: 'Linux Beginner', id: 'b05' },
      { room: 'NOC Center', title: 'Analyze Systemd Nginx Daemon', cat: 'Linux Intermediate', id: 'i06' },
      { room: 'Cloud Wing', title: 'AWS IAM Gateway Credentials', cat: 'AWS Fundamentals', id: 'aws-01' },
      { room: 'IaC Foundry',title: 'Terraform Plan & Apply', cat: 'Terraform Fundamentals & Core Workflow', id: 'tf-01' }
    ];

    samples.forEach(s => {
      const isDone = game && game._state.completed[s.id];
      const item = document.createElement('div');
      item.className = `pinned-task-item${isDone ? ' done' : ''}`;
      item.innerHTML = `
        <span class="pti-check">${isDone ? '✓' : '●'}</span>
        <span class="pti-room">${s.room}:</span>
        <span class="pti-title">${s.title}</span>
      `;
      item.addEventListener('click', () => {
        if (window.officeGame) {
          const st = window.officeGame.stations.find(x => x.room.toLowerCase().includes(s.room.toLowerCase()));
          if (st) {
            window.officeGame.player.x = st.x + st.w / 2 + (st.x < 750 ? 36 : -36);
            window.officeGame.player.y = st.y + st.h / 2;
            window.officeGame.targetPos = null;
            window.officeGame.nearStation = st;
          }
        }
        const lab = LABS.find(l => l.id === s.id) || LABS[0];
        if (lab) this.openDirectLabModal(lab, s.room);
      });
      itemsEl.appendChild(item);
    });
  }

  // ── Station Proximity & [USE] Button ────────────────────────────
  setNearStation(station) {
    this.activeStation = station;
    if (!this.useBtn) return;

    if (station) {
      this.useBtn.classList.add('active');
      const isDistressed = window.incidentEngine && window.incidentEngine.isStationDistressed(station.id);

      if (isDistressed) {
        this.useBtn.classList.add('incident-alert');
        this.useBtn.querySelector('.among-btn-title').textContent = 'FIX';
        this.useBtn.querySelector('.use-hint').textContent = '🚨 RESPOND';
      } else {
        this.useBtn.classList.remove('incident-alert');
        this.useBtn.querySelector('.among-btn-title').textContent = 'USE';
        this.useBtn.querySelector('.use-hint').textContent = station.name;
      }
    } else {
      this.useBtn.classList.remove('active', 'incident-alert');
      this.useBtn.querySelector('.among-btn-title').textContent = 'USE';
      this.useBtn.querySelector('.use-hint').textContent = 'STAND NEAR DESK';
    }
  }

  // ── Station Task Modal Pop-Up (Incident Response Ticket) ────────
  openStationTaskModal(station) {
    this.activeStation = station;

    // Check if this is the Emergency War Room button!
    if (station.isEmergency) {
      this.openEmergencyMeeting();
      return;
    }

    // Check if this station has an active distressed incident!
    const isIncident = window.incidentEngine && window.incidentEngine.isStationDistressed(station.id);
    const curInc = isIncident ? window.incidentEngine.currentIncident : null;

    let targetLab = null;
    if (curInc && curInc.labId) {
      targetLab = LABS.find(l => l.id === curInc.labId);
    }
    if (!targetLab) {
      const matchingLabs = LABS.filter(l => l.category === station.category);
      targetLab = matchingLabs.find(l => !game.isQuestCompleted(l.id)) || matchingLabs[0] || LABS[0];
    }
    this.activeLab = targetLab;
    this.currentStepIdx = 0;

    // Populate Modal with realistic Incident Ticket data
    if (curInc) {
      document.getElementById('stm-room-tag').innerHTML = `
        <span style="color:#ef4444;font-weight:900;">🚨 TICKET #${curInc.ticketId} // ${curInc.severity}</span>
        <span style="color:#94a3b8;margin-left:8px;">${station.room.toUpperCase()}</span>
      `;
      document.getElementById('stm-mission-title').textContent = curInc.title;
      document.getElementById('stm-mission-xp').textContent = `+200 XP`;
      document.getElementById('stm-npc-avatar').textContent = curInc.leadAvatar;
      document.getElementById('stm-npc-name').textContent = curInc.lead;
      document.getElementById('stm-npc-dialog').innerHTML = `
        <strong>INCIDENT BRIEFING:</strong> "${curInc.briefing}"<br/>
        <strong style="color:#f87171;margin-top:4px;display:inline-block;">IMPACT:</strong> ${curInc.impact}
      `;
    } else {
      document.getElementById('stm-room-tag').textContent = `${station.room.toUpperCase()} // ${station.name.toUpperCase()}`;
      document.getElementById('stm-mission-title').textContent = targetLab.title;
      document.getElementById('stm-mission-xp').textContent = `+150 XP`;
      document.getElementById('stm-npc-avatar').textContent = '🧑‍💻';
      document.getElementById('stm-npc-name').textContent = 'DevOps Routine Maintenance';
      document.getElementById('stm-npc-dialog').textContent = `"${targetLab.objective}"`;
    }

    // Render Steps
    this.renderModalSteps(targetLab);

    // Show modal with Among Us pop animation
    if (this.taskModal) {
      this.taskModal.style.display = 'flex';
    }
  }

  openDirectLabModal(lab, roomName) {
    this.activeLab = lab;
    document.getElementById('stm-room-tag').textContent = `${roomName.toUpperCase()} // TASK CONSOLE`;
    document.getElementById('stm-mission-title').textContent = lab.title;
    document.getElementById('stm-mission-xp').textContent = `+150 XP`;
    document.getElementById('stm-npc-avatar').textContent = '🧑‍💻';
    document.getElementById('stm-npc-name').textContent = 'SRE Operations Dispatch';
    document.getElementById('stm-npc-dialog').textContent = lab.objective;

    this.renderModalSteps(lab);
    if (this.taskModal) this.taskModal.style.display = 'flex';
  }

  renderModalSteps(lab) {
    const container = document.getElementById('stm-steps-container');
    if (!container) return;
    container.innerHTML = '';

    lab.steps.forEach((step, idx) => {
      const isDone = game.getStepDone(lab.id, idx);
      const stepDiv = document.createElement('div');
      stepDiv.className = `stm-step-box${isDone ? ' done' : ''}`;
      stepDiv.id = `stm-step-${idx}`;

      const cmdBox = step.cmd ? `
        <div class="stm-cmd-row">
          <span class="stm-prompt">$</span>
          <span class="stm-cmd-text">${step.cmd}</span>
          <button class="stm-copy-btn" onclick="gameUI.copyCmdText('${step.cmd.replace(/'/g, "\\'")}', this)">copy</button>
        </div>` : '';

      stepDiv.innerHTML = `
        <div class="stm-step-top">
          <div class="stm-step-badge">STEP ${idx + 1}</div>
          <div class="stm-step-title">${step.title}</div>
          <div class="stm-step-tick">${isDone ? '✓' : '○'}</div>
        </div>
        <div class="stm-step-explain">${step.explain}</div>
        ${cmdBox}
        <div class="stm-step-actions">
          <button class="stm-run-btn" onclick="gameUI.runInMiniTerminal('${step.cmd.replace(/'/g, "\\'")}', ${idx})">💻 Execute in Terminal</button>
          <button class="stm-confirm-btn${isDone ? ' undo' : ''}" onclick="gameUI.toggleStepComplete('${lab.id}', ${idx}, this)">
            ${isDone ? '↩ Undo' : '✓ Mark Verified'}
          </button>
        </div>
      `;
      container.appendChild(stepDiv);
    });
  }

  closeTaskModal() {
    if (this.taskModal) this.taskModal.style.display = 'none';
    if (window.cyberAudio) window.cyberAudio.closeTask();
  }

  // ── Step Completion & Terminal Run ──────────────────────────────
  toggleStepComplete(labId, stepIdx, btn) {
    const isDone = game.getStepDone(labId, stepIdx);
    const stepBox = document.getElementById(`stm-step-${stepIdx}`);

    if (isDone) {
      game.unmarkStep(labId, stepIdx);
      if (stepBox) {
        stepBox.classList.remove('done');
        stepBox.querySelector('.stm-step-tick').textContent = '○';
      }
      btn.textContent = '✓ Mark Verified';
      btn.classList.remove('undo');
    } else {
      const result = game.markStep(labId, stepIdx);
      if (stepBox) {
        stepBox.classList.add('done');
        stepBox.querySelector('.stm-step-tick').textContent = '✓';
      }
      btn.textContent = '↩ Undo';
      btn.classList.add('undo');

      // Audio celebration
      if (window.cyberAudio) {
        if (result.questCompleted) window.cyberAudio.taskComplete();
        else window.cyberAudio.playTone(880, 'sine', 0.1, 0.05);
      }

      // Update HUD & Top Task Bar
      this.updateTaskBar();
      this.renderPinnedTasks();
      this.updateHUD();

      // Check if this resolved the active on-call incident!
      const isIncidentLab = window.incidentEngine &&
                            window.incidentEngine.currentIncident &&
                            window.incidentEngine.currentIncident.labId === labId;

      if (isIncidentLab && (result.questCompleted || game.isQuestCompleted(labId))) {
        window.incidentEngine.resolveCurrentIncident();
        setTimeout(() => this.closeTaskModal(), 1400);
      }
    }
  }

  runInMiniTerminal(cmd, stepIdx) {
    // Switch to Terminal tab and prefill
    this.closeTaskModal();
    if (typeof navTo === 'function') navTo('linux');
    const inp = document.getElementById('terminal-input');
    if (inp && cmd) {
      inp.value = cmd;
      inp.focus();
    }
  }

  copyCmdText(cmd, btn) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cmd).then(() => {
        btn.textContent = 'copied!';
        setTimeout(() => btn.textContent = 'copy', 1400);
      });
    }
  }

  // ── Admin Mini-Map Overlay ──────────────────────────────────────
  toggleAdminMap(forceOpen) {
    if (!this.adminMapModal) return;
    const shouldOpen = forceOpen !== undefined ? forceOpen : (this.adminMapModal.style.display !== 'flex');
    this.adminMapModal.style.display = shouldOpen ? 'flex' : 'none';

    if (shouldOpen) {
      if (window.cyberAudio) window.cyberAudio.mapToggle();
      this.renderAdminMapDetails();
    } else {
      if (window.cyberAudio) window.cyberAudio.closeTask();
    }
  }

  renderAdminMapDetails() {
    const playerMarker = document.getElementById('map-player-pin');
    if (playerMarker && window.officeGame) {
      const pinXPct = Math.max(3, Math.min(97, (window.officeGame.player.x / 1650) * 100));
      const pinYPct = Math.max(3, Math.min(97, (window.officeGame.player.y / 1150) * 100));
      playerMarker.style.left = `${pinXPct.toFixed(1)}%`;
      playerMarker.style.top  = `${pinYPct.toFixed(1)}%`;
    }

    // Attach click-to-travel listeners to room blocks on the map
    const roomCoordinates = {
      'server': { x: 250, y: 300, name: 'Cold Datacenter' },
      'noc':    { x: 750, y: 300, name: 'NOC Monitoring' },
      'cloud':  { x: 1300, y: 300, name: 'AWS Cloud Wing' },
      'cafe':   { x: 250, y: 850, name: 'Cafeteria' },
      'dev':    { x: 750, y: 850, name: 'Dev Open Floor' },
      'iac':    { x: 1300, y: 850, name: 'Terraform Foundry' },
      'war':    { x: 750, y: 50,  name: 'Executive War Room' }
    };

    // Remove any previous incident hazard pulse
    document.querySelectorAll('.s-room').forEach(r => r.classList.remove('incident-hazard'));

    // Highlight active incident room on map
    if (window.incidentEngine && window.incidentEngine.currentIncident) {
      const incRoom = window.incidentEngine.currentIncident.room.toLowerCase();
      let mapKey = null;
      if (incRoom.includes('datacenter') || incRoom.includes('server')) mapKey = 'server';
      else if (incRoom.includes('noc')) mapKey = 'noc';
      else if (incRoom.includes('cloud') || incRoom.includes('aws')) mapKey = 'cloud';
      else if (incRoom.includes('cafeteria') || incRoom.includes('breakroom')) mapKey = 'cafe';
      else if (incRoom.includes('dev')) mapKey = 'dev';
      else if (incRoom.includes('terraform') || incRoom.includes('foundry')) mapKey = 'iac';
      else if (incRoom.includes('war')) mapKey = 'war';

      if (mapKey) {
        const targetRoomEl = document.querySelector(`.s-room.${mapKey}`);
        if (targetRoomEl) {
          targetRoomEl.classList.add('incident-hazard');
        }
      }
    }

    Object.entries(roomCoordinates).forEach(([key, coords]) => {
      const roomEl = document.querySelector(`.s-room.${key}`);
      if (roomEl && !roomEl.dataset.wired) {
        roomEl.dataset.wired = '1';
        roomEl.style.cursor = 'pointer';
        roomEl.title = `Click to walk to ${coords.name}`;
        roomEl.addEventListener('click', () => {
          if (window.officeGame) {
            window.officeGame.player.x = coords.x;
            window.officeGame.player.y = coords.y;
            window.officeGame.targetPos = null;
            if (window.cyberAudio) window.cyberAudio.playTone(800, 'sine', 0.08, 0.04);
          }
          this.toggleAdminMap(false);
        });
      }
    });
  }

  // ── Emergency Incident Meeting (War Room) ───────────────────────
  openEmergencyMeeting() {
    if (window.cyberAudio) window.cyberAudio.emergencySiren();
    if (this.emergencyModal) {
      this.emergencyModal.style.display = 'flex';
    }
  }
}

window.gameUI = null;
window.initAmongUsUI = function() {
  window.gameUI = new GameUIManager();
};
