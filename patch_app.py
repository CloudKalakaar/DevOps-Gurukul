with open('js/app.js', encoding='utf-8') as f:
    content = f.read()

# Add renderLabsList calls
content = content.replace(
    "if (sec === 'linux') setTimeout(() => inp.focus(), 100);",
    "if (sec === 'linux') setTimeout(() => inp.focus(), 100);\n      if (sec === 'labs') renderLabsList();"
)
content = content.replace(
    "  // Init labs list\n  renderLabsList();\n});\n",
    "});\n"
)
content = content.replace(
    "  initTerminal();\n",
    "  initTerminal();\n  renderLabsList();\n"
)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
