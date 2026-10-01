from PIL import Image
import glob

for f in ['C:/Users/Admin/Downloads/3050e3d7b29c32c26b8d.jpg',
          'C:/Users/Admin/Downloads/ba65fb79aa322a6c7323.jpg',
          'C:/Users/Admin/Downloads/ff3e8e99aed62e8877c7.jpg',
          'C:/Users/Admin/Downloads/images.jpg']:
    try:
        im = Image.open(f)
        print(f, im.size)
    except Exception as e:
        print(f, e)
