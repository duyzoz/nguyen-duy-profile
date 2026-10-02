with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Analyzing style.css for theme-specific elements and hardcoded colors...")
hardcoded = []
for idx, line in enumerate(lines):
    s = line.strip()
    if ('#00f0ff' in s or '0, 240, 255' in s or '0,240,255' in s) and not s.startswith('/*') and not s.startswith('--theme-'):
        if 'data-theme' not in s:
            hardcoded.append((idx + 1, s))

print(f"Total lines with hardcoded cyan outside data-theme declarations: {len(hardcoded)}")
for num, l in hardcoded[:40]:
    print(f"{num}: {l}")
