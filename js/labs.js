const LABS = [
  {
    id: 'b01', num: 1, category: 'Linux Beginner', title: 'Navigate the Filesystem',
    icon: '🗺️', duration: '10 min',
    objective: 'Use pwd, ls, and cd to move around the Linux filesystem and understand what you see.',
    theory: `The Linux filesystem is a tree structure starting at / (root).
Every file and directory has a path — like an address.

Key commands:
  pwd  → Print Working Directory (where am I right now?)
  ls   → List contents of a directory
  cd   → Change Directory (move around)

Common ls flags:
  ls -l    long format (permissions, size, date)
  ls -a    show hidden files (starting with .)
  ls -la   both combined

Path types:
  Absolute path: starts with /  e.g. /home/devops/labs
  Relative path: from current   e.g. labs/linux-basics`,
    steps: [
      {
        title: 'Where am I?',
        explain: 'pwd shows your current location in the filesystem. It always returns an absolute path starting with /.',
        cmd: 'pwd',
        expect: '/home/devops',
        note: 'You are in your home directory /home/devops'
      },
      {
        title: 'List what\'s here',
        explain: 'ls lists all files and directories in the current directory. Directories appear in blue.',
        cmd: 'ls',
        expect: 'labs  projects  README.md',
        note: 'You can see labs/, projects/ and README.md'
      },
      {
        title: 'List with details',
        explain: 'ls -la shows permissions, owner, size, date, and hidden files (those starting with a dot).',
        cmd: 'ls -la',
        expect: 'drwxr-xr-x',
        note: 'd = directory, r = read, w = write, x = execute. Hidden files like .bashrc are now visible.'
      },
      {
        title: 'Move into a directory',
        explain: 'cd changes your current directory. Use a relative or absolute path.',
        cmd: 'cd labs',
        expect: '',
        note: 'No output = success in Linux. Run pwd to confirm you moved.'
      },
      {
        title: 'Confirm you moved',
        explain: 'Run pwd again to verify your new location.',
        cmd: 'pwd',
        expect: '/home/devops/labs',
        note: 'You are now inside the labs directory'
      },
      {
        title: 'List labs content',
        explain: 'See what is inside labs/ — you have sub-directories for each topic.',
        cmd: 'ls',
        expect: 'linux-basics  networking  docker',
        note: 'These are the lab topic directories'
      },
      {
        title: 'Go up one level',
        explain: 'cd .. moves you up one level to the parent directory. .. always means "parent".',
        cmd: 'cd ..',
        expect: '',
        note: 'You should be back at /home/devops'
      },
      {
        title: 'Go home from anywhere',
        explain: 'cd ~ or just cd (with no arguments) always takes you back to your home directory.',
        cmd: 'cd ~',
        expect: '',
        note: '~ is shorthand for /home/devops. Very useful when lost deep in directories!'
      }
    ]
  },
  {
    id: 'b02', num: 2, category: 'Linux Beginner', title: 'Create & Delete Files and Directories',
    icon: '📁', duration: '12 min',
    objective: 'Use touch, mkdir, rm, and rmdir to create and remove files and directories.',
    theory: `Creating and deleting files is a core Linux skill.

Key commands:
  touch <file>     Create an empty file (or update its timestamp)
  mkdir <dir>      Create a directory
  mkdir -p a/b/c   Create nested directories in one shot
  rm <file>        Delete a file (PERMANENT — no recycle bin!)
  rm -r <dir>      Delete a directory and all its contents
  rm -rf <dir>     Force delete without prompts (use with caution!)
  rmdir <dir>      Remove an EMPTY directory only

⚠️  Linux has no undo for rm. Always double-check before deleting.`,
    steps: [
      {
        title: 'Create a practice directory',
        explain: 'mkdir creates a new directory. Give it a meaningful name.',
        cmd: 'mkdir practice',
        expect: '',
        note: 'No output = success. Verify with ls'
      },
      {
        title: 'Verify it was created',
        explain: 'Use ls to confirm the directory exists.',
        cmd: 'ls',
        expect: 'practice',
        note: 'practice/ should appear in the listing'
      },
      {
        title: 'Create a file inside it',
        explain: 'touch creates an empty file. The path practice/hello.txt is relative to your current directory.',
        cmd: 'touch practice/hello.txt',
        expect: '',
        note: 'Creates hello.txt inside the practice directory'
      },
      {
        title: 'List directory contents',
        explain: 'Verify the file was created by listing the practice directory.',
        cmd: 'ls practice',
        expect: 'hello.txt',
        note: 'hello.txt is inside practice/'
      },
      {
        title: 'Create multiple files at once',
        explain: 'touch accepts multiple filenames — create them all in one command.',
        cmd: 'touch practice/file1.txt practice/file2.txt practice/notes.md',
        expect: '',
        note: 'Three files created at once. Check with ls practice'
      },
      {
        title: 'Create nested directories',
        explain: 'mkdir -p creates parent directories too. Without -p it would fail if parent doesn\'t exist.',
        cmd: 'mkdir -p practice/config/nginx',
        expect: '',
        note: 'Creates practice/config/ and practice/config/nginx/ in one shot'
      },
      {
        title: 'Delete a single file',
        explain: 'rm deletes a file permanently. There is no recycle bin in Linux.',
        cmd: 'rm practice/file1.txt',
        expect: '',
        note: 'file1.txt is gone. Verify with: ls practice'
      },
      {
        title: 'Delete directory and contents',
        explain: 'rm -rf deletes a directory and everything inside it recursively. Be careful!',
        cmd: 'rm -rf practice',
        expect: '',
        note: 'The entire practice directory and all its files are deleted permanently'
      }
    ]
  },
  {
    id: 'b03', num: 3, category: 'Linux Beginner', title: 'View File Content',
    icon: '👁️', duration: '10 min',
    objective: 'Use cat, head, tail, and wc to read and analyze file contents.',
    theory: `Linux has several ways to read file content — each suited for different situations.

Key commands:
  cat <file>       Print entire file to screen
  cat -n <file>    Print with line numbers
  head <file>      Show first 10 lines
  head -n 5 <file> Show first 5 lines
  tail <file>      Show last 10 lines
  tail -n 20 <file>Show last 20 lines
  wc <file>        Count lines, words, bytes
  wc -l <file>     Count lines only

Real DevOps usage:
  tail -f /var/log/syslog   → Live log monitoring (follow mode)
  head -1 file.csv          → Check CSV header
  wc -l access.log          → Count log entries`,
    steps: [
      {
        title: 'Read the README file',
        explain: 'cat prints the entire file content to the terminal. Good for short files.',
        cmd: 'cat README.md',
        expect: '# DevOps Gurukul',
        note: 'You see the full file. For long files this floods your terminal.'
      },
      {
        title: 'View with line numbers',
        explain: 'cat -n adds line numbers. Useful when referencing specific lines.',
        cmd: 'cat -n README.md',
        expect: '1',
        note: 'Each line is numbered. Handy for error messages like "error on line 42"'
      },
      {
        title: 'Read the lab file',
        explain: 'Navigate into the labs and read a lab file.',
        cmd: 'cat labs/linux-basics/lab01.txt',
        expect: 'Lab 01',
        note: 'Full file printed. Notice it has tasks and instructions inside.'
      },
      {
        title: 'See only the first lines',
        explain: 'head shows the beginning of a file — great for checking file format or headers.',
        cmd: 'head -5 labs/linux-basics/lab01.txt',
        expect: 'Lab 01',
        note: 'Only the first 5 lines are shown. Default head shows 10 lines.'
      },
      {
        title: 'See only the last lines',
        explain: 'tail shows the end of a file — very useful for reading recent log entries.',
        cmd: 'tail -5 labs/linux-basics/lab01.txt',
        expect: '',
        note: 'Last 5 lines shown. In real servers: tail -f /var/log/nginx/access.log watches live logs.'
      },
      {
        title: 'Count lines in a file',
        explain: 'wc -l counts lines. wc alone shows lines, words, and bytes.',
        cmd: 'wc -l labs/linux-basics/lab01.txt',
        expect: '',
        note: 'The number before the filename is the line count. Useful for log file analysis.'
      },
      {
        title: 'Create and read your own file',
        explain: 'Use echo with redirection to write content, then cat to read it back.',
        cmd: 'echo "My first Linux file" > myfile.txt',
        expect: '',
        note: '> redirects output INTO a file. >> would append. Now run: cat myfile.txt'
      },
      {
        title: 'Read your created file',
        explain: 'Verify the file you just created contains the right content.',
        cmd: 'cat myfile.txt',
        expect: 'My first Linux file',
        note: 'This is the core workflow: write to file, verify with cat.'
      }
    ]
  },
  {
    id: 'b04', num: 4, category: 'Linux Beginner', title: 'Search Files with find',
    icon: '🔍', duration: '12 min',
    objective: 'Use the find command to locate files and directories using various filters.',
    theory: `find is one of the most powerful Linux commands. It searches the filesystem recursively.

Syntax: find <where> <what>

Common filters:
  -name "*.txt"     Match by filename (supports wildcards)
  -type f           Files only
  -type d           Directories only
  -iname "*.TXT"    Case-insensitive name match

Combining filters:
  find . -type f -name "*.txt"     Text files in current directory
  find /etc -name "*.conf"         Config files in /etc
  find /home -type d               All directories under /home

Real DevOps usage:
  find / -name "nginx.conf"        Locate nginx config
  find /var/log -name "*.log"      Find all log files
  find . -name "*.sh" -type f      Find all shell scripts`,
    steps: [
      {
        title: 'Find all files from current directory',
        explain: 'find . lists EVERYTHING under the current directory, recursively.',
        cmd: 'find .',
        expect: './',
        note: 'The . means "start here". Every file and directory is shown with its path.'
      },
      {
        title: 'Find only files',
        explain: '-type f filters to regular files only, excluding directories.',
        cmd: 'find . -type f',
        expect: '',
        note: 'Only files shown — no directories. Compare with previous output.'
      },
      {
        title: 'Find only directories',
        explain: '-type d filters to directories only.',
        cmd: 'find . -type d',
        expect: './',
        note: 'Only directories. Useful to see the folder structure without files.'
      },
      {
        title: 'Find by filename',
        explain: '-name filters by filename. Use quotes to prevent shell expansion.',
        cmd: 'find . -name "*.txt"',
        expect: '.txt',
        note: '*.txt matches any file ending in .txt. The * is a wildcard.'
      },
      {
        title: 'Find specific filename',
        explain: 'Search for an exact filename anywhere under current directory.',
        cmd: 'find . -name "README.md"',
        expect: 'README.md',
        note: 'Returns the full relative path. Useful when you know the name but not the location.'
      },
      {
        title: 'Find lab files specifically',
        explain: 'Combine -type f and -name to be precise.',
        cmd: 'find . -type f -name "lab*.txt"',
        expect: 'lab',
        note: 'lab*.txt matches lab01.txt, lab02.txt etc. Multiple filters narrow results.'
      },
      {
        title: 'Search in /etc directory',
        explain: 'Search in a different directory — find config files in /etc.',
        cmd: 'find /etc -name "*.conf"',
        expect: '.conf',
        note: 'Searches all of /etc recursively. On real systems this finds nginx.conf, ssh config etc.'
      },
      {
        title: 'Find directories in /etc',
        explain: 'Find only directories inside /etc.',
        cmd: 'find /etc -type d',
        expect: '/etc',
        note: 'Shows sub-directories within /etc like /etc/nginx, /etc/ssh etc.'
      }
    ]
  },
  {
    id: 'b05', num: 5, category: 'Linux Beginner', title: 'File Permissions with chmod',
    icon: '🔐', duration: '15 min',
    objective: 'Read Linux file permissions and change them using chmod.',
    theory: `Every Linux file has permissions controlling who can read, write, or execute it.

Reading ls -l output:
  -rwxr-xr-- 1 devops devops 1234 Jul 3 README.md
  │├┤├─┤├─┤
  ││ │ │ └── Other (everyone else)
  ││ │ └──── Group
  ││ └─────── Owner (user)
  │└────────── File type (- file, d directory, l symlink)

Permission bits:
  r = read    (4)   Can view content
  w = write   (2)   Can modify content
  x = execute (1)   Can run as program

chmod modes:
  Symbolic: chmod +x file   (add execute)
            chmod -w file   (remove write)
            chmod u+x file  (add execute for user only)
  
  Numeric:  chmod 755 file  (rwxr-xr-x)
            chmod 644 file  (rw-r--r--)
            chmod 600 file  (rw-------)

Common permission sets:
  755 → Scripts, executables (owner: all, group/other: read+execute)
  644 → Regular files (owner: read+write, group/other: read only)
  600 → Private files like SSH keys (owner only)`,
    steps: [
      {
        title: 'View file permissions',
        explain: 'ls -l shows permissions in the first column. Read the permission string.',
        cmd: 'ls -l README.md',
        expect: '-rw-r--r--',
        note: '-rw-r--r-- means: file(-), owner can read+write(rw-), group can read(r--), others can read(r--)'
      },
      {
        title: 'View all file permissions',
        explain: 'See permissions for everything in the current directory.',
        cmd: 'ls -la',
        expect: 'drwx',
        note: 'Notice directories start with d. Hidden files (.bashrc) are also visible.'
      },
      {
        title: 'Create a script file',
        explain: 'Create a shell script file to practice changing permissions.',
        cmd: 'touch myscript.sh',
        expect: '',
        note: 'Shell scripts conventionally end in .sh'
      },
      {
        title: 'Check script permissions',
        explain: 'New files are created without execute permission by default.',
        cmd: 'ls -l myscript.sh',
        expect: '-rw-r--r--',
        note: 'No x anywhere — this script cannot be executed yet.'
      },
      {
        title: 'Add execute permission',
        explain: 'chmod +x adds execute permission for owner, group, and others.',
        cmd: 'chmod +x myscript.sh',
        expect: '',
        note: 'No output = success. Now check with ls -l to see the change.'
      },
      {
        title: 'Verify execute was added',
        explain: 'Run ls -l again to confirm the permission change.',
        cmd: 'ls -l myscript.sh',
        expect: '-rwxr-xr-x',
        note: 'x is now set for owner, group, and others. The file is now executable!'
      },
      {
        title: 'Set permissions numerically',
        explain: '755 = rwxr-xr-x. Owner gets all (7=4+2+1), group+others get read+execute (5=4+1).',
        cmd: 'chmod 755 myscript.sh',
        expect: '',
        note: 'Same result as chmod +x but more explicit. Use numbers for precise control.'
      },
      {
        title: 'Set read-only permissions',
        explain: '444 = r--r--r-- makes the file read-only for everyone.',
        cmd: 'chmod 444 myscript.sh',
        expect: '',
        note: 'Now nobody can write to it. Verify: ls -l myscript.sh'
      },
      {
        title: 'Restore normal permissions',
        explain: '644 = rw-r--r-- is the standard for regular files.',
        cmd: 'chmod 644 myscript.sh',
        expect: '',
        note: 'Owner can read+write. Group and others can only read. This is the default for most config files.'
      }
    ]
  },
  {
    id: 'b06', num: 6, category: 'Linux Beginner', title: 'Copy and Move Files',
    icon: '📋', duration: '10 min',
    objective: 'Copy files with cp and move/rename them with mv.',
    theory: `cp (copy) duplicates files or directories.
mv (move) relocates files. It is also used to rename files.

Key commands:
  cp file.txt newfile.txt     Copy file
  cp -r dir1 dir2             Copy directory recursively
  mv oldname.txt newname.txt  Rename file
  mv file.txt /tmp/           Move file to directory

Unlike rm, cp and mv will overwrite existing files by default without asking.`,
    steps: [
      {
        title: 'Create a test file',
        explain: 'First, let us create a file to copy and move.',
        cmd: 'touch secret.txt',
        expect: '',
        note: 'A file named secret.txt is created.'
      },
      {
        title: 'Copy the file',
        explain: 'Use cp to make a backup copy of the file.',
        cmd: 'cp secret.txt backup.txt',
        expect: '',
        note: 'You now have two identical files.'
      },
      {
        title: 'Verify the copy',
        explain: 'List files to see both of them.',
        cmd: 'ls',
        expect: 'backup.txt',
        note: 'Both secret.txt and backup.txt should be visible.'
      },
      {
        title: 'Create a directory',
        explain: 'Create a folder to move things into.',
        cmd: 'mkdir vault',
        expect: '',
        note: ''
      },
      {
        title: 'Move file into directory',
        explain: 'Use mv to move the backup into the vault directory.',
        cmd: 'mv backup.txt vault/',
        expect: '',
        note: 'The file is no longer in the current directory.'
      },
      {
        title: 'Rename the file',
        explain: 'mv is also used to rename files. Rename secret.txt.',
        cmd: 'mv secret.txt public.txt',
        expect: '',
        note: 'secret.txt is gone, replaced by public.txt.'
      }
    ]
  },
  {
    id: 'b07', num: 7, category: 'Linux Beginner', title: 'Redirection and Pipes',
    icon: '🔀', duration: '15 min',
    objective: 'Control where output goes using >, >> and understand pipes.',
    theory: `Redirection changes where a command reads from or writes to.

Operators:
  >   Redirect output to a file (overwrites file)
  >>  Redirect and append to a file (adds to end)
  |   Pipe output of one command as input to another

Examples:
  echo "hello" > file.txt   Write to file
  echo "world" >> file.txt  Append to file
  ls -l | grep "Jan"        Find January files`,
    steps: [
      {
        title: 'Write to a new file',
        explain: 'Use > to write the output of echo into a file.',
        cmd: 'echo "Line 1" > data.txt',
        expect: '',
        note: 'The > operator creates or overwrites data.txt.'
      },
      {
        title: 'Read the file',
        explain: 'Verify what was written.',
        cmd: 'cat data.txt',
        expect: 'Line 1',
        note: ''
      },
      {
        title: 'Overwrite the file',
        explain: 'Using > again will destroy the old content.',
        cmd: 'echo "New Line 1" > data.txt',
        expect: '',
        note: 'Careful! The old data is gone.'
      },
      {
        title: 'Check the overwrite',
        explain: 'See that the file only contains the new line.',
        cmd: 'cat data.txt',
        expect: 'New Line 1',
        note: ''
      },
      {
        title: 'Append to the file',
        explain: 'Use >> to add data without erasing what is there.',
        cmd: 'echo "Line 2" >> data.txt',
        expect: '',
        note: '>> is safe. It only adds to the end.'
      },
      {
        title: 'Verify the append',
        explain: 'You should now see both lines.',
        cmd: 'cat data.txt',
        expect: 'Line 2',
        note: 'Both lines are present.'
      }
    ]
  },
  {
    id: 'b08', num: 8, category: 'Linux Beginner', title: 'Disk and Memory Usage',
    icon: '💾', duration: '10 min',
    objective: 'Monitor system resources using df and free.',
    theory: `Monitoring resource usage is a daily DevOps task.

Commands:
  df    Disk Free (shows filesystem space)
  df -h Human readable (MB, GB instead of blocks)
  free  Memory and Swap usage
  top   Live process and resource monitor`,
    steps: [
      {
        title: 'Check disk space',
        explain: 'Use df to see how much space is left on the drives.',
        cmd: 'df',
        expect: 'Filesystem',
        note: 'Notice the Use% column. It tells you how full a drive is.'
      },
      {
        title: 'Check RAM memory',
        explain: 'free shows available and used RAM.',
        cmd: 'free',
        expect: 'Mem:',
        note: 'Look at the available column to see how much RAM you can actually use.'
      },
      {
        title: 'View system uptime',
        explain: 'uptime shows how long the server has been running.',
        cmd: 'uptime',
        expect: 'load average',
        note: 'Also shows load average: CPU usage over 1, 5, and 15 minutes.'
      },
      {
        title: 'View running processes',
        explain: 'ps shows a snapshot of currently running processes.',
        cmd: 'ps',
        expect: 'PID',
        note: 'Every program running gets a Process ID (PID).'
      }
    ]
  },
  {
    id: 'b09', num: 9, category: 'Linux Beginner', title: 'Search inside Files',
    icon: '🔬', duration: '15 min',
    objective: 'Use grep to search for specific text patterns inside files.',
    theory: `grep is the ultimate search tool in Linux.
It filters text line by line.

Syntax:
  grep [options] "pattern" file

Options:
  -i    Case-insensitive search
  -n    Show line numbers
  -v    Invert match (show lines that DO NOT match)`,
    steps: [
      {
        title: 'Create a log file',
        explain: 'First, let us create a simple file to search in.',
        cmd: 'echo -e "error on line 1\\nwarning on line 2\\nerror on line 3" > log.txt',
        expect: '',
        note: 'We now have a file with some logs.'
      },
      {
        title: 'Search for a word',
        explain: 'Use grep to find only the lines containing "error".',
        cmd: 'grep error log.txt',
        expect: 'error on line 1',
        note: 'Only lines with the word error are returned.'
      },
      {
        title: 'Case insensitive search',
        explain: 'Add -i to ignore case differences.',
        cmd: 'grep -i ERROR log.txt',
        expect: 'error',
        note: 'It matched "error" even though we searched for "ERROR".'
      },
      {
        title: 'Show line numbers',
        explain: 'Use -n to see exactly where the match is in the file.',
        cmd: 'grep -n warning log.txt',
        expect: '2:warning',
        note: 'The number before the colon is the line number.'
      }
    ]
  },
  {
    id: 'b10', num: 10, category: 'Linux Beginner', title: 'History and Shortcuts',
    icon: '⌨️', duration: '5 min',
    objective: 'Work faster using the history command and terminal shortcuts.',
    theory: `Real engineers rarely type commands from scratch.
They use shortcuts to save time.

Shortcuts:
  Up Arrow    ↑   Bring back previous command
  Down Arrow  ↓   Go forward in history
  history         Show numbered list of past commands

  Ctrl + L        Clear the screen (same as "clear" cmd)
  Ctrl + C        Cancel/interrupt a running command`,
    steps: [
      {
        title: 'Run a random command',
        explain: 'Let us generate a command for history.',
        cmd: 'echo "testing history"',
        expect: 'testing history',
        note: ''
      },
      {
        title: 'View your history',
        explain: 'The history command shows everything you typed.',
        cmd: 'history',
        expect: 'echo',
        note: 'Each command has a number. Notice your echo command.'
      },
      {
        title: 'Clear the screen',
        explain: 'Keep your workspace clean by clearing the screen.',
        cmd: 'clear',
        expect: '',
        note: 'The shortcut Ctrl+L does the exact same thing instantly.'
      }
    ]
  }
  ,
  {
    id: 'i01', num: 11, category: 'Linux Intermediate', title: 'Users and Groups',
    icon: '👥', duration: '15 min',
    objective: 'Manage users and groups using useradd, usermod, and groupadd.',
    theory: `Linux is a multi-user system. Every process runs as a specific user.
Users are organized into groups for easier permission management.

Core commands:
  useradd <name>   Create a new user
  usermod          Modify user properties
  groupadd <name>  Create a new group
  id               Show current user identity`,
    steps: [
      {
        title: 'Check current user',
        explain: 'First, see who you are logged in as.',
        cmd: 'id',
        expect: 'uid=',
        note: 'You are logged in as devops.'
      },
      {
        title: 'Create a new group',
        explain: 'Create a group named developers.',
        cmd: 'groupadd developers',
        expect: '',
        note: 'Groups help manage permissions for multiple users at once.'
      },
      {
        title: 'Create a new user',
        explain: 'Create a user named alice and add her to developers.',
        cmd: 'useradd -G developers alice',
        expect: '',
        note: 'The -G flag adds the user to a supplementary group.'
      }
    ]
  },
  {
    id: 'i02', num: 12, category: 'Linux Intermediate', title: 'Sudo and Privilege Escalation',
    icon: '🛡️', duration: '10 min',
    objective: 'Understand sudo and privilege escalation.',
    theory: `The root user is the ultimate admin in Linux. 
However, logging in directly as root is dangerous.

Instead, we use "sudo" (SuperUser DO) to temporarily elevate privileges for a single command.`,
    steps: [
      {
        title: 'Attempt an admin command',
        explain: 'Try to read the secure shadow file without sudo.',
        cmd: 'cat /etc/shadow',
        expect: 'Permission denied',
        note: 'You get Permission denied because it requires root.'
      },
      {
        title: 'Use sudo',
        explain: 'Use sudo to run the same command as root.',
        cmd: 'sudo cat /etc/shadow',
        expect: 'root:',
        note: 'Sudo elevated your privileges to read the file.'
      }
    ]
  },
  {
    id: 'i03', num: 13, category: 'Linux Intermediate', title: 'Monitor Processes',
    icon: '📈', duration: '15 min',
    objective: 'Monitor processes using ps, top, and htop.',
    theory: `Every running program is a "process".
You need to know what processes are running and how much CPU/RAM they use.

Commands:
  ps    Snapshot of current processes
  top   Live updating list of processes
  htop  Interactive, colorful process viewer`,
    steps: [
      {
        title: 'View all processes',
        explain: 'Use ps to list every process on the system.',
        cmd: 'ps aux',
        expect: 'PID',
        note: 'aux shows processes for all users in a detailed format.'
      },
      {
        title: 'Search for a process',
        explain: 'Find if a specific service is running by combining ps and grep.',
        cmd: 'ps aux | grep bash',
        expect: 'bash',
        note: 'This is the most common way to check if an app is running.'
      },
      {
        title: 'Run top',
        explain: 'View live process statistics.',
        cmd: 'top -n 1',
        expect: 'Tasks:',
        note: '-n 1 runs top for a single iteration and exits.'
      }
    ]
  },
  {
    id: 'i04', num: 14, category: 'Linux Intermediate', title: 'Kill Processes',
    icon: '💀', duration: '10 min',
    objective: 'Kill and manage processes using kill and pkill.',
    theory: `When a process hangs or consumes too many resources, you must terminate it.

Signals:
  SIGTERM (15)  Polite request to stop (default)
  SIGKILL (9)   Forceful immediate termination

Commands:
  kill <PID>    Kill by Process ID
  pkill <name>  Kill by process name`,
    steps: [
      {
        title: 'Create a background process',
        explain: 'Start a process that runs infinitely in the background.',
        cmd: 'sleep 300 &',
        expect: '[1]',
        note: 'The & symbol puts the command in the background.'
      },
      {
        title: 'Kill by name',
        explain: 'Use pkill to terminate the sleep process.',
        cmd: 'pkill sleep',
        expect: '',
        note: 'pkill is faster than finding the PID manually.'
      }
    ]
  },
  {
    id: 'i05', num: 15, category: 'Linux Intermediate', title: 'Schedule Jobs',
    icon: '⏰', duration: '12 min',
    objective: 'Schedule jobs using cron and at.',
    theory: `Automation requires running scripts at specific times.
"cron" runs tasks on a repeating schedule.

Cron format: * * * * * command
(Minute Hour Day Month DayOfWeek)`,
    steps: [
      {
        title: 'View crontab',
        explain: 'List the current scheduled cron jobs for your user.',
        cmd: 'crontab -l',
        expect: '',
        note: 'By default, it is empty.'
      },
      {
        title: 'Add a cron job',
        explain: 'Echo a new cron job that runs every minute.',
        cmd: 'echo "* * * * * echo hello >> /tmp/cron.log" > mycron && crontab mycron',
        expect: '',
        note: 'This writes the job to a file and loads it into crontab.'
      },
      {
        title: 'Verify the job',
        explain: 'Check if it was loaded successfully.',
        cmd: 'crontab -l',
        expect: '* * * * * echo hello',
        note: 'The task is now scheduled.'
      }
    ]
  },
  {
    id: 'i06', num: 16, category: 'Linux Intermediate', title: 'Manage Services',
    icon: '⚙️', duration: '15 min',
    objective: 'Manage services using systemctl.',
    theory: `Modern Linux uses "systemd" to manage background services (daemons).
You control it using the systemctl command.

Commands:
  systemctl start <service>
  systemctl stop <service>
  systemctl restart <service>
  systemctl status <service>`,
    steps: [
      {
        title: 'Check service status',
        explain: 'Check the status of the simulated nginx web server.',
        cmd: 'systemctl status nginx',
        expect: 'inactive',
        note: 'It is currently stopped.'
      },
      {
        title: 'Start the service',
        explain: 'Use systemctl to start it.',
        cmd: 'systemctl start nginx',
        expect: '',
        note: 'It runs silently on success.'
      },
      {
        title: 'Verify it is running',
        explain: 'Check the status again.',
        cmd: 'systemctl status nginx',
        expect: 'active',
        note: 'The service is now active.'
      }
    ]
  },
  {
    id: 'i07', num: 17, category: 'Linux Intermediate', title: 'Analyze Logs',
    icon: '📜', duration: '12 min',
    objective: 'Analyze logs in /var/log.',
    theory: `Logs are critical for debugging. 
Most system logs live in /var/log.

Important logs:
  /var/log/syslog    General system activity
  /var/log/auth.log  Authentication attempts
  
Use commands like tail and grep to read them.`,
    steps: [
      {
        title: 'Simulate a log file',
        explain: 'First, let us create a fake syslog with some errors.',
        cmd: 'echo -e "Started nginx\\nERROR: Failed to bind port\\nStopped nginx" > /var/log/syslog',
        expect: '',
        note: ''
      },
      {
        title: 'View recent logs',
        explain: 'Use tail to view the last 10 lines of the log.',
        cmd: 'tail /var/log/syslog',
        expect: 'nginx',
        note: 'tail is great for watching live logs.'
      },
      {
        title: 'Filter for errors',
        explain: 'Use grep to find only the ERROR lines.',
        cmd: 'grep ERROR /var/log/syslog',
        expect: 'ERROR',
        note: 'This isolates the problem quickly.'
      }
    ]
  },
  {
    id: 'i08', num: 18, category: 'Linux Intermediate', title: 'Archives and Compression',
    icon: '🗜️', duration: '15 min',
    objective: 'Work with tar, gzip, zip files.',
    theory: `To save space or bundle files for transfer, we use archives.

Tar (Tape Archive) bundles files together. Gzip compresses them.

Flags for tar:
  -c  Create archive
  -x  Extract archive
  -v  Verbose (show files)
  -f  Specify filename
  -z  Compress with gzip (.tar.gz)`,
    steps: [
      {
        title: 'Create dummy files',
        explain: 'Make some files to compress.',
        cmd: 'touch file1.txt file2.txt',
        expect: '',
        note: ''
      },
      {
        title: 'Create a tarball',
        explain: 'Bundle and compress them into a .tar.gz archive.',
        cmd: 'tar -czvf myarchive.tar.gz file1.txt file2.txt',
        expect: 'file',
        note: 'The output shows the files being packed.'
      },
      {
        title: 'List archive contents',
        explain: 'See what is inside without extracting it.',
        cmd: 'tar -tf myarchive.tar.gz',
        expect: 'file1.txt',
        note: 'The -t flag lists the contents.'
      }
    ]
  },
  {
    id: 'i09', num: 19, category: 'Linux Intermediate', title: 'Network Troubleshooting',
    icon: '🌐', duration: '15 min',
    objective: 'Network troubleshooting using ping, netstat, ss.',
    theory: `When an app goes down, it is often a network issue.

Commands:
  ping     Test connectivity to a host
  ss       Modern alternative to view active connections`,
    steps: [
      {
        title: 'Test connectivity',
        explain: 'Ping google.com to check if you have internet access.',
        cmd: 'ping -c 3 google.com',
        expect: 'bytes from',
        note: '-c 3 sends exactly 3 packets.'
      },
      {
        title: 'View connections',
        explain: 'Use ss to list all active TCP connections.',
        cmd: 'ss -t',
        expect: 'State',
        note: '-t shows only TCP sockets.'
      }
    ]
  },
  {
    id: 'i10', num: 20, category: 'Linux Intermediate', title: 'Open Ports',
    icon: '🚪', duration: '10 min',
    objective: 'Check open ports and services.',
    theory: `Servers listen for traffic on specific "ports".
Port 80 is HTTP, 443 is HTTPS, 22 is SSH.

You must ensure your application is actually listening on the expected port.`,
    steps: [
      {
        title: 'View listening ports',
        explain: 'Use ss to see what ports are open and listening.',
        cmd: 'ss -tln',
        expect: 'LISTEN',
        note: '-l means listening, -n shows numeric ports instead of names.'
      },
      {
        title: 'Test a local port',
        explain: 'Check if something is responding on port 80.',
        cmd: 'curl -I http://localhost:80',
        expect: 'HTTP',
        note: 'curl -I fetches just the HTTP headers.'
      }
    ]
  }
  ,
  {
    id: 'a01', num: 21, category: 'Advanced OS / Admin', title: 'Custom Systemd Services',
    icon: '⚙️', duration: '15 min',
    objective: 'Configure and manage custom systemd services.',
    theory: `systemd manages services via unit files in /etc/systemd/system/.
You can create a custom .service file to run any script or program as a daemon in the background.`,
    steps: [
      {
        title: 'Create service file',
        explain: 'Create a simple service unit file.',
        cmd: 'echo "[Service]\\nExecStart=/bin/echo hello" > /etc/systemd/system/myservice.service',
        expect: '',
        note: 'This defines what the service runs.'
      },
      {
        title: 'Reload systemd daemon',
        explain: 'Systemd must be told to look for new files.',
        cmd: 'systemctl daemon-reload',
        expect: '',
        note: 'Always run this after editing a .service file.'
      }
    ]
  },
  {
    id: 'a02', num: 22, category: 'Advanced OS / Admin', title: 'Analyze Boot Process',
    icon: '⏱️', duration: '10 min',
    objective: 'Analyze boot process using systemd-analyze.',
    theory: `Slow boot times can be debugged using systemd-analyze.
It shows how long the kernel, initramfs, and userspace took to boot.
Use "blame" to find exactly which service slowed down the boot.`,
    steps: [
      {
        title: 'Check total boot time',
        explain: 'See how long the system took to start.',
        cmd: 'systemd-analyze',
        expect: 'Startup finished',
        note: 'Shows a summary of boot times.'
      },
      {
        title: 'Find slow services',
        explain: 'List the slowest services to start.',
        cmd: 'systemd-analyze blame | head -n 3',
        expect: 'ms',
        note: 'Useful for finding misconfigured daemons.'
      }
    ]
  },
  {
    id: 'a03', num: 23, category: 'Advanced OS / Admin', title: 'Manage Disk Partitions',
    icon: '💽', duration: '15 min',
    objective: 'Manage disk partitions using fdisk or parted.',
    theory: `Disks must be partitioned before use.
Linux sees disks as block devices (e.g., /dev/sda, /dev/nvme0n1).
"fdisk" is an interactive tool for MBR/GPT partitioning.`,
    steps: [
      {
        title: 'List block devices',
        explain: 'View all attached disks and partitions.',
        cmd: 'lsblk',
        expect: 'disk',
        note: 'Shows the tree of disks and partitions.'
      },
      {
        title: 'Check partition tables',
        explain: 'Use fdisk to list partition details.',
        cmd: 'fdisk -l',
        expect: 'Disk /dev',
        note: 'Requires root privileges (simulated here).'
      }
    ]
  },
  {
    id: 'a04', num: 24, category: 'Advanced OS / Admin', title: 'Filesystems and Mounts',
    icon: '📁', duration: '15 min',
    objective: 'Create and mount filesystems (ext4, xfs).',
    theory: `A partition needs a filesystem (like ext4 or xfs) before storing files.
Mounting attaches that filesystem to a directory in your tree.
The /etc/fstab file makes mounts permanent across reboots.`,
    steps: [
      {
        title: 'Format a partition',
        explain: 'Create an ext4 filesystem on a block device.',
        cmd: 'mkfs.ext4 /dev/sdb1',
        expect: 'Creating journal',
        note: 'This destroys all data on /dev/sdb1.'
      },
      {
        title: 'Mount the filesystem',
        explain: 'Attach it to the /data directory.',
        cmd: 'mount /dev/sdb1 /data',
        expect: '',
        note: 'Files written to /data now go to the sdb1 partition.'
      }
    ]
  },
  {
    id: 'a05', num: 25, category: 'Advanced OS / Admin', title: 'Logical Volume Manager (LVM)',
    icon: '📚', duration: '20 min',
    objective: 'Configure LVM (create VG, LV, extend volumes).',
    theory: `LVM abstracts physical disks into flexible logical volumes.
1. Physical Volumes (PV): The actual disks.
2. Volume Groups (VG): Pools of PVs.
3. Logical Volumes (LV): Virtual partitions carved from a VG.`,
    steps: [
      {
        title: 'Create a Volume Group',
        explain: 'Combine disks into a VG named datavg.',
        cmd: 'vgcreate datavg /dev/sdc',
        expect: 'successfully created',
        note: 'You can add more disks to this pool later.'
      },
      {
        title: 'Create a Logical Volume',
        explain: 'Carve out a 10G logical volume named app_lv.',
        cmd: 'lvcreate -L 10G -n app_lv datavg',
        expect: 'created',
        note: 'This creates the device /dev/datavg/app_lv.'
      }
    ]
  },
  {
    id: 'a06', num: 26, category: 'Advanced OS / Admin', title: 'Swap and Memory',
    icon: '🧠', duration: '15 min',
    objective: 'Manage swap space and tune memory usage.',
    theory: `Swap is disk space used when RAM is full.
It prevents the system from crashing (OOM - Out of Memory) but is very slow.`,
    steps: [
      {
        title: 'Check memory and swap',
        explain: 'View how much RAM and swap is in use.',
        cmd: 'free -h',
        expect: 'Swap:',
        note: '-h makes the sizes human-readable (Megabytes/Gigabytes).'
      },
      {
        title: 'View swap devices',
        explain: 'See which disks or files provide the swap.',
        cmd: 'swapon --show',
        expect: 'NAME',
        note: 'You can add a swap file using mkswap and swapon.'
      }
    ]
  },
  {
    id: 'a07', num: 27, category: 'Advanced OS / Admin', title: 'Firewall Configuration',
    icon: '🔥', duration: '15 min',
    objective: 'Configure firewall using iptables or firewalld.',
    theory: `Linux firewalls block or allow network traffic.
"iptables" is the traditional tool, while "firewalld" provides a higher-level zone-based approach.`,
    steps: [
      {
        title: 'List firewall rules',
        explain: 'Show current iptables rules.',
        cmd: 'iptables -L -n',
        expect: 'Chain INPUT',
        note: '-n prevents slow DNS resolution of IP addresses.'
      },
      {
        title: 'Allow a port',
        explain: 'Open TCP port 80 for web traffic.',
        cmd: 'iptables -A INPUT -p tcp --dport 80 -j ACCEPT',
        expect: '',
        note: '-A appends the rule. -j ACCEPT allows the packet.'
      }
    ]
  },
  {
    id: 'a08', num: 28, category: 'Advanced OS / Admin', title: 'SSH Keys and Auth',
    icon: '🔑', duration: '15 min',
    objective: 'Set up and troubleshoot SSH access.',
    theory: `SSH keys are mathematically linked pairs (Public/Private) used for secure logins without passwords.
The public key goes on the server in ~/.ssh/authorized_keys.
The private key stays strictly on your client.`,
    steps: [
      {
        title: 'Generate a keypair',
        explain: 'Create an ed25519 SSH key.',
        cmd: 'ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""',
        expect: 'Your public key has been saved',
        note: '-N "" means no passphrase is required to use the key.'
      },
      {
        title: 'View the public key',
        explain: 'This is what you paste into GitHub or the remote server.',
        cmd: 'cat ~/.ssh/id_ed25519.pub',
        expect: 'ssh-ed25519',
        note: 'Never share the private key (without the .pub extension)!'
      }
    ]
  },
  {
    id: 'a09', num: 29, category: 'Advanced OS / Admin', title: 'System Performance',
    icon: '📊', duration: '15 min',
    objective: 'Monitor system performance using vmstat, iostat, sar.',
    theory: `Performance tuning requires gathering metrics.
  vmstat: Virtual memory and CPU usage
  iostat: Disk I/O performance
  sar: Historical system activity (sysstat package)`,
    steps: [
      {
        title: 'Check memory/cpu stats',
        explain: 'Run vmstat to get a quick overview.',
        cmd: 'vmstat 1 3',
        expect: 'procs',
        note: 'This runs 3 times with a 1-second delay.'
      },
      {
        title: 'Check disk I/O',
        explain: 'View how hard the disks are working.',
        cmd: 'iostat -x 1 2',
        expect: 'avg-cpu',
        note: '-x gives extended statistics like %util (utilization).'
      }
    ]
  },
  {
    id: 'a10', num: 30, category: 'Advanced OS / Admin', title: 'Troubleshooting Scenarios',
    icon: '🕵️', duration: '20 min',
    objective: 'Troubleshoot high CPU/memory/disk usage scenario.',
    theory: `When an alert fires, you must find the root cause.
High Disk Usage: Use df -h and du -sh.
High CPU/Mem: Use top, ps, and check logs.`,
    steps: [
      {
        title: 'Find full disks',
        explain: 'Check which partition is out of space.',
        cmd: 'df -h',
        expect: 'Mounted on',
        note: 'Look for Use% near 100%.'
      },
      {
        title: 'Find large files',
        explain: 'Find the largest directories taking up space.',
        cmd: 'du -sh /var/log/* | sort -rh | head -n 5',
        expect: '',
        note: 'sort -rh sorts in reverse human-readable format.'
      }
    ]
  }
];

class LabsManager {
  constructor() {
    this.progress = JSON.parse(localStorage.getItem('devops-gurukul-progress') || '{}');
  }

  saveProgress() {
    localStorage.setItem('devops-gurukul-progress', JSON.stringify(this.progress));
  }

  markStep(labId, stepIdx) {
    if (!this.progress[labId]) this.progress[labId] = {};
    this.progress[labId][stepIdx] = true;
    this.saveProgress();
  }

  unmarkStep(labId, stepIdx) {
    if (this.progress[labId]) delete this.progress[labId][stepIdx];
    this.saveProgress();
  }

  getLabProgress(labId) {
    const lab = LABS.find(l => l.id === labId);
    if (!lab) return { done: 0, total: 0 };
    const done = Object.keys(this.progress[labId] || {}).length;
    return { done, total: lab.steps.length };
  }

  getTotalProgress() {
    let done = 0, total = 0;
    LABS.forEach(lab => {
      const p = this.getLabProgress(lab.id);
      done += p.done; total += p.total;
    });
    return { done, total };
  }

  resetLab(labId) {
    delete this.progress[labId];
    this.saveProgress();
  }
}

window.LABS = LABS;
window.LabsManager = LabsManager;
