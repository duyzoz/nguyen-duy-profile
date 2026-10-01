import re

with open('app_nd.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines, 1):
    if '.style.' in line and any(k in line for k in ['bg', 'background', 'Image', 'video', 'wrap', 'art', 'cover', 'filter']):
        print(f"L{i}: {line.strip()}")
