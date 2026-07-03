// Storage keys
const LS_FS  = 'devops-lab-fs';
const LS_CWD = 'devops-lab-cwd';
const LS_PKG = 'devops-lab-pkgs';

// Virtual Linux Filesystem (default/factory)
const VFS = {
  '/': { type: 'dir', children: ['home', 'etc', 'var', 'usr', 'tmp', 'bin', 'proc'] },
  '/home': { type: 'dir', children: ['devops'] },
  '/home/devops': { type: 'dir', children: ['labs', 'projects', '.bashrc', '.bash_history', 'README.md'] },
  '/home/devops/labs': { type: 'dir', children: ['linux-basics', 'networking', 'docker'] },
  '/home/devops/labs/linux-basics': { type: 'dir', children: ['lab01.txt', 'lab02.txt'] },
  '/home/devops/labs/networking': { type: 'dir', children: ['lab01.txt'] },
  '/home/devops/labs/docker': { type: 'dir', children: [] },
  '/home/devops/projects': { type: 'dir', children: [] },
  '/home/devops/.bashrc': { type: 'file', content: '# ~/.bashrc\nexport PS1="\\u@devops-lab:~$ "\nexport PATH="/usr/local/bin:/usr/bin:/bin"\nalias ll="ls -la"\nalias la="ls -A"\nalias l="ls -CF"\n' },
  '/home/devops/.bash_history': { type: 'file', content: 'ls\npwd\ncd labs\nls -la\ncat lab01.txt\n' },
  '/home/devops/README.md': { type: 'file', content: '# DevOps Training Lab\n\nWelcome to your Linux training environment!\n\n## Getting Started\nType `help` to see available commands.\nExplore the filesystem with `ls`, `cd`, `cat`.\n\n## Labs\n- linux-basics/\n- networking/\n- docker/\n\nHappy learning! 🚀\n' },
  '/home/devops/labs/linux-basics/lab01.txt': { type: 'file', content: '=== Lab 01: Linux Basics ===\n\nObjective: Learn fundamental Linux commands\n\nTasks:\n1. Navigate the filesystem with cd, ls, pwd\n2. Create files with touch and directories with mkdir\n3. View file contents with cat, less, head, tail\n4. Copy and move files with cp and mv\n5. Remove files with rm\n\nTry it:\n  pwd\n  ls -la\n  mkdir mydir\n  touch mydir/hello.txt\n  echo "Hello Linux!" > mydir/hello.txt\n  cat mydir/hello.txt\n' },
  '/home/devops/labs/linux-basics/lab02.txt': { type: 'file', content: '=== Lab 02: File Permissions ===\n\nObjective: Understand Linux file permissions\n\nTasks:\n1. View permissions with ls -l\n2. Change permissions with chmod\n3. Change ownership with chown\n4. Understand rwx notation\n\nPermission bits:\n  r = read    (4)\n  w = write   (2)\n  x = execute (1)\n\nExample:\n  chmod 755 script.sh\n  chmod +x script.sh\n  ls -l script.sh\n' },
  '/home/devops/labs/networking/lab01.txt': { type: 'file', content: '=== Lab 01: Networking Basics ===\n\nObjective: Learn Linux networking commands\n\nTasks:\n1. Check IP address with ip addr\n2. Test connectivity with ping\n3. Check open ports with netstat\n4. Trace route with traceroute\n5. DNS lookup with nslookup/dig\n\nTry it:\n  ip addr show\n  ping -c 4 8.8.8.8\n  netstat -tuln\n' },
  '/etc': { type: 'dir', children: ['hostname', 'hosts', 'passwd', 'os-release', 'apt'] },
  '/etc/apt': { type: 'dir', children: ['sources.list'] },
  '/etc/apt/sources.list': { type: 'file', content: 'deb http://archive.ubuntu.com/ubuntu jammy main restricted\ndeb http://archive.ubuntu.com/ubuntu jammy-updates main restricted\ndeb http://security.ubuntu.com/ubuntu jammy-security main restricted\n' },
  '/etc/hostname': { type: 'file', content: 'devops-lab\n' },
  '/etc/hosts': { type: 'file', content: '127.0.0.1\tlocalhost\n127.0.1.1\tdevops-lab\n::1\t\tlocalhost ip6-localhost\n' },
  '/etc/passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\ndevops:x:1000:1000:DevOps User:/home/devops:/bin/bash\n' },
  '/etc/os-release': { type: 'file', content: 'NAME="Ubuntu"\nVERSION="22.04.3 LTS (Jammy Jellyfish)"\nID=ubuntu\nID_LIKE=debian\nPRETTY_NAME="Ubuntu 22.04.3 LTS"\nVERSION_ID="22.04"\nHOME_URL="https://www.ubuntu.com/"\n' },
  '/var': { type: 'dir', children: ['log', 'lib'] },
  '/var/lib': { type: 'dir', children: ['apt'] },
  '/var/lib/apt': { type: 'dir', children: ['lists'] },
  '/var/lib/apt/lists': { type: 'dir', children: [] },
  '/var/log': { type: 'dir', children: ['syslog', 'auth.log', 'apt'] },
  '/var/log/apt': { type: 'dir', children: ['history.log'] },
  '/var/log/apt/history.log': { type: 'file', content: '' },
  '/var/log/syslog': { type: 'file', content: 'Jul  3 00:00:01 devops-lab systemd[1]: Starting Daily apt download activities...\nJul  3 00:00:02 devops-lab systemd[1]: Started Daily apt download activities.\nJul  3 06:25:01 devops-lab CRON[1234]: (root) CMD (test -x /usr/sbin/anacron)\n' },
  '/var/log/auth.log': { type: 'file', content: 'Jul  3 10:00:01 devops-lab sshd[1234]: Server listening on 0.0.0.0 port 22.\nJul  3 10:00:01 devops-lab sshd[1234]: Server listening on :: port 22.\nJul  3 10:01:42 devops-lab login[5678]: pam_unix(login:session): session opened for user devops\n' },
  '/tmp': { type: 'dir', children: [] },
  '/usr': { type: 'dir', children: ['bin', 'local', 'share', 'sbin'] },
  '/usr/bin': { type: 'dir', children: [] },
  '/usr/sbin': { type: 'dir', children: [] },
  '/usr/local': { type: 'dir', children: ['bin', 'sbin'] },
  '/usr/local/bin': { type: 'dir', children: [] },
  '/usr/local/sbin': { type: 'dir', children: [] },
  '/usr/share': { type: 'dir', children: ['doc'] },
  '/usr/share/doc': { type: 'dir', children: [] },
  '/bin': { type: 'dir', children: [] },
  '/proc': { type: 'dir', children: ['cpuinfo', 'meminfo', 'version'] },
  '/proc/cpuinfo': { type: 'file', content: 'processor\t: 0\nvendor_id\t: GenuineIntel\ncpu family\t: 6\nmodel name\t: Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz\ncpu MHz\t\t: 2904.000\ncache size\t: 16384 KB\ncpu cores\t: 8\n' },
  '/proc/meminfo': { type: 'file', content: 'MemTotal:\t\t8192000 kB\nMemFree:\t\t3421184 kB\nMemAvailable:\t\t5242880 kB\nBuffers:\t\t204800 kB\nCached:\t\t\t1638400 kB\nSwapTotal:\t\t2097152 kB\nSwapFree:\t\t2097152 kB\n' },
  '/proc/version': { type: 'file', content: 'Linux version 5.15.0-91-generic (buildd@lcy02-amd64-017) (gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0, GNU ld (GNU Binutils for Ubuntu) 2.38) #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023\n' }
};

class FileSystem {
  constructor() {
    this.env = { USER: 'devops', HOME: '/home/devops', SHELL: '/bin/bash', TERM: 'xterm-256color' };
    this.load();
  }

  // ── Persistence ──────────────────────────────────────────
  save() {
    try {
      localStorage.setItem(LS_FS,  JSON.stringify(this.fs));
      localStorage.setItem(LS_CWD, this.cwd);
    } catch(e) { /* storage full or private mode — fail silently */ }
  }

  load() {
    try {
      const savedFs  = localStorage.getItem(LS_FS);
      const savedCwd = localStorage.getItem(LS_CWD);
      // Merge: VFS provides new defaults, saved data overwrites with user changes
      this.fs  = savedFs
        ? Object.assign(JSON.parse(JSON.stringify(VFS)), JSON.parse(savedFs))
        : JSON.parse(JSON.stringify(VFS));
      this.cwd = savedCwd || '/home/devops';
    } catch(e) {
      this.fs  = JSON.parse(JSON.stringify(VFS));
      this.cwd = '/home/devops';
    }
  }

  reset() {
    localStorage.removeItem(LS_FS);
    localStorage.removeItem(LS_CWD);
    localStorage.removeItem(LS_PKG);
    this.fs  = JSON.parse(JSON.stringify(VFS));
    this.cwd = '/home/devops';
    this.save();
  }

  // ── Path helpers ─────────────────────────────────────────
  resolvePath(path) {
    if (!path || path === '~') return this.env.HOME;
    if (path.startsWith('~/')) return this.env.HOME + path.slice(1);
    if (!path.startsWith('/')) {
      const base = this.cwd === '/' ? '' : this.cwd;
      path = base + '/' + path;
    }
    const parts = path.split('/').filter(Boolean);
    const resolved = [];
    for (const p of parts) {
      if (p === '.') continue;
      if (p === '..') { resolved.pop(); }
      else resolved.push(p);
    }
    return '/' + resolved.join('/');
  }

  getNode(path) {
    const resolved = this.resolvePath(path);
    return { node: this.fs[resolved], path: resolved };
  }

  getDirName(path) {
    const parts = path.split('/');
    parts.pop();
    return parts.join('/') || '/';
  }

  getBaseName(path) {
    return path.split('/').pop();
  }

  promptPath() {
    let p = this.cwd;
    if (p.startsWith(this.env.HOME)) p = '~' + p.slice(this.env.HOME.length);
    return p || '/';
  }
}

window.FileSystem = FileSystem;
window.LS_PKG = LS_PKG;
