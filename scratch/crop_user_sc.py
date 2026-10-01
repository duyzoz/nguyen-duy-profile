from PIL import Image

sc = Image.open(r'C:\Users\Admin\.gemini\antigravity-ide\brain\6dbbc1f3-6bac-488a-aa6f-5d01aade91df\.user_uploaded\media_1790681287305.png')
print("sc size:", sc.size)
# In sc, crop left side and right side
left = sc.crop((0, 70, 350, sc.height - 40))
right = sc.crop((sc.width - 400, 70, sc.width, sc.height - 40))
left.save('scratch/user_left.png')
right.save('scratch/user_right.png')
print("Saved user_left and user_right")
