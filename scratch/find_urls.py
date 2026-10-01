import re

for fn in ['index.html', 'app_nd.js', 'style.css']:
    with open(fn, 'r', encoding='utf-8') as f:
        text = f.read()
    urls = set(re.findall(r'https?://[^\s\'\"\<\>\)]+\.(?:jpg|png|jpeg|webp|mp4|gif)', text))
    print(f"=== {fn} ===")
    for u in urls:
        print(" ", u)
