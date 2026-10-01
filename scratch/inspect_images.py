from PIL import Image
import os

for f in ['assets/Background.png', 'assets/avatar.png', 'scratch/video_frame0.jpg', 'scratch/left_crop.png', 'scratch/right_crop.png', 'scratch/remote_Background.png']:
    if os.path.exists(f):
        im = Image.open(f)
        print(f, im.size, im.format, im.mode)
