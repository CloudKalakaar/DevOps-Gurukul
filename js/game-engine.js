// SRE Survival — Game Engine
// Handles XP, rank, floor unlock, quest progress

class GameEngine {
  constructor() {
    this._state = this._loadState();
    // Migrate old devops-gurukul progress if present
    this._migrateOldProgress();
  }

  _loadState() {
    try {
      const saved = localStorage.getItem('sre_survival_v1');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
      xp: 0,
      questSteps: {},   // { labId: { stepIdx: true } }
      completed: {},    // { labId: true }
      badgesEarned: [],
      startedAt: Date.now()
    };
  }

  _migrateOldProgress() {
    // If we have old devops-gurukul-progress, award XP for existing completions
    try {
      const old = localStorage.getItem('devops-gurukul-progress');
      if (!old || this._state.migrated) return;
      const oldProg = JSON.parse(old);
      this._state.questSteps = oldProg;
      // Award partial XP for migrated progress
      LABS.forEach(lab => {
        const steps = Object.keys(oldProg[lab.id] || {}).length;
        if (steps >= lab.steps.length && lab.steps.length > 0) {
          this._state.completed[lab.id] = true;
          const floor = this._floorForLab(lab);
          this._state.xp += floor ? floor.xpPerQuest : 100;
        }
      });
      this._state.migrated = true;
      this._save();
    } catch(e) {}
  }

  _save() {
    try {
      localStorage.setItem('sre_survival_v1', JSON.stringify(this._state));
    } catch(e) {}
  }

  _floorForLab(lab) {
    return FLOORS.find(f => f.categories.includes(lab.category)) || null;
  }

  // ── XP & Rank ──────────────────────────────────────────────────
  get xp() { return this._state.xp; }

  get rank() {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (this._state.xp >= RANKS[i].minXP) return RANKS[i];
    }
    return RANKS[0];
  }

  get rankIndex() {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (this._state.xp >= RANKS[i].minXP) return i;
    }
    return 0;
  }

  get nextRank() {
    const idx = this.rankIndex;
    return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
  }

  get xpProgressPct() {
    const cur  = this.rank;
    const next = this.nextRank;
    if (!next) return 100;
    return Math.min(100, Math.round(
      ((this._state.xp - cur.minXP) / (next.minXP - cur.minXP)) * 100
    ));
  }

  get xpToNextRank() {
    const next = this.nextRank;
    return next ? next.minXP - this._state.xp : 0;
  }

  // ── Floor Unlock ────────────────────────────────────────────────
  isFloorUnlocked(floorId) {
    const floor = FLOORS.find(f => f.id === floorId);
    if (!floor) return false;
    return this._state.xp >= floor.xpRequired;
  }

  getFloorProgress(floorId) {
    const floor = FLOORS.find(f => f.id === floorId);
    if (!floor) return { done: 0, total: 0, pct: 0 };
    const labs = LABS.filter(lab => floor.categories.includes(lab.category));
    const done = labs.filter(lab => this._state.completed[lab.id]).length;
    const total = labs.length;
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }

  // ── Quest Progress ───────────────────────────────────────────────
  isQuestCompleted(labId) {
    return !!this._state.completed[labId];
  }

  getStepDone(labId, stepIdx) {
    return !!(this._state.questSteps[labId] && this._state.questSteps[labId][stepIdx]);
  }

  getQuestProgress(labId) {
    const lab = LABS.find(l => l.id === labId);
    if (!lab) return { done: 0, total: 0, pct: 0 };
    const done = Object.keys(this._state.questSteps[labId] || {}).length;
    const total = lab.steps.length;
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }

  markStep(labId, stepIdx) {
    const lab = LABS.find(l => l.id === labId);
    if (!lab) return { xpGained: 0, questCompleted: false, ranked: false };

    if (!this._state.questSteps[labId]) this._state.questSteps[labId] = {};
    this._state.questSteps[labId][stepIdx] = true;

    const doneCount = Object.keys(this._state.questSteps[labId]).length;
    let xpGained = 0;
    let questCompleted = false;
    let oldRankIdx = this.rankIndex;

    if (doneCount >= lab.steps.length && !this._state.completed[labId]) {
      this._state.completed[labId] = true;
      const floor = this._floorForLab(lab);
      xpGained = floor ? floor.xpPerQuest : 100;
      this._state.xp += xpGained;
      questCompleted = true;
    }

    this._save();
    return {
      xpGained,
      questCompleted,
      ranked: this.rankIndex > oldRankIdx,
      rank: this.rank
    };
  }

  unmarkStep(labId, stepIdx) {
    if (!this._state.questSteps[labId]) return;
    delete this._state.questSteps[labId][stepIdx];
    if (this._state.completed[labId]) {
      const lab = LABS.find(l => l.id === labId);
      const floor = lab ? this._floorForLab(lab) : null;
      const xpGained = floor ? floor.xpPerQuest : 100;
      this._state.xp = Math.max(0, this._state.xp - xpGained);
      delete this._state.completed[labId];
    }
    this._save();
  }

  resetQuest(labId) {
    if (this._state.completed[labId]) {
      const lab = LABS.find(l => l.id === labId);
      const floor = lab ? this._floorForLab(lab) : null;
      const xpGained = floor ? floor.xpPerQuest : 100;
      this._state.xp = Math.max(0, this._state.xp - xpGained);
    }
    delete this._state.questSteps[labId];
    delete this._state.completed[labId];
    this._save();
  }

  // ── Badge logic ──────────────────────────────────────────────────
  checkBadge(floorId) {
    const floor  = FLOORS.find(f => f.id === floorId);
    if (!floor || !floor.badge) return null;
    if (this._state.badgesEarned.includes(floor.badge.id)) return null;
    const { done, total } = this.getFloorProgress(floorId);
    if (done >= total && total > 0) {
      this._state.badgesEarned.push(floor.badge.id);
      this._save();
      return floor.badge;
    }
    return null;
  }

  get badges() { return this._state.badgesEarned; }
  get startedAt() { return this._state.startedAt; }
}

window.GameEngine = GameEngine;
