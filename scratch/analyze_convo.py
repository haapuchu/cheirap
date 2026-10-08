import json

with open('conversation_history_raw.jsonl', 'r', encoding='utf-8') as f:
    lines = [json.loads(line) for line in f]

code_actions = []
commands_run = []
browser_tasks = []

for l in lines:
    t = l.get('type')
    step = l.get('step_index')
    calls = l.get('tool_calls', [])
    for c in calls:
        name = c.get('name')
        args = c.get('args', {})
        if name in ('replace_file_content', 'multi_replace_file_content', 'write_to_file'):
            tf = args.get('TargetFile', '')
            desc = args.get('Description', '') or args.get('Instruction', '')
            code_actions.append((step, name, tf, desc))
        elif name == 'run_command':
            cmd = args.get('CommandLine', '')
            commands_run.append((step, cmd))
        elif name == 'browser_subagent':
            browser_tasks.append((step, args.get('TaskName'), args.get('TaskSummary')))

print(f"Total Code Modifications: {len(code_actions)}")
for step, name, tf, desc in code_actions:
    fname = tf.replace('c:\\Users\\singh\\.gemini\\antigravity-ide\\scratch\\cheirap\\', '')
    print(f"  Step {step:3d} | {name:25s} | {fname:45s} | {desc[:60]}")

print(f"\nTotal Commands Executed: {len(commands_run)}")
for step, cmd in commands_run[:20]:
    print(f"  Step {step:3d} | {cmd[:80]}")
if len(commands_run) > 20:
    print(f"  ... and {len(commands_run) - 20} more commands")

print(f"\nTotal Browser Subagents: {len(browser_tasks)}")
for step, tn, ts in browser_tasks:
    print(f"  Step {step:3d} | {tn} | {ts}")
