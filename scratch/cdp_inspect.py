import asyncio, aiohttp, subprocess, os, json, base64

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
proc = subprocess.Popen([
    edge_path,
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "--window-size=1280,800",
    "http://localhost:8080/index.html"
])

async def run():
    await asyncio.sleep(2)
    async with aiohttp.ClientSession() as session:
        async with session.get("http://localhost:9222/json") as resp:
            targets = await resp.json()
        ws_url = [t for t in targets if t.get('type') == 'page'][0]['webSocketDebuggerUrl']
        print("Connected to:", ws_url)
        async with session.ws_connect(ws_url) as ws:
            msg_id = 1
            async def send(method, params=None):
                nonlocal msg_id
                mid = msg_id
                msg_id += 1
                await ws.send_json({"id": mid, "method": method, "params": params or {}})
                while True:
                    res = await ws.receive_json()
                    if res.get('id') == mid:
                        return res.get('result', {})

            # Enable Page and Runtime
            await send("Page.enable")
            await send("Runtime.enable")

            # Wait 3.5s for terminal loader to be ready, then click it
            await asyncio.sleep(3.5)
            # Dismiss loader by calling click on loader or document
            await send("Runtime.evaluate", {"expression": "document.getElementById('loader').click();"})
            await asyncio.sleep(1.5)

            # Let's check elements that have pic4 or cover
            eval_res = await send("Runtime.evaluate", {
                "expression": """
                (function() {
                    const res = [];
                    document.querySelectorAll('img, video').forEach(el => {
                        const r = el.getBoundingClientRect();
                        res.push({
                            tag: el.tagName,
                            id: el.id,
                            cls: el.className,
                            src: el.src || (el.querySelector('source') ? el.querySelector('source').src : ''),
                            rect: {x: r.x, y: r.y, w: r.width, h: r.height},
                            display: window.getComputedStyle(el).display,
                            visibility: window.getComputedStyle(el).visibility,
                            opacity: window.getComputedStyle(el).opacity,
                            zIndex: window.getComputedStyle(el).zIndex
                        });
                    });
                    return JSON.stringify(res);
                })()
                """,
                "returnByValue": True
            })
            elements = json.loads(eval_res.get('result', {}).get('value', '[]'))
            print("=== VISIBLE IMAGES/VIDEOS BEFORE PLAYING ===")
            for el in elements:
                print(el)

            # Now play track 4!
            await send("Runtime.evaluate", {
                "expression": "if (typeof loadTrack === 'function') { loadTrack(3, true); } else { document.getElementById('mpPlay').click(); }"
            })
            await asyncio.sleep(1.5)

            eval_res2 = await send("Runtime.evaluate", {
                "expression": """
                (function() {
                    const res = [];
                    document.querySelectorAll('img, video').forEach(el => {
                        const r = el.getBoundingClientRect();
                        res.push({
                            tag: el.tagName,
                            id: el.id,
                            cls: el.className,
                            src: el.src || (el.querySelector('source') ? el.querySelector('source').src : ''),
                            rect: {x: r.x, y: r.y, w: r.width, h: r.height},
                            display: window.getComputedStyle(el).display,
                            visibility: window.getComputedStyle(el).visibility,
                            opacity: window.getComputedStyle(el).opacity,
                            zIndex: window.getComputedStyle(el).zIndex
                        });
                    });
                    return JSON.stringify(res);
                })()
                """,
                "returnByValue": True
            })
            elements2 = json.loads(eval_res2.get('result', {}).get('value', '[]'))
            print("\n=== VISIBLE IMAGES/VIDEOS AFTER PLAYING TRACK 4 ===")
            for el in elements2:
                print(el)

            # Capture screenshot
            ss = await send("Page.captureScreenshot", {"format": "png"})
            data = base64.b64decode(ss['data'])
            with open("scratch/screen_after_play.png", "wb") as f:
                f.write(data)
            print("Screenshot saved to scratch/screen_after_play.png")

try:
    asyncio.run(run())
finally:
    proc.terminate()
