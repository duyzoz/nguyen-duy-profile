import urllib.request
from PIL import Image

for i in range(1, 6):
    url = f"https://cdn.jsdelivr.net/gh/duyzoz/Audio-deplynew@main/pic{i}.jpg"
    out = f"scratch/pic{i}.jpg"
    try:
        urllib.request.urlretrieve(url, out)
        im = Image.open(out)
        print(f"pic{i}.jpg: size={im.size}")
    except Exception as e:
        print(f"pic{i}.jpg failed: {e}")
