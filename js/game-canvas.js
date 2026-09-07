// SRE Survival — Among Us Style 2D IT Office Campus Game Engine
// Canvas renderer, office room layout, collision physics, player controller, interactive stations

class OfficeGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    // World dimensions
    this.worldWidth  = 1650;
    this.worldHeight = 1150;

    // Camera viewport
    this.camera = { x: 300, y: 300 };

    // Player state (spawns in wide open central hallway)
    this.player = {
      x: 750,
      y: 580,
      radius: 16,
      speed: 4.6,
      vx: 0,
      vy: 0,
      facingRight: true,
      moving: false,
      stepPhase: 0,
      color: '#00ff41',      // SRE Neon Green suit
      visorColor: '#8be9fd', // Cyan reflective visor
      backpackColor: '#0f3d1f',
      lanyardColor: '#ff5555'
    };

    // Target position for click-to-move / touch-to-move
    this.targetPos = null;

    // Visual animated click ping
    this.clickPing = null;

    // Keys pressed
    this.keys = {};

    // Near interactive station
    this.nearStation = null;

    // Pulse animation timer for exclamation marks
    this.animTime = 0;

    // Define rooms, walls & stations
    this.initRooms();
    this.initStations();
    this.initWalls();

    // Prevent player from starting inside any wall
    this.unstuckPlayer();

    // Bind inputs
    this.bindInputs();

    // Handle resize
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Start 60fps loop
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width  = parent.clientWidth  || window.innerWidth;
      this.canvas.height = parent.clientHeight || window.innerHeight;
    }
  }

  // ── Office Departments (Rooms) ──────────────────────────────────
  initRooms() {
    this.rooms = [
      {
        id: 'breakroom',
        name: 'Cafeteria & Breakroom',
        code: 'CAFE-01',
        icon: '☕',
        x: 40, y: 640, w: 420, h: 450,
        floorColor: '#161c28',
        borderColor: '#00ff41',
        category: 'Linux Beginner'
      },
      {
        id: 'dev_floor',
        name: 'Open-Floor Dev Bay',
        code: 'DEV-02',
        icon: '💻',
        x: 520, y: 640, w: 480, h: 450,
        floorColor: '#131b2c',
        borderColor: '#50fa7b',
        category: 'Linux Beginner'
      },
      {
        id: 'server_room',
        name: 'Cold Datacenter / Server Room',
        code: 'SERVER-03',
        icon: '🧊',
        x: 40, y: 80, w: 420, h: 440,
        floorColor: '#0d1829',
        borderColor: '#8be9fd',
        category: 'Linux Intermediate'
      },
      {
        id: 'noc_center',
        name: '24/7 NOC Monitoring Center',
        code: 'NOC-04',
        icon: '📡',
        x: 520, y: 80, w: 480, h: 440,
        floorColor: '#171924',
        borderColor: '#f1fa8c',
        category: 'Advanced OS / Admin'
      },
      {
        id: 'cloud_wing',
        name: 'AWS Cloud Operations Hub',
        code: 'AWS-05',
        icon: '☁️',
        x: 1060, y: 80, w: 540, h: 440,
        floorColor: '#1f162a',
        borderColor: '#ff79c6',
        category: 'AWS Fundamentals'
      },
      {
        id: 'iac_foundry',
        name: 'Terraform IaC Foundry',
        code: 'IAC-06',
        icon: '🏗️',
        x: 1060, y: 640, w: 540, h: 450,
        floorColor: '#1b142d',
        borderColor: '#bd93f9',
        category: 'Terraform Fundamentals & Core Workflow'
      },
      {
        id: 'war_room',
        name: 'Executive War Room & Incident Table',
        code: 'WAR-07',
        icon: '🚨',
        x: 640, y: 15, w: 240, h: 65,
        floorColor: '#281116',
        borderColor: '#ff5555',
        category: 'Advanced OS / Admin'
      }
    ];
  }

  // ── Interactive Workstations & Server Racks ─────────────────────
  initStations() {
    this.stations = [
      // Breakroom Stations
      {
        id: 'station_kiosk',
        name: 'Orientation Check-In Kiosk',
        room: 'Cafeteria & Breakroom',
        x: 130, y: 720, w: 55, h: 36,
        icon: '🖥️',
        category: 'Linux Beginner',
        hint: 'Filesystem navigation & path missions (pwd, ls, cd)',
        color: '#00ff41'
      },
      {
        id: 'station_coffee',
        name: 'Breakroom Coffee Bar & Files Terminal',
        room: 'Cafeteria & Breakroom',
        x: 330, y: 720, w: 60, h: 36,
        icon: '☕',
        category: 'Linux Beginner',
        hint: 'File manipulation (touch, mkdir, rm, cp)',
        color: '#00ff41'
      },

      // Open-Floor Dev Bay Stations
      {
        id: 'station_dev_a',
        name: 'Engineering Desk Alpha',
        room: 'Open-Floor Dev Bay',
        x: 630, y: 720, w: 70, h: 45,
        icon: '💻',
        category: 'Linux Beginner',
        hint: 'Permissions & Redirection (chmod, grep, pipes)',
        color: '#50fa7b'
      },
      {
        id: 'station_dev_b',
        name: 'Automation & Scripting Workstation',
        room: 'Open-Floor Dev Bay',
        x: 830, y: 720, w: 70, h: 45,
        icon: '📜',
        category: 'Linux Beginner',
        hint: 'Bash scripting & Environment variables',
        color: '#50fa7b'
      },

      // Server Room / Datacenter (Electrical) Stations
      {
        id: 'station_rack_proc',
        name: 'Server Core Rack A1 — Process Monitor',
        room: 'Cold Datacenter / Server Room',
        x: 140, y: 170, w: 45, h: 80,
        icon: '🧠',
        category: 'Linux Intermediate',
        hint: 'CPU load & runaway process triage (ps, top, kill)',
        color: '#8be9fd'
      },
      {
        id: 'station_rack_sysd',
        name: 'Server Core Rack B2 — Systemd Daemons',
        room: 'Cold Datacenter / Server Room',
        x: 300, y: 170, w: 45, h: 80,
        icon: '⚙️',
        category: 'Linux Intermediate',
        hint: 'Service management & cron jobs (systemctl, cron)',
        color: '#8be9fd'
      },
      {
        id: 'station_rack_auth',
        name: 'Security Vault Console — Sudo & Users',
        room: 'Cold Datacenter / Server Room',
        x: 220, y: 360, w: 65, h: 40,
        icon: '🔑',
        category: 'Linux Intermediate',
        hint: 'User accounts, groups & sudo privileges',
        color: '#8be9fd'
      },

      // 24/7 NOC Center Stations
      {
        id: 'station_noc_wall',
        name: 'Incident Video Wall — Main Display',
        room: '24/7 NOC Monitoring Center',
        x: 720, y: 130, w: 100, h: 30,
        icon: '🖥️',
        category: 'Advanced OS / Admin',
        hint: 'Real-time alert triage & production incidents',
        color: '#f1fa8c'
      },
      {
        id: 'station_noc_logs',
        name: 'Log Forensics Desk',
        room: '24/7 NOC Monitoring Center',
        x: 640, y: 260, w: 65, h: 45,
        icon: '📊',
        category: 'Advanced OS / Admin',
        hint: '/var/log analysis & system crash dumps',
        color: '#f1fa8c'
      },
      {
        id: 'station_noc_net',
        name: 'Network Switchboard & Firewall',
        room: '24/7 NOC Monitoring Center',
        x: 830, y: 260, w: 65, h: 45,
        icon: '🌐',
        category: 'Advanced OS / Admin',
        hint: 'Socket routing, ports & iptables rules',
        color: '#f1fa8c'
      },

      // AWS Cloud Operations Hub Stations
      {
        id: 'station_aws_iam',
        name: 'AWS CLI & IAM Identity Gateway',
        room: 'AWS Cloud Operations Hub',
        x: 1180, y: 180, w: 70, h: 45,
        icon: '🔐',
        category: 'AWS Fundamentals',
        hint: 'AWS configure, credentials & IAM policies (30 Labs)',
        color: '#ff79c6'
      },
      {
        id: 'station_aws_vpc',
        name: 'VPC Routing & Subnet Console',
        room: 'AWS Cloud Operations Hub',
        x: 1380, y: 180, w: 70, h: 45,
        icon: '🌐',
        category: 'AWS Networking & Database',
        hint: 'VPC subnets, route tables, RDS databases',
        color: '#ff79c6'
      },
      {
        id: 'station_aws_serverless',
        name: 'Serverless Lambda Matrix',
        room: 'AWS Cloud Operations Hub',
        x: 1280, y: 330, w: 80, h: 45,
        icon: '⚡',
        category: 'AWS Serverless & Automation',
        hint: 'Lambda functions, SQS queues, CloudWatch',
        color: '#ff79c6'
      },

      // Terraform IaC Foundry Stations
      {
        id: 'station_tf_core',
        name: 'Terraform Plan & Apply Terminal',
        room: 'Terraform IaC Foundry',
        x: 1180, y: 720, w: 75, h: 45,
        icon: '🏗️',
        category: 'Terraform Fundamentals & Core Workflow',
        hint: 'Core workflow: init, plan, apply, destroy (50 Labs)',
        color: '#bd93f9'
      },
      {
        id: 'station_tf_state',
        name: 'Remote State & DynamoDB Vault',
        room: 'Terraform IaC Foundry',
        x: 1380, y: 720, w: 75, h: 45,
        icon: '🔒',
        category: 'Terraform State Management & Backend',
        hint: 'S3 remote state storage & state locking',
        color: '#bd93f9'
      },
      {
        id: 'station_tf_modules',
        name: 'Child Modules Workbench',
        room: 'Terraform IaC Foundry',
        x: 1280, y: 880, w: 80, h: 45,
        icon: '📦',
        category: 'Terraform Modules & Workspaces',
        hint: 'Reusable modules, environments & workspaces',
        color: '#bd93f9'
      },

      // Executive War Room Emergency Button
      {
        id: 'station_emergency',
        name: 'EMERGENCY INCIDENT BUTTON',
        room: 'Executive War Room & Incident Table',
        x: 740, y: 35, w: 40, h: 25,
        icon: '🚨',
        category: 'Advanced OS / Admin',
        isEmergency: true,
        hint: 'Call Emergency Meeting / P0 Production Incident Briefing',
        color: '#ef4444'
      }
    ];
  }

  // ── Collision Walls with generous open doorways ─────────────────
  initWalls() {
    this.walls = [];

    // Outer boundary walls
    this.walls.push({ x: 20, y: 10, w: 1610, h: 10 });                     // Top outer
    this.walls.push({ x: 20, y: 1130, w: 1610, h: 10 });                   // Bottom outer
    this.walls.push({ x: 20, y: 10, w: 10, h: 1130 });                     // Left outer
    this.walls.push({ x: 1620, y: 10, w: 10, h: 1130 });                   // Right outer

    // 1. Datacenter (Left-Top) Walls — Wide doorway at y: 270-370 (100px)
    this.walls.push({ x: 460, y: 80,  w: 10, h: 190 });
    this.walls.push({ x: 460, y: 370, w: 10, h: 150 });
    // Bottom wall with 120px doorway at x: 200-320
    this.walls.push({ x: 40,  y: 520, w: 160, h: 10 });
    this.walls.push({ x: 320, y: 520, w: 140, h: 10 });

    // 2. Cafeteria / Breakroom (Left-Bottom) Walls — Wide doorway at y: 780-880
    this.walls.push({ x: 460, y: 640, w: 10, h: 140 });
    this.walls.push({ x: 460, y: 880, w: 10, h: 210 });
    // Top wall with 120px doorway at x: 200-320
    this.walls.push({ x: 40,  y: 640, w: 160, h: 10 });
    this.walls.push({ x: 320, y: 640, w: 140, h: 10 });

    // 3. NOC Center (Center-Top) — Bottom doorway at x: 680-820 (140px wide open entrance)
    this.walls.push({ x: 520, y: 520, w: 160, h: 10 });
    this.walls.push({ x: 820, y: 520, w: 180, h: 10 });
    // Side walls
    this.walls.push({ x: 520, y: 80, w: 10, h: 440 });
    this.walls.push({ x: 1000, y: 80, w: 10, h: 440 });

    // 4. Open-Floor Dev Bay (Center-Bottom) — Top doorway at x: 680-820 (140px wide open entrance)
    this.walls.push({ x: 520, y: 640, w: 160, h: 10 });
    this.walls.push({ x: 820, y: 640, w: 180, h: 10 });
    // Side walls
    this.walls.push({ x: 520, y: 640, w: 10, h: 450 });
    this.walls.push({ x: 1000, y: 640, w: 10, h: 450 });

    // 5. AWS Cloud Wing (Right-Top) Walls — Doorway at y: 270-370 (100px)
    this.walls.push({ x: 1060, y: 80,  w: 10, h: 190 });
    this.walls.push({ x: 1060, y: 370, w: 10, h: 150 });
    // Bottom wall with 120px doorway at x: 1220-1340
    this.walls.push({ x: 1060, y: 520, w: 160, h: 10 });
    this.walls.push({ x: 1340, y: 520, w: 260, h: 10 });

    // 6. Terraform Foundry (Right-Bottom) Walls — Doorway at y: 780-880
    this.walls.push({ x: 1060, y: 640, w: 10, h: 140 });
    this.walls.push({ x: 1060, y: 880, w: 10, h: 210 });
    // Top wall with 120px doorway at x: 1220-1340
    this.walls.push({ x: 1060, y: 640, w: 160, h: 10 });
    this.walls.push({ x: 1340, y: 640, w: 260, h: 10 });

    // Notice: Central hallway running x: 40 to 1600 between y: 530 and y: 630 is 100% UNBLOCKED!
  }

  // Ensure player is never stuck inside any wall
  unstuckPlayer() {
    const r = this.player.radius;
    for (const w of this.walls) {
      if (this.player.x + r > w.x && this.player.x - r < w.x + w.w &&
          this.player.y + r > w.y && this.player.y - r < w.y + w.h) {
        // Safe central hallway coordinates
        this.player.x = 750;
        this.player.y = 580;
        this.player.vx = 0;
        this.player.vy = 0;
        break;
      }
    }
  }

  // ── Input Listeners ─────────────────────────────────────────────
  bindInputs() {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      this.keys[key] = true;

      // Interaction hotkeys: Space or E triggers [USE]
      if (e.code === 'Space' || key === 'e') {
        if (this.nearStation) {
          e.preventDefault();
          this.triggerStationAction(this.nearStation);
        }
      }
      // 'M' toggles the mini-map
      if (key === 'm') {
        if (window.gameUI && typeof window.gameUI.toggleAdminMap === 'function') {
          window.gameUI.toggleAdminMap();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Mouse click on canvas
    this.canvas.addEventListener('mousedown', (e) => {
      this.handlePointerClick(e.clientX, e.clientY);
    });

    // Touch click on canvas
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        this.handlePointerClick(t.clientX, t.clientY);
      }
    }, { passive: true });

    // Touch drag movement
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.targetPos = {
          x: t.clientX - rect.left + this.camera.x,
          y: t.clientY - rect.top  + this.camera.y
        };
      }
    }, { passive: true });
  }

  handlePointerClick(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = clientX - rect.left + this.camera.x;
    const clickY = clientY - rect.top  + this.camera.y;

    // 1. Did the user click directly on any station or its exclamation mark?
    for (const st of this.stations) {
      const centerX = st.x + st.w / 2;
      const centerY = st.y + st.h / 2;
      const dist = Math.hypot(clickX - centerX, clickY - centerY);

      // Station hit test
      if (dist < 48) {
        // Move near station
        const walkX = st.x < 750 ? st.x + st.w + 22 : st.x - 22;
        const walkY = centerY;
        this.player.x = walkX;
        this.player.y = walkY;
        this.targetPos = null;
        this.nearStation = st;
        this.triggerStationAction(st);
        return;
      }
    }

    // 2. Set target destination for character to walk to
    this.targetPos = { x: clickX, y: clickY };
    this.clickPing = { x: clickX, y: clickY, radius: 4, alpha: 1 };
    if (window.cyberAudio) window.cyberAudio.playTone(600, 'sine', 0.04, 0.02);
  }

  // ── Physics & Smooth Collision Sliding ──────────────────────────
  update(dt) {
    this.animTime += dt;

    let dx = 0;
    let dy = 0;

    // 1. Keyboard input
    if (this.keys['w'] || this.keys['arrowup'])    dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown'])  dy += 1;
    if (this.keys['a'] || this.keys['arrowleft'])  dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;

    // 2. Mouse/Touch Target navigation
    if (this.targetPos && (dx === 0 && dy === 0)) {
      const distToTarget = Math.hypot(this.targetPos.x - this.player.x, this.targetPos.y - this.player.y);
      if (distToTarget > 14) {
        dx = (this.targetPos.x - this.player.x) / distToTarget;
        dy = (this.targetPos.y - this.player.y) / distToTarget;
      } else {
        this.targetPos = null;
      }
    }

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    // Update velocity with smooth acceleration
    const accel = 0.32;
    this.player.vx += (dx * this.player.speed - this.player.vx) * accel;
    this.player.vy += (dy * this.player.speed - this.player.vy) * accel;

    // Check movement
    const isMoving = Math.hypot(this.player.vx, this.player.vy) > 0.35;
    this.player.moving = isMoving;

    if (isMoving) {
      this.player.stepPhase += dt * 14;
      if (Math.abs(this.player.vx) > 0.15) {
        this.player.facingRight = this.player.vx > 0;
      }
      // Play footstep audio
      if (window.cyberAudio) window.cyberAudio.footstep();
    } else {
      this.player.stepPhase = 0;
    }

    // Proposed new positions
    let proposedX = this.player.x + this.player.vx;
    let proposedY = this.player.y + this.player.vy;

    // Resolve collision with wall sliding (X and Y handled independently!)
    const r = this.player.radius;

    // Test X movement
    let blockedX = false;
    for (const w of this.walls) {
      if (proposedX + r > w.x && proposedX - r < w.x + w.w &&
          this.player.y + r > w.y && this.player.y - r < w.y + w.h) {
        blockedX = true;
        break;
      }
    }
    if (!blockedX) {
      this.player.x = Math.max(30, Math.min(this.worldWidth - 30, proposedX));
    } else {
      this.player.vx = 0;
    }

    // Test Y movement
    let blockedY = false;
    for (const w of this.walls) {
      if (this.player.x + r > w.x && this.player.x - r < w.x + w.w &&
          proposedY + r > w.y && proposedY - r < w.y + w.h) {
        blockedY = true;
        break;
      }
    }
    if (!blockedY) {
      this.player.y = Math.max(30, Math.min(this.worldHeight - 30, proposedY));
    } else {
      this.player.vy = 0;
    }

    // Animate click ping ring
    if (this.clickPing) {
      this.clickPing.radius += dt * 36;
      this.clickPing.alpha  -= dt * 2.2;
      if (this.clickPing.alpha <= 0) {
        this.clickPing = null;
      }
    }

    // Smooth Camera tracking
    const targetCamX = this.player.x - this.canvas.width / 2;
    const targetCamY = this.player.y - this.canvas.height / 2;
    this.camera.x += (targetCamX - this.camera.x) * 0.14;
    this.camera.y += (targetCamY - this.camera.y) * 0.14;

    // Check station proximity
    this.checkStationProximity();
  }

  // Check if player is near any interactive station
  checkStationProximity() {
    let closestStation = null;
    let minDistance = 78; // interaction radius

    for (const st of this.stations) {
      const centerX = st.x + st.w / 2;
      const centerY = st.y + st.h / 2;
      const d = Math.hypot(this.player.x - centerX, this.player.y - centerY);
      if (d < minDistance) {
        closestStation = st;
        minDistance = d;
      }
    }

    if (closestStation !== this.nearStation) {
      this.nearStation = closestStation;
      if (window.gameUI && typeof window.gameUI.setNearStation === 'function') {
        window.gameUI.setNearStation(closestStation);
      }
      if (closestStation && window.cyberAudio) {
        window.cyberAudio.stationNear();
      }
    }
  }

  // ── Render ──────────────────────────────────────────────────────
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    // Translate camera
    this.ctx.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));

    // 1. Draw Hallways & Base Floor
    this.drawHallways();

    // 2. Draw Department Rooms
    this.drawRooms();

    // 3. Draw Interior Furniture & Server Racks
    this.drawFurniture();

    // 4. Draw Stations & Pulsing Among Us Exclamation Marks
    this.drawStations();

    // 5. Draw Walls & Doorway Openings
    this.drawWalls();

    // 6. Draw Animated Click Ping Target
    this.drawClickPing();

    // 7. Draw Player (SRE Engineer Crewmate)
    this.drawPlayer();

    // 8. Draw Incident Waypoint Compass HUD
    this.drawHUDNavigation();

    this.ctx.restore();
  }

  drawHallways() {
    // Background tech grid
    this.ctx.fillStyle = '#070b14';
    this.ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);

    // Corridor hazard stripes
    this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.05)';
    this.ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < this.worldWidth; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.worldHeight);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.worldHeight; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.worldWidth, y);
      this.ctx.stroke();
    }

    // Floor navigation directional arrows in hallway
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    this.ctx.font = 'bold 12px "JetBrains Mono", monospace';
    this.ctx.fillText('◄ DATACENTER', 320, 585);
    this.ctx.fillText('NOC CENTER ▲', 710, 500);
    this.ctx.fillText('DEV BAY ▼', 720, 665);
    this.ctx.fillText('CLOUD & IAC ►', 1080, 585);
  }

  drawRooms() {
    this.rooms.forEach(rm => {
      // Room floor tile
      this.ctx.fillStyle = rm.floorColor;
      this.ctx.fillRect(rm.x, rm.y, rm.w, rm.h);

      // Inner room grid
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      this.ctx.lineWidth = 1;
      for (let rx = rm.x + 30; rx < rm.x + rm.w; rx += 30) {
        this.ctx.beginPath();
        this.ctx.moveTo(rx, rm.y);
        this.ctx.lineTo(rx, rm.y + rm.h);
        this.ctx.stroke();
      }

      // Department neon floor label
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
      this.ctx.font = 'bold 15px "JetBrains Mono", monospace';
      this.ctx.fillText(`${rm.icon} ${rm.name.toUpperCase()}`, rm.x + 20, rm.y + 30);

      // Department code tag
      this.ctx.fillStyle = rm.borderColor;
      this.ctx.font = 'bold 10px "JetBrains Mono", monospace';
      this.ctx.fillText(`// SEC-${rm.code}`, rm.x + 20, rm.y + 46);
    });
  }

  drawFurniture() {
    // 1. Cafeteria: Breakroom tables & coffee bar
    this.drawTable(100, 840, 110, 50, '#243048');
    this.drawTable(260, 840, 110, 50, '#243048');

    // 2. Open Floor: Workstation desk clusters
    this.drawDeskCluster(600, 840, 100, 60);
    this.drawDeskCluster(780, 840, 100, 60);

    // 3. Datacenter: Tall Server Racks with blinking LEDs
    this.drawServerRack(120, 280, 40, 90, '#00ff41');
    this.drawServerRack(280, 280, 40, 90, '#8be9fd');

    // 4. NOC: Incident curved video wall
    this.drawVideoWall(620, 100, 280, 25);

    // 5. Cloud Wing: VPC racks & cloud servers
    this.drawServerRack(1160, 250, 40, 75, '#ff79c6');
    this.drawServerRack(1360, 250, 40, 75, '#ff79c6');

    // 6. IaC Foundry: Build terminals
    this.drawDeskCluster(1260, 800, 110, 60);
  }

  drawTable(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
    this.ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    this.ctx.strokeRect(x, y, w, h);
  }

  drawDeskCluster(x, y, w, h) {
    this.ctx.fillStyle = '#1c283c';
    this.ctx.fillRect(x, y, w, h);
    this.ctx.strokeStyle = '#2a3d5c';
    this.ctx.strokeRect(x, y, w, h);

    // Dual monitors on desk
    this.ctx.fillStyle = '#060a12';
    this.ctx.fillRect(x + 15, y + 10, 30, 8);
    this.ctx.fillRect(x + 55, y + 10, 30, 8);
    // Screen glow
    this.ctx.fillStyle = '#50fa7b';
    this.ctx.fillRect(x + 17, y + 11, 26, 3);
    this.ctx.fillStyle = '#8be9fd';
    this.ctx.fillRect(x + 57, y + 11, 26, 3);
  }

  drawServerRack(x, y, w, h, ledColor) {
    this.ctx.fillStyle = '#0a101d';
    this.ctx.fillRect(x, y, w, h);
    this.ctx.strokeStyle = '#1d2f4d';
    this.ctx.strokeRect(x, y, w, h);

    // Server rack shelves with blinking LED diodes
    const shelves = 5;
    const shH = (h - 10) / shelves;
    for (let i = 0; i < shelves; i++) {
      const sy = y + 6 + i * shH;
      this.ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      this.ctx.strokeRect(x + 4, sy, w - 8, shH - 2);

      // Blinking LED
      const blink = (Math.sin(this.animTime * 4 + i) + 1) / 2 > 0.35;
      this.ctx.fillStyle = blink ? ledColor : 'rgba(0,0,0,0.5)';
      this.ctx.fillRect(x + 8, sy + 3, 4, 3);
      this.ctx.fillStyle = !blink ? '#50fa7b' : 'rgba(0,0,0,0.5)';
      this.ctx.fillRect(x + 16, sy + 3, 4, 3);
    }
  }

  drawVideoWall(x, y, w, h) {
    this.ctx.fillStyle = '#060a12';
    this.ctx.fillRect(x, y, w, h);
    this.ctx.strokeStyle = '#f1fa8c';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, w, h);

    // Live waveforms
    this.ctx.strokeStyle = 'rgba(241, 250, 140, 0.8)';
    this.ctx.beginPath();
    for (let px = x + 10; px < x + w - 10; px += 10) {
      const py = y + h / 2 + Math.sin(this.animTime * 6 + px * 0.1) * 7;
      if (px === x + 10) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.stroke();
  }

  drawWalls() {
    this.ctx.fillStyle = '#1e293b';
    this.ctx.strokeStyle = '#0f172a';
    this.ctx.lineWidth = 2;

    this.walls.forEach(w => {
      this.ctx.fillRect(w.x, w.y, w.w, w.h);
      this.ctx.strokeRect(w.x, w.y, w.w, w.h);
    });

    // Draw glowing green threshold lines for doorways
    this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.4)';
    this.ctx.lineWidth = 3;
    // Datacenter door
    this.ctx.beginPath(); this.ctx.moveTo(200, 525); this.ctx.lineTo(320, 525); this.ctx.stroke();
    // Breakroom door
    this.ctx.beginPath(); this.ctx.moveTo(200, 645); this.ctx.lineTo(320, 645); this.ctx.stroke();
    // NOC door
    this.ctx.beginPath(); this.ctx.moveTo(680, 525); this.ctx.lineTo(820, 525); this.ctx.stroke();
    // Dev bay door
    this.ctx.beginPath(); this.ctx.moveTo(680, 645); this.ctx.lineTo(820, 645); this.ctx.stroke();
    // Cloud wing door
    this.ctx.beginPath(); this.ctx.moveTo(1220, 525); this.ctx.lineTo(1340, 525); this.ctx.stroke();
    // Foundry door
    this.ctx.beginPath(); this.ctx.moveTo(1220, 645); this.ctx.lineTo(1340, 645); this.ctx.stroke();
  }

  drawStations() {
    const isIncident = (st) => window.incidentEngine && window.incidentEngine.isStationDistressed(st.id);

    this.stations.forEach(st => {
      const isNear = (this.nearStation === st);
      const isDistressed = isIncident(st);

      // Station base pad
      this.ctx.save();

      if (isDistressed) {
        // Red flashing emergency hazard glow!
        const pulse = (Math.sin(this.animTime * 8) + 1) / 2;
        this.ctx.shadowColor = '#ef4444';
        this.ctx.shadowBlur = 24 + pulse * 18;
        this.ctx.fillStyle = '#ef4444';
        this.ctx.strokeStyle = '#fee2e2';
        this.ctx.lineWidth = 3.5;
      } else if (isNear) {
        // Glowing interaction halo
        this.ctx.shadowColor = st.color;
        this.ctx.shadowBlur = 18;
        this.ctx.fillStyle = st.color;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2.5;
      } else {
        // Calm dormant station
        this.ctx.fillStyle = '#111827';
        this.ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        this.ctx.lineWidth = 1;
      }

      this.ctx.fillRect(st.x, st.y, st.w, st.h);
      this.ctx.strokeRect(st.x, st.y, st.w, st.h);

      // Icon on station
      this.ctx.fillStyle = isDistressed ? '#ffffff' : (isNear ? '#060910' : '#94a3b8');
      this.ctx.font = 'bold 13px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(st.icon, st.x + st.w / 2, st.y + st.h / 2 + 5);
      this.ctx.restore();

      // ONLY the active distressed station has the emergency beacon!
      if (isDistressed) {
        const bounce = Math.sin(this.animTime * 8) * 6;
        const exclaimX = st.x + st.w / 2;
        const exclaimY = st.y - 20 + bounce;

        this.ctx.save();
        this.ctx.shadowColor = '#ef4444';
        this.ctx.shadowBlur = 22;

        // Red emergency alert circle
        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(exclaimX, exclaimY, 13, 0, Math.PI * 2);
        this.ctx.fill();

        // Siren icon
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🚨', exclaimX, exclaimY);
        this.ctx.restore();
      }
    });
  }

  drawHUDNavigation() {
    if (!window.incidentEngine || !window.incidentEngine.currentIncident) return;
    const waypoint = window.incidentEngine.getWaypointToIncident(this.player.x, this.player.y);
    if (!waypoint) return;

    const p = this.player;

    // Draw directional pointer ring around player
    const pointerDist = 36;
    const arrowX = p.x + Math.cos(waypoint.angle) * pointerDist;
    const arrowY = p.y + Math.sin(waypoint.angle) * pointerDist;

    this.ctx.save();
    this.ctx.translate(arrowX, arrowY);
    this.ctx.rotate(waypoint.angle);

    this.ctx.fillStyle = '#ef4444';
    this.ctx.shadowColor = '#ef4444';
    this.ctx.shadowBlur = 14;

    this.ctx.beginPath();
    this.ctx.moveTo(10, 0);
    this.ctx.lineTo(-6, -6);
    this.ctx.lineTo(-3, 0);
    this.ctx.lineTo(-6, 6);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();

    // Floating distance badge above player
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    this.ctx.strokeStyle = '#ef4444';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.roundRect(p.x - 65, p.y - 42, 130, 20, 5);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#fca5a5';
    this.ctx.font = 'bold 9px "JetBrains Mono", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(`🚨 ${waypoint.distance}m // ${waypoint.room.split(' ')[0]}`, p.x, p.y - 31);
    this.ctx.restore();
  }

  drawClickPing() {
    if (!this.clickPing) return;
    this.ctx.save();
    this.ctx.strokeStyle = `rgba(0, 255, 65, ${Math.max(0, this.clickPing.alpha)})`;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.clickPing.x, this.clickPing.y, this.clickPing.radius, 0, Math.PI * 2);
    this.ctx.stroke();

    // Crosshair dot in center
    this.ctx.fillStyle = `rgba(0, 255, 65, ${Math.max(0, this.clickPing.alpha)})`;
    this.ctx.beginPath();
    this.ctx.arc(this.clickPing.x, this.clickPing.y, 3, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawPlayer() {
    const p = this.player;
    const footBob = p.moving ? Math.sin(p.stepPhase) * 3 : 0;

    this.ctx.save();
    this.ctx.translate(p.x, p.y);

    // Drop shadow
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 17, p.radius * 1.15, p.radius * 0.5, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Flip character left or right
    if (!p.facingRight) {
      this.ctx.scale(-1, 1);
    }

    // 1. Little animated Feet (Among Us style)
    this.ctx.fillStyle = '#0c2415';
    // Left foot
    this.ctx.beginPath();
    this.ctx.roundRect(-12, 11 + footBob, 10, 8, 4);
    this.ctx.fill();
    // Right foot
    this.ctx.beginPath();
    this.ctx.roundRect(2, 11 - footBob, 10, 8, 4);
    this.ctx.fill();

    // 2. Tech Backpack / Datapad Battery on back
    this.ctx.fillStyle = p.backpackColor;
    this.ctx.beginPath();
    this.ctx.roundRect(-18, -10, 8, 22, 4);
    this.ctx.fill();
    this.ctx.strokeStyle = '#05180c';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // 3. Crewmate Body (Pill shaped SRE suit)
    this.ctx.fillStyle = p.color;
    this.ctx.beginPath();
    this.ctx.roundRect(-12, -18, 24, 31, [12, 12, 6, 6]);
    this.ctx.fill();
    this.ctx.strokeStyle = '#0a3618';
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    // 4. Large Shiny Visor (Among Us eye shield)
    this.ctx.fillStyle = p.visorColor;
    this.ctx.beginPath();
    this.ctx.roundRect(0, -12, 16, 12, 6);
    this.ctx.fill();
    this.ctx.strokeStyle = '#052b36';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Visor reflection highlight
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    this.ctx.beginPath();
    this.ctx.ellipse(8, -10, 5, 2, -0.3, 0, Math.PI * 2);
    this.ctx.fill();

    // 5. IT ID Badge Lanyard
    this.ctx.strokeStyle = p.lanyardColor;
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(-4, -6);
    this.ctx.lineTo(2, 4);
    this.ctx.stroke();

    // Little white badge card
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 4, 6, 8);

    this.ctx.restore();
  }

  // ── Trigger Station Task Modal ──────────────────────────────────
  triggerStationAction(station) {
    if (!station) return;
    if (window.cyberAudio) window.cyberAudio.openTask();
    if (window.gameUI && typeof window.gameUI.openStationTaskModal === 'function') {
      window.gameUI.openStationTaskModal(station);
    }
  }

  // ── Main Game Loop ──────────────────────────────────────────────
  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.loop);
  }
}

window.OfficeGame = OfficeGame;
