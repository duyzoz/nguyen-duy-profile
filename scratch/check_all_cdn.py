import urllib.request

base = 'https://cdn.jsdelivr.net/gh/duyzoz/Audio-deplynew@main/'

for i in range(1, 13):
    s_url = f"{base}sound{i}.mp3"
    p_url = f"{base}pic{i}.jpg"
    try:
        req = urllib.request.Request(s_url, method='HEAD')
        s_code = urllib.request.urlopen(req, timeout=5).status
    except Exception as e:
        s_code = str(e)
    try:
        req = urllib.request.Request(p_url, method='HEAD')
        p_code = urllib.request.urlopen(req, timeout=5).status
    except Exception as e:
        p_code = str(e)
    print(f"Track {i}: sound{i}.mp3 -> {s_code} | pic{i}.jpg -> {p_code}")
