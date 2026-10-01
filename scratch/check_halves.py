import os
from PIL import Image

def analyze_img(path):
    if not os.path.exists(path): return
    try:
        im = Image.open(path)
        print(f"=== {path} ({im.size}) ===")
        # check left half and right half average color
        w, h = im.size
        left = im.crop((0, 0, w//2, h)).resize((1, 1)).getpixel((0, 0))
        right = im.crop((w//2, 0, w, h)).resize((1, 1)).getpixel((0, 0))
        print(f"  Avg Left: {left} | Avg Right: {right}")
    except Exception as e:
        print(f"  {path}: {e}")

analyze_img('assets/Background.png')
analyze_img('scratch/frame_0s.jpg')
analyze_img('scratch/video_frame0.jpg')
analyze_img('scratch/pic3.jpg')
analyze_img('scratch/left_crop.png')
analyze_img('scratch/right_crop.png')
