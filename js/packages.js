// Package Registry — defines what each apt package installs
const PKG_REGISTRY = {
  nginx: {
    version: '1.18.0-6ubuntu14', size: '1,234 kB', desc: 'HTTP and reverse proxy server',
    files: {
      '/etc/nginx': { type: 'dir', children: ['nginx.conf', 'sites-available', 'sites-enabled'] },
      '/etc/nginx/sites-available': { type: 'dir', children: ['default'] },
      '/etc/nginx/sites-enabled':   { type: 'dir', children: [] },
      '/etc/nginx/nginx.conf': { type: 'file', content: 'user www-data;\nworker_processes auto;\nerror_log /var/log/nginx/error.log;\nevents { worker_connections 1024; }\nhttp {\n  include /etc/nginx/sites-enabled/*;\n  server {\n    listen 80;\n    root /var/www/html;\n    index index.html;\n  }\n}\n' },
      '/etc/nginx/sites-available/default': { type: 'file', content: 'server {\n  listen 80 default_server;\n  root /var/www/html;\n  index index.html;\n  server_name _;\n  location / { try_files $uri $uri/ =404; }\n}\n' },
      '/var/www': { type: 'dir', children: ['html'] },
      '/var/www/html': { type: 'dir', children: ['index.html'] },
      '/var/www/html/index.html': { type: 'file', content: '<!DOCTYPE html><html><body><h1>Welcome to nginx!</h1></body></html>\n' },
      '/var/log/nginx': { type: 'dir', children: ['access.log', 'error.log'] },
      '/var/log/nginx/access.log': { type: 'file', content: '' },
      '/var/log/nginx/error.log':  { type: 'file', content: '' },
    },
    cmd: { nginx: (args) => {
      if (args[0] === '-v' || args[0] === '--version') return 'nginx version: nginx/1.18.0 (Ubuntu)';
      if (args[0] === '-t') return 'nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful';
      if (args[0] === '-s') return `nginx: signal ${args[1] || 'unknown'} sent`;
      return 'nginx: usage: nginx [-s signal] [-t] [-v]\nUse: nginx -t  (test config)\n     nginx -v  (version)\n     nginx -s reload|stop|quit';
    }}
  },

  git: {
    version: '1:2.34.1-1ubuntu1.10', size: '4,142 kB', desc: 'Fast version control system',
    files: {},
    cmd: { git: (args) => {
      const sub = args[0];
      if (!sub) return 'usage: git [--version] [--help] <command> [<args>]\nCommon commands: init, clone, add, commit, status, log, diff, push, pull';
      if (sub === '--version') return 'git version 2.34.1';
      if (sub === 'init') return `Initialized empty Git repository in ${args[1] || '.'}/.git/`;
      if (sub === 'status') return 'On branch main\nnothing to commit, working tree clean';
      if (sub === 'log') return 'commit a1b2c3d4e5f6 (HEAD -> main)\nAuthor: devops <devops@lab.local>\nDate:   Thu Jul  3 10:00:00 2025\n\n    Initial commit';
      if (sub === 'add') return '';
      if (sub === 'commit') return `[main a1b2c3d] ${args.includes('-m') ? args[args.indexOf('-m')+1] || 'commit' : 'commit'}\n 1 file changed`;
      if (sub === 'clone') return `Cloning into '${(args[1]||'repo').split('/').pop()}'...\nremote: Counting objects: 100\nReceiving objects: 100% done.`;
      if (sub === 'branch') return '* main';
      if (sub === 'checkout') return `Switched to branch '${args[1] || 'main'}'`;
      if (sub === 'diff') return '';
      if (sub === 'push') return 'Everything up-to-date (simulated)';
      if (sub === 'pull') return 'Already up to date. (simulated)';
      return `git: '${sub}' is a valid git command. See 'git --help'.`;
    }}
  },

  vim: {
    version: '2:8.2.3995-1ubuntu2.15', size: '1,800 kB', desc: 'Vi IMproved - enhanced vi editor',
    files: { '/etc/vim': { type: 'dir', children: ['vimrc'] }, '/etc/vim/vimrc': { type: 'file', content: '" Vim configuration\nsyntax on\nset number\nset tabstop=4\nset expandtab\n' } },
    cmd: { vim: (args) => `vim: Opening ${args[0] || 'new buffer'}\n(vim is interactive — not supported in web terminal)\nTip: Use cat, echo, or text redirection to edit files instead.\nExample: echo "content" > file.txt`, vi: (args) => `vi: Opening ${args[0] || 'new buffer'}\n(interactive editor not supported)\nTip: echo "text" > ${args[0] || 'file.txt'}` }
  },

  nano: {
    version: '6.2-1', size: '250 kB', desc: 'Small user-friendly text editor',
    files: {},
    cmd: { nano: (args) => `nano: Opening ${args[0] || 'new file'}\n(interactive editor not supported in web terminal)\nTip: Use echo or cat with redirection:\n  echo "Hello" > ${args[0] || 'file.txt'}\n  cat >> ${args[0] || 'file.txt'} <<< "more text"` }
  },

  python3: {
    version: '3.10.12-1~22.04.1', size: '27,800 kB', desc: 'Python 3 interpreter',
    files: { '/usr/bin/python3': { type: 'file', content: '#!/usr/bin/python3\n' } },
    cmd: {
      python3: (args) => {
        if (args[0] === '--version' || args[0] === '-V') return 'Python 3.10.12';
        if (args[0] === '-c' && args[1]) {
          // Simple eval for training demos
          try {
            const code = args[1];
            if (/^print\(/.test(code)) {
              const inner = code.match(/print\((.*)\)/)?.[1] || '';
              try { return String(eval(inner)); } catch { return inner.replace(/['"]/g,''); }
            }
            return '(simulated python output)';
          } catch { return 'SyntaxError'; }
        }
        if (!args[0]) return 'Python 3.10.12 (simulated REPL not supported)\nRun scripts with: python3 script.py\nRun code with:   python3 -c "print(\'hello\')"';
        return `python3: Running ${args[0]}... (simulated)`;
      },
      python: (args) => 'Python 2 is not installed. Try: python3'
    }
  },

  curl: {
    version: '7.81.0-1ubuntu1.14', size: '194 kB', desc: 'Command line HTTP client',
    files: {},
    cmd: { curl: (args) => {
      const url = args.find(a => !a.startsWith('-'));
      if (!url) return 'curl: no URL specified. Try: curl https://example.com';
      const silent = args.includes('-s') || args.includes('--silent');
      const head = args.includes('-I') || args.includes('--head');
      if (head) return `HTTP/1.1 200 OK\nContent-Type: text/html\nServer: nginx/1.18.0\nDate: ${new Date().toUTCString()}\n(simulated — no real network)`;
      return `<!DOCTYPE html>\n<html><body>\n  <h1>Example Domain</h1>\n  <p>This is a simulated response for: ${url}</p>\n</body></html>\n(simulated — no real network)`;
    }}
  },

  wget: {
    version: '1.21.2-2ubuntu1', size: '348 kB', desc: 'Network file downloader',
    files: {},
    cmd: { wget: (args) => {
      const url = args.find(a => !a.startsWith('-'));
      if (!url) return 'wget: missing URL';
      const file = url.split('/').pop() || 'index.html';
      return `--${new Date().toISOString()}--  ${url}\nResolving... (simulated)\nConnecting... connected.\nHTTP request sent, 200 OK\nSaving to: '${file}'\n\n${file}     100%[===================>]   1.23K  --.-KB/s   in 0s\n\nDownloaded (simulated — file not actually saved).`;
    }}
  },

  htop: {
    version: '3.0.5-7build2', size: '221 kB', desc: 'Interactive process viewer',
    files: {},
    cmd: { htop: () => `htop (interactive TUI not supported in web terminal)\nUse 'top' or 'ps aux' instead for process info.` }
  },

  tree: {
    version: '2.0.2-1', size: '47 kB', desc: 'Display directory tree structure',
    files: {},
    cmd: { tree: (args) => '__TREE__' }   // handled specially in terminal.js
  },

  jq: {
    version: '1.6-2.1ubuntu3', size: '64 kB', desc: 'Lightweight JSON processor',
    files: {},
    cmd: { jq: (args) => {
      if (!args.length) return 'jq - commandline JSON processor\nUsage: echo \'{"a":1}\' | jq .\nOr:    jq . file.json';
      return '(simulated) jq requires piped input — pipe not yet supported in web terminal.\nExample output:\n{\n  "key": "value"\n}';
    }}
  },

  'net-tools': {
    version: '1.60+git20181103', size: '204 kB', desc: 'NET-3 networking toolkit (ifconfig, netstat)',
    files: {},
    cmd: {}  // ifconfig/netstat already built-in
  },

  tmux: {
    version: '3.2a-4build1', size: '337 kB', desc: 'Terminal multiplexer',
    files: { '/etc/tmux.conf': { type: 'file', content: '# tmux configuration\nset -g mouse on\nset -g history-limit 10000\n' } },
    cmd: { tmux: (args) => `tmux: interactive multiplexer not supported in web terminal.\nIn a real server: tmux new-session, tmux attach, Ctrl+b d to detach.` }
  },

  unzip: {
    version: '6.0-26ubuntu3.1', size: '172 kB', desc: 'Extract ZIP archives',
    files: {},
    cmd: { unzip: (args) => {
      const file = args.find(a => !a.startsWith('-'));
      if (!file) return 'Usage: unzip <file.zip>';
      return `Archive:  ${file}\n  inflating: (simulated — no real archive)`;
    }, zip: (args) => `zip: ${args.join(' ')} (simulated)` }
  },

  rsync: {
    version: '3.2.7-1', size: '385 kB', desc: 'Fast remote file sync',
    files: {},
    cmd: { rsync: (args) => `rsync: ${args.join(' ')}\nsending incremental file list\n(simulated — no real network transfer)` }
  },

  docker: {
    version: '24.0.7', size: '89,200 kB', desc: 'Container runtime (Docker Engine)',
    files: {
      '/etc/docker': { type: 'dir', children: ['daemon.json'] },
      '/etc/docker/daemon.json': { type: 'file', content: '{\n  "log-driver": "json-file",\n  "log-opts": { "max-size": "10m", "max-file": "3" }\n}\n' }
    },
    cmd: { docker: (args) => {
      const sub = args[0];
      if (!sub) return 'Usage: docker [OPTIONS] COMMAND\nCommon: run, ps, images, pull, build, exec, logs, stop, rm, rmi';
      if (sub === '--version') return 'Docker version 24.0.7, build afdd53b';
      if (sub === 'ps') return 'CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES\n(no running containers)';
      if (sub === 'images') return 'REPOSITORY   TAG       IMAGE ID       CREATED        SIZE\n(no images — use: docker pull ubuntu)';
      if (sub === 'pull') return `Pulling from library/${args[1] || 'ubuntu'}\nStatus: Downloaded newer image for ${args[1] || 'ubuntu'}:latest (simulated)`;
      if (sub === 'run') return `(simulated) Would run: docker ${args.join(' ')}\nContainer started with ID: a1b2c3d4e5f6 (simulated)`;
      if (sub === 'build') return `Step 1/3 : FROM ubuntu:22.04\nStep 2/3 : RUN apt-get update\nStep 3/3 : CMD ["/bin/bash"]\nSuccessfully built abc123def456 (simulated)`;
      if (sub === 'info') return `Server:\n Docker Engine - Community\n  Version: 24.0.7\n  OS/Arch: linux/amd64\n  Containers: 0\n  Images: 0`;
      return `docker: '${sub}' — simulated. Commands work conceptually for learning.`;
    }}
  },

  ansible: {
    version: '2.12.10+dfsg-0ubuntu0.22.04', size: '15,400 kB', desc: 'Automation & config management',
    files: {
      '/etc/ansible': { type: 'dir', children: ['ansible.cfg', 'hosts'] },
      '/etc/ansible/ansible.cfg': { type: 'file', content: '[defaults]\nhost_key_checking = False\nremote_user = devops\n' },
      '/etc/ansible/hosts': { type: 'file', content: '# Ansible inventory\n[webservers]\nweb01 ansible_host=10.0.1.10\nweb02 ansible_host=10.0.1.11\n\n[dbservers]\ndb01 ansible_host=10.0.2.10\n' }
    },
    cmd: { ansible: (args) => {
      if (args[0] === '--version') return 'ansible [core 2.12.10]';
      return `ansible ${args.join(' ')} (simulated — no real hosts)`;
    }, 'ansible-playbook': (args) => `ansible-playbook: Running ${args[0] || 'playbook.yml'}\nPLAY [all] ***\nTASK [Gathering Facts] OK\nPLAY RECAP: ok=1  changed=0  failed=0 (simulated)` }
  },

  terraform: {
    version: '1.6.6', size: '22,500 kB', desc: 'Infrastructure as Code tool',
    files: { '/home/devops/projects': { type: 'dir', children: ['main.tf'] }, '/home/devops/projects/main.tf': { type: 'file', content: 'terraform {\n  required_providers {\n    aws = { source = "hashicorp/aws", version = "~> 5.0" }\n  }\n}\n\nprovider "aws" {\n  region = "us-east-1"\n}\n\nresource "aws_instance" "example" {\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = "t2.micro"\n  tags = { Name = "DevOps-Lab" }\n}\n' } },
    cmd: { terraform: (args) => {
      const sub = args[0];
      if (!sub) return 'Usage: terraform <command>\nCommands: init, plan, apply, destroy, fmt, validate, output, state';
      if (sub === 'version' || sub === '--version') return 'Terraform v1.6.6\non linux_amd64';
      if (sub === 'init') return 'Initializing provider plugins...\n- Finding hashicorp/aws versions...\n- Installing hashicorp/aws v5.0.1...\nTerraform has been successfully initialized! (simulated)';
      if (sub === 'plan') return 'Terraform will perform the following actions:\n  + aws_instance.example\n      ami: "ami-0c55b159cbfafe1f0"\n      instance_type: "t2.micro"\nPlan: 1 to add, 0 to change, 0 to destroy. (simulated)';
      if (sub === 'apply') return 'aws_instance.example: Creating...\naws_instance.example: Creation complete after 10s [id=i-0abc123]\nApply complete! Resources: 1 added. (simulated)';
      if (sub === 'fmt') return 'main.tf (simulated format)';
      if (sub === 'validate') return 'Success! The configuration is valid. (simulated)';
      return `terraform ${args.join(' ')} (simulated)`;
    }}
  },

  kubectl: {
    version: '1.28.4', size: '10,200 kB', desc: 'Kubernetes command-line tool',
    files: { '/home/devops/.kube': { type: 'dir', children: ['config'] }, '/home/devops/.kube/config': { type: 'file', content: 'apiVersion: v1\nclusters:\n- cluster:\n    server: https://127.0.0.1:6443\n  name: devops-lab\ncontexts:\n- context:\n    cluster: devops-lab\n    user: devops\n  name: devops-lab\ncurrent-context: devops-lab\n' } },
    cmd: { kubectl: (args) => {
      const sub = args[0];
      if (!sub) return 'kubectl controls the Kubernetes cluster manager.\nUsage: kubectl <command> [options]\nCommon: get, describe, apply, delete, logs, exec';
      if (sub === 'version') return 'Client Version: v1.28.4\nKustomize Version: v5.0.4-0\n(simulated — no real cluster)';
      if (sub === 'get') return `NAME      READY   STATUS    RESTARTS   AGE\n(${args[1] || 'pods'}: none running — simulated cluster)`;
      if (sub === 'apply') return `${args.includes('-f') ? args[args.indexOf('-f')+1] : 'resource'} configured (simulated)`;
      if (sub === 'cluster-info') return 'Kubernetes control plane is running at https://127.0.0.1:6443 (simulated)';
      return `kubectl ${args.join(' ')} (simulated cluster)`;
    }, k: (args) => `alias k=kubectl — try: kubectl ${args.join(' ')}` }
  },

  'openssh-server': {
    version: '1:8.9p1-3ubuntu0.4', size: '388 kB', desc: 'Secure Shell server',
    files: {
      '/etc/ssh': { type: 'dir', children: ['sshd_config'] },
      '/etc/ssh/sshd_config': { type: 'file', content: '# SSH server configuration\nPort 22\nListenAddress 0.0.0.0\nPermitRootLogin no\nPasswordAuthentication yes\nPubkeyAuthentication yes\nAuthorizedKeysFile .ssh/authorized_keys\nX11Forwarding no\nPrintMotd no\n' }
    },
    cmd: { sshd: (args) => args[0] === '-t' ? 'sshd_config: syntax OK' : 'sshd: Started (simulated)' }
  },

  mysql: {
    version: '8.0.35-0ubuntu0.22.04.1', size: '25,600 kB', desc: 'MySQL database client',
    files: { '/etc/mysql': { type: 'dir', children: ['my.cnf'] }, '/etc/mysql/my.cnf': { type: 'file', content: '[mysqld]\nbind-address = 127.0.0.1\nmax_connections = 100\ncharacter-set-server = utf8mb4\n' } },
    cmd: { mysql: (args) => {
      if (args.includes('--version')) return 'mysql  Ver 8.0.35 Distrib 8.0.35';
      return 'Welcome to the MySQL monitor. (simulated)\nmysql> (interactive mode not supported — use scripts)';
    }, mysqladmin: (args) => `mysqladmin: ${args.join(' ')} (simulated)` }
  },

  nodejs: {
    version: '18.19.0', size: '12,400 kB', desc: 'JavaScript runtime (Node.js)',
    files: {},
    cmd: {
      node: (args) => {
        if (args[0] === '--version' || args[0] === '-v') return 'v18.19.0';
        if (!args[0]) return 'Node.js v18.19.0 (REPL not supported in web terminal)\nRun scripts: node script.js';
        return `node: Running ${args[0]}... (simulated)`;
      },
      npm: (args) => {
        const sub = args[0];
        if (sub === '--version' || sub === '-v') return '9.2.0';
        if (sub === 'install' || sub === 'i') return `added ${Math.floor(Math.random()*100)+10} packages (simulated)`;
        if (sub === 'init') return 'Wrote to package.json (simulated)';
        if (sub === 'run') return `> running script: ${args[1]} (simulated)`;
        return `npm ${args.join(' ')} (simulated)`;
      }
    }
  }
};

// Package manager state — load from localStorage
class PackageManager {
  constructor(fs) {
    this.fs = fs;
    this.installed = new Set(JSON.parse(localStorage.getItem(LS_PKG) || '[]'));
  }

  save() {
    localStorage.setItem(LS_PKG, JSON.stringify([...this.installed]));
  }

  isInstalled(pkg) { return this.installed.has(pkg); }

  getCommand(cmd) {
    for (const [pkg, def] of Object.entries(PKG_REGISTRY)) {
      if (this.installed.has(pkg) && def.cmd[cmd]) return def.cmd[cmd];
    }
    return null;
  }

  install(pkgNames) {
    const lines = [];
    const date = new Date().toLocaleString();
    lines.push('Reading package lists... Done');
    lines.push('Building dependency tree... Done');
    lines.push('Reading state information... Done');

    const toInstall = pkgNames.filter(n => PKG_REGISTRY[n]);
    const unknown   = pkgNames.filter(n => !PKG_REGISTRY[n]);

    if (unknown.length) {
      lines.push(`\x1b[31mE: Unable to locate package(s): ${unknown.join(', ')}\x1b[0m`);
      lines.push('\x1b[33mAvailable packages: ' + Object.keys(PKG_REGISTRY).join(', ') + '\x1b[0m');
    }

    if (!toInstall.length) return lines.join('\n');

    const sizes = toInstall.map(n => PKG_REGISTRY[n].size);
    const totalKb = sizes.reduce((a,s) => a + parseInt(s.replace(/[^0-9]/g,'')), 0);
    lines.push(`The following NEW packages will be installed:\n  \x1b[1m${toInstall.join('  ')}\x1b[0m`);
    lines.push(`0 upgraded, ${toInstall.length} newly installed, 0 to remove.`);
    lines.push(`Need to get ${totalKb} kB of archives.`);
    lines.push('After this operation, space will be used.');
    lines.push('');

    for (const name of toInstall) {
      if (this.installed.has(name)) { lines.push(`${name} is already the newest version.`); continue; }
      const pkg = PKG_REGISTRY[name];
      lines.push(`Get:1 http://archive.ubuntu.com/ubuntu jammy/main amd64 ${name} ${pkg.version} [${pkg.size}]`);
      lines.push(`Fetched ${pkg.size} in 1s`);
      lines.push(`Selecting previously unselected package ${name}.`);
      lines.push(`Unpacking ${name} (${pkg.version}) ...`);
      lines.push(`Setting up ${name} (${pkg.version}) ...`);

      // Write files into filesystem
      for (const [path, node] of Object.entries(pkg.files)) {
        if (!this.fs.fs[path]) {
          this.fs.fs[path] = JSON.parse(JSON.stringify(node));
          const parent = this.fs.getDirName(path);
          const base   = this.fs.getBaseName(path);
          if (this.fs.fs[parent] && !this.fs.fs[parent].children.includes(base)) {
            this.fs.fs[parent].children.push(base);
          }
        }
      }

      this.installed.add(name);
      lines.push(`\x1b[32m✓ ${name} installed successfully.\x1b[0m`);
    }

    this.save();
    this.fs.save();

    // Log to apt history
    const logNode = this.fs.fs['/var/log/apt/history.log'];
    if (logNode) {
      logNode.content += `Start-Date: ${date}\nCommandline: apt install ${pkgNames.join(' ')}\nInstall: ${toInstall.join(', ')}\nEnd-Date: ${date}\n\n`;
    }

    return lines.join('\n');
  }

  remove(pkgNames) {
    const lines = ['Reading package lists... Done'];
    for (const name of pkgNames) {
      if (!this.installed.has(name)) { lines.push(`Package '${name}' is not installed.`); continue; }
      lines.push(`Removing ${name} ...`);
      this.installed.delete(name);
      lines.push(`\x1b[33m${name} removed.\x1b[0m`);
    }
    this.save();
    return lines.join('\n');
  }

  list() {
    if (!this.installed.size) return 'No extra packages installed.\nUse: apt install <package>';
    const rows = [...this.installed].map(n => {
      const p = PKG_REGISTRY[n];
      return `\x1b[32m${n.padEnd(22)}\x1b[0m ${(p?.version||'').padEnd(30)} ${p?.desc||''}`;
    });
    return `Listing installed packages...\n${rows.join('\n')}`;
  }

  search(term) {
    const results = Object.entries(PKG_REGISTRY)
      .filter(([n, p]) => n.includes(term) || (p.desc||'').toLowerCase().includes(term.toLowerCase()))
      .map(([n, p]) => `\x1b[36m${n.padEnd(22)}\x1b[0m ${p.version.padEnd(30)} ${p.desc}`);
    return results.length ? results.join('\n') : `No packages found matching '${term}'.`;
  }
}

window.PKG_REGISTRY   = PKG_REGISTRY;
window.PackageManager = PackageManager;
