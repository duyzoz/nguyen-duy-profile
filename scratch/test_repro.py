import asyncio, aiohttp, subprocess, os, json, base64

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
proc = subprocess.Popen([
    edge_path,
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9223",
    "--window-size=1280,800",
    "http://localhost:8080/index.html"
])

async def run():
    await asyncio.sleep(2)
    async with aiohttp.ClientSession() as session:
        async with session.get("http://localhost:9223/json") as resp:
            targets = await resp.json()
        ws_url = [t for t in targets if t.get('type') == 'page'][0]['webSocketDebuggerUrl']
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

            await send("Page.enable")
            await send("Runtime.enable")
            await asyncio.sleep(3)
            # Dismiss loader
            await send("Runtime.evaluate", {"expression": "document.getElementById('loader').click();"})
            await asyncio.sleep(1)

            # Explicitly load track 4 and trigger updateMmpState(true)
            await send("Runtime.evaluate", {
                "expression": """
                loadTrack(3, false);
                const mmp = document.getElementById('mobileMiniPlayer');
                mmp.style.display = 'block';
                mmp.classList.add('is-playing');
                const mmpArt = document.getElementById('mmpArt');
                mmpArt.src = 'https://cdn.jsdelivr.net/gh/duyzoz/Audio-deplynew@main/pic4.jpg';
                """
            })
            await asyncio.sleep(1)

            # Check rect of mmp and mmpArt
            eval_res = await send("Runtime.evaluate", {
                "expression": """
                (function() {
                    const mmp = document.getElementById('mobileMiniPlayer');
                    const mmpArt = document.getElementById('mmpArt');
                    const r1 = mmp.getBoundingClientRect();
                    const r2 = mmpArt.getBoundingClientRect();
                    return JSON.stringify({
                        mmp: {rect: r1, style: window.getComputedStyle(mmp).cssText},
                        mmpArt: {rect: r2, style: window.getComputedStyle(mmpArt).cssText}
                    });
                })()
                """,
                "returnByValue": True
            })
            info = json.loads(eval_res.get('result', {}).get('value', '{}'))
            print("mmp rect:", info.get('mmp', {}).get('rect'))
            print("mmpArt rect:", info.get('mmpArt', {}).get('rect'))

            # Screenshot
            ss = await send("Page.captureScreenshot", {"format": "png"})
            with open("scratch/desktop_repro.png", "wb") as f:
                f.write(base64.b64decode(ss['data']))
            print("Saved scratch/desktop_repro.png")

try:
    asyncio.run(run())
finally:
    proc.terminate()
