import subprocess, time, json, urllib.request, os
from PIL import Image

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
proc = subprocess.Popen([
    edge_path,
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "--window-size=1280,800",
    "http://localhost:8080/index.html"
])

try:
    time.sleep(2)
    # Get WebSocket URL
    targets = json.loads(urllib.request.urlopen("http://localhost:9222/json").read())
    page_target = [t for t in targets if t.get('type') == 'page'][0]
    ws_url = page_target['webSocketDebuggerUrl']
    print("CDP WS URL:", ws_url)
finally:
    proc.terminate()
