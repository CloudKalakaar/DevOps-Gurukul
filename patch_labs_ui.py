import re

with open('js/labs-ui.js', encoding='utf-8') as f:
    js = f.read()

new_func = """function renderLabsList() {
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
    var catDone = 0, catTot = 0;
    catLabs.forEach(function(lab) {
      var p = labsMgr.getLabProgress(lab.id);
      catDone += p.done; catTot += p.total;
    });
    
    var group = document.createElement('div');
    group.className = 'category-group';
    if (list.children.length === 0) group.classList.add('open');
    
    group.innerHTML = '<div class="category-header"><div style="display:flex;align-items:center;gap:10px;"><div class="category-title">' + cat + '</div></div><div style="display:flex;align-items:center;"><div class="category-stats">' + catDone + '/' + catTot + ' steps</div><div class="category-arrow">▼</div></div></div><div class="category-content"></div>';
    
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
}"""

# regex replace the old renderLabsList function
pattern = re.compile(r'function renderLabsList\(\) \{.*?\n\}', re.DOTALL)
js = pattern.sub(new_func, js, count=1)

with open('js/labs-ui.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Replaced renderLabsList')
