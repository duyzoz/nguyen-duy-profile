import urllib.request, os
from PIL import Image

for i in range(1, 13):
    url = f"https://cdn.jsdelivr.net/gh/duyzoz/Audio-deplynew@main/pic{i}.jpg"
    out = f"scratch/pic{i}.jpg"
    if not os.path.exists(out):
        try:
            urllib.request.urlretrieve(url, out)
        except Exception as e:
            print(f"Failed {i}: {e}")
    if os.path.exists(out):
        im = Image.open(out)
        print(f"pic{i}: size={im.size}, center={im.getpixel((im.width//2, im.height//2))}")
