import glob, os
from PIL import Image

for f in glob.glob(r'C:\Users\Admin\.gemini\antigravity-ide\brain\*\.user_uploaded\*'):
    try:
        im = Image.open(f)
        print(f, im.size, os.path.basename(f))
    except Exception as e:
        print(f, e)
