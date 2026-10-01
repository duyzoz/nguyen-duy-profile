import re

for fn in ['index.html', 'app_nd.js', 'style.css']:
    with open(fn, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f, 1):
            if 'pic' in line.lower():
                print(f"{fn}:{i}: {line.strip()}")
