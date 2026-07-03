const additionalLabs = [
  {
    id: 'b06', num: 6, category: 'Beginner', title: 'Copy and Move Files',
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
    id: 'b07', num: 7, category: 'Beginner', title: 'Redirection and Pipes',
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
    id: 'b08', num: 8, category: 'Beginner', title: 'Disk and Memory Usage',
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
    id: 'b09', num: 9, category: 'Beginner', title: 'Search inside Files',
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
    id: 'b10', num: 10, category: 'Beginner', title: 'History and Shortcuts',
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
]
