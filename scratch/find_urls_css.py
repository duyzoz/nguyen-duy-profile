import re

with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines, 1):
    if 'url(' in line:
        print(f"L{i}: {line.strip()}")
