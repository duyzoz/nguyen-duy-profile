import subprocess, time, os, json
from PIL import Image

# Path to msedge
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

print("Edge path:", edge_path)

# Let's write a small script that Edge can run, or use CDP / devtools protocol, or run headless with screenshot
out_png = os.path.abspath("scratch/edge_test_screen.png")

# First let's test a simple screenshot at 1280x720 after 3 seconds
# We can use Edge headless with --virtual-time-budget=5000 or similar
cmd = [
    edge_path,
    "--headless",
    "--disable-gpu",
    "--window-size=1280,720",
    "--screenshot=" + out_png,
    "http://localhost:8080/index.html"
]

res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
print("Return code:", res.returncode)
print("Stdout:", res.stdout)
print("Stderr:", res.stderr)
if os.path.exists(out_png):
    im = Image.open(out_png)
    print("Screenshot captured! Size:", im.size)
