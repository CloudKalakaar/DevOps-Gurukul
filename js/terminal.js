class Terminal {
  constructor(fs, pkgManager) {
    this.fs = fs;
    this.pkg = pkgManager;
    this.history = [];
    this.histIndex = -1;
    this.variables = {};
  }

  run(input) {
    input = input.trim();
    if (!input) return '';
    this.history.unshift(input);
    this.histIndex = -1;

    // Handle echo with redirection (echo "text" > file)
    const redirMatch = input.match(/^echo\s+(.*?)\s*(>>?)\s*(\S+)$/);
    if (redirMatch) {
      const content = redirMatch[1].replace(/^['"]|['"]$/g,'');
      const append  = redirMatch[2] === '>>';
      const target  = this.fs.resolvePath(redirMatch[3]);
      const parent  = this.fs.getDirName(target);
      if (!this.fs.fs[parent]) return `bash: ${redirMatch[3]}: No such file or directory`;
      if (!this.fs.fs[target]) { this.fs.fs[parent].children.push(this.fs.getBaseName(target)); }
      this.fs.fs[target] = { type:'file', content: append ? ((this.fs.fs[target]?.content||'') + content + '\n') : content + '\n' };
      this.fs.save();
      return '';
    }

    const [cmd, ...args] = this.parseArgs(input);

    // Check installed package commands first
    if (this.pkg) {
      const pkgCmd = this.pkg.getCommand(cmd);
      if (pkgCmd) {
        const result = pkgCmd(args);
        if (result === '__TREE__') return this.cmdTree(args);
        return result;
      }
    }

    const handlers = {
      pwd: () => this.fs.cwd,
      echo: () => {
        let a = args;
        if (a[0] === '-e') {
          a = a.slice(1);
          return a.map(x => x.replace(/\\n/g, '\n')).join(' ');
        }
        return a.map(a => a.replace(/\$(\w+)/g, (_, k) => this.fs.env[k] || this.variables[k] || '')).join(' ');
      },
      clear: () => '__CLEAR__',
      help: () => this.cmdHelp(),
      ls: () => this.cmdLs(args),
      cd: () => this.cmdCd(args),
      cat: () => this.cmdCat(args),
      mkdir: () => this.cmdMkdir(args),
      touch: () => this.cmdTouch(args),
      rm: () => this.cmdRm(args),
      cp: () => this.cmdCp(args),
      mv: () => this.cmdMv(args),
      whoami: () => this.fs.env.USER,
      hostname: () => 'devops-lab',
      date: () => new Date().toString(),
      uname: () => this.cmdUname(args),
      uptime: () => 'up 3 days, 14:22,  1 user,  load average: 0.08, 0.03, 0.01',
      ps: () => this.cmdPs(),
      df: () => this.cmdDf(),
      free: () => this.cmdFree(),
      top: () => this.cmdTop(),
      history: () => this.cmdHistory(),
      env: () => Object.entries(this.fs.env).map(([k,v]) => `${k}=${v}`).join('\n'),
      export: () => this.cmdExport(args),
      grep: () => this.cmdGrep(args),
      find: () => this.cmdFind(args),
      head: () => this.cmdHead(args),
      tail: () => this.cmdTail(args),
      wc: () => this.cmdWc(args),
      chmod: () => this.cmdChmod(args),
      man: () => this.cmdMan(args),
      ping: () => this.cmdPing(args),
      curl: () => this.cmdCurl(args),
      wget: () => this.cmdWget(args),
      ifconfig: () => this.cmdIfconfig(),
      'ip addr': () => this.cmdIpAddr(),
      netstat: () => this.cmdNetstat(),
      ssh: () => 'ssh: connect to host: Network simulated - use labs for practice',
      sudo: () => this.cmdSudo(args),
      apt: () => this.cmdApt(args),
      'apt-get': () => this.cmdApt(args),
      reset: () => { this.fs.reset(); if(this.pkg){ this.pkg.installed.clear(); this.pkg.save(); } return '\x1b[33mEnvironment reset to defaults. Refresh the page.\x1b[0m'; },
      which: () => this.cmdWhich(args),
      alias: () => 'alias ll=\'ls -la\'\nalias la=\'ls -A\'\nalias l=\'ls -CF\'',
      exit: () => '__EXIT__',
      logout: () => '__EXIT__',
    };
    if (cmd === 'ip' && args[0] === 'addr') return handlers['ip addr']();
    const handler = handlers[cmd];
    if (handler) return handler();
    if (input.includes('=') && !input.includes(' ')) return this.cmdAssign(input);
    return `bash: ${cmd}: command not found\nType 'help' to see available commands.`;
  }

  parseArgs(input) {
    const tokens = [];
    let cur = '', inQ = false, qChar = '';
    for (const ch of input) {
      if (inQ) { if (ch === qChar) inQ = false; else cur += ch; }
      else if (ch === '"' || ch === "'") { inQ = true; qChar = ch; }
      else if (ch === ' ') { if (cur) tokens.push(cur); cur = ''; }
      else cur += ch;
    }
    if (cur) tokens.push(cur);
    return tokens;
  }

  cmdHelp() {
    return `\x1b[1;32m╔══════════════════════════════════════════════════╗\x1b[0m
\x1b[1;32m║         DevOps Lab - Available Commands          ║\x1b[0m
\x1b[1;32m╚══════════════════════════════════════════════════╝\x1b[0m

\x1b[1;33m── Navigation ──────────────────────────────────────\x1b[0m
  pwd       Print working directory
  ls        List directory contents
  cd        Change directory
  find      Search for files

\x1b[1;33m── Files ────────────────────────────────────────────\x1b[0m
  cat       Display file contents
  touch     Create empty file
  mkdir     Create directory
  rm        Remove file/directory
  cp        Copy file
  mv        Move/rename file
  head      Show first lines
  tail      Show last lines
  wc        Word/line count
  grep      Search in files
  chmod     Change permissions

\x1b[1;33m── System ───────────────────────────────────────────\x1b[0m
  uname     System information
  whoami    Current user
  hostname  Machine hostname
  date      Current date/time
  uptime    System uptime
  ps        Process list
  top       System monitor
  df        Disk usage
  free      Memory usage
  env       Environment vars
  export    Set env variable
  history   Command history
  which     Find command path
  man       Manual pages

\x1b[1;33m── Network ──────────────────────────────────────────\x1b[0m
  ping      Test connectivity
  curl      HTTP requests
  wget      Download files
  ifconfig  Network interfaces
  ip addr   IP addresses
  netstat   Network stats

\x1b[1;33m── Package ──────────────────────────────────────────\x1b[0m
  apt       Package manager
  sudo      Superuser command

\x1b[2mTip: Use ↑↓ arrows for history, Tab for autocomplete\x1b[0m`;
  }

  cmdLs(args) {
    let showHidden = false, longFmt = false, path = null;
    for (const a of args) {
      if (a === '-la' || a === '-al' || a === '-a') showHidden = true;
      if (a === '-la' || a === '-al' || a === '-l') longFmt = true;
      if (!a.startsWith('-')) path = a;
    }
    const target = path ? this.fs.resolvePath(path) : this.fs.cwd;
    const { node } = this.fs.getNode(target);
    if (!node) return `ls: cannot access '${path}': No such file or directory`;
    if (node.type === 'file') return longFmt ? `-rw-r--r-- 1 devops devops ${node.content.length} Jul  3 12:00 ${this.fs.getBaseName(target)}` : this.fs.getBaseName(target);

    let items = [...(node.children || [])];
    const hidden = ['.', '..', '.bashrc', '.bash_history'];
    const allItems = showHidden ? ['.', '..', ...items] : items.filter(i => !i.startsWith('.'));

    if (longFmt) {
      const now = 'Jul  3 12:00';
      const lines = ['total ' + allItems.length * 4];
      for (const item of allItems) {
        if (item === '.') { lines.push(`drwxr-xr-x 2 devops devops 4096 ${now} .`); continue; }
        if (item === '..') { lines.push(`drwxr-xr-x 3 devops devops 4096 ${now} ..`); continue; }
        const childPath = target === '/' ? '/' + item : target + '/' + item;
        const child = this.fs.fs[childPath];
        const isDir = child && child.type === 'dir';
        const isHidden = item.startsWith('.');
        const perm = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
        const size = isDir ? '4096' : String(child ? child.content.length : 0).padStart(4);
        const color = isDir ? '\x1b[1;34m' : isHidden ? '\x1b[1;36m' : '';
        const reset = '\x1b[0m';
        lines.push(`${perm} 1 devops devops ${size} ${now} ${color}${item}${reset}`);
      }
      return lines.join('\n');
    }

    return allItems.map(item => {
      const childPath = target === '/' ? '/' + item : target + '/' + item;
      const child = this.fs.fs[childPath];
      const isDir = child && child.type === 'dir';
      return isDir ? `\x1b[1;34m${item}/\x1b[0m` : item;
    }).join('  ');
  }

  cmdCd(args) {
    const dest = args[0] || this.fs.env.HOME;
    const resolved = this.fs.resolvePath(dest);
    const { node } = this.fs.getNode(resolved);
    if (!node) return `bash: cd: ${dest}: No such file or directory`;
    if (node.type !== 'dir') return `bash: cd: ${dest}: Not a directory`;
    this.fs.cwd = resolved;
    return '';
  }

  cmdCat(args) {
    if (!args.length) return 'cat: missing operand';
    return args.map(a => {
      const { node } = this.fs.getNode(a);
      if (!node) return `cat: ${a}: No such file or directory`;
      if (node.type === 'dir') return `cat: ${a}: Is a directory`;
      return node.content;
    }).join('\n');
  }

  cmdMkdir(args) {
    if (!args.length) return 'mkdir: missing operand';
    for (const a of args) {
      const resolved = this.fs.resolvePath(a);
      if (this.fs.fs[resolved]) return `mkdir: cannot create directory '${a}': File exists`;
      const parent = this.fs.getDirName(resolved);
      const parentNode = this.fs.fs[parent];
      if (!parentNode) return `mkdir: cannot create directory '${a}': No such file or directory`;
      const base = this.fs.getBaseName(resolved);
      this.fs.fs[resolved] = { type: 'dir', children: [] };
      if (!parentNode.children.includes(base)) parentNode.children.push(base);
    }
    this.fs.save(); return '';
  }

  cmdTouch(args) {
    if (!args.length) return 'touch: missing file operand';
    for (const a of args) {
      const resolved = this.fs.resolvePath(a);
      if (!this.fs.fs[resolved]) {
        const parent = this.fs.getDirName(resolved);
        const base = this.fs.getBaseName(resolved);
        if (!this.fs.fs[parent]) return `touch: cannot touch '${a}': No such file or directory`;
        this.fs.fs[resolved] = { type: 'file', content: '' };
        this.fs.fs[parent].children.push(base);
      }
    }
    this.fs.save(); return '';
  }

  cmdRm(args) {
    let recursive = false, force = false, paths = [];
    for (const a of args) {
      if (a === '-r' || a === '-rf' || a === '-fr') recursive = true;
      if (a === '-f' || a === '-rf' || a === '-fr') force = true;
      if (!a.startsWith('-')) paths.push(a);
    }
    for (const p of paths) {
      const resolved = this.fs.resolvePath(p);
      const { node } = this.fs.getNode(resolved);
      if (!node) { if (!force) return `rm: cannot remove '${p}': No such file or directory`; continue; }
      if (node.type === 'dir' && !recursive) return `rm: cannot remove '${p}': Is a directory`;
      const parent = this.fs.getDirName(resolved);
      const base = this.fs.getBaseName(resolved);
      const parentNode = this.fs.fs[parent];
      if (parentNode) parentNode.children = parentNode.children.filter(c => c !== base);
      delete this.fs.fs[resolved];
    }
    this.fs.save(); return '';
  }

  cmdCp(args) {
    if (args.length < 2) return 'cp: missing destination file operand';
    const src = this.fs.resolvePath(args[0]);
    const dst = this.fs.resolvePath(args[1]);
    const srcNode = this.fs.fs[src];
    if (!srcNode) return `cp: '${args[0]}': No such file or directory`;
    const dstBase = this.fs.getBaseName(dst);
    const dstParent = this.fs.getDirName(dst);
    if (!this.fs.fs[dstParent]) return `cp: '${args[1]}': No such directory`;
    this.fs.fs[dst] = JSON.parse(JSON.stringify(srcNode));
    const p = this.fs.fs[dstParent];
    if (!p.children.includes(dstBase)) p.children.push(dstBase);
    this.fs.save(); return '';
  }

  cmdMv(args) {
    if (args.length < 2) return 'mv: missing destination file operand';
    const out = this.cmdCp(args);
    if (out) return out.replace('cp:', 'mv:');
    this.cmdRm([args[0]]); return '';
  }

  cmdTree(args) {
    const startPath = args.find(a => !a.startsWith('-')) || '.';
    const root = this.fs.resolvePath(startPath);
    const lines = [startPath];
    const walk = (path, prefix) => {
      const node = this.fs.fs[path];
      if (!node || node.type !== 'dir') return;
      const children = (node.children || []).filter(c => !c.startsWith('.'));
      children.forEach((c, i) => {
        const isLast = i === children.length - 1;
        const childPath = (path === '/' ? '' : path) + '/' + c;
        const child = this.fs.fs[childPath];
        const isDir = child && child.type === 'dir';
        lines.push(prefix + (isLast ? '└── ' : '├── ') + (isDir ? `\x1b[1;34m${c}\x1b[0m` : c));
        if (isDir) walk(childPath, prefix + (isLast ? '    ' : '│   '));
      });
    };
    walk(root, '');
    const dirs  = lines.filter((_, i) => i > 0).length;
    lines.push(`\n${dirs} item(s)`);
    return lines.join('\n');
  }

  cmdUname(args) {
    const all = args.includes('-a');
    if (all) return 'Linux devops-lab 5.15.0-91-generic #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux';
    if (args.includes('-r')) return '5.15.0-91-generic';
    return 'Linux';
  }

  cmdPs() {
    return `  PID TTY          TIME CMD
    1 ?        00:00:03 systemd
  123 ?        00:00:00 sshd
  456 pts/0    00:00:00 bash
  789 pts/0    00:00:00 ps`;
  }

  cmdDf() {
    return `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G  5.2G   14G  28% /
tmpfs           3.9G     0  3.9G   0% /dev/shm
/dev/sda2       100G   12G   88G  12% /home`;
  }

  cmdFree() {
    return `              total        used        free      shared  buff/cache   available
Mem:        8192000     2048000     3421184      204800     1638400     5242880
Swap:       2097152           0     2097152`;
  }

  cmdTop() {
    return `top - ${new Date().toLocaleTimeString()} up 3 days, 14:22,  1 user,  load average: 0.08, 0.03, 0.01
Tasks:  87 total,   1 running,  86 sleeping,   0 stopped,   0 zombie
%Cpu(s):  2.3 us,  0.5 sy,  0.0 ni, 97.1 id,  0.0 wa
MiB Mem :   8000.0 total,   3341.0 free,   2000.0 used,   2659.0 buff/cache

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
    1 root      20   0  168932  13324   8772 S   0.0   0.2   0:03.45 systemd
  123 root      20   0   72296   6768   5976 S   0.0   0.1   0:00.12 sshd
  456 devops    20   0   21776   5120   3584 S   0.0   0.1   0:00.05 bash`;
  }

  cmdHistory() {
    return this.history.map((cmd, i) => `  ${String(this.history.length - i).padStart(3)}  ${cmd}`).join('\n');
  }

  cmdExport(args) {
    for (const a of args) {
      const [k, v] = a.split('=');
      if (v !== undefined) this.fs.env[k] = v;
    }
    return '';
  }

  cmdAssign(input) {
    const [k, v] = input.split('=');
    this.variables[k] = v;
    return '';
  }

  cmdGrep(args) {
    let pattern = '', files = [], ignoreCase = false, lineNum = false;
    for (const a of args) {
      if (a === '-i') ignoreCase = true;
      else if (a === '-n') lineNum = true;
      else if (!pattern) pattern = a;
      else files.push(a);
    }
    if (!files.length) return 'grep: usage: grep [options] pattern file...';
    const results = [];
    for (const f of files) {
      const { node } = this.fs.getNode(f);
      if (!node) { results.push(`grep: ${f}: No such file or directory`); continue; }
      const lines = node.content.split('\n');
      const re = new RegExp(pattern, ignoreCase ? 'i' : '');
      lines.forEach((line, i) => {
        if (re.test(line)) {
          const hl = line.replace(re, m => `\x1b[1;31m${m}\x1b[0m`);
          results.push(lineNum ? `${i+1}:${hl}` : hl);
        }
      });
    }
    return results.join('\n');
  }

  cmdFind(args) {
    let startPath = '.', name = '', type = '';
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-name') name = args[++i] || '';
      else if (args[i] === '-type') type = args[++i] || '';
      else if (!args[i].startsWith('-')) startPath = args[i];
    }
    const root = this.fs.resolvePath(startPath);
    const results = [];
    const walk = (path) => {
      const node = this.fs.fs[path];
      if (!node) return;
      const base = this.fs.getBaseName(path) || path;
      const matchName = !name || base.includes(name.replace('*',''));
      const matchType = !type || (type === 'f' && node.type === 'file') || (type === 'd' && node.type === 'dir');
      if (matchName && matchType && path !== root) results.push(path.replace(root, startPath === '.' ? '.' : root));
      if (node.type === 'dir') (node.children || []).forEach(c => walk((path === '/' ? '' : path) + '/' + c));
    };
    walk(root);
    return results.join('\n') || 'No results found';
  }

  cmdHead(args) {
    let n = 10, files = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-n') n = parseInt(args[++i]) || 10;
      else files.push(args[i]);
    }
    return files.map(f => {
      const { node } = this.fs.getNode(f);
      if (!node) return `head: ${f}: No such file or directory`;
      return node.content.split('\n').slice(0, n).join('\n');
    }).join('\n');
  }

  cmdTail(args) {
    let n = 10, files = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-n') n = parseInt(args[++i]) || 10;
      else files.push(args[i]);
    }
    return files.map(f => {
      const { node } = this.fs.getNode(f);
      if (!node) return `tail: ${f}: No such file or directory`;
      const lines = node.content.split('\n');
      return lines.slice(Math.max(0, lines.length - n)).join('\n');
    }).join('\n');
  }

  cmdWc(args) {
    return args.map(f => {
      const { node } = this.fs.getNode(f);
      if (!node) return `wc: ${f}: No such file or directory`;
      const lines = node.content.split('\n').length - 1;
      const words = node.content.split(/\s+/).filter(Boolean).length;
      const bytes = node.content.length;
      return `${String(lines).padStart(4)} ${String(words).padStart(4)} ${String(bytes).padStart(4)} ${f}`;
    }).join('\n');
  }

  cmdChmod(args) {
    if (args.length < 2) return 'chmod: missing operand';
    return '';
  }

  cmdMan(args) {
    const page = args[0];
    if (!page) return 'What manual page do you want?';
    const manuals = {
      ls: 'LS(1)\n\nNAME\n  ls - list directory contents\n\nSYNOPSIS\n  ls [OPTION]... [FILE]...\n\nOPTIONS\n  -a   include hidden files\n  -l   long listing format\n  -la  combine -l and -a',
      cd: 'CD(1)\n\nNAME\n  cd - change directory\n\nSYNOPSIS\n  cd [DIR]\n\nDESCRIPTION\n  Change the current directory to DIR.\n  Without arguments, changes to HOME.',
      grep: 'GREP(1)\n\nNAME\n  grep - search for pattern in files\n\nSYNOPSIS\n  grep [OPTIONS] PATTERN [FILE]...\n\nOPTIONS\n  -i   case insensitive\n  -n   show line numbers',
    };
    return manuals[page] || `No manual entry for ${page}`;
  }

  cmdPing(args) {
    const host = args.find(a => !a.startsWith('-')) || 'localhost';
    const count = args.includes('-c') ? parseInt(args[args.indexOf('-c') + 1]) || 4 : 4;
    const ip = host === 'localhost' ? '127.0.0.1' : '8.8.8.8';
    const lines = [`PING ${host} (${ip}) 56(84) bytes of data.`];
    for (let i = 0; i < Math.min(count, 4); i++) {
      const ms = (10 + Math.random() * 20).toFixed(3);
      lines.push(`64 bytes from ${ip}: icmp_seq=${i+1} ttl=64 time=${ms} ms`);
    }
    lines.push(`\n--- ${host} ping statistics ---`);
    lines.push(`${count} packets transmitted, ${count} received, 0% packet loss`);
    return lines.join('\n');
  }

  cmdCurl(args) {
    const url = args.find(a => !a.startsWith('-'));
    if (!url) return 'curl: no URL specified';
    return `curl: (6) Could not resolve host: ${url.replace(/https?:\/\//,'')} (simulated - no network in lab)`;
  }

  cmdWget(args) {
    const url = args.find(a => !a.startsWith('-'));
    if (!url) return 'wget: missing URL';
    return `--${new Date().toISOString()}--  ${url}\nResolving... (simulated - no network in lab)\nwget: unable to resolve host address`;
  }

  cmdIfconfig() {
    return `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255
        ether 08:00:27:ab:cd:ef  txqueuelen 1000  (Ethernet)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)`;
  }

  cmdIpAddr() {
    return `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP
    link/ether 08:00:27:ab:cd:ef brd ff:ff:ff:ff:ff:ff
    inet 10.0.2.15/24 brd 10.0.2.255 scope global eth0`;
  }

  cmdNetstat() {
    return `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN
tcp6       0      0 :::80                   :::*                    LISTEN`;
  }

  cmdSudo(args) {
    if (!args.length) return 'usage: sudo command';
    const sub = this.run(args.join(' '));
    return sub || `[sudo] running as root: ${args.join(' ')}`;
  }

  cmdApt(args) {
    const sub = args[0];
    if (!sub) return 'apt: usage: apt [update|install|remove|list|search|show] ...';
    if (sub === 'update') {
      return `Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease\nHit:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease\nHit:3 http://security.ubuntu.com/ubuntu jammy-security InRelease\nReading package lists... Done\nBuilding dependency tree... Done\n\x1b[32mAll packages are up to date.\x1b[0m`;
    }
    if (sub === 'install') {
      if (!this.pkg) return 'apt: package manager not initialized';
      const pkgs = args.slice(1).filter(a => !a.startsWith('-'));
      if (!pkgs.length) return 'apt install: package name required';
      return this.pkg.install(pkgs);
    }
    if (sub === 'remove' || sub === 'purge') {
      if (!this.pkg) return 'apt: package manager not initialized';
      const pkgs = args.slice(1).filter(a => !a.startsWith('-'));
      return this.pkg.remove(pkgs);
    }
    if (sub === 'list') {
      const installed = args.includes('--installed');
      if (installed && this.pkg) return this.pkg.list();
      return `Listing available packages...\n\x1b[36m${'PACKAGE'.padEnd(22)}VERSION'.padEnd(30)}DESCRIPTION\x1b[0m\n` +
        Object.entries(window.PKG_REGISTRY||{}).map(([n,p]) => `${n.padEnd(22)}${p.version.padEnd(30)}${p.desc}`).join('\n');
    }
    if (sub === 'search') {
      if (!this.pkg) return 'apt: not initialized';
      return this.pkg.search(args[1] || '');
    }
    if (sub === 'show') {
      const name = args[1];
      const p = (window.PKG_REGISTRY||{})[name];
      if (!p) return `E: No packages found for '${name}'`;
      return `Package: ${name}\nVersion: ${p.version}\nInstalled-Size: ${p.size}\nDescription: ${p.desc}\nStatus: ${this.pkg?.isInstalled(name) ? '\x1b[32minstalled\x1b[0m' : 'not installed'}`;
    }
    if (sub === 'upgrade') return 'Reading package lists... Done\nAll packages are up to date. (simulated)';
    return `apt: unknown command '${sub}'. Usage: apt [update|install|remove|list|search|show]`;
  }

  cmdWhich(args) {
    const builtin = { bash:'/bin/bash', sh:'/bin/sh', ls:'/bin/ls', cat:'/bin/cat', grep:'/bin/grep', find:'/usr/bin/find' };
    return args.map(a => {
      if (builtin[a]) return builtin[a];
      if (this.pkg && this.pkg.getCommand(a)) return `/usr/bin/${a}`;
      return `which: ${a}: not found`;
    }).join('\n');
  }
}

window.Terminal = Terminal;
