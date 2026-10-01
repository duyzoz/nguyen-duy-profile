import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

imgs = re.findall(r'<img[^>]+>', html, re.IGNORECASE)
print(f"Total img tags: {len(imgs)}")
for i, img in enumerate(imgs, 1):
    print(f"{i}. {img}")

videos = re.findall(r'<video[^>]+>', html, re.IGNORECASE)
print(f"\nTotal video tags: {len(videos)}")
for v in videos:
    print(v)
