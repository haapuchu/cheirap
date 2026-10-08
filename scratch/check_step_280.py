import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('conversation_history_raw.jsonl', 'r', encoding='utf-8') as f:
    lines = [json.loads(line) for line in f]

for l in lines:
    step = l.get('step_index')
    if 280 <= step <= 291:
        print(f"================ STEP {step} ================")
        print(f"Type: {l.get('type')}")
        calls = l.get('tool_calls', [])
        if calls:
            print("Calls:", json.dumps(calls, indent=2))
        content = l.get('content', '')
        if content:
            print("Content:", content[:1000])
