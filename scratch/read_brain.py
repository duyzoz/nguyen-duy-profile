import json, os

for brain_id in ['4c9f7d0c-72af-4e0b-a7aa-a6e1c67deca0', 'bbf3e2c7-8402-4a5d-95b0-d1d97cb752ce']:
    p = os.path.join(r'C:\Users\Admin\.gemini\antigravity-ide\brain', brain_id, '.system_generated', 'logs', 'transcript.jsonl')
    if os.path.exists(p):
        print(f"=== {brain_id} ===")
        with open(p, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    d = json.loads(line)
                    if d.get('type') == 'USER_INPUT':
                        c = d.get('content', '')
                        req = c.split('</USER_REQUEST>')[0].replace('<USER_REQUEST>', '').strip()
                        print(req)
                        print("-" * 50)
                except:
                    pass
