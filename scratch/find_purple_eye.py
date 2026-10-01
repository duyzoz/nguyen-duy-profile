from PIL import Image

# In the screenshot, the character has a purple eye at roughly 75% width, 45% height.
# Let's crop the eye area or check all pics
for i in range(1, 13):
    im = Image.open(f'scratch/pic{i}.jpg')
    # Let's check color in right region
    w, h = im.size
    right_box = im.crop((int(w*0.6), int(h*0.3), int(w*0.9), int(h*0.7))).resize((5, 5))
    pixels = list(right_box.getdata())
    # count purplish/blueish pixels (B > R, B > G, or high contrast)
    purple_count = sum(1 for (r, g, b) in pixels if b > 100 and (r > 60 or g < b))
    print(f"pic{i}: purple_count={purple_count}, center-right={pixels[12]}")
