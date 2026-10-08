import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('CONVERSATION_HISTORY.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for i, l in enumerate(lines):
    if l.startswith('#'):
        print(f"Line {i+1:4d}: {l.strip()}")
