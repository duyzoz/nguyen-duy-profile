from PIL import Image
import numpy as np

# Let's compare Background.png with pic4.jpg
bg = Image.open('assets/Background.png')
p4 = Image.open('scratch/pic4.jpg')

print("Background.png size:", bg.size)
print("pic4.jpg size:", p4.size)

# Resize p4 to bg size and compute difference
p4_resized = p4.resize(bg.size)
bg_rgb = bg.convert('RGB')
diff = np.mean(np.abs(np.array(bg_rgb, dtype=float) - np.array(p4_resized, dtype=float)))
print("Mean absolute difference between Background.png and pic4.jpg:", diff)
