import asyncio, aiohttp, subprocess, os, json, base64

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

async def test_viewport(width, height, is_mob_name, out_file):
    proc = subprocess.Popen([
        edge_path,
        "--headless",
        "--disable-gpu",
        "--remote-debugging-port=9225",
        f"--window-size={width},{height}",
        "http://localhost:8080/index.html"
    ])
    try:
        await asyncio.sleep(2)
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:9225/json") as resp:
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
                await asyncio.sleep(3.5)

                # Force dismiss loader
                await send("Runtime.evaluate", {
                    "expression": """
                    const l = document.getElementById('loader');
                    if (l) { l.click(); l.remove(); }
                    """
                })
                await asyncio.sleep(1)

                # Play track 4 (Em Của Quá Khứ)
                await send("Runtime.evaluate", {
                    "expression": """
                    loadTrack(3, true);
                    """
                })
                await asyncio.sleep(2)

                eval_res = await send("Runtime.evaluate", {
                    "expression": """
                    (function() {
                        const mmp = document.getElementById('mobileMiniPlayer');
                        const mmpArt = document.getElementById('mmpArt');
                        const mpArt = document.getElementById('mpArt');
                        const r1 = mmp ? mmp.getBoundingClientRect() : {};
                        const r2 = mmpArt ? mmpArt.getBoundingClientRect() : {};
                        const r3 = mpArt ? mpArt.getBoundingClientRect() : {};
                        return JSON.stringify({
                            mmp: {rect: r1, display: mmp ? window.getComputedStyle(mmp).display : 'none'},
                            mmpArt: {rect: r2, w: r2.width, h: r2.height, display: mmpArt ? window.getComputedStyle(mmpArt).display : 'none'},
                            mpArt: {rect: r3, w: r3.width, h: r3.height}
                        });
                    })()
                    """,
                    "returnByValue": True
                })
                info = json.loads(eval_res.get('result', {}).get('value', '{}'))
                print(f"\n=== VIEWPORT: {is_mob_name} ({width}x{height}) ===")
                print("mmp:", info.get('mmp'))
                print("mmpArt:", info.get('mmpArt'))
                print("mpArt:", info.get('mpArt'))

                ss = await send("Page.captureScreenshot", {"format": "png"})
                with open(out_file, "wb") as f:
                    f.write(base64.b64decode(ss['data']))
                print("Saved screenshot:", out_file)
    finally:
        proc.terminate()
        await asyncio.sleep(1)

async def main():
    await test_viewport(1280, 800, "DESKTOP", "scratch/verify_desktop_clean.png")
    await test_viewport(414, 736, "IPHONE_7_PLUS", "scratch/verify_mobile_clean.png")

asyncio.run(main())
