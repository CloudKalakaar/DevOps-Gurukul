// SRE Survival — Quest Data & Campus Architecture
// Maps 110 LABS to Campus Buildings, Floors, and Interactive Office Rooms

const RANKS = [
  { title: 'Probationary SRE', minXP: 0,     color: '#6272a4', icon: '🔰' },
  { title: 'Junior SRE',       minXP: 500,   color: '#50fa7b', icon: '🟢' },
  { title: 'SRE',              minXP: 1500,  color: '#00ff41', icon: '⚡' },
  { title: 'Senior SRE',       minXP: 3500,  color: '#8be9fd', icon: '🔷' },
  { title: 'Staff SRE',        minXP: 6500,  color: '#bd93f9', icon: '💜' },
  { title: 'Principal SRE',    minXP: 10500, color: '#f1fa8c', icon: '⭐' },
  { title: 'Distinguished SRE',minXP: 16000, color: '#ff79c6', icon: '👑' },
];

const BUILDINGS = [
  {
    id: 'all',
    name: 'Full SRE Campus',
    code: 'CAMPUS-ALL',
    icon: '🌐',
    desc: 'All 6 floors & 110 operational missions',
    floorIds: ['rooftop', 'floor4', 'floor3', 'floor2', 'floor1', 'ground'],
    accentColor: '#00ff41',
    accentRgb: '0,255,65'
  },
  {
    id: 'tower',
    name: 'Core Operations Tower',
    code: 'TOWER-01',
    icon: '🏢',
    desc: 'Linux Systems, Server Datacenter & NOC Operations',
    floorIds: ['floor2', 'floor1', 'ground'],
    accentColor: '#00ff41',
    accentRgb: '0,255,65'
  },
  {
    id: 'cloud',
    name: 'AWS Cloud Facility',
    code: 'CLOUD-02',
    icon: '☁️',
    desc: 'Cloud Infrastructure, VPC, IAM & Serverless (30 Labs)',
    floorIds: ['floor3'],
    accentColor: '#ff79c6',
    accentRgb: '255,121,198'
  },
  {
    id: 'foundry',
    name: 'Terraform IaC Foundry',
    code: 'IAC-03',
    icon: '🏗️',
    desc: 'Infrastructure as Code Automation, State & Modules (50 Labs)',
    floorIds: ['floor4'],
    accentColor: '#bd93f9',
    accentRgb: '189,147,249'
  },
  {
    id: 'warroom',
    name: 'Emergency War Room',
    code: 'WAR-04',
    icon: '🚨',
    desc: 'High-Severity Outages, Production Incidents & Disaster Recovery',
    floorIds: ['rooftop'],
    accentColor: '#ff5555',
    accentRgb: '255,85,85'
  }
];

const FLOORS = [
  {
    id: 'ground',
    floorNum: 0,
    label: 'GND',
    name: 'Orientation Lobby & Helpdesk',
    icon: '🏛️',
    buildingId: 'tower',
    accentColor: '#00ff41',
    accentRgb: '0,255,65',
    xpRequired: 0,
    xpPerQuest: 100,
    categories: ['Linux Beginner'],
    npc: {
      name: 'ALEX',
      title: 'Senior SRE — On-Call Lead',
      avatar: '🧑‍💻',
      intro: `Welcome to the SRE Operations Center, recruit. I'm Alex — Senior SRE and your supervisor.\n\nBefore you touch ANY production server, you need Linux fundamentals locked down cold. I've seen junior engineers cause P0 incidents because they couldn't navigate a server without a GUI.\n\nExplore our lobby workstations and prove you're ready for the server room.`,
    },
    badge: { id: 'linux_recruit', name: 'Linux Recruit', icon: '🐧' },
    rooms: [
      { id: 'reception', name: 'Check-In Terminal', icon: '🖥️', desc: 'Filesystem Navigation & Core Tools', labIds: ['b01', 'b02'] },
      { id: 'archives', name: 'Document Archive Stacks', icon: '🗄️', desc: 'File Reading, Head/Tail & Find', labIds: ['b03', 'b04'] },
      { id: 'security_desk', name: 'Permissions Gate', icon: '🔒', desc: 'File Permissions & Copy/Move', labIds: ['b05', 'b06'] },
      { id: 'pipeline_bay', name: 'I/O Stream Workshop', icon: '🔄', desc: 'Redirection, Pipes, Disk & Memory', labIds: ['b07', 'b08'] },
      { id: 'automation_lab', name: 'Bash Scripting Bench', icon: '📜', desc: 'Grep Search & History Shortcuts', labIds: ['b09', 'b10'] }
    ],
    missionDialogue: {
      'b01': `The incident reports from last week are buried somewhere on the server. Before you can find anything, you need to know how to move around a Linux filesystem.\n\nMission: Navigate to the correct directories, understand your location at all times, and don't get lost.`,
      'b02': `Our deployment scripts create dozens of temporary files. Someone left a mess on the staging server. Learn to create, organize, and remove files and directories — clean systems are happy systems.`,
      'b03': `Half our team edits config files without reading them first. That's how bad deployments happen. Learn to read files properly — cat, less, head, tail — before you touch anything.`,
      'b04': `The error logs are full of noise. You need to filter signal from noise using grep and pattern matching. Find the real error buried in thousands of log lines.`,
      'b05': `Our backup scripts chain commands together using pipes and redirections. Master I/O redirection or you'll never understand what those scripts are actually doing.`,
      'b06': `Security audit found world-writable files on the production web server. Fix the permissions before the security team escalates this to management.`,
      'b07': `The server is running out of disk space but nobody knows where it went. Use disk usage tools to diagnose the problem before the database crashes.`,
      'b08': `A runaway process is eating 100% CPU. The app is slowing down. Find the process, identify it, and handle it — but don't kill the wrong thing.`,
      'b09': `Our app reads its config from environment variables. Someone changed them without documentation and now the app behaves differently in prod vs staging. Understand how env vars work.`,
      'b10': `Automation is the SRE way. Repetitive manual tasks are a liability. Write your first shell script to automate something we do every day.`,
    }
  },
  {
    id: 'floor1',
    floorNum: 1,
    label: 'FL 1',
    name: 'Datacenter & Server Room',
    icon: '🖥️',
    buildingId: 'tower',
    accentColor: '#8be9fd',
    accentRgb: '139,233,253',
    xpRequired: 600,
    xpPerQuest: 150,
    categories: ['Linux Intermediate'],
    npc: {
      name: 'MAYA',
      title: 'Linux Systems Engineer',
      avatar: '👩‍🔧',
      intro: `You survived orientation. I'm Maya — I run the physical servers in this building.\n\nThe server room is where things get real. User accounts, process management, scheduled jobs, service daemons — this is the work of keeping systems alive 24/7.\n\nDon't touch the hardware power cords. Do touch everything else.`,
    },
    badge: { id: 'sysadmin', name: 'SysAdmin', icon: '⚙️' },
    rooms: [
      { id: 'user_vault', name: 'Identity & Sudo Vault', icon: '🔑', desc: 'User Accounts, Groups & Escalation', labIds: ['i01', 'i02'] },
      { id: 'process_core', name: 'Process Core Racks', icon: '🧠', desc: 'Resource Monitoring, Top & Signals', labIds: ['i03', 'i04'] },
      { id: 'cron_bay', name: 'Cron & Daemons Bay', icon: '⏰', desc: 'Scheduled Jobs & Systemd Services', labIds: ['i05', 'i06'] },
      { id: 'log_archive', name: 'Log Forensics Station', icon: '📊', desc: 'System Logs & Tar/Gzip Backups', labIds: ['i07', 'i08'] },
      { id: 'network_bay', name: 'Network Switchboard', icon: '🌐', desc: 'Connectivity, Sockets & Open Ports', labIds: ['i09', 'i10'] }
    ],
    missionDialogue: {
      'i01': `A new developer needs a server account with limited access. Create the user, add them to the right groups, and make sure they can't break anything.`,
      'i02': `The sudo configuration is a mess. Some users have too many privileges. Audit and tighten the sudo rules before the next security review.`,
      'i03': `Something is consuming all CPU and memory. The server is crawling. Identify the culprit using process monitoring tools.`,
      'i04': `A runaway job forked 500 child processes. The server is out of file descriptors. Kill the right processes without taking down the whole system.`,
      'i05': `A critical backup job needs to run every night at 2 AM. Set it up in cron and verify it will execute correctly.`,
      'i06': `The nginx web server crashed and didn't restart automatically. Configure it as a managed systemd service so it auto-recovers.`,
      'i07': `The application logs in /var/log are filling up the disk. Analyze the logs to find what's generating so much noise.`,
      'i08': `The weekly database backup needs to be compressed and archived. Master tar, gzip, and zip for backup operations.`,
      'i09': `A server can't reach the database. Network connectivity is down somewhere. Use network troubleshooting tools to diagnose it.`,
      'i10': `A new service is supposed to listen on port 8080 but customers are getting connection refused. Check what ports are actually open and what's listening.`,
    }
  },
  {
    id: 'floor2',
    floorNum: 2,
    label: 'FL 2',
    name: '24/7 NOC Monitoring Center',
    icon: '📡',
    buildingId: 'tower',
    accentColor: '#f1fa8c',
    accentRgb: '241,250,140',
    xpRequired: 2100,
    xpPerQuest: 200,
    categories: ['Advanced OS / Admin'],
    npc: {
      name: 'SIREN',
      title: 'Incident Response Lead',
      avatar: '🚨',
      intro: `Welcome to the NOC. I'm SIREN — Systemic Incident Response ENgine. I never sleep.\n\nNeither do incidents. You'll be managing systemd services, analyzing boot failures, partitioning disks under pressure, and fighting fires at 3 AM.\n\nEvery mission here is an actual scenario from our incident database. Keep our uptime at 99.999%.`,
    },
    badge: { id: 'noc_operator', name: 'NOC Operator', icon: '📟' },
    rooms: [
      { id: 'noc_wall', name: 'Incident Wall Displays', icon: '🖥️', desc: 'Real-time Triage & System Load', labIds: ['a01', 'a02'] },
      { id: 'disk_array', name: 'Storage SAN Bay', icon: '💾', desc: 'Disk Partitions, Filesystems & LVM', labIds: ['a03', 'a04'] },
      { id: 'firewall_matrix', name: 'Firewall Matrix Room', icon: '🛡️', desc: 'Iptables & Security Policies', labIds: ['a05', 'a06'] },
      { id: 'kernel_bay', name: 'Kernel & Boot Bay', icon: '🩺', desc: 'Boot Targets & System Recovery', labIds: ['a07', 'a08'] },
      { id: 'perf_lab', name: 'Hardening & Tuning Lab', icon: '🚀', desc: 'OS Hardening & Performance', labIds: ['a09', 'a10'] }
    ],
    missionDialogue: {}
  },
  {
    id: 'floor3',
    floorNum: 3,
    label: 'FL 3',
    name: 'AWS Cloud Operations Hub',
    icon: '☁️',
    buildingId: 'cloud',
    accentColor: '#ff79c6',
    accentRgb: '255,121,198',
    xpRequired: 3900,
    xpPerQuest: 250,
    categories: ['AWS Fundamentals', 'AWS Networking & Database', 'AWS Serverless & Automation'],
    npc: {
      name: 'NIMBUS',
      title: 'Cloud Infrastructure Lead',
      avatar: '☁️',
      intro: `The Cloud Wing. Our entire global production infrastructure lives here in AWS.\n\nI'm Nimbus. I've seen what happens when people misconfigure IAM policies or leave S3 buckets wide open. Data breaches, runaway $50,000 bills, outages.\n\nYou will master EC2, S3, VPCs, RDS, Lambda, and CloudWatch across 30 live missions. Do it right: Security first, cost second, performance third.`,
    },
    badge: { id: 'cloud_practitioner', name: 'Cloud Practitioner', icon: '☁️' },
    rooms: [
      { id: 'iam_vault', name: 'IAM Security & CLI Gateway', icon: '🔐', desc: 'Credentials, Profiles & Policies (10 Labs)', labIds: [] },
      { id: 'vpc_network', name: 'VPC & Networking Bay', icon: '🌐', desc: 'Subnets, Routing & Databases (10 Labs)', labIds: [] },
      { id: 'serverless_bay', name: 'Serverless & Event Matrix', icon: '⚡', desc: 'Lambda, SQS & CloudWatch (10 Labs)', labIds: [] }
    ],
    missionDialogue: {}
  },
  {
    id: 'floor4',
    floorNum: 4,
    label: 'FL 4',
    name: 'Terraform IaC Foundry',
    icon: '🏗️',
    buildingId: 'foundry',
    accentColor: '#bd93f9',
    accentRgb: '189,147,249',
    xpRequired: 7650,
    xpPerQuest: 300,
    categories: [
      'Terraform Fundamentals & Core Workflow',
      'Terraform Variables, Locals, Data Sources',
      'Terraform Modules & Workspaces',
      'Terraform State Management & Backend',
      'Terraform Advanced & Production Concepts'
    ],
    npc: {
      name: 'HASH',
      title: 'Infrastructure Architect',
      avatar: '🏗️',
      intro: `If you're clicking around in the AWS console, you're doing it wrong.\n\nI'm Hash. I've been writing Infrastructure as Code since before it had a name. Terraform is your weapon. Plan before you apply. NEVER destroy in production without a peer review.\n\nThe IaC Foundry contains 50 rigorous missions. State locking, child modules, remote backends — you will master it all.`,
    },
    badge: { id: 'iac_engineer', name: 'IaC Engineer', icon: '🏗️' },
    rooms: [
      { id: 'tf_core', name: 'Terraform Core Engine Bay', icon: '⚙️', desc: 'Workflow, CLI & Resource Blocks (10 Labs)', labIds: [] },
      { id: 'tf_vars', name: 'Variables & Data Source Lab', icon: '🧩', desc: 'Input Vars, Locals & Lookups (10 Labs)', labIds: [] },
      { id: 'tf_modules', name: 'Reusable Modules Workshop', icon: '📦', desc: 'Child Modules & Workspaces (10 Labs)', labIds: [] },
      { id: 'tf_state', name: 'Remote State & Locking Vault', icon: '🔒', desc: 'S3 Backend & DynamoDB Locks (10 Labs)', labIds: [] },
      { id: 'tf_prod', name: 'Production CI/CD Deck', icon: '🚀', desc: 'Zero-downtime & Lifecycles (10 Labs)', labIds: [] }
    ],
    missionDialogue: {}
  },
  {
    id: 'rooftop',
    floorNum: 5,
    label: 'ROOF',
    name: 'Penthouse Incident War Room',
    icon: '⚡',
    buildingId: 'warroom',
    accentColor: '#ff5555',
    accentRgb: '255,85,85',
    xpRequired: 13650,
    xpPerQuest: 500,
    categories: [],
    npc: {
      name: 'INCIDENT-1',
      title: 'AI Incident Commander',
      avatar: '🤖',
      intro: `You've reached the Penthouse War Room.\n\nI am INCIDENT-1. I've processed 47,000 production incidents. I've seen cascading failures, database corruption, DDoS attacks, and human error at scale.\n\nYour skills will be tested without mercy here. P0 disaster recovery, multi-region failovers, and crisis decisions under pressure. Are you ready?`,
    },
    badge: { id: 'sre_veteran', name: 'SRE Veteran', icon: '⭐' },
    rooms: [
      { id: 'helipad', name: 'Helipad & Satellite Uplink', icon: '🚁', desc: 'Disaster Recovery Command Deck', labIds: [] },
      { id: 'crisis_table', name: 'Crisis Commander Round Table', icon: '🚨', desc: 'P0 Incident Triage & Root Cause', labIds: [] }
    ],
    missionDialogue: {}
  }
];

window.RANKS     = RANKS;
window.BUILDINGS = BUILDINGS;
window.FLOORS    = FLOORS;
