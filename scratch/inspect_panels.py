import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

panels = re.findall(r'id="(panel[A-Za-z0-9]+)"', html)
print('Panels in index.html:', panels)

modals = re.findall(r'id="([A-Za-z0-9_-]*[Mm]odal[A-Za-z0-9_-]*)"', html)
print('Modals in index.html:', modals)

# Let's check classes inside panelCreateVPS, panelBypass, panelManage, panelProjects, panelTools, panelGuestbook, panelAi, panelGame
for p in panels:
    pattern = rf'<div class="tc-panel" id="{p}".*?(?=<div class="tc-panel" id="|\s*</div>\s*<!-- \/tool-content -->|\s*</div>\s*</div>\s*<!-- \/TOOL CARD)'
    match = re.search(pattern, html, re.DOTALL)
    if match:
        classes = set(re.findall(r'class="([^"]+)"', match.group(0)))
        print(f"\n--- Panel {p} has {len(classes)} class groupings ---")
