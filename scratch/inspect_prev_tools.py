import json

with open(r'C:\Users\Admin\.gemini\antigravity-ide\brain\f417c01f-941f-425c-8f4a-882d108ba080\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        try:
            d = json.loads(line)
            if d.get('type') == 'PLANNER_RESPONSE':
                for tc in d.get('tool_calls', []):
                    name = tc.get('name')
                    args = tc.get('args', {})
                    if name in ['replace_file_content', 'write_to_file', 'multi_replace_file_content']:
                        print(f"Tool: {name}, File: {args.get('TargetFile')}")
                        print("Desc:", args.get('Description'))
                        if 'Instruction' in args:
                            print("Inst:", args.get('Instruction'))
        except Exception:
            pass
