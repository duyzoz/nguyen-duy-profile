import os
from PIL import Image

bg = Image.open('assets/Background.png')
print("assets/Background.png size:", bg.size)
# Let's inspect its colors and corners
print("Top-left pixel:", bg.getpixel((10, 10)))
print("Top-right pixel:", bg.getpixel((700, 10)))
print("Bottom-left pixel:", bg.getpixel((10, 390)))
print("Bottom-right pixel:", bg.getpixel((700, 390)))

# Let's inspect video_frame0.jpg
vf = Image.open('scratch/video_frame0.jpg')
print("video_frame0 size:", vf.size)
print("Top-left pixel:", vf.getpixel((10, 10)))
print("Top-right pixel:", vf.getpixel((3800, 10)))
