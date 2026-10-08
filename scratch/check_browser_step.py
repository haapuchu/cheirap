import json

with open('conversation_history_raw.jsonl', 'r', encoding='utf-8') as f:
    lines = [json.loads(line) for line in f]

for l in lines:
    calls = l.get('tool_calls', [])
    for c in calls:
        if c.get('name') == 'browser_subagent':
            print("BROWSER CALL ARGS:")
            print(json.dumps(c.get('args'), indent=2))
    if l.get('type') == 'GENERIC' or 'browser' in str(l).lower():
        # check if it's the result of browser subagent
        if l.get('step_index') in (287, 288, 289):
            print(f"STEP {l.get('step_index')} ({l.get('type')}):")
            print(str(l)[:1500])
