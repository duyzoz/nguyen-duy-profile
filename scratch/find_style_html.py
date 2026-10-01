import re

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines, 1):
    if '.style.' in line:
        print(f"L{i}: {line.strip()}")
