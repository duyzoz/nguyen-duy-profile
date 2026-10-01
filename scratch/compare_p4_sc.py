from PIL import Image
import numpy as np

sc = Image.open(r'C:\Users\Admin\.gemini\antigravity-ide\brain\6dbbc1f3-6bac-488a-aa6f-5d01aade91df\.user_uploaded\media_1790681287305.png')
p4 = Image.open('scratch/pic4.jpg')

# In the screenshot (1024x576), look at the right area (e.g. x: 650 to 950, y: 100 to 450)
# In object-fit: cover on 1024x576 with a 1080x1080 image:
# 1024 / 576 = 1.7777 aspect ratio.
# 1080x1080 has aspect ratio 1.
# So with object-fit: cover on a 16:9 container, the top and bottom of pic4.jpg are CROPPED!
# The width 1080 matches width 1024. Height displayed is 1080 / 1.7777 = 607.5!
# Top crop is (1080 - 607.5)/2 = 236 pixels.
# Let's crop p4 vertically from y=236 to y=236+608, and resize to 1024x576!

p4_cropped = p4.crop((0, 236, 1080, 236 + 608)).resize((1024, 576))

# Let's check difference in the background area (far right, e.g. x=800, y=200)
print("Screenshot at (850, 200):", sc.getpixel((850, 200)))
print("p4_cropped at (850, 200):", p4_cropped.getpixel((850, 200)))

# Let's check far left (e.g. x=100, y=200)
print("Screenshot at (100, 200):", sc.getpixel((100, 200)))
print("p4_cropped at (100, 200):", p4_cropped.getpixel((100, 200)))
