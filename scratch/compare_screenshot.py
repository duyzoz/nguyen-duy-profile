import os
from PIL import Image

sc = Image.open(r'C:\Users\Admin\.gemini\antigravity-ide\brain\6dbbc1f3-6bac-488a-aa6f-5d01aade91df\.user_uploaded\media_1790681287305.png')
bg = Image.open('assets/Background.png')

print("Screenshot size:", sc.size)
print("Background.png size:", bg.size)

# Let's sample a pixel from the left side of screenshot (around x=100, y=300)
print("Screenshot left pixel (100, 300):", sc.getpixel((100, 300)))
# Let's sample corresponding pixel in Background.png: x = 100/1024*735 ~ 72, y = 300/576*400 ~ 208
print("Background.png left pixel (72, 208):", bg.getpixel((72, 208)))

# Let's sample right side of screenshot (around x=800, y=300)
print("Screenshot right pixel (800, 300):", sc.getpixel((800, 300)))
# Corresponding in Background.png: x = 800/1024*735 ~ 574, y = 208
print("Background.png right pixel (574, 208):", bg.getpixel((574, 208)))
