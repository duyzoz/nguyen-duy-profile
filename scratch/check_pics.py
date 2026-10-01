from PIL import Image

for i in range(1, 6):
    im = Image.open(f'scratch/pic{i}.jpg')
    print(f"pic{i}.jpg: top-left={im.getpixel((10,10))}, bottom-right={im.getpixel((1000,1000))}")
