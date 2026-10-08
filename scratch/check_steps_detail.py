import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('conversation_history_raw.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        l = json.loads(line)
        idx = l.get('step_index')
        if 285 <= idx <= 292:
            print(f"--- STEP {idx}: type={l.get('type')} status={l.get('status')} ---")
            calls = l.get('tool_calls', [])
            if calls:
                print("tool_calls:", [c.get('name') for c in calls])
            content = str(l.get('content', ''))
            if content:
                print("content:", content[:400])
