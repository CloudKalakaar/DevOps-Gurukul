// ── Labs UI ─────────────────────────────────────────────────────
function renderLabsList() {
  const list = document.getElementById('labs-list');
  const prog = document.getElementById('labs-overall-progress');
  if (!list) return;
  const total = labsMgr.getTotalProgress();
  prog.textContent = total.done + '/' + total.total + ' steps done';
  list.innerHTML = '';
  
  var categories = {};
  LABS.forEach(function(lab) {
    if (!categories[lab.category]) categories[lab.category] = [];
    categories[lab.category].push(lab);
  });
  
  for (var cat in categories) {
    var catLabs = categories[cat];
    var labsDone = 0;
    catLabs.forEach(function(lab) {
      var p = labsMgr.getLabProgress(lab.id);
      if (p.done === p.total && p.total > 0) labsDone++;
    });
    
    var group = document.createElement('div');
    group.className = 'category-group';
    if (list.children.length === 0) group.classList.add('open');
    
    group.innerHTML = '<div class="category-header"><div style="display:flex;align-items:center;gap:10px;"><div class="category-title">' + cat + '</div></div><div style="display:flex;align-items:center;"><div class="category-stats">' + labsDone + '/' + catLabs.length + ' labs</div><div class="category-arrow">▼</div></div></div><div class="category-content"></div>';
    
    var content = group.querySelector('.category-content');
    group.querySelector('.category-header').addEventListener('click', function(e) {
      e.currentTarget.parentElement.classList.toggle('open');
    });
    
    catLabs.forEach(function(lab) {
      var p = labsMgr.getLabProgress(lab.id);
      var done = p.done, tot = p.total;
      var pct = tot > 0 ? Math.round((done / tot) * 100) : 0;
      var completed = done === tot && tot > 0;
      var card = document.createElement('div');
      card.className = 'lab-card' + (completed ? ' lab-completed' : '');
      card.innerHTML = '<div class="lab-card-top"><div class="lab-num">' + lab.icon + '</div><div class="lab-card-info"><div class="lab-card-title">' + (completed ? '✓ ' : '') + 'Lab ' + lab.num + ': ' + lab.title + '</div><div class="lab-card-meta"><span class="lab-meta-badge">' + lab.category.toUpperCase() + '</span><span>⏱ ' + lab.duration + '</span><span>' + lab.steps.length + ' steps</span></div></div><div class="lab-arrow">›</div></div><div class="lab-progress-bar-wrap"><div class="lab-progress-bar" style="width:' + pct + '%"></div></div><div class="lab-progress-label">' + done + '/' + tot + ' steps ' + (completed ? '✓ complete' : 'completed') + '</div>';
      card.addEventListener('click', function() { showLab(lab.id); });
      content.appendChild(card);
    });
    
    list.appendChild(group);
  }
}

function showLab(labId) {
  var lab = LABS.find(function(l) { return l.id === labId; });
  if (!lab) return;
  currentLabId = labId;
  document.getElementById('labs-list-view').style.display = 'none';
  document.getElementById('labs-detail-view').style.display = 'flex';
  document.getElementById('lab-detail-title').textContent = 'Lab ' + lab.num + ': ' + lab.title;

  var resetBtn = document.getElementById('lab-reset-btn');
  resetBtn.onclick = function() {
    if (confirm('Reset all progress for this lab?')) {
      labsMgr.resetLab(labId);
      showLab(labId);
      renderLabsList();
    }
  };

  var content = document.getElementById('lab-detail-content');
  content.innerHTML = '';

  // Objective
  var obj = document.createElement('div');
  obj.className = 'lab-objective';
  obj.innerHTML = '<div class="lab-objective-label">🎯 OBJECTIVE</div><div class="lab-objective-text">' + lab.objective + '</div>';
  content.appendChild(obj);

  // Theory (collapsible)
  var theory = document.createElement('div');
  theory.className = 'lab-theory';
  theory.innerHTML = '<div class="lab-theory-toggle"><div class="lab-theory-label">📖 THEORY &amp; CONCEPTS</div><div class="lab-theory-arrow">▼</div></div><div class="lab-theory-body">' + lab.theory + '</div>';
  theory.addEventListener('click', function() { theory.classList.toggle('open'); });
  content.appendChild(theory);

  // Steps label
  var stepsLbl = document.createElement('div');
  stepsLbl.className = 'steps-label';
  stepsLbl.textContent = 'Steps (' + lab.steps.length + ')';
  content.appendChild(stepsLbl);

  // Step cards
  var firstIncomplete = -1;
  lab.steps.forEach(function(step, i) {
    var isDone = !!(labsMgr.progress[labId] && labsMgr.progress[labId][i]);
    if (!isDone && firstIncomplete === -1) firstIncomplete = i;
    var card = document.createElement('div');
    card.className = 'step-card' + (isDone ? ' done' : '');
    card.id = 'step-card-' + labId + '-' + i;
    var cmdHtml = step.cmd ? '<div class="step-cmd-label">RUN THIS COMMAND:</div><div class="step-cmd"><span class="step-cmd-prompt">$</span><span class="step-cmd-text">' + step.cmd + '</span><button class="step-cmd-copy" data-cmd="' + step.cmd.replace(/"/g, '&quot;') + '" onclick="copyCmd(this)">copy</button></div>' : '';
    var noteHtml = step.note ? '<div class="step-note">' + step.note + '</div>' : '';
    card.innerHTML = '<div class="step-header"><div class="step-check">' + (isDone ? '✓' : '') + '</div><div class="step-num">STEP ' + String(i + 1).padStart(2, '0') + '</div><div class="step-title">' + step.title + '</div><div class="step-arrow">▼</div></div><div class="step-body"><div class="step-explain">' + step.explain + '</div>' + cmdHtml + noteHtml + '<div class="step-actions"><button class="step-try-btn" data-cmd="' + (step.cmd || '').replace(/"/g, '&quot;') + '" onclick="tryInTerminal(this)">💻 Try in Terminal</button><button class="step-done-btn ' + (isDone ? 'undo' : '') + '" onclick="toggleStep(\'' + labId + '\',' + i + ',this)">' + (isDone ? '↩ Mark Undone' : '✓ Mark Done') + '</button></div></div>';
    card.querySelector('.step-header').addEventListener('click', function() { card.classList.toggle('open'); });
    content.appendChild(card);
  });

  // Auto-open logic
  if (firstIncomplete === 0) {
    theory.classList.add('open');
  } else if (firstIncomplete > 0) {
    var fc = document.getElementById('step-card-' + labId + '-' + firstIncomplete);
    if (fc) fc.classList.add('open');
  }
  content.scrollTop = 0;
}

function showLabsList() {
  currentLabId = null;
  document.getElementById('labs-list-view').style.display = 'flex';
  document.getElementById('labs-detail-view').style.display = 'none';
  renderLabsList();
}

function toggleStep(labId, stepIdx, btn) {
  var card = document.getElementById('step-card-' + labId + '-' + stepIdx);
  var isDone = card.classList.contains('done');
  if (isDone) {
    labsMgr.unmarkStep(labId, stepIdx);
    card.classList.remove('done');
    card.querySelector('.step-check').textContent = '';
    btn.textContent = '✓ Mark Done';
    btn.classList.remove('undo');
  } else {
    labsMgr.markStep(labId, stepIdx);
    card.classList.add('done');
    card.querySelector('.step-check').textContent = '✓';
    btn.textContent = '↩ Mark Undone';
    btn.classList.add('undo');
    var lab = LABS.find(function(l) { return l.id === labId; });
    var next = stepIdx + 1;
    if (lab && next < lab.steps.length) {
      var nextCard = document.getElementById('step-card-' + labId + '-' + next);
      if (nextCard) { nextCard.classList.add('open'); nextCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    }
  }
}

function copyCmd(btn) {
  var cmd = btn.dataset.cmd;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(cmd).then(function() {
      btn.textContent = 'copied!'; btn.classList.add('copied');
      setTimeout(function() { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 1500);
    });
  }
}

function tryInTerminal(btn) {
  var cmd = typeof btn === 'string' ? btn : btn.dataset.cmd;
  document.querySelector('.nav-item[data-section="linux"]').click();
  var inp = document.getElementById('terminal-input');
  if (inp && cmd) { inp.value = cmd; inp.focus(); }
}
