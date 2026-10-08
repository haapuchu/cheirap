import json

with open('conversation_history_raw.jsonl', 'r', encoding='utf-8') as f:
    lines = [json.loads(line) for line in f]

for l in lines:
    idx = l.get('step_index')
    if idx is not None and 280 <= idx <= 295:
        tc = [c.get('name') for c in l.get('tool_calls', [])]
        cont = str(l.get('content', ''))[:150]
        print(f"Step {idx:3d} | Type: {l.get('type'):20s} | Calls: {tc} | Content: {cont}")
