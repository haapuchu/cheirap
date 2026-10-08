import json

with open('conversation_history_raw.jsonl', 'r', encoding='utf-8') as f:
    lines = [json.loads(line) for line in f]

for l in lines[270:]:
    step = l.get('step_index')
    t = l.get('type')
    calls = l.get('tool_calls', [])
    content = l.get('content', '')
    call_names = [c.get('name') for c in calls]
    print(f"=== Step {step} | Type: {t} | Calls: {call_names} ===")
    if content:
        print(content[:500])
        print("...")
