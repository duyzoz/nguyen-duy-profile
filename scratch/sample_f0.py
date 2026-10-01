from PIL import Image

f0 = Image.open('scratch/frame_0s.jpg')
print("f0 size:", f0.size)
# Sample several points across f0
for x in [500, 1000, 1920, 2800, 3400]:
    for y in [500, 1080, 1600]:
        print(f"({x}, {y}): {f0.getpixel((x, y))}")
