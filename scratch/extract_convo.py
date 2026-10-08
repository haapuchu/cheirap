import json

with open('conversation_history_raw.jsonl', 'r', encoding='utf-8') as f:
    lines = [json.loads(line) for line in f]

print(f"Total lines in raw: {len(lines)}")
for i, l in enumerate(lines):
    t = l.get('type')
    step = l.get('step_index')
    content = l.get('content', '')
    calls = l.get('tool_calls', [])
    if t == 'USER_INPUT':
        print(f"\n==================== USER INPUT (step {step}) ====================")
        print(content)
    elif t == 'PLANNER_RESPONSE' and (not calls or len(content) > 50):
        print(f"\n--- PLANNER RESPONSE (step {step}) ---")
        print(content)
