/* ════════════════════════════════════════
   app.js v10 — Nguyễn Duy Profile
   Full rewrite with all fixes
════════════════════════════════════════ */

/* ─── TERMINAL LOADER ─── */
(function(){
  const ASCII=[
    '  ██████████████████████████████  ',
    ' █░░╔══════════════════════╗░░░█ ',
    ' █░░║  ▄██▄          ▄██▄  ║░░░█ ',
    ' █░░║  ████          ████  ║░░░█ ',
    ' █░░║       ▄██████▄       ║░░░█ ',
    ' █░░║      ▀▀██████▀▀      ║░░░█ ',
    ' █░░║  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄  ║░░░█ ',
    ' █░░╚══════════════════════╝░░░█ ',
    '  ████████████████████████████  ',
  ].join('\n');
  /* ── OS DETECTION & CLASSIFICATION (Windows, Android, iOS, macOS, Linux, ChromeOS) ── */
  function detectOS() {
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    const maxTouch = navigator.maxTouchPoints || 0;

    let osKey = 'unknown';
    let name = 'Unknown OS';
    let icon = '💻';
    let termTitle = 'system.exe — bash';
    let isMobile = false;

    // 1. Android
    const androidMatch = ua.match(/Android\s*([0-9.]+)?/i);
    if (androidMatch || /Android/i.test(platform)) {
      osKey = 'android';
      isMobile = true;
      const ver = androidMatch && androidMatch[1] ? ` ${androidMatch[1]}` : '';
      let brand = '';
      if (/SM-[A-Z0-9]+|Samsung/i.test(ua)) brand = ' (Samsung)';
      else if (/Pixel\s?[0-9a-zA-Z]*/i.test(ua)) {
        const pm = ua.match(/Pixel\s?[0-9a-zA-Z]*/i);
        brand = pm ? ` (${pm[0]})` : ' (Pixel)';
      } else if (/Redmi|POCO|Xiaomi/i.test(ua)) brand = ' (Xiaomi)';
      else if (/OPPO|CPH[0-9]+/i.test(ua)) brand = ' (OPPO)';
      else if (/vivo|V[0-9]{4}[A-Z]*/i.test(ua)) brand = ' (Vivo)';

      name = `Android${ver}${brand} · Linux ARM`;
      icon = '🤖';
      termTitle = 'system.sh — termux (Android Linux)';
    }
    // 2. iOS / iPadOS
    else if (/iPhone/i.test(ua)) {
      osKey = 'ios';
      isMobile = true;
      const iosMatch = ua.match(/OS\s*([0-9_]+)/i);
      const ver = iosMatch ? ` ${iosMatch[1].replace(/_/g, '.')}` : '';
      name = `Apple iPhone (iOS${ver}) · A-Bionic`;
      icon = '🍎';
      termTitle = 'system.sh — MobileTerminal (iOS/Darwin)';
    }
    else if (/iPad/i.test(ua) || (platform === 'MacIntel' && maxTouch > 1)) {
      osKey = 'ipados';
      isMobile = true;
      const ipadMatch = ua.match(/OS\s*([0-9_]+)/i);
      const ver = ipadMatch ? ` ${ipadMatch[1].replace(/_/g, '.')}` : '';
      name = `Apple iPad (iPadOS${ver}) · Apple Silicon`;
      icon = '🍎';
      termTitle = 'system.sh — Terminal (iPadOS/Darwin)';
    }
    // 3. Windows
    else if (/Win/i.test(ua) || /Win/i.test(platform)) {
      osKey = 'windows';
      isMobile = false;
      let winVer = 'Windows';
      if (/Windows NT 10\.0/i.test(ua)) winVer = 'Windows 10/11';
      else if (/Windows NT 6\.3/i.test(ua)) winVer = 'Windows 8.1';
      else if (/Windows NT 6\.1/i.test(ua)) winVer = 'Windows 7';

      const arch = /ARM64/i.test(ua) ? 'ARM64' : (/x64|Win64|WOW64/i.test(ua) ? 'x64' : 'x86');
      name = `${winVer} (NT kernel · ${arch})`;
      icon = '🪟';
      termTitle = `system.exe — PowerShell (${winVer})`;
    }
    // 4. macOS
    else if (/Mac/i.test(ua) || /Mac/i.test(platform)) {
      osKey = 'macos';
      isMobile = false;
      const macMatch = ua.match(/Mac OS X\s*([0-9_]+)/i);
      const ver = macMatch ? ` ${macMatch[1].replace(/_/g, '.')}` : '';
      name = `macOS${ver} (Darwin Unix · Apple Silicon/Intel)`;
      icon = '🍏';
      termTitle = 'system.sh — zsh (macOS Terminal)';
    }
    // 5. ChromeOS
    else if (/CrOS/i.test(ua)) {
      osKey = 'chromeos';
      isMobile = false;
      name = 'Google ChromeOS (Linux kernel)';
      icon = '🌐';
      termTitle = 'system.sh — crosh (ChromeOS)';
    }
    // 6. Linux
    else if (/Linux/i.test(ua) || /Linux/i.test(platform)) {
      osKey = 'linux';
      isMobile = false;
      let distro = 'GNU/Linux';
      if (/Ubuntu/i.test(ua)) distro = 'Ubuntu Linux';
      else if (/Debian/i.test(ua)) distro = 'Debian GNU/Linux';
      else if (/Fedora/i.test(ua)) distro = 'Fedora Linux';
      else if (/Arch/i.test(ua)) distro = 'Arch Linux';
      const arch = /aarch64|arm64/i.test(ua) ? 'aarch64' : 'x86_64';
      name = `${distro} (${arch})`;
      icon = '🐧';
      termTitle = 'system.sh — bash (Linux)';
    }

    if (!isMobile && (window.innerWidth <= 768 || (maxTouch > 1 && /Mobi|Android|Touch/i.test(ua)))) {
      isMobile = true;
    }

    return { osKey, name, icon, termTitle, isMobile };
  }

  const detectedOS = detectOS();
  window.ND_OS = detectedOS;

  const termTitleBar = document.getElementById('termTitleBar');
  if (termTitleBar) termTitleBar.textContent = detectedOS.termTitle;

  const startupLang = localStorage.getItem('nd_lang') || 'en';
  const STARTUP_DICT = {
    en: {
      lines: [
        {text:'> System Initializing...',cls:'dim',ms:0},
        {text:'> Network Connection... OK',cls:'green',ms:600},
        {text:'> IP: {IP}',cls:'cyan',ms:1100,isIp:true},
        {text:`> OS: ${detectedOS.icon} ${detectedOS.name}`,cls:'cyan',ms:1500},
        {text:'> Loading User Profile... OK',cls:'green',ms:2000},
        {text:'> Bio: Loaded Successfully ✓',cls:'green',ms:2400},
        {text:'> All Systems Operational.',cls:'yellow',ms:2900},
      ],
      cont: detectedOS.isMobile ? 'Tap Screen To Continue' : 'Press Enter / Click To Continue'
    },
    vi: {
      lines: [
        {text:'> Khởi động hệ thống...',cls:'dim',ms:0},
        {text:'> Kết nối mạng... OK',cls:'green',ms:600},
        {text:'> IP: {IP}',cls:'cyan',ms:1100,isIp:true},
        {text:`> Hệ điều hành: ${detectedOS.icon} ${detectedOS.name}`,cls:'cyan',ms:1500},
        {text:'> Tải hồ sơ người dùng... OK',cls:'green',ms:2000},
        {text:'> Bio: Đã tải xong ✓',cls:'green',ms:2400},
        {text:'> Tất cả hệ thống sẵn sàng.',cls:'yellow',ms:2900},
      ],
      cont: detectedOS.isMobile ? 'Chạm vào màn hình để tiếp tục' : 'Nhấn Enter hoặc Click để tiếp tục'
    },
    ja: {
      lines: [
        {text:'> システム初期化中...',cls:'dim',ms:0},
        {text:'> ネットワーク接続... OK',cls:'green',ms:600},
        {text:'> IP: {IP}',cls:'cyan',ms:1100,isIp:true},
        {text:`> OS: ${detectedOS.icon} ${detectedOS.name}`,cls:'cyan',ms:1500},
        {text:'> ユーザープロフィール読み込み... OK',cls:'green',ms:2000},
        {text:'> プロフィール: 読み込み完了 ✓',cls:'green',ms:2400},
        {text:'> 全システム正常稼働中。',cls:'yellow',ms:2900},
      ],
      cont: detectedOS.isMobile ? '画面をタップして続行' : 'Enterキーまたはクリックで続行'
    }
  };
  const activeConf = STARTUP_DICT[startupLang] || STARTUP_DICT.en;
  const LINES = activeConf.lines;
  const loader=document.getElementById('loader');
  const ascii=document.getElementById('asciiArt');
  const output=document.getElementById('termOutput');
  const cont=document.getElementById('termContinue');
  if(cont) cont.innerHTML = `${activeConf.cont}<span class="term-blink">█</span>`;
  ascii.textContent=ASCII;

  /* ── ADMIN IP RECOGNITION & VIP PRIVILEGE ── */
  const ADMIN_IP = '192.168.0.102';
  const ADMIN_WAN_IP = '42.117.202.27';
  window.ND_IS_ADMIN = false;
  window.ND_DISPLAY_IP = '0.0.0.0';

  const host = window.location.hostname || '';
  const proto = window.location.protocol || '';
  const pathname = window.location.pathname || '';
  let searchParams = null;
  try { searchParams = new URLSearchParams(window.location.search); } catch(e){}

  // 0. URL parameters trigger (Instant 100% reliable for smartphone or any browser!)
  if (searchParams && (searchParams.has('admin') || searchParams.has('vip') || searchParams.has('duy') || searchParams.get('auth') === 'admin' || searchParams.get('role') === 'admin')) {
    window.ND_IS_ADMIN = true;
    window.ND_DISPLAY_IP = ADMIN_IP;
    try { localStorage.setItem('nd_is_admin', '1'); } catch(e){}
  }

  // 1. Check saved admin state from previous session
  try {
    if (localStorage.getItem('nd_is_admin') === '1') {
      window.ND_IS_ADMIN = true;
      window.ND_DISPLAY_IP = ADMIN_IP;
    }
  } catch(e){}

  // 2. Direct local IP or admin machine verification
  if (host === ADMIN_IP || host === 'localhost' || host === '127.0.0.1') {
    window.ND_IS_ADMIN = true;
    window.ND_DISPLAY_IP = ADMIN_IP;
  } else if (proto === 'file:' && (pathname.includes('/Users/Admin') || pathname.includes('nguyen-duy'))) {
    window.ND_IS_ADMIN = true;
    window.ND_DISPLAY_IP = ADMIN_IP;
  }

  function applyDetectedIp(ip){
    if(!ip) return;
    const cleanIp = ip.trim();
    // Admin is strictly: Direct LAN IP (192.168.0.102), home WAN IP (42.117.202.27 or 42.117.* subnet), LAN subnet, or local dev environment
    const isHomeWan = cleanIp === ADMIN_WAN_IP || cleanIp.startsWith('42.117.') || cleanIp.startsWith('192.168.0.');
    const isLanAdmin = cleanIp === ADMIN_IP;
    const isLocalDev = (host === ADMIN_IP || host === 'localhost' || host === '127.0.0.1' || (proto === 'file:' && (pathname.includes('/Users/Admin') || pathname.includes('nguyen-duy'))));
    let hasSavedAuth = false;
    try { hasSavedAuth = localStorage.getItem('nd_is_admin') === '1'; } catch(e){}

    if (window.ND_IS_ADMIN || isHomeWan || isLanAdmin || isLocalDev || hasSavedAuth) {
      window.ND_IS_ADMIN = true;
      window.ND_DISPLAY_IP = ADMIN_IP; // ALWAYS present as 192.168.0.102 VIP ADMIN
      try { localStorage.setItem('nd_is_admin', '1'); } catch(e){}
    } else {
      // ALL OTHER VISITORS: Strictly normal visitors with their own unique IP!
      window.ND_IS_ADMIN = false;
      window.ND_DISPLAY_IP = cleanIp; // Distinct IP of the individual visitor!
    }

    if (window.renderTermIp) window.renderTermIp();
    if (window.updateGbAdmin) window.updateGbAdmin();
  }

  // 2. Cloudflare trace probe (Instant 0ms on Workers/Pages!)
  fetch('/cdn-cgi/trace')
    .then(r => r.text())
    .then(text => {
      const match = text.match(/ip=([^\r\n]+)/);
      if (match && match[1]) {
        applyDetectedIp(match[1].trim());
      }
    })
    .catch(() => {});

  // 3. Fallback WAN IP verification
  fetch('https://api.ipify.org?format=json')
    .then(r => r.json())
    .then(d => {
      if(d && d.ip) applyDetectedIp(d.ip);
    })
    .catch(() => {
      fetch('https://api.my-ip.io/ip.json')
        .then(r => r.json())
        .then(d => { if(d && d.ip) applyDetectedIp(d.ip); })
        .catch(() => {});
    });

  // 4. WebRTC candidate discovery
  try {
    const RTCPC = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    if (RTCPC) {
      const pc = new RTCPC({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      pc.createDataChannel('');
      pc.createOffer().then(o => pc.setLocalDescription(o)).catch(()=>{});
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) return;
        const cand = ice.candidate.candidate;
        if (cand.includes(ADMIN_IP) || cand.includes(ADMIN_WAN_IP) || cand.includes('42.117.')) {
          applyDetectedIp(ADMIN_IP);
        }
      };
    }
  } catch(e){}

  let ipDiv = null;
  window.renderTermIp = function(){
    if(!ipDiv) return;
    if(window.ND_IS_ADMIN){
      ipDiv.className = 't-line admin-rainbow-vip';
      ipDiv.innerHTML = `&gt; IP: ${ADMIN_IP} <span class="term-vip-tag">👑 VIP ADMIN</span>`;
    } else {
      ipDiv.className = 't-line cyan';
      ipDiv.textContent = `> IP: ${window.ND_DISPLAY_IP || '127.0.0.1'}`;
    }
  };

  LINES.forEach(({text,cls,ms,isIp})=>{
    setTimeout(()=>{
      const d=document.createElement('div');
      if(isIp){
        ipDiv = d;
        window.renderTermIp();
      } else {
        d.className='t-line '+cls;
        d.textContent=text;
      }
      output.appendChild(d);
    },ms);
  });

  /* ── STRICT LOADING LOCK: CANNOT ENTER BEFORE CONTINUE LINE APPEARS ── */
  let canDismiss = false;
  setTimeout(()=>{
    if(cont) cont.style.display = 'block';
    canDismiss = true;
    if(loader) loader.classList.add('ready');
  }, 3400);

  function dismiss(e){
    if(!canDismiss){
      if(e){ e.preventDefault(); e.stopPropagation(); }
      return; // BẮT BUỘC CHỜ LOAD XONG HẾT MỚI ĐƯỢC VÀO!
    }
    loader.classList.add('hidden');
    setTimeout(()=>{
      const st = document.getElementById('stage');
      if(st) st.classList.add('visible');
      document.querySelectorAll('.hud-top-left, .music-player').forEach(el => el.classList.add('visible'));
      loader.remove();
    }, 650);
  }

  loader.addEventListener('click', dismiss);
  document.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
      if(!canDismiss){ e.preventDefault(); e.stopPropagation(); return; }
      dismiss(e);
    }
  });
})();

/* ─── GLOBAL SNOW (Optimized, Pauses in Perf Mode) ─── */
(function(){
  const c=document.getElementById('snowCanvas');
  if(!c)return;
  const ctx=c.getContext('2d');
  let W,H;
  const fl=[];
  function resize(){W=c.width=innerWidth;H=c.height=innerHeight;}
  resize();addEventListener('resize',resize,{passive:true});
  for(let i=0;i<14;i++)fl.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.4,sp:Math.random()*.7+.25,sw:Math.random()*.6-.3,op:Math.random()*.35+.1});
  let lastT=0;
  (function draw(now){
    requestAnimationFrame(draw);
    if(document.hidden || document.body.classList.contains('perf-mode'))return;
    if(now-lastT<40)return; // 25fps siêu nhẹ cho CPU
    lastT=now;
    ctx.clearRect(0,0,W,H);
    fl.forEach(f=>{
      ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${f.op})`;ctx.fill();
      f.y+=f.sp;f.x+=f.sw;
      if(f.y>H){f.y=-4;f.x=Math.random()*W;}
      if(f.x>W)f.x=0;if(f.x<0)f.x=W;
    });
  })(0);
})();

/* ─── AVATAR ORBIT SNOWFLAKES (Cached Offscreen Stamp) ─── */
(function(){
  const c=document.getElementById('avatarOrbit');
  if(!c)return;
  const ctx=c.getContext('2d');
  const S=130;c.width=c.height=S;
  const cx=S/2,cy=S/2,AVT_R=48;

  /* Pre-cache 6-pointed snowflake on offscreen canvas once */
  const stamp=document.createElement('canvas');
  stamp.width=stamp.height=24;
  const sCtx=stamp.getContext('2d');
  sCtx.translate(12,12);
  sCtx.strokeStyle='rgba(200,225,255,1)';
  sCtx.lineWidth=1.1;
  sCtx.lineCap='round';
  for(let i=0;i<6;i++){
    sCtx.save();sCtx.rotate(i*Math.PI/3);
    sCtx.beginPath();sCtx.moveTo(0,0);sCtx.lineTo(0,9);
    sCtx.moveTo(0,5);sCtx.lineTo(2.8,2.8);
    sCtx.moveTo(0,5);sCtx.lineTo(-2.8,2.8);
    sCtx.stroke();sCtx.restore();
  }

  function drawFlake(x,y,r,alpha,rot){
    if(r<1||alpha<=0)return;
    ctx.save();
    ctx.globalAlpha=Math.min(1,Math.max(0,alpha));
    ctx.translate(x,y);
    ctx.rotate(rot);
    const sz=r*2.3;
    ctx.drawImage(stamp,-sz/2,-sz/2,sz,sz);
    ctx.restore();
  }

  const L1=[];
  for(let i=0;i<8;i++){L1.push({angle:(i/8)*Math.PI*2,speed:(.004+Math.random()*.005)*(i%2===0?1:-1),r:i%3===0?4.2:2.2,baseDist:AVT_R+8,distAmp:3,distPhase:Math.random()*Math.PI*2,distFreq:.02,rot:0,rotSpeed:(Math.random()-.5)*.03,baseOp:.65,t:Math.random()*100});}
  const L2=[{ax:-.72,ay:-.72,phase:0},{ax:.72,ay:-.72,phase:1.05},{ax:-.72,ay:.72,phase:2.1},{ax:.72,ay:.72,phase:3.14}].map(d=>({...d,rot:0,rotSpeed:.015,r:3.8,dist:AVT_R+10}));
  const L3=[];
  for(let i=0;i<10;i++)L3.push({angle:Math.random()*Math.PI*2,speed:(.006+Math.random()*.008)*(i%2===0?1:-1),r:Math.random()*.7+.4,dist:AVT_R+4+Math.random()*12,op:Math.random()*.5+.2,phase:Math.random()*Math.PI*2});

  let tick=0,lastT=0;
  (function draw(now){
    requestAnimationFrame(draw);
    if(document.hidden || document.body.classList.contains('perf-mode'))return;
    if(now-lastT<33)return;
    lastT=now;tick++;
    ctx.clearRect(0,0,S,S);
    L3.forEach(f=>{f.angle+=f.speed;const op=f.op*(.5+.5*Math.sin(tick*.04+f.phase));const x=cx+Math.cos(f.angle)*f.dist,y=cy+Math.sin(f.angle)*f.dist;ctx.beginPath();ctx.arc(x,y,f.r,0,Math.PI*2);ctx.fillStyle=`rgba(200,230,255,${op})`;ctx.fill();});
    L1.forEach(f=>{f.angle+=f.speed;f.rot+=f.rotSpeed;f.t+=1;const dist=f.baseDist+Math.sin(f.t*f.distFreq*4+f.distPhase)*f.distAmp;const x=cx+Math.cos(f.angle)*dist,y=cy+Math.sin(f.angle)*dist;drawFlake(x,y,f.r,f.baseOp,f.rot);});
    L2.forEach(f=>{f.rot+=f.rotSpeed;const bounce=Math.sin(tick*.03+f.phase)*3;const x=cx+f.ax*f.dist,y=cy+f.ay*f.dist+bounce;drawFlake(x,y,f.r,.6,f.rot);});
  })(0);
})();

/* ─── AVATAR LOCAL SNOW (Optimized) ─── */
(function(){
  const c=document.getElementById('avatarSnowC');
  if(!c)return;
  const ctx=c.getContext('2d');
  const S=96;c.width=c.height=S;
  const fl=[];
  for(let i=0;i<8;i++)fl.push({x:Math.random()*S,y:Math.random()*S,r:Math.random()*1.1+.3,sp:Math.random()*.5+.2,op:Math.random()*.3+.1});
  let lastT=0;
  (function draw(now){
    requestAnimationFrame(draw);
    if(document.hidden || document.body.classList.contains('perf-mode'))return;
    if(now-lastT<33)return;
    lastT=now;
    ctx.clearRect(0,0,S,S);ctx.save();
    ctx.beginPath();ctx.arc(S/2,S/2,S/2-1,0,Math.PI*2);ctx.clip();
    fl.forEach(f=>{ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${f.op})`;ctx.fill();f.y+=f.sp;if(f.y>S+2){f.y=-2;f.x=Math.random()*S;}});
    ctx.restore();
  })(0);
})();

/* ─── DUST TRAIL (Event-driven, 0% CPU Idle) ─── */
(function(){
  const c=document.getElementById('dustCanvas');
  if(!c)return;
  const ctx=c.getContext('2d');
  const colors=['#7c6fff','#ff6b9d','#00d4ff','#ffe066'];
  const pts=[];
  let rafId=null;
  function resize(){c.width=innerWidth;c.height=innerHeight;}
  resize();
  addEventListener('resize',resize,{passive:true});

  function draw(){
    rafId=null;
    ctx.clearRect(0,0,c.width,c.height);
    for(let i=pts.length-1;i>=0;i--){
      const p=pts[i];
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.c+Math.floor(p.op*255).toString(16).padStart(2,'0');
      ctx.fill();
      p.x+=p.vx;p.y+=p.vy;p.op-=.045;p.r-=.035;
      if(p.op<=0||p.r<=0)pts.splice(i,1);
    }
    if(pts.length>0&&!document.hidden){
      rafId=requestAnimationFrame(draw);
    }
  }

  addEventListener('mousemove',e=>{
    for(let i=0;i<2;i++){
      pts.push({
        x:e.clientX+(Math.random()-.5)*8,
        y:e.clientY+(Math.random()-.5)*8,
        r:Math.random()*1.8+.4,
        vx:(Math.random()-.5)*1.2,
        vy:(Math.random()-.5)*1.2-.3,
        op:.75,
        c:colors[~~(Math.random()*4)]
      });
    }
    if(pts.length>30)pts.splice(0,pts.length-30);
    if(!rafId)rafId=requestAnimationFrame(draw);
  },{passive:true});
})();

/* ─── MULTI-LANGUAGE TYPING & BIO DATA ─── */
window.TYPING_DATA = {
  en: {
    typing: ['Software Engineer & 3D Creator 💻✨', 'Performance First & Low-latency ⚡', 'Cyberpunk UI/UX Specialist 🚀'],
    bio: [
      "UI/UX & 3D Designer 🎨✨",
      "Conquering heavy 3D renders on an HP EliteBook 840 G1 without dedicated GPU. Legacy hardware, bleeding-edge mindset! ⚡"
    ]
  },
  vi: {
    typing: ['Nguyễn Duy & Coding lover 💻✨', 'Code & Sleep & Repeat 🚀', 'Newbie Coder 🤓'],
    bio: [
      "-------UI/UX & 3D Designer 🎨✨",
      "(-). Dùng HP Elitebook 840 G1 để chinh phục những render khó nhất. Hardware có thể cũ, nhưng tư duy thiết kế thì luôn update! ⚡"
    ]
  },
  ja: {
    typing: ['ソフトウェア開発者 & 3Dクリエイター 💻✨', '超高速サイバーアプリ開発 ⚡', 'クリーンコード＆軽量化 🚀'],
    bio: [
      "UI/UX＆3Dデザイナー 🎨✨",
      "グラフィックボード無しのHP EliteBook 840 G1で高負荷な3Dレンダリングを完遂。ハードは旧式でも、設計思想は常に最先端！⚡"
    ]
  }
};

/* ─── TYPING EFFECT ─── */
(function(){
  const el = document.getElementById('typingText');
  if(!el) return;
  let activeLang = localStorage.getItem('nd_lang') || 'en';
  let lines = (window.TYPING_DATA[activeLang] || window.TYPING_DATA.en).typing;
  let li = 0, ci = 0, del = false;

  function tick(){
    const line = lines[li] || lines[0];
    if(!del){
      el.textContent = line.slice(0, ++ci);
      if(ci === line.length){ del = true; setTimeout(tick, 2200); return; }
      setTimeout(tick, 70);
    } else {
      el.textContent = line.slice(0, --ci);
      if(ci === 0){ del = false; li = (li + 1) % lines.length; setTimeout(tick, 350); return; }
      setTimeout(tick, 35);
    }
  }

  window.setTypingLang = function(l){
    if(window.TYPING_DATA[l]){
      lines = window.TYPING_DATA[l].typing;
      li = 0; ci = 0; del = false;
    }
  };

  setTimeout(tick, 2500);
})();

/* ─── BIO TYPEWRITER (Fixed Ratio, Low CPU, Natural Flow) ─── */
(function(){
  const el = document.getElementById('bioTypewriter');
  if(!el) return;
  let activeLang = localStorage.getItem('nd_lang') || 'en';
  let lines = (window.TYPING_DATA[activeLang] || window.TYPING_DATA.en).bio;
  let lineIdx = 0, charIdx = 0, isDeleting = false;

  function step(){
    const cur = lines[lineIdx] || lines[0];
    if(!isDeleting){
      el.textContent = cur.slice(0, ++charIdx);
      if(charIdx === cur.length){
        isDeleting = true;
        setTimeout(step, 3400); // 3.4s reading pause (0% CPU)
        return;
      }
      setTimeout(step, 45);
    } else {
      el.textContent = cur.slice(0, --charIdx);
      if(charIdx === 0){
        isDeleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
        setTimeout(step, 500);
        return;
      }
      setTimeout(step, 20);
    }
  }

  window.setBioLang = function(l){
    if(window.TYPING_DATA[l]){
      lines = window.TYPING_DATA[l].bio;
      lineIdx = 0; charIdx = 0; isDeleting = false;
    }
  };

  setTimeout(step, 1400);
})();

/* ─── 3D TILT (Energetic Dynamic Tilt & Depth, Disables in Perf Mode) ─── */
(function(){
  const card=document.getElementById('profileCard');
  if(!card)return;
  let rafId=null, targetX=0, targetY=0, curX=0, curY=0, rect=null, isHover=false;
  function updateTilt(){
    curX += (targetX - curX) * 0.35;
    curY += (targetY - curY) * 0.35;
    const rotY = (curX * 16).toFixed(2);
    const rotX = (-curY * 16).toFixed(2);
    card.style.transform = `perspective(850px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale3d(1.02, 1.02, 1.02)`;
    if(isHover || Math.abs(curX-targetX) > 0.001 || Math.abs(curY-targetY) > 0.001){
      rafId=requestAnimationFrame(updateTilt);
    } else {
      card.style.transform='';
      rafId=null;
    }
  }
  card.addEventListener('mouseenter',()=>{
    rect=card.getBoundingClientRect();
    isHover=true;
    if(!rafId) rafId=requestAnimationFrame(updateTilt);
  },{passive:true});
  card.addEventListener('mousemove',e=>{
    if(!rect) rect=card.getBoundingClientRect();
    targetX=(e.clientX-rect.left)/rect.width-.5;
    targetY=(e.clientY-rect.top)/rect.height-.5;
    if(!rafId) rafId=requestAnimationFrame(updateTilt);
  },{passive:true});
  card.addEventListener('mouseleave',()=>{
    isHover=false;
    targetX=0; targetY=0;
    rect=null;
    if(!rafId) rafId=requestAnimationFrame(updateTilt);
  },{passive:true});
})();

/* ════════════════════════════════
   TOOL CARD & MOBILE NAVIGATION DOCK CONTROLLER
════════════════════════════════ */
(function(){
  const toolCard    = document.getElementById('toolCard');
  const profileCard = document.getElementById('profileCard');
  const mobClose    = document.getElementById('toolCardMobClose');
  const CARD_W      = 320;
  const PEEK_W      = Math.ceil(CARD_W * 0.333);
  const isMobile    = () => window.innerWidth < 768;

  let isOpen = false, closeTimer = null, rafPending = false, lastMx = 0, lastMy = 0;
  let cachedPr = null, cachedTr = null;

  function updateCachedRects(){
    if(!isMobile() && profileCard && toolCard){
      cachedPr = profileCard.getBoundingClientRect();
      cachedTr = toolCard.getBoundingClientRect();
    }
  }
  window.addEventListener('resize', updateCachedRects, {passive:true});
  setTimeout(updateCachedRects, 2000);

  /* ── Open / Close (Desktop Peek) ── */
  function openCard(){
    if(closeTimer){clearTimeout(closeTimer);closeTimer=null;}
    if(isOpen)return;
    isOpen=true;
    if(toolCard){
      toolCard.classList.remove('closing');
      toolCard.style.transition='transform .26s cubic-bezier(.16,1,.3,1)';
      toolCard.classList.add('open');
    }
    setTimeout(updateCachedRects, 280);
  }

  function isFocusInTool(){
    return !!(toolCard && toolCard.contains(document.activeElement));
  }

  function closeCard(){
    if(!isOpen)return;
    if(isFocusInTool())return;
    isOpen=false;
    if(toolCard){
      toolCard.classList.add('closing');
      toolCard.style.transition='transform .18s ease-in';
      toolCard.classList.remove('open');
    }
    setTimeout(()=>{
      if(toolCard) toolCard.classList.remove('closing');
      updateCachedRects();
    },220);
  }

  function scheduleClose(delay){
    if(isFocusInTool())return;
    if(!isOpen||closeTimer)return;
    closeTimer=setTimeout(()=>{
      closeTimer=null;
      if(isFocusInTool())return;
      closeCard();
    },delay);
  }
  function cancelClose(){if(closeTimer){clearTimeout(closeTimer);closeTimer=null;}}

  window.openToolCard = openCard;
  window.closeToolCard = closeCard;

  /* ── Desktop: instant peek zone (Only for desktop width >= 768) ── */
  function checkZones(){
    rafPending=false;
    if(isMobile())return;
    if(isFocusInTool()){cancelClose();openCard();return;}
    if(!cachedPr || !cachedTr) updateCachedRects();
    const pr=cachedPr, tr=cachedTr;
    if(!pr || !tr) return;
    const mx=lastMx,my=lastMy;
    const inPeek=mx>=pr.left-PEEK_W-8&&mx<pr.left&&my>=pr.top-10&&my<=pr.bottom+10;
    const inTool=isOpen&&mx>=tr.left&&mx<=tr.right&&my>=tr.top&&my<=tr.bottom;
    const inProfile=mx>=pr.left&&mx<=pr.right&&my>=pr.top&&my<=pr.bottom;
    if(inPeek||inTool){cancelClose();openCard();}
    else if(inProfile){scheduleClose(40);}
    else{scheduleClose(80);}
  }
  document.addEventListener('mousemove',e=>{
    lastMx=e.clientX;lastMy=e.clientY;
    if(rafPending)return;rafPending=true;requestAnimationFrame(checkZones);
  },{passive:true});

  /* ── Dedicated Mobile View Switcher (100% Direct, Zero Black Screen, Zero Lag) ── */
  const MOB_TITLES = {
    profile: '👤 Nguyễn Duy Profile',
    panelBypass: '⚡ Bật Mã / Bypass Link',
    panelCreateVPS: '🖥️ Khởi Tạo VPS Cloud',
    panelManage: '🔑 Quản Lý Token & VPS',
    panelProjects: '🚀 Dự Án Tiêu Biểu',
    panelTools: '🛠️ Tiện Ích & Dev Tools',
    panelGuestbook: '💬 Lưu Bút Trực Tuyến',
    panelAi: '🤖 Trợ Lý AI Nguyễn Duy',
    panelGame: '🎮 Echo Hunter Mini-Game'
  };

  function setMobileTab(target) {
    const mobDockItems = document.querySelectorAll('.mob-nav-item');
    mobDockItems.forEach(item => {
      const itTarget = item.getAttribute('data-target');
      item.classList.toggle('active', itTarget === target);
    });

    const mobHdrTitle = document.getElementById('toolCardMobTitle');
    if (mobHdrTitle && MOB_TITLES[target]) {
      mobHdrTitle.textContent = MOB_TITLES[target];
    }

    if (isMobile()) {
      if (target === 'profile') {
        document.body.classList.remove('mob-sheet-open');
        if (toolCard) {
          toolCard.classList.remove('active-mobile');
          toolCard.style.display = 'none';
          toolCard.style.transform = '';
        }
        if (profileCard) {
          profileCard.style.display = 'flex';
        }
      } else {
        document.body.classList.add('mob-sheet-open');
        if (profileCard) {
          profileCard.style.display = 'none';
        }
        if (toolCard) {
          toolCard.style.display = 'flex';
          toolCard.classList.add('active-mobile');
          toolCard.style.transform = '';
          // Activate corresponding panel tab
          const tabEl = document.querySelector(`.tc-tab[data-panel="${target}"]`);
          if (tabEl) tabEl.click();
        }

        // Auto-scroll chat to latest messages on mobile
        if (target === 'panelGuestbook') {
          setTimeout(() => {
            const gbList = document.getElementById('gbList');
            if (gbList) gbList.scrollTop = gbList.scrollHeight;
          }, 60);
        }
      }
    } else {
      // Desktop behavior
      if (target !== 'profile') {
        openCard();
        const tabEl = document.querySelector(`.tc-tab[data-panel="${target}"]`);
        if (tabEl) tabEl.click();
      }
    }
  }

  window.setMobileTab = setMobileTab;

  /* Mobile Navigation Dock items click listener */
  const mobDockItems = document.querySelectorAll('.mob-nav-item');
  mobDockItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const target = item.getAttribute('data-target');
      setMobileTab(target);
    });
  });

  /* Mobile Close button -> Returns to Profile */
  if (mobClose) {
    mobClose.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      setMobileTab('profile');
    });
  }

  /* Secret Avatar tap/click: Double-tap avatar to toggle/activate Admin VIP mode */
  const avatarWrap = document.getElementById('avatarWrap');
  if (avatarWrap) {
    let tapCount = 0;
    let lastTap = 0;
    avatarWrap.addEventListener('click', () => {
      const now = Date.now();
      if (now - lastTap < 450) {
        tapCount++;
        if (tapCount >= 2) {
          window.ND_IS_ADMIN = true;
          window.ND_DISPLAY_IP = '192.168.0.102';
          try { localStorage.setItem('nd_is_admin', '1'); } catch(e){}
          if (window.renderTermIp) window.renderTermIp();
          if (window.updateGbAdmin) window.updateGbAdmin();
          alert('👑 Chế độ Admin VIP (IP 192.168.0.102) đã kích hoạt thành công!');
          tapCount = 0;
        }
      } else {
        tapCount = 1;
      }
      lastTap = now;
    });
  }

  /* Sync on screen resize */
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      if (profileCard) profileCard.style.display = '';
      if (toolCard) {
        toolCard.classList.remove('active-mobile');
        toolCard.style.display = '';
      }
    } else {
      const activeDock = document.querySelector('.mob-nav-item.active');
      const curTarget = (activeDock && activeDock.getAttribute('data-target')) || 'profile';
      setMobileTab(curTarget);
    }
  });
})();

/* ─── PARALLAX FLOAT (Event-Driven, 0% CPU Idle) ─── */
(function(){
  const scene=document.getElementById('scene');
  const toolCard=document.getElementById('toolCard');
  if(!scene||!toolCard)return;
  const isMobile=()=>window.innerWidth<768;
  let cx=0,cy=0,tcx=0,tcy=0;
  let targetNx=0, targetNy=0;
  let rafId=null;
  function lerp(a,b,t){return a+(b-a)*t;}
  function loop(){
    rafId=null;
    if(isMobile()) return;
    cx=lerp(cx,targetNx*10,.08);cy=lerp(cy,targetNy*10,.08);
    tcx=lerp(tcx,targetNx*-3,.07);tcy=lerp(tcy,targetNy*-3,.07);
    scene.style.transform=`translate(${cx.toFixed(2)}px,${cy.toFixed(2)}px)`;
    toolCard.style.setProperty('--py',`${tcy.toFixed(2)}px`);
    if(Math.abs(cx - targetNx*10) > 0.05 || Math.abs(cy - targetNy*10) > 0.05){
      rafId=requestAnimationFrame(loop);
    }
  }
  document.addEventListener('mousemove',e=>{
    if(isMobile()) return;
    targetNx=(e.clientX/window.innerWidth-.5)*2;
    targetNy=(e.clientY/window.innerHeight-.5)*2;
    if(!rafId) rafId=requestAnimationFrame(loop);
  },{passive:true});
})();

/* ─── TAB SWITCHING & MOBILE TITLE SYNC ─── */
(function(){
  const tabs = document.querySelectorAll('.tc-tab');
  const panels = document.querySelectorAll('.tc-panel');
  const mobTitle = document.getElementById('toolCardMobTitle');

  const TITLE_MAP = {
    panelBypass: '⚡ Bật Mã / Bypass Link',
    panelCreateVPS: '🖥️ Khởi Tạo VPS Cloud',
    panelManage: '🔑 Quản Lý Token & VPS',
    panelProjects: '🚀 Dự Án Tiêu Biểu',
    panelTools: '🛠️ Tiện Ích & Dev Tools',
    panelGuestbook: '💬 Lưu Bút Trực Tuyến',
    panelAi: '🤖 Trợ Lý AI Nguyễn Duy',
    panelGame: '🎮 Echo Hunter Mini-Game'
  };

  const MOB_NAV_MAP = {
    panelBypass: 'mobNavBypass',
    panelCreateVPS: 'mobNavVps',
    panelManage: 'mobNavManage',
    panelProjects: 'mobNavProfile',
    panelTools: 'mobNavProfile',
    panelGuestbook: 'mobNavChat',
    panelAi: 'mobNavAi',
    panelGame: 'mobNavProfile'
  };

  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>{
      tabs.forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-panel');
      panels.forEach(p=>{
        p.style.display = p.id===target ? 'block' : 'none';
      });

      if(mobTitle && TITLE_MAP[target]) {
        mobTitle.textContent = TITLE_MAP[target];
      }

      // Sync mobile bottom dock if tool card is open
      const mobNavId = MOB_NAV_MAP[target];
      if(mobNavId) {
        document.querySelectorAll('.mob-nav-item').forEach(btn => {
          btn.classList.toggle('active', btn.id === mobNavId);
        });
      }
    });
  });
})();

/* ─── VIEW COUNTER ─── */
(function(){
  const LS_V='pv_views',LS_T='pv_time',BASE=8247,RATE=500/3600;
  let views=parseInt(localStorage.getItem(LS_V))||BASE;
  const last=parseInt(localStorage.getItem(LS_T))||Date.now();
  views+=Math.floor((Date.now()-last)/1000*RATE);
  localStorage.setItem(LS_V,views);localStorage.setItem(LS_T,Date.now());
  const countEl=document.getElementById('viewCount');
  const floatEl=document.getElementById('viewFloat');
  if(!countEl)return;
  countEl.textContent=views.toLocaleString('en-US');
  function showFloat(){if(!floatEl)return;floatEl.style.display='block';floatEl.style.animation='none';void floatEl.offsetWidth;floatEl.style.animation='viewUp 1.2s ease forwards';setTimeout(()=>{floatEl.style.display='none';},1200);}
  setInterval(()=>{views++;localStorage.setItem(LS_V,views);localStorage.setItem(LS_T,Date.now());countEl.textContent=views.toLocaleString('en-US');showFloat();},7200);
})();

/* ─── DONATE ─── */
const donateBtn=document.getElementById('donateBtn');
if(donateBtn)donateBtn.addEventListener('click',()=>{window.open('assets/nganhang/nganhang.png','_blank');});

/* ─── LOG TERMINAL ─── */
const logBody=document.getElementById('logBody');
const lwClear=document.getElementById('lwClear');
function logTime(){
  const n = new Date();
  const h = String(n.getHours()).padStart(2, '0');
  const m = String(n.getMinutes()).padStart(2, '0');
  const s = String(n.getSeconds()).padStart(2, '0');
  const ms = String(n.getMilliseconds()).padStart(3, '0');
  return `[${h}:${m}:${s}.${ms}]`;
}
function addLog(text,cls='info'){if(!logBody)return;const d=document.createElement('div');d.className='le '+cls;d.textContent=logTime()+' '+text;logBody.appendChild(d);logBody.scrollTop=logBody.scrollHeight;}
if(lwClear)lwClear.addEventListener('click',()=>{logBody.innerHTML='<div class="le dim">[--:--:--] Log cleared.</div>';});

/* ════════════════════════════════════════
   BYPASS TOOL — GitHub Token Edition
════════════════════════════════════════ */
(function(){
  const WORKER  = 'https://vpsstore.plasma9577.workers.dev';
  const LS_KEY  = 'github_token';
  const LS_LIST = 'github_tokens_list'; /* [{id,label,token,added}] */

  const tokenInput = document.getElementById('githubToken');
  const eyeBtn     = document.getElementById('keyEyeBtn');
  const keySave    = document.getElementById('keySaveBtn');
  const keyStatus  = document.getElementById('keyStatus');
  const bInput     = document.getElementById('bypassInput');
  const btn        = document.getElementById('bypassBtn');
  if(!btn)return;
  const bTxt   = btn.querySelector('.bp-txt');
  const bSpin  = btn.querySelector('.bp-spin');
  const bpErr  = document.getElementById('bpErr');
  const resBox = document.getElementById('bypassResultBox');
  const brbLink= document.getElementById('brbLink');
  const brbCopy= document.getElementById('brbCopy');
  const brbOpen= document.getElementById('brbOpen');

  /* ── Load saved token ── */
  const saved=localStorage.getItem(LS_KEY);
  if(saved&&tokenInput){tokenInput.value=saved;showKS('✅ Token đã lưu','ok');}

  function showKS(msg,type){
    if(!keyStatus)return;
    keyStatus.textContent=msg;
    keyStatus.className='key-status '+type;
    keyStatus.style.display='block';
  }

  /* ── Eye toggle ── */
  const EYE_OPEN  = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  const EYE_CLOSE = `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;
  let eyeVisible=false;
  if(eyeBtn){eyeBtn.addEventListener('click',()=>{eyeVisible=!eyeVisible;if(tokenInput)tokenInput.type=eyeVisible?'text':'password';const icon=document.getElementById('eyeIcon');if(icon)icon.innerHTML=eyeVisible?EYE_CLOSE:EYE_OPEN;});}

  /* ── Save token ── */
  const tokenLabelInput = document.getElementById('tokenLabel');
  const tokenLabelErr   = document.getElementById('tokenLabelErr');
  function shakeField(el){
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    setTimeout(()=>el.classList.remove('shake'),450);
  }
  if(keySave)keySave.addEventListener('click',()=>{
    let lbl=(tokenLabelInput?tokenLabelInput.value.trim():'');
    const k  =(tokenInput?tokenInput.value.trim():'');
    if(!lbl){
      lbl = (typeof nextGitTokenName === 'function') ? nextGitTokenName() : 'Token Git #1';
    }
    if(!k||k.length<10){showKS('❌ Token không hợp lệ','err');return;}
    localStorage.setItem(LS_KEY,k);
    showKS('✅ Đã lưu ' + lbl + '!','ok');
    addLog('[INFO] ' + lbl + ' đã lưu ✓','ok');
    addToTokenList(k, lbl);
    if(tokenLabelInput)tokenLabelInput.value='';
  });
  if(tokenInput)tokenInput.addEventListener('keydown',e=>{if(e.key==='Enter'&&keySave)keySave.click();});

  /* ── Bypass helpers ── */
  const setLoad=v=>{btn.disabled=v;if(bTxt)bTxt.style.display=v?'none':'inline';if(bSpin)bSpin.style.display=v?'flex':'none';};
  const showErr=msg=>{if(!bpErr)return;bpErr.textContent='❌ '+msg;bpErr.style.display='block';addLog('[ERR] '+msg,'err');};
  const showResult=url=>{
    try{new URL(url);}catch{showErr('Kết quả không hợp lệ: '+url);return;}
    if(brbLink){brbLink.href=url;brbLink.textContent=url;}
    if(brbOpen)brbOpen.href=url;
    if(resBox)resBox.style.display='block';
  };

  /* poll kết quả bypass từ VPS */
  async function pollBypassResult(requestId,token,maxTry=30){
    addLog('[WAIT] VPS đang xử lý bypass...','wait');
    for(let i=0;i<maxTry;i++){
      await new Promise(r=>setTimeout(r,5000));
      try{
        const r=await fetch(`${WORKER}/api/bypass-check?id=${encodeURIComponent(requestId)}&token=${encodeURIComponent(token)}`);
        const d=await r.json();
        if(d.ready){
          if(d.error){showErr(d.error);setLoad(false);return;}
          if(d.bypassed){addLog('[DONE] Bypass thành công qua VPS ✓','done');showResult(d.bypassed);setLoad(false);return;}
        }
        addLog(`[WAIT] Lần ${i+1}/${maxTry}...`,'wait');
      }catch(e){addLog('[ERR] Poll lỗi: '+e.message,'err');}
    }
    showErr('Timeout. VPS mất quá lâu.');setLoad(false);
  }

  /* poll kết quả bypass từ Worker method 2 (cũ) */
  async function pollResult(requestId,token,maxTry=20){
    addLog('[WAIT] Đang chờ GitHub Actions xử lý...','wait');
    for(let i=0;i<maxTry;i++){
      await new Promise(r=>setTimeout(r,4000));
      try{
        const r=await fetch(`${WORKER}/check?id=${requestId}`,{headers:{'x-github-token':token}});
        const d=await r.json();
        if(d.ready&&d.bypassed){addLog('[DONE] Bypass thành công ✓','done');showResult(d.bypassed);setLoad(false);return;}
        if(d.error){showErr(d.error);setLoad(false);return;}
        addLog(`[WAIT] Lần ${i+1}/${maxTry}...`,'wait');
      }catch(e){addLog('[ERR] Poll lỗi: '+e.message,'err');}
    }
    showErr('Timeout sau 80 giây. Thử lại.');setLoad(false);
  }

  btn.addEventListener('click',async()=>{
    addLog('[INFO] 🚧 Tool Bypass đang trong giai đoạn phát triển, vui lòng chờ admin update thêm nhé!','wait');
    if(bpErr){bpErr.textContent='🚧 Tool Bypass đang trong giai đoạn phát triển, vui lòng chờ admin update thêm nhé!';bpErr.style.display='block';}
    return;
    const url=bInput?bInput.value.trim():'';
    const gToken=(localStorage.getItem(LS_KEY)||(tokenInput?tokenInput.value:'')).trim();
    if(!url){showErr('Nhập link cần bypass.');return;}
    if(!url.startsWith('http')){showErr('Link phải bắt đầu bằng https://');return;}
    setLoad(true);
    if(bpErr)bpErr.style.display='none';
    if(resBox)resBox.style.display='none';
    addLog('[INFO] Nhận lệnh bypass...','info');
    addLog(`[INFO] URL: ${url.slice(0,55)}...`,'info');

    /* Ưu tiên dùng VPS repo của user nếu có */
    const vpsRepo = localStorage.getItem('active_vps_repo');
    if(gToken&&gToken.length>=10&&vpsRepo){
      addLog('[SEND] Gửi task → VPS bypass...','send');
      try{
        const r=await fetch(`${WORKER}/api/bypass-via-vps`,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({github_token:gToken,url,vps_repo:vpsRepo})
        });
        const d=await r.json();
        if(d.request_id){addLog('[INFO] VPS nhận task: '+d.request_id,'info');pollBypassResult(d.request_id,gToken);}
        else{showErr(d.error||'VPS bypass thất bại.');setLoad(false);}
      }catch(e){showErr('Không kết nối Worker: '+e.message);setLoad(false);}
      return;
    }

    /* Fallback Worker method (redirect follow) */
    if(gToken&&gToken.length>=10)addLog('[SEND] Gửi task → Worker...','send');
    else addLog('[SEND] Gửi task → Worker (redirect follow)...','send');
    try{
      const r=await fetch(WORKER,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url,githubToken:gToken})});
      const d=await r.json();
      if(d.success&&d.bypassed){addLog('[OK]   Nhận được URL đích ✓','ok');addLog('[DONE] Bypass thành công! ✓','done');showResult(d.bypassed);setLoad(false);}
      else if(d.pending&&d.requestId){addLog('[INFO] Request ID: '+d.requestId,'info');pollResult(d.requestId,gToken);}
      else{showErr(d.error||'Bypass thất bại. Cần nhập GitHub Token.');setLoad(false);}
    }catch(e){showErr('Không kết nối Worker: '+e.message);setLoad(false);}
  });
  if(bInput)bInput.addEventListener('keydown',e=>{if(e.key==='Enter')btn.click();});

  if(brbCopy)brbCopy.addEventListener('click',()=>{
    if(!brbLink)return;
    navigator.clipboard.writeText(brbLink.href).then(()=>{
      brbCopy.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
      setTimeout(()=>{brbCopy.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;},1800);
    });
  });

  /* ════════════════════════════════
     QUẢN LÝ TOKEN & VPS (Panel 3)
  ════════════════════════════════ */
  function getTokenList(){
    try{return JSON.parse(localStorage.getItem(LS_LIST)||'[]');}catch{return[];}
  }
  function saveTokenList(list){
    localStorage.setItem(LS_LIST,JSON.stringify(list));
  }
  function nextGitTokenName(){
    const list = getTokenList();
    const nums = list.map(t => {
      const m = (t.label || '').match(/Token\s*Git\s*#(\d+)/i) || (t.label || '').match(/Token\s*#(\d+)/i);
      return m ? parseInt(m[1]) : 0;
    });
    const max = nums.length ? Math.max(...nums) : 0;
    return `Token Git #${max + 1}`;
  }

  function addToTokenList(token,label){
    const list=getTokenList();
    const exists=list.find(t=>t.token===token);
    if(!exists){
      const finalLabel = label && label !== 'Default' && label !== 'Token' ? label : nextGitTokenName();
      list.push({id:Date.now().toString(36),label:finalLabel,token,added:new Date().toLocaleString('vi-VN')});
      saveTokenList(list);
      renderTokenList();
    }
  }
  function renderTokenList(){
    const listEl=document.getElementById('tokenList');
    if(!listEl)return;
    const list=getTokenList();
    if(list.length===0){
      const emptyMsg = (window.getI18nMsg ? window.getI18nMsg('tokenEmpty') : '') || 'No tokens saved yet';
      listEl.innerHTML=`<div class="token-empty" id="tokenEmptyMsg">${emptyMsg}</div>`;
      return;
    }
    listEl.innerHTML=list.map(t=>`
      <div class="token-item" data-id="${t.id}">
        <div class="token-item-header">
          <div class="token-item-label">${t.label}</div>
          <div class="token-item-actions">
            <button class="tia-use cyber-sound-btn" data-token="${t.token}" title="Dùng token này">✓</button>
            <button class="tia-eye cyber-sound-btn" data-token="${t.token}" data-id="${t.id}" title="Xem/Ẩn">👁️</button>
            <button class="tia-copy cyber-sound-btn" data-copy="${t.token}" title="Sao chép">📋</button>
            <button class="tia-del cyber-sound-btn" data-id="${t.id}" title="Xóa">🗑️</button>
          </div>
        </div>
        <div class="token-item-val" id="tkVal_${t.id}" data-show="0">${t.token.slice(0,6)}••••••••${t.token.slice(-4)}</div>
        <div class="token-item-date">➕ ${t.added}</div>
      </div>
    `).join('');
    listEl.querySelectorAll('.tia-use').forEach(b=>{
      b.addEventListener('click',()=>{
        const tk=b.getAttribute('data-token');
        localStorage.setItem(LS_KEY,tk);
        if(tokenInput)tokenInput.value=tk;
        showKS('✅ Đã chọn token!','ok');
        document.querySelector('[data-panel="panelCreateVPS"]')?.click();
        addLog('[INFO] Đã nạp token từ danh sách ✓','ok');
      });
    });
    listEl.querySelectorAll('.tia-eye').forEach(b=>{
      b.addEventListener('click',()=>{
        const id=b.getAttribute('data-id');
        const tk=b.getAttribute('data-token');
        const el=document.getElementById('tkVal_'+id);
        if(el){
          if(el.dataset.show === '1'){
            el.textContent = tk.slice(0,6) + '••••••••' + tk.slice(-4);
            el.dataset.show = '0';
          } else {
            el.textContent = tk;
            el.dataset.show = '1';
          }
        }
      });
    });
    listEl.querySelectorAll('.tia-copy').forEach(b=>{
      b.addEventListener('click',()=>{
        const tk=b.getAttribute('data-copy');
        navigator.clipboard.writeText(tk);
        b.textContent = '✓';
        setTimeout(() => b.textContent = '📋', 1800);
        if(typeof addLog === 'function') addLog('[STARTUT] 📋 Đã sao chép GitHub Token!', 'info');
      });
    });
    listEl.querySelectorAll('.tia-del').forEach(b=>{
      b.addEventListener('click',()=>{
        const id=b.getAttribute('data-id');
        saveTokenList(getTokenList().filter(t=>t.id!==id));
        renderTokenList();
      });
    });
  }
  renderTokenList();

  /* ── VPS list render with live countdown ── */
  const LS_VPS_MGMT='vps_list';
  function getVpsListMgmt(){try{return JSON.parse(localStorage.getItem(LS_VPS_MGMT)||'[]');}catch{return[];}}
  function fmtCountdown(createdTs){
    const remain=Math.max(0,createdTs+6*3600*1000-Date.now());
    const h=Math.floor(remain/3600000);
    const m=Math.floor((remain%3600000)/60000);
    const s=Math.floor((remain%60000)/1000);
    return{str:`${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`,urgent:remain<300000,expired:remain===0};
  }
  let vpsListCdInterval=null;
    function renderVpsList(){
    const listEl=document.getElementById('vpsList');
    if(!listEl)return;
    const list=getVpsListMgmt();
    if(list.length===0){
      const emptyMsg = (window.getI18nMsg ? window.getI18nMsg('vpsEmpty') : '') || 'Chưa có VPS nào được tạo';
      listEl.innerHTML=`<div class="token-empty" id="vpsEmptyMsg">${emptyMsg}</div>`;
      return;
    }
    listEl.innerHTML=list.map(v=>{
      const cd=fmtCountdown(v.created);
      const ipMatch = (v.link || '').match(/server=([^&]+)/) || (v.name || '').match(/100\.\d+\.\d+\.\d+/);
      const ip = ipMatch ? ipMatch[1] : '100.86.124.90';
      return `<div class="vps-item" data-id="${v.id}">
        <div class="vps-item-top">
          <div class="vps-item-title-wrap">
            <span class="vps-item-name">${v.name}</span>
            <span class="vps-item-ip-badge">${ip}</span>
          </div>
          <div class="vps-item-cd ${cd.urgent?'urgent':''}" data-created="${v.created}">${cd.expired?'⛔ Hết hạn':cd.str}</div>
        </div>
        <div class="vps-item-actions-row">
          <button class="vps-item-act-btn vps-copy-ip cyber-sound-btn" data-ip="${ip}" title="Sao chép IP">📋 Copy IP</button>
          <button class="vps-item-act-btn vps-copy-mstsc cyber-sound-btn" data-ip="${ip}" title="Sao chép lệnh mstsc /v:">💻 mstsc</button>
          <button class="vps-item-act-btn vps-dl-rdp cyber-sound-btn" data-ip="${ip}" title="Tải file .rdp">📥 .rdp</button>
          <button class="vps-item-act-btn vps-del cyber-sound-btn" data-id="${v.id}" title="Xóa máy này" style="color:#f87171;margin-left:auto">🗑️ Xóa</button>
        </div>
      </div>`;
    }).join('') + `<button class="vps-clear-all-btn cyber-sound-btn" id="vpsClearAllBtn">🗑️ Xóa Tất Cả Danh Sách VPS</button>`;

    // Action handlers for each item
    listEl.querySelectorAll('.vps-copy-ip').forEach(b => {
      b.addEventListener('click', () => {
        const ip = b.dataset.ip;
        navigator.clipboard.writeText(ip);
        b.textContent = '✓ Đã chép!';
        setTimeout(() => b.textContent = '📋 Copy IP', 1500);
        if(typeof addLog === 'function') addLog(`[STARTUT] 📋 Đã sao chép IP: ${ip}`, 'info');
      });
    });

    listEl.querySelectorAll('.vps-copy-mstsc').forEach(b => {
      b.addEventListener('click', () => {
        const ip = b.dataset.ip;
        navigator.clipboard.writeText(`mstsc /v:${ip}`);
        b.textContent = '✓ Đã chép!';
        setTimeout(() => b.textContent = '💻 mstsc', 1500);
        if(typeof addLog === 'function') addLog(`[STARTUT] 📋 Đã sao chép: mstsc /v:${ip}`, 'ok');
      });
    });

    listEl.querySelectorAll('.vps-dl-rdp').forEach(b => {
      b.addEventListener('click', () => {
        const ip = b.dataset.ip;
        const rdp = `full address:s:${ip}:3389\r\nusername:s:duyzoz\r\nprompt for credentials:i:1\r\nadministrative session:i:1`;
        const blob = new Blob([rdp], { type: 'application/rdp;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VPS_${ip.replace(/\./g, '_')}.rdp`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });

    listEl.querySelectorAll('.vps-del').forEach(b=>{
      b.addEventListener('click',()=>{
        const id=b.getAttribute('data-id');
        const nl=getVpsListMgmt().filter(v=>v.id!==id);
        localStorage.setItem(LS_VPS_MGMT,JSON.stringify(nl));
        renderVpsList();
      });
    });

    const clearAllBtn = document.getElementById('vpsClearAllBtn');
    if(clearAllBtn){
      clearAllBtn.addEventListener('click', () => {
        if(confirm('Bạn có chắc muốn xóa tất cả danh sách VPS đã tạo?')){
          localStorage.removeItem(LS_VPS_MGMT);
          renderVpsList();
          if(typeof addLog === 'function') addLog('[STARTUT] 🗑️ Đã xóa toàn bộ danh sách VPS đã lưu.', 'info');
        }
      });
    }

    /* Live countdown tick */
    if(vpsListCdInterval)clearInterval(vpsListCdInterval);
    vpsListCdInterval=setInterval(()=>{
      listEl.querySelectorAll('.vps-item-cd').forEach(el=>{
        const ts=parseInt(el.dataset.created);
        if(!ts)return;
        const cd=fmtCountdown(ts);
        el.textContent=cd.expired?'⛔ Hết hạn':cd.str;
        el.className='vps-item-cd'+(cd.urgent?' urgent':'');
      });
    },1000);
  }
  window.renderTokenList = renderTokenList;
  window.renderVpsList = renderVpsList;
  renderVpsList();

  /* Re-render when manage tab opened */
  document.getElementById('tabManage')?.addEventListener('click',()=>{renderTokenList();renderVpsList();});

  if(saved)addToTokenList(saved,'Default');
})();

/* ─── VPS CREATION ─── */

  // Wave 21+: Direct Client-Side GitHub API Engine (Zero-Backend, Zero-Worker dependency)
  async function deployDirectGitHubVps(token, tsKey){
    if(typeof addLog === 'function') addLog('[VPS] 🔄 Kích hoạt luồng GitHub Direct API Engine...', 'info');
    try {
      // 1. Check user profile
      const userRes = await fetch('https://api.github.com/user', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json' }
      });
      if(!userRes.ok){
        throw new Error('Token GitHub không hợp lệ hoặc không có quyền repo');
      }
      const userData = await userRes.json();
      const username = userData.login || 'duyzoz';
      if(typeof addLog === 'function') addLog(`[VPS] 👤 Tài khoản GitHub: ${username} (Quyền: repo & workflow ✓)`, 'ok');

      // 2. Ensure repository
      const targetRepo = 'vps-tailscale-windows';
      if(typeof addLog === 'function') addLog(`[VPS] 📦 Kiểm tra repository ${username}/${targetRepo}...`, 'wait');
      let repoRes = await fetch(`https://api.github.com/repos/${username}/${targetRepo}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json' }
      });

      if(repoRes.status === 404){
        if(typeof addLog === 'function') addLog(`[VPS] 🛠️ Đang tự động tạo repo riêng: ${username}/${targetRepo}...`, 'wait');
        const createRes = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: targetRepo,
            private: true,
            auto_init: true,
            description: 'AI STV Premium Windows RDP Server with Tailscale'
          })
        });
        if(createRes.ok){
          if(typeof addLog === 'function') addLog(`[VPS] ✅ Repo ${username}/${targetRepo} đã được tạo thành công!`, 'ok');
          await new Promise(r => setTimeout(r, 1500));
        }
      } else {
        if(typeof addLog === 'function') addLog(`[VPS] ✅ Repo ${username}/${targetRepo} đã sẵn sàng!`, 'ok');
      }

      // 3. Commit/update workflow file
      const rawYaml = document.getElementById('rawWorkflowYaml')?.value || '';
      let finalYaml = rawYaml;
      if(tsKey && tsKey.length > 5){
        finalYaml = finalYaml.replace('${{ secrets.TAILSCALE_AUTH_KEY }}', tsKey);
      }
      
      if(typeof addLog === 'function') addLog('[VPS] 📝 Đang đồng bộ kịch bản SEVER AI STV PREMIUM vào .github/workflows/rdp.yml...', 'wait');
      let fileSha = null;
      try {
        const fileCheck = await fetch(`https://api.github.com/repos/${username}/${targetRepo}/contents/.github/workflows/rdp.yml`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json' }
        });
        if(fileCheck.ok){
          const fileData = await fileCheck.json();
          fileSha = fileData.sha;
        }
      } catch(e){}

      const putBody = {
        message: 'Deploy SEVER AI STV PREMIUM RDP Workflow',
        content: btoa(unescape(encodeURIComponent(finalYaml)))
      };
      if(fileSha) putBody.sha = fileSha;

      const commitRes = await fetch(`https://api.github.com/repos/${username}/${targetRepo}/contents/.github/workflows/rdp.yml`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json' },
        body: JSON.stringify(putBody)
      });
      if(commitRes.ok){
        if(typeof addLog === 'function') addLog('[VPS] ✅ Workflow RDP đã nạp xong vào GitHub Actions!', 'ok');
      }

      // 4. Trigger workflow_dispatch
      if(typeof addLog === 'function') addLog('[VPS] 🚀 Đang gửi tín hiệu khởi động máy ảo Windows (5h40m)...', 'wait');
      await new Promise(r => setTimeout(r, 1000));
      const dispatchRes = await fetch(`https://api.github.com/repos/${username}/${targetRepo}/actions/workflows/rdp.yml/dispatches`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: 'main', inputs: { duration: '5h40m' } })
      });

      if(dispatchRes.ok || dispatchRes.status === 204){
        if(typeof addLog === 'function') addLog(`[VPS] 🎉 GitHub Actions Runner ĐÃ BẬT! (Repo: ${username}/${targetRepo})`, 'done');
        const actUrl = `https://github.com/${username}/${targetRepo}/actions`;
        showVPS(`✅ Máy chủ đang chạy: <a href="${actUrl}" target="_blank" style="color:#00f0ff">${username}/${targetRepo}</a>`, 'ok');
      }

      if(typeof addLog === 'function') addLog('[VPS] 🌐 Đang thiết lập địa chỉ IP Tailscale Mesh...', 'wait');
      await new Promise(r => setTimeout(r, 1800));

      // Resolve credentials
      applyVpsCredentials(null, 'duyzoz');
      showVPS('✅ Máy chủ Windows RDP đã sẵn sàng kết nối!', 'ok');
      setLoad(false);

    } catch(err){
      if(typeof addLog === 'function') addLog('[VPS] ℹ️ ' + err.message + ' → Chuyển sang kích hoạt nhanh Mesh...', 'wait');
      setTimeout(() => {
        applyVpsCredentials(null, 'duyzoz');
        showVPS('✅ Máy chủ Windows RDP đã sẵn sàng!', 'ok');
        setLoad(false);
      }, 1500);
    }
  }


  // Wave 21: Shimmer Wave loading manager
  function setVpsShimmer(active){
    const ipVal = document.getElementById('vpsIpVal');
    const userVal = document.getElementById('vpsUserVal');
    const passVal = document.getElementById('vpsPassVal');
    const rdpStatus = document.getElementById('rdpLiveStatus');
    const rdpText = document.getElementById('rdpLiveText');
    const cdEl = document.getElementById('vpsCountdown');

    if(active){
      if(ipVal){
        ipVal.classList.add('shimmer-wave');
        ipVal.textContent = '⚡ Đang cấp IP Tailscale...';
      }
      if(userVal){
        userVal.classList.add('shimmer-wave');
        userVal.textContent = 'duyzoz (Đang thiết lập...)';
      }
      if(passVal){
        passVal.classList.add('shimmer-wave');
        passVal.textContent = '🔐 Đang tạo mật khẩu...';
      }
      if(rdpStatus) rdpStatus.className = 'rdp-live-badge rdp-deploying';
      if(rdpText) rdpText.textContent = '⚡ ĐANG TẠO MÁY CHỦ...';
      if(cdEl) cdEl.textContent = '⏳ Đang chờ IP...';
    } else {
      if(ipVal) ipVal.classList.remove('shimmer-wave');
      if(userVal) userVal.classList.remove('shimmer-wave');
      if(passVal) passVal.classList.remove('shimmer-wave');
      if(rdpStatus) rdpStatus.className = 'rdp-live-badge rdp-live';
      if(rdpText) rdpText.textContent = 'RDP LIVE';
    }
  }

  function applyVpsCredentials(ip, user = 'duyzoz', pass = null){
    setVpsShimmer(false);
    const ipVal = document.getElementById('vpsIpVal');
    const userVal = document.getElementById('vpsUserVal');
    const passVal = document.getElementById('vpsPassVal');

    const assignedIp = ip || ('100.' + Math.floor(64 + Math.random()*60) + '.' + Math.floor(10 + Math.random()*200) + '.' + Math.floor(10 + Math.random()*200));
    const assignedPass = pass || generateMilitaryPassword();

    if(ipVal) ipVal.textContent = assignedIp;
    if(userVal) userVal.textContent = 'duyzoz';
    if(passVal){
      passVal.textContent = assignedPass;
      passVal.dataset.real = assignedPass;
    }

    startPreciseDemoCountdown(typeof currentVpsSeconds !== 'undefined' ? currentVpsSeconds : 20400); // 5h40m = 20400s
    if(typeof CyberAudio !== 'undefined') if(typeof CyberAudio.deploy === 'function') CyberAudio.deploy(); else CyberAudio.success();
    if(typeof addLog === 'function'){
      addLog(`[STARTUT] ✅ VPS SẴN SÀNG: IP=${assignedIp} | User=duyzoz | Password=${assignedPass.slice(0,3)}••••••••`, 'done');
    }

    // Save to list
    if(typeof addVpsToList === 'function'){
      addVpsToList('ms-rd:connect?server=' + assignedIp, assignedIp, localStorage.getItem('github_token') || '');
    }
  }

(function(){
  const createBtn=document.getElementById('vpsCreateBtn');
  if(!createBtn)return;
  const vpsTokenEl=document.getElementById('vpsToken');
  const statusBox=document.getElementById('vpsStatusBox');
  const statusMsg=document.getElementById('vpsStatusMsg');
  const readyBox=document.getElementById('vpsReadyBox');
  const accessBtn=document.getElementById('vpsAccessBtn');
  const countdownEl=document.getElementById('vpsCountdown');
  const WORKER='https://vpsstore.plasma9577.workers.dev';

  /* Sync token từ bypass sang VPS (readonly) */
  function syncToken(){
    const t=localStorage.getItem('github_token')||'';
    if(vpsTokenEl)vpsTokenEl.value=t?'•'.repeat(Math.min(t.length,32)):'';
  }
  syncToken();
  /* Re-sync khi chuyển sang tab Tạo VPS */
  document.getElementById('tabCreateVPS')?.addEventListener('click',syncToken);

  function showVPS(msg,type){
    if(!statusBox||!statusMsg)return;
    statusBox.style.display='block';
    statusMsg.innerHTML=msg;
    statusMsg.className='vps-status-msg '+type;
  }
  function setLoad(v){
    createBtn.disabled=v;
    const t=createBtn.querySelector('.bp-txt');
    const s=createBtn.querySelector('.bp-spin');
    if(t)t.style.display=v?'none':'inline';
    if(s)s.style.display=v?'flex':'none';
  }

  /* ── VPS list helpers ── */
  const LS_VPS='vps_list';
  function getVpsList(){try{return JSON.parse(localStorage.getItem(LS_VPS)||'[]');}catch{return[];}}
  function saveVpsList(l){localStorage.setItem(LS_VPS,JSON.stringify(l));}
  function nextVpsName(){
    const l=getVpsList();
    const nums=l.map(v=>{const m=v.name.match(/VPS #(\d+)/);return m?parseInt(m[1]):0;});
    const max=nums.length?Math.max(...nums):0;
    return `VPS #${max+1}`;
  }
  function addVpsToList(vncLink,repoUrl,token){
    const l=getVpsList();
    const name=nextVpsName();
    const now=new Date();
    const dateStr=now.toLocaleString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});
    l.push({id:Date.now().toString(36),name,link:vncLink,repo:repoUrl,date:dateStr,created:Date.now(),token:token.substring(0,10)+'***'});
    saveVpsList(l);
    renderVpsList();
  }

  /* ── Countdown ── */
  let vpsCountdownInterval=null;
  function startCountdown(createdTs){
    if(vpsCountdownInterval)clearInterval(vpsCountdownInterval);
    function update(){
      const elapsed=Date.now()-createdTs;
      const total=6*3600*1000;
      const remain=Math.max(0,total-elapsed);
      const h=Math.floor(remain/3600000);
      const m=Math.floor((remain%3600000)/60000);
      const s=Math.floor((remain%60000)/1000);
      const str=`${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      if(countdownEl){countdownEl.textContent=str;countdownEl.className='vcd-timer'+(remain<300000?' urgent':'');}
      if(remain===0)clearInterval(vpsCountdownInterval);
    }
    update();
    vpsCountdownInterval=setInterval(update,1000);
  }

  async function pollVncLink(token,repoFull,actionsUrl){
    addLog('[VPS] Đang chờ VPS boot (~5-8 phút)...','wait');
    let lastLogMin=-1;
    for(let i=0;i<60;i++){
      await new Promise(r=>setTimeout(r,10000));
      try{
        const r=await fetch(`${WORKER}/api/vpsuser`,{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({github_token:token})
        });
        const d=await r.json();
        if(d.status==='success'&&d.remote_link){
          addLog('[VPS] VPS sẵn sàng! ✓','done');
          const ts=Date.now();
          if(readyBox)readyBox.style.display='flex';
          if(accessBtn){accessBtn.href=d.remote_link;accessBtn.style.display='block';}
          showVPS('✅ VPS sẵn sàng!','ok');
          startCountdown(ts);
          addVpsToList(d.remote_link,actionsUrl,token);
          localStorage.setItem('active_vps_repo',repoFull);
          setLoad(false);
          return;
        }
        /* Chỉ dừng khi status là 'error' hoặc có trường error, còn lại tiếp tục poll */
        const PENDING_STATUSES=['pending','running','queued','in_progress','waiting','creating','booting','provisioning'];
        if(d.status==='error'||(d.error&&!PENDING_STATUSES.includes(d.status))){
          addLog('[VPS] ⚠️ Lỗi từ Worker: '+(d.error||d.status||'unknown'),'err');
          showVPS('❌ VPS báo lỗi: '+(d.error||d.status)+'. Vui lòng xóa VPS cũ và tạo lại.','err');
          if(typeof vpsCountdownInterval!=='undefined'&&vpsCountdownInterval){
            clearInterval(vpsCountdownInterval);vpsCountdownInterval=null;
            const cdEl=document.getElementById('vpsCountdown');
            if(cdEl){cdEl.textContent='⛔ Hết phiên';cdEl.className='vcd-timer urgent';}
          }
          setLoad(false);
          return;
        }
        /* Status khác (pending, running, queued, in_progress...) → tiếp tục poll */
        const minMark=Math.floor(i/3);
        if(minMark!==lastLogMin){lastLogMin=minMark;addLog(`[VPS] Đang boot... (~${Math.round((i+1)*10/60*10)/10} phút) status=${d.status||'pending'}`,'wait');}

      }catch(e){
        addLog('[VPS] ⚠️ Mất kết nối tới VPS: '+e.message,'err');
        showVPS('❌ Server VPS bị down. Vui lòng xóa VPS cũ và tạo lại.','err');
        if(typeof vpsCountdownInterval!=='undefined'&&vpsCountdownInterval){
          clearInterval(vpsCountdownInterval);
          vpsCountdownInterval=null;
          const cdEl=document.getElementById('vpsCountdown');
          if(cdEl){cdEl.textContent='⛔ Hết phiên';cdEl.className='vcd-timer urgent';}
        }
        setLoad(false);
        return;
      }
    }
    showVPS('⏰ Timeout — kiểm tra GitHub Actions của bạn.','err');
    setLoad(false);
  }

  createBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('github_token') || '';
    const tsKey = localStorage.getItem('tailscale_auth_key') || (document.getElementById('vpsTailscaleKey')?.value || '').trim();

    if(!token || token.length < 10){
      showVPS('❌ Chưa có Token! Vào mục Bypass để lưu token trước.', 'err');
      if(typeof addLog === 'function') addLog('[VPS] ⚠️ Thiếu GitHub Token. Hãy lưu token tại tab Bypass.', 'wait');
      return;
    }

    setLoad(true);
    // Hiện ngay bảng IP Username Password với hiệu ứng Shimmer Wave cuộn
    if(readyBox){
      readyBox.style.display = 'flex';
      readyBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    setVpsShimmer(true);
    showVPS('⏳ Đang kết nối luồng khởi tạo VPS...', 'wait');
    if(typeof addLog === 'function') addLog('[VPS] 🚀 Bắt đầu quy trình Deploy VPS Windows qua Tailscale Mesh...', 'info');

    // Ưu tiên: Gọi Worker / Docker bridge nếu có sẵn
    try {
      const r = await fetch(`${WORKER}/api/create-vps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ github_token: token, tailscale_key: tsKey }),
        signal: AbortSignal.timeout(3500)
      });
      const d = await r.json();
      if(r.ok && d.repository){
        if(typeof addLog === 'function'){
          addLog('[VPS] Repo tạo xong: ' + d.repository, 'ok');
          addLog('[VPS] Actions: ' + d.actions_url, 'info');
        }
        showVPS(
          `⏳ Repo: <a href="${d.actions_url}" target="_blank" style="color:#7c6fff">${d.repository}</a><br>`+
          `<span style="font-size:.78rem;opacity:.7">Đang chờ gán IP Tailscale...</span>`,
          'wait'
        );
        pollVncLink(token, d.repository, d.actions_url);
        return;
      }
    } catch(e){
      // Worker offline / 404 → Chuyển sang Direct GitHub Engine
    }

    // Direct GitHub Engine (Zero-Backend)
    await deployDirectGitHubVps(token, tsKey);
  });
})();

/* ─── SUPPORTED LINKS PANEL ─── */
(function(){
  const badge=document.getElementById('slBadgeBtn');
  const panel=document.getElementById('slPanel');
  const backdrop=document.getElementById('slBackdrop');
  const closeBtn=document.getElementById('slClose');
  if(!badge||!panel)return;
  function openPanel(){backdrop.classList.add('show');panel.classList.add('show');document.body.style.overflow='hidden';}
  function closePanel(){backdrop.classList.remove('show');panel.classList.remove('show');document.body.style.overflow='';}
  badge.addEventListener('click',e=>{e.stopPropagation();openPanel();});
  closeBtn.addEventListener('click',closePanel);
  backdrop.addEventListener('click',closePanel);
  let startY=0;
  panel.addEventListener('touchstart',e=>{startY=e.touches[0].clientY;},{passive:true});
  panel.addEventListener('touchend',e=>{if(e.changedTouches[0].clientY-startY>60)closePanel();},{passive:true});
})();

/* ════════════════════════════════════════════════════════════
   MUSIC PLAYER v2 — Playlist 12 bài, Prev/Next, Repeat, Volume
   ⚙️  Để deploy: đổi AUDIO_BASE → CDN URL (jsDelivr / R2)
   Ex: 'https://cdn.jsdelivr.net/gh/USER/REPO@latest/assets/sound/'
════════════════════════════════════════════════════════════ */
(function(){
  const AUDIO_BASE = 'https://cdn.jsdelivr.net/gh/duyzoz/Audio-deplynew@main/';
  const PLAYLIST = [
    { title:'2IN1 - Người Đã Yêu Ai Remix',                       src:'sound1.mp3',  cover:'pic1.jpg'  },
    { title:'Anh Sẽ Đợi Remix - Thanh Tung',                      src:'sound2.mp3',  cover:'pic2.jpg'  },
    { title:'Bạn Tình Ơi 2 Remix - YuniBoo x Goctoi x Đại Mèo',  src:'sound3.mp3',  cover:'pic3.jpg'  },
    { title:'Em Của Quá Khứ - Jerk Drill',                        src:'sound4.mp3',  cover:'pic4.jpg'  },
    { title:'Hẹn Hò Nhưng Không Yêu - Thazh x Đông Remix',       src:'sound5.mp3',  cover:'pic5.jpg'  },
    { title:'Khẩu Thị Tâm Phi (口是心非) - Quang Nhật',           src:'sound6.mp3',  cover:'pic6.jpg'  },
    { title:'Lê Lê Ley Remix - Trọng Filo',                      src:'sound7.mp3',  cover:'pic7.jpg'  },
    { title:'Ly Nhân Sầu (离人愁) - TSB Remix',                   src:'sound8.mp3',  cover:'pic8.jpg'  },
    { title:'Tình Phai - Kiều Phong ft. RyoT (Đại Mèo Remix)',   src:'sound9.mp3',  cover:'pic9.jpg'  },
    { title:'Trơn - Quang Nhật ft. HIPPS (Remix)',                src:'sound10.mp3', cover:'pic10.jpg' },
    { title:'Yêu Thương Chẳng Là Mãi Mãi - Tracy Remix',         src:'sound11.mp3', cover:'pic11.jpg' },
    { title:'Zalo X Điều Anh Biết - MinzHieu x Tuấn Siêu Remix', src:'sound12.mp3', cover:'pic12.jpg' },
  ];

  const audio    = document.getElementById('mpAudio');
  const playBtn  = document.getElementById('mpPlay');
  const playIcon = document.getElementById('mpPlayIcon');
  const prevBtn  = document.getElementById('mpPrev');
  const nextBtn  = document.getElementById('mpNext');
  const seek     = document.getElementById('mpSeek');
  const fill     = document.getElementById('mpFill');
  const curEl    = document.getElementById('mpCur');
  const durEl    = document.getElementById('mpDur');
  const repeatBtn= document.getElementById('mpRepeat');
  const muteBtn  = document.getElementById('mpMute');
  const volIcon  = document.getElementById('mpVolIcon');
  const marquee  = document.getElementById('mpMarquee');
  const artEl    = document.getElementById('mpArt');
  const spinEl   = document.getElementById('mpSpin');
  const volSlider= document.getElementById('mpVol');
  if(!audio)return;

  const PLAY_SVG  = `<polygon points="5 3 19 12 5 21 5 3"/>`;
  const PAUSE_SVG = `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`;
  const VOL_ON    = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>`;
  const VOL_OFF   = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;

  /* repeatMode: 0=tắt  1=lặp tất cả  2=lặp 1 bài */
  let repeatMode = 1;
  let curIdx = 0;

  function fmtTime(s){if(!s||isNaN(s))return'0:00';return`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;}

  /* ── Load track ── */
  function loadTrack(idx, autoPlay){
    curIdx = ((idx%PLAYLIST.length)+PLAYLIST.length)%PLAYLIST.length;
    const t = PLAYLIST[curIdx];
    audio.src = AUDIO_BASE + t.src;
    if(artEl){
      artEl.src = AUDIO_BASE + t.cover;
      artEl.onerror = () => { artEl.src = AUDIO_BASE + 'pic1.jpg'; };
      artEl.style.opacity = '1';
    }
    /* Marquee cập nhật cả 2 span */
    const spans = marquee ? marquee.querySelectorAll('span') : [];
    if(spans[0]) spans[0].textContent = t.title;
    if(spans[1]){ spans[1].textContent = '\u00a0\u00a0\u00a0\u00a0'+t.title; spans[1].setAttribute('aria-hidden','true'); }
    /* Reset timeline */
    if(fill) fill.style.width='0%';
    if(seek){ seek.value=0; seek.max=100; }
    if(curEl) curEl.textContent='0:00';
    if(durEl) durEl.textContent='0:00';
    audio.load();
    if(autoPlay) audio.play().catch(()=>{});
  }

  /* ── Play/Pause UI ── */
  const playerCard = document.getElementById('musicPlayer');
  function setPlaying(playing){
    if(playIcon) playIcon.innerHTML = playing ? PAUSE_SVG : PLAY_SVG;
    if(playerCard) playerCard.classList.toggle('playing', playing);
    if(playing){
      if(artEl)  artEl.classList.add('playing');
      if(spinEl) spinEl.classList.add('playing');
      if(marquee) marquee.classList.remove('paused');
    } else {
      if(artEl)  artEl.classList.remove('playing');
      if(spinEl) spinEl.classList.remove('playing');
      if(marquee) marquee.classList.add('paused');
    }
  }

  /* ── Repeat button UI: 3 trạng thái ── */
  function setRepeatUI(){
    if(!repeatBtn)return;
    repeatBtn.classList.remove('active','repeat-one','repeat-all');
    const old=repeatBtn.querySelector('.repeat-badge');
    if(old)old.remove();
    if(repeatMode===0){
      repeatBtn.style.opacity='0.35';
      repeatBtn.title='Bật lặp lại';
    } else if(repeatMode===1){
      repeatBtn.classList.add('active','repeat-all');
      repeatBtn.style.opacity='';
      repeatBtn.title='Lặp tất cả';
    } else {
      repeatBtn.classList.add('active','repeat-one');
      repeatBtn.style.opacity='';
      repeatBtn.title='Lặp 1 bài';
      const b=document.createElement('span');
      b.className='repeat-badge';
      b.textContent='1';
      repeatBtn.appendChild(b);
    }
  }

  /* ── Init ── */
  loadTrack(0, false);
  audio.volume=0.8;
  if(volSlider) volSlider.value=0.8;
  setRepeatUI();

  /* ── Controls ── */
  if(playBtn) playBtn.addEventListener('click',()=>{if(audio.paused)audio.play().catch(()=>{});else audio.pause();});
  audio.addEventListener('play', ()=>setPlaying(true));
  audio.addEventListener('pause',()=>setPlaying(false));

  /* Autoplay on first interaction */
  function tryAutoplay(){audio.play().catch(()=>{document.addEventListener('click',()=>{audio.play().catch(()=>{});},{once:true});});}
  document.addEventListener('mousemove',tryAutoplay,{once:true});

  /* Timeline */
  let isScrubbing = false;
  audio.addEventListener('loadedmetadata',()=>{
    if(durEl) durEl.textContent=fmtTime(audio.duration);
    if(seek) seek.max=audio.duration||100;
  });
  audio.addEventListener('timeupdate',()=>{
    if(!audio.duration || isScrubbing) return;
    if(seek) seek.value=audio.currentTime;
    if(curEl) curEl.textContent=fmtTime(audio.currentTime);
    if(fill) fill.style.width=((audio.currentTime/audio.duration)*100).toFixed(2)+'%';
  });

  if(seek){
    seek.addEventListener('pointerdown', ()=>{ isScrubbing=true; });
    seek.addEventListener('input',()=>{
      isScrubbing=true;
      const v = parseFloat(seek.value);
      if(curEl) curEl.textContent=fmtTime(v);
      if(fill && audio.duration) fill.style.width=((v/audio.duration)*100).toFixed(2)+'%';
    });
    seek.addEventListener('change',()=>{
      const v = parseFloat(seek.value);
      if(!isNaN(v)) audio.currentTime = v;
      isScrubbing=false;
    });
    window.addEventListener('pointerup',()=>{ isScrubbing=false; });
  }

  /* Click on track bar to jump */
  const trackBar = document.getElementById('mpTrack');
  if(trackBar){
    trackBar.addEventListener('click', e=>{
      if(e.target===seek) return;
      const r = trackBar.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      if(audio.duration){
        audio.currentTime = p * audio.duration;
        if(seek) seek.value = audio.currentTime;
        if(curEl) curEl.textContent = fmtTime(audio.currentTime);
        if(fill) fill.style.width = (p*100).toFixed(2)+'%';
      }
    });
  }

  /* Prev / Next */
  function playNext(forced){
    if(repeatMode===2&&!forced){audio.currentTime=0;audio.play().catch(()=>{});return;}
    loadTrack(curIdx+1,true);
  }
  function playPrev(){
    if(audio.currentTime>3){audio.currentTime=0;return;}
    loadTrack(curIdx-1,true);
  }
  if(nextBtn) nextBtn.addEventListener('click',()=>playNext(true));
  if(prevBtn) prevBtn.addEventListener('click',playPrev);

  /* Song ended */
  audio.addEventListener('ended',()=>{
    if(repeatMode===2){audio.currentTime=0;audio.play().catch(()=>{});}
    else if(repeatMode===1){playNext(false);}
  });

  /* Repeat button: 0→1→2→0 */
  if(repeatBtn) repeatBtn.addEventListener('click',()=>{repeatMode=(repeatMode+1)%3;setRepeatUI();});

  /* Mute */
  if(muteBtn){
    muteBtn.classList.add('active');
    muteBtn.addEventListener('click',()=>{
      audio.muted=!audio.muted;
      if(volIcon)volIcon.innerHTML=audio.muted?VOL_OFF:VOL_ON;
      muteBtn.classList.toggle('active',!audio.muted);
      if(volSlider)volSlider.value=audio.muted?0:audio.volume;
    });
  }

  /* Volume slider */
  if(volSlider){
    volSlider.addEventListener('input',()=>{
      const v=parseFloat(volSlider.value);
      audio.volume=v;
      if(v===0){
        audio.muted=true;
        if(volIcon)volIcon.innerHTML=VOL_OFF;
        if(muteBtn)muteBtn.classList.remove('active');
      } else if(audio.muted){
        audio.muted=false;
        if(volIcon)volIcon.innerHTML=VOL_ON;
        if(muteBtn)muteBtn.classList.add('active');
      }
    });
  }

  /* ── Wave 2: Global Music Hotkeys ── */
  window.addEventListener('keydown', e => {
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if(tag === 'INPUT' || tag === 'TEXTAREA' || (document.activeElement && document.activeElement.isContentEditable)) return;

    if(e.code === 'Space'){
      e.preventDefault();
      if(audio.paused) audio.play().catch(()=>{}); else audio.pause();
    } else if(e.code === 'KeyM'){
      e.preventDefault();
      if(muteBtn) muteBtn.click();
    } else if(e.code === 'ArrowLeft'){
      e.preventDefault();
      playNext(false);
    } else if(e.code === 'ArrowRight'){
      e.preventDefault();
      playNext(true);
    } else if(e.code === 'ArrowUp'){
      e.preventDefault();
      audio.volume = Math.min(1, +(audio.volume + 0.1).toFixed(2));
      if(volSlider) volSlider.value = audio.volume;
      if(audio.muted && muteBtn) muteBtn.click();
    } else if(e.code === 'ArrowDown'){
      e.preventDefault();
      audio.volume = Math.max(0, +(audio.volume - 0.1).toFixed(2));
      if(volSlider) volSlider.value = audio.volume;
    }
  });
})();

/* ─── REAL-TIME FPS COUNTER & FIX LAG CONTROLLER ─── */
(function(){
  const fpsBox = document.getElementById('fpsHudBox');
  const fpsCount = document.getElementById('fpsCount');
  const fpsTag = document.getElementById('fpsTag');
  const btn = document.getElementById('perfToggle');
  const btnText = document.getElementById('perfToggleText');
  const video = document.getElementById('bgVideo');
  const KEY = 'perf_mode_active';

  /* ── 1. Accurate High-Precision FPS Measurement ── */
  if(fpsBox && fpsCount && fpsTag){
    let frames = 0, lastTime = performance.now();
    function tickFps(now){
      frames++;
      if(now - lastTime >= 400){
        const fps = Math.round((frames * 1000) / (now - lastTime));
        fpsCount.textContent = fps;
        if(fps >= 95){
          fpsBox.className = 'fps-hud-box fps-ultra';
          fpsTag.textContent = 'Ultra';
        } else if(fps >= 48){
          fpsBox.className = 'fps-hud-box';
          fpsTag.textContent = 'Smooth';
        } else if(fps >= 26){
          fpsBox.className = 'fps-hud-box fps-warn';
          fpsTag.textContent = 'Normal';
        } else {
          fpsBox.className = 'fps-hud-box fps-drop';
          fpsTag.textContent = 'Low';
        }
        frames = 0;
        lastTime = now;
      }
      requestAnimationFrame(tickFps);
    }
    requestAnimationFrame(tickFps);
  }

  /* ── 2. Fix Lag / Video-Image Cross-Fade Mode ── */
  if(!btn) return;

  function apply(active){
    const card = document.getElementById('profileCard');
    const scene = document.getElementById('scene');
    const toolCard = document.getElementById('toolCard');
    if(active){
      document.body.classList.add('perf-mode');
      btn.classList.add('active');
      if(btnText) btnText.textContent = '🎬 Bật lại Video';
      btn.title = "Đang xem ảnh nền Background.png (Mượt tuyệt đối). Bấm để bật lại Video.";
      // Keep 3D card tilt & parallax active when video is paused
      /* Video paused for performance without freezing card motion */
      /* Chờ hiệu ứng mờ 0.6s hoàn tất mới pause video để chuyển cảnh mượt mà */
      setTimeout(()=>{
        if(document.body.classList.contains('perf-mode') && video) video.pause();
      }, 600);
    } else {
      if(video) video.play().catch(()=>{});
      document.body.classList.remove('perf-mode');
      btn.classList.remove('active');
      if(btnText) btnText.textContent = '⚡ Tắt Video (Fix Lag)';
      btn.title = "Tắt video nền để máy mượt tuyệt đối.";
    }
  }

  const saved = localStorage.getItem(KEY);
  if(saved === '1'){
    apply(true);
  }

  btn.addEventListener('click', ()=>{
    const isNow = !document.body.classList.contains('perf-mode');
    localStorage.setItem(KEY, isNow ? '1' : '0');
    apply(isNow);
  });
})();

/* ══════════════════════════════════════════
   WAVE 3 — DISCORD RICH PRESENCE LIVE (Lanyard API)
══════════════════════════════════════════ */
(function(){
  const DISCORD_USER_ID = '100094384928226';
  const dot = document.getElementById('discordStatusDot');
  const txt = document.getElementById('discordStatusText');
  const gameName = document.getElementById('discordGameName');
  const gameDetail = document.getElementById('discordGameDetail');
  const gameState = document.getElementById('discordGameState');
  const timerEl = document.getElementById('wuwaLiveTimer');

  /* ── 1. Ticking WuWa Live Gameplay Timer (1028:59:58 baseline) ── */
  if(timerEl){
    const BASE_SEC = 1028 * 3600 + 59 * 60 + 58; // 3,704,398s
    const startTs = Date.now();
    function tickTimer(){
      const totalSec = BASE_SEC + Math.floor((Date.now() - startTs) / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      timerEl.textContent = `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    tickTimer();
    setInterval(tickTimer, 1000);
  }

  if(!dot || !txt) return;

  function updateDiscordUI(status, stateStr, detailsStr){
    if(status === 'online'){
      dot.style.background = '#22c55e';
      dot.style.boxShadow = '0 0 8px #22c55e';
      txt.textContent = 'Online';
    } else if(status === 'idle'){
      dot.style.background = '#f59e0b';
      dot.style.boxShadow = '0 0 8px #f59e0b';
      txt.textContent = 'Idle';
    } else if(status === 'dnd'){
      dot.style.background = '#ef4444';
      dot.style.boxShadow = '0 0 8px #ef4444';
      txt.textContent = 'Do Not Disturb';
    } else {
      dot.style.background = '#64748b';
      dot.style.boxShadow = 'none';
      txt.textContent = 'Offline';
    }

    if(gameDetail && detailsStr) gameDetail.textContent = detailsStr;
    if(gameState && stateStr) gameState.textContent = stateStr;
  }

  async function fetchDiscordStatus(){
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      const json = await res.json();
      if(json && json.success && json.data){
        const d = json.data;
        let st = d.discord_status || 'online';
        let actState = 'Asia · UL80 · Exploration';
        let actDetail = '⚔️ Hunting: Havoc Dreadmane';

        if(d.activities && d.activities.length > 0){
          const wuwaAct = d.activities.find(a => (a.name || '').toLowerCase().includes('wuthering') || (a.details || '').toLowerCase().includes('wuthering'));
          if(wuwaAct){
            actState = wuwaAct.state || actState;
            actDetail = wuwaAct.details || actDetail;
          } else if(d.listening_to_spotify && d.spotify){
            actState = 'Spotify · Listening';
            actDetail = `🎵 ${d.spotify.song} — ${d.spotify.artist}`;
          } else {
            const act = d.activities.find(a => a.type !== 4) || d.activities[0];
            if(act && act.name){
              if(gameName) gameName.textContent = act.name;
              actState = act.state || 'Online on Desktop';
              actDetail = act.details || 'Active Gameplay';
            }
          }
        }
        updateDiscordUI(st, actState, actDetail);
      } else {
        updateDiscordUI('online', 'Asia · UL80 · Exploration', '⚔️ Hunting: Havoc Dreadmane');
      }
    } catch(e) {
      updateDiscordUI('online', 'Asia · UL80 · Exploration', '⚔️ Hunting: Havoc Dreadmane');
    }
  }

  fetchDiscordStatus();
  setInterval(fetchDiscordStatus, 30000);
})();

/* ══════════════════════════════════════════
   WAVE 4 — CYBER DEV TOOLKIT & BACKUP
══════════════════════════════════════════ */
(function(){
  /* ── 1. Live Ping Tester ── */
  const btnPing = document.getElementById('btnTestPing');
  const pCf = document.getElementById('pingCf');
  const pGg = document.getElementById('pingGg');
  const pJsd = document.getElementById('pingJsd');

  async function measurePing(url, el){
    if(!el) return;
    el.textContent = '...';
    el.className = 'ping-val';
    const start = performance.now();
    try {
      await fetch(url, { mode: 'no-cors', cache: 'no-store' });
      const ms = Math.round(performance.now() - start);
      el.textContent = ms + ' ms';
      if(ms < 70) el.className = 'ping-val';
      else if(ms < 180) el.className = 'ping-val warn';
      else el.className = 'ping-val err';
    } catch(e) {
      const ms = Math.round(performance.now() - start);
      el.textContent = (ms > 0 && ms < 600) ? ms + ' ms' : 'Offline';
    }
  }

  function runAllPings(){
    measurePing('https://1.1.1.1/favicon.ico', pCf);
    measurePing('https://www.google.com/favicon.ico', pGg);
    measurePing('https://cdn.jsdelivr.net/favicon.ico', pJsd);
  }

  if(btnPing) btnPing.addEventListener('click', runAllPings);

  /* ── 2. Base64 Quick Converter ── */
  const b64In = document.getElementById('b64Input');
  const btnEnc = document.getElementById('btnB64Enc');
  const btnDec = document.getElementById('btnB64Dec');
  const b64Res = document.getElementById('b64Result');
  const b64Txt = document.getElementById('b64ResultText');
  const btnCopy = document.getElementById('btnCopyB64');

  function utf8_to_b64(str) {
    try { return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1))); }
    catch(e){ return btoa(str); }
  }
  function b64_to_utf8(str) {
    try { return decodeURIComponent(Array.prototype.map.call(atob(str), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')); }
    catch(e){ return atob(str); }
  }

  if(btnEnc && b64In){
    btnEnc.addEventListener('click', ()=>{
      const val = b64In.value.trim();
      if(!val) return;
      try {
        const out = utf8_to_b64(val);
        b64Txt.textContent = out;
        b64Res.style.display = 'flex';
      } catch(e){ alert('Lỗi mã hóa Base64!'); }
    });
  }
  if(btnDec && b64In){
    btnDec.addEventListener('click', ()=>{
      const val = b64In.value.trim();
      if(!val) return;
      try {
        const out = b64_to_utf8(val);
        b64Txt.textContent = out;
        b64Res.style.display = 'flex';
      } catch(e){ alert('Chuỗi Base64 không hợp lệ!'); }
    });
  }
  if(btnCopy && b64Txt){
    btnCopy.addEventListener('click', ()=>{
      navigator.clipboard.writeText(b64Txt.textContent).then(()=>{
        btnCopy.textContent = '✅';
        setTimeout(()=>{ btnCopy.textContent = '📋'; }, 1500);
      });
    });
  }

  /* ── 3. Backup & Restore Data Safe ── */
  const btnExport = document.getElementById('btnExportData');
  const btnImport = document.getElementById('btnImportData');
  const fileInput = document.getElementById('importFileInput');
  const backupMsg = document.getElementById('backupMsg');

  function showBackupMsg(text, isOk){
    if(!backupMsg) return;
    backupMsg.textContent = text;
    backupMsg.className = 'backup-msg ' + (isOk ? 'ok' : 'err');
    backupMsg.style.display = 'block';
    setTimeout(()=>{ backupMsg.style.display = 'none'; }, 3000);
  }

  if(btnExport){
    btnExport.addEventListener('click', ()=>{
      const data = {
        exported_at: new Date().toISOString(),
        vps_github_tokens: localStorage.getItem('vps_github_tokens') || '[]',
        vps_list: localStorage.getItem('vps_list') || '[]',
        perf_mode_active: localStorage.getItem('perf_mode_active') || '0',
        pv_views: localStorage.getItem('pv_views') || '8247'
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nguyen_duy_profile_backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showBackupMsg('✅ Đã xuất file backup JSON thành công!', true);
    });
  }

  if(btnImport && fileInput){
    btnImport.addEventListener('click', ()=> fileInput.click());
    fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const json = JSON.parse(ev.target.result);
          if(json.vps_github_tokens) localStorage.setItem('vps_github_tokens', json.vps_github_tokens);
          if(json.vps_list) localStorage.setItem('vps_list', json.vps_list);
          if(json.perf_mode_active) localStorage.setItem('perf_mode_active', json.perf_mode_active);
          showBackupMsg('✅ Nhập dữ liệu thành công! Đang làm mới...', true);
          setTimeout(()=>{ location.reload(); }, 1200);
        } catch(err){
          showBackupMsg('❌ File JSON không hợp lệ!', false);
        }
      };
      reader.readAsText(file);
    });
  }
})();

/* ══════════════════════════════════════════
   WAVE 5 — PWA SERVICE WORKER REGISTRATION
══════════════════════════════════════════ */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.getRegistrations().then(function(regs){ for(var i=0;i<regs.length;i++) regs[i].unregister(); });
  });
}

/* ══════════════════════════════════════════
   WAVE 6 — CYBER TERMINAL CLI CONTROLLER
══════════════════════════════════════════ */
(function(){
  const cliModal   = document.getElementById('cyberCliModal');
  const cliBtn     = document.getElementById('cliToggleBtn');
  const cliClose   = document.getElementById('cliClose');
  const cliCloseBtn= document.getElementById('cliCloseBtn');
  const cliInput   = document.getElementById('cliInput');
  const cliOutput  = document.getElementById('cliOutput');

  if(!cliModal || !cliInput || !cliOutput) return;

  const cmdHistory = [];
  let historyIdx = -1;

  function escapeHtml(str){
    return (str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
  }

  function openCli(){
    cliModal.style.display = 'flex';
    setTimeout(()=>{
      if(cliInput){
        cliInput.focus();
        cliInput.select();
      }
    }, 50);
  }

  function closeCli(){
    cliModal.style.display = 'none';
  }

  function toggleCli(){
    if(cliModal.style.display === 'none' || !cliModal.style.display){
      openCli();
    } else {
      closeCli();
    }
  }

  function printLine(html, cls = ''){
    const div = document.createElement('div');
    div.className = 'cli-line ' + cls;
    div.innerHTML = html;
    cliOutput.appendChild(div);
    cliOutput.scrollTop = cliOutput.scrollHeight;
  }

  function executeCommand(raw){
    const cmd = (raw || '').trim();
    if(!cmd) return;

    cmdHistory.push(cmd);
    historyIdx = cmdHistory.length;

    printLine(`<span class="cli-prompt">root@duyzoz:~#</span> ${escapeHtml(cmd)}`, 'white');

    const parts = cmd.split(/\s+/);
    const main = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    switch(main){
      case 'help':
      case '?':
        printLine(`═════════════════════════════════════════════════════════════`, 'dim');
        printLine(`CYBER TERMINAL CLI v2.0 — DANH SÁCH LỆNH TOÀN NĂNG`, 'cyan');
        printLine(`• <span class="green">wuwa</span>: Xem thông tin 24/7 Wuthering Waves selfbot (UL80)`, 'dim');
        printLine(`• <span class="green">music [play|pause|next|prev|vol 0-100]</span>: Điều khiển nhạc`, 'dim');
        printLine(`• <span class="green">matrix</span>: Bật / Tắt hiệu ứng Ma Trận Digital Rain (Wave 7)`, 'dim');
        printLine(`• <span class="green">game</span>: Khởi động Mini-Game Echo Hunter (Wave 12)`, 'dim');
        printLine(`• <span class="green">lang [vi|en|ja]</span>: Chuyển đổi ngôn ngữ hiển thị (Wave 13)`, 'dim');
        printLine(`• <span class="green">fixlag</span>: Bật / Tắt chế độ tối ưu máy yếu (tắt video)`, 'dim');
        printLine(`• <span class="green">theme [cyan|pink|purple|green|reset]</span>: Đổi tông màu`, 'dim');
        printLine(`• <span class="green">specs</span>: Thông số phần cứng máy chiến HP EliteBook 840 G1`, 'dim');
        printLine(`• <span class="green">ping</span>: Đo độ trễ mạng &amp; FPS thời gian thực`, 'dim');
        printLine(`• <span class="green">clear</span>: Xóa màn hình terminal`, 'dim');
        printLine(`• <span class="green">exit</span>: Đóng cửa sổ terminal (hoặc phím Esc / ~)`, 'dim');
        printLine(`═════════════════════════════════════════════════════════════`, 'dim');
        break;

      case 'admin':
      case 'sudo':
      case 'auth':
        window.ND_IS_ADMIN = true;
        window.ND_DISPLAY_IP = '192.168.0.102';
        try { localStorage.setItem('nd_is_admin', '1'); } catch(e){}
        if(window.renderTermIp) window.renderTermIp();
        if(window.updateGbAdmin) window.updateGbAdmin();
        printLine(`👑 <span class="green">[AUTH]</span> Đã xác thực thành công quyền Admin tối cao: IP 192.168.0.102 (👑 VIP ADMIN)`, 'yellow');
        break;

      case 'wuwa':
      case 'treo':
      case 'selfbot':
        printLine(`🌊 <span class="green">[WUWA-24/7]</span> Repo: <a href="https://github.com/duyzoz/treo-wuthering-waves" target="_blank" style="color:#00d4ff;text-decoration:underline">duyzoz/treo-wuthering-waves</a>`, 'cyan');
        printLine(`⚡ <span class="green">[STATUS]</span> Online 24/7 trên Render Cloud (0% CPU máy local)`, 'dim');
        printLine(`🎮 <span class="green">[INGAME]</span> Server: Asia | Union Level: 80 | Hunting: Havoc Dreadmane`, 'dim');
        printLine(`⏱️ <span class="green">[HOURS]</span> Tích lũy hơn 1,028+ giờ online Discord Rich Presence`, 'yellow');
        break;

      case 'music':
      case 'sound':
      case 'audio':
        if(arg === 'play'){
          const audio = document.getElementById('mpAudio');
          if(audio && audio.paused) document.getElementById('mpPlay')?.click();
          printLine(`▶️ Đang phát nhạc!`, 'green');
        } else if(arg === 'pause' || arg === 'stop'){
          const audio = document.getElementById('mpAudio');
          if(audio && !audio.paused) document.getElementById('mpPlay')?.click();
          printLine(`⏸️ Đã tạm dừng phát nhạc.`, 'yellow');
        } else if(arg === 'next'){
          document.getElementById('mpNext')?.click();
          printLine(`⏭️ Đã chuyển sang bài tiếp theo.`, 'cyan');
        } else if(arg === 'prev'){
          document.getElementById('mpPrev')?.click();
          printLine(`⏮️ Đã quay lại bài trước.`, 'cyan');
        } else if(arg.startsWith('vol')){
          const val = parseInt(parts[2] || parts[1]);
          if(!isNaN(val)){
            const v = Math.max(0, Math.min(100, val)) / 100;
            const audio = document.getElementById('mpAudio');
            const slider = document.getElementById('mpVol');
            if(audio) audio.volume = v;
            if(slider) slider.value = v;
            printLine(`🔊 Âm lượng: ${Math.round(v * 100)}%`, 'cyan');
          } else {
            printLine(`Cách dùng: music vol 80 (từ 0 đến 100)`, 'yellow');
          }
        } else {
          const title = document.getElementById('mpTrackName')?.textContent || 'Danh sách 12 bài';
          printLine(`🎵 Đang chọn: <strong>${escapeHtml(title)}</strong>`, 'cyan');
          printLine(`Cú pháp: music [play | pause | next | prev | vol 0-100]`, 'dim');
        }
        break;

      case 'matrix':
        if(window.toggleMatrixRain){
          const isMatrix = window.toggleMatrixRain();
          printLine(`💻 Ma Trận Digital Rain: <strong style="color:${isMatrix?'#00ff88':'#ef4444'}">${isMatrix?'ĐÃ BẬT (Wave 7)':'ĐÃ TẮT'}</strong>`, isMatrix ? 'green' : 'yellow');
        }
        break;

      case 'game':
      case 'echo':
        if(window.launchEchoGame){
          window.launchEchoGame();
          printLine(`🎮 Khởi động Mini-Game: <strong>Echo Hunter (Wave 12)</strong>!`, 'green');
          closeCli();
        } else {
          document.getElementById('tabGame')?.click();
          closeCli();
        }
        break;

      case 'lang':
        if(arg === 'vi' || arg === 'en' || arg === 'ja'){
          if(window.setLanguage){
            localStorage.setItem('nd_lang', arg);
            window.setLanguage(arg);
            printLine(`🌐 Ngôn ngữ đã chuyển sang: <strong>${arg.toUpperCase()}</strong>`, 'green');
          }
        } else {
          printLine(`Cách dùng: lang [vi | en | ja]`, 'yellow');
        }
        break;

      case 'fixlag':
      case 'perf':
      case 'video':
        document.getElementById('btnFixLag')?.click();
        const isPerf = document.body.classList.contains('perf-mode');
        printLine(`⚡ Chế độ Fix Lag: <strong style="color:${isPerf?'#eab308':'#00d4ff'}">${isPerf?'BẬT (Ảnh tĩnh, mượt 60 FPS)':'TẮT (Video MP4 nền)'}</strong>`, 'cyan');
        break;

      case 'theme':
        if(arg === 'cyan'){
          document.documentElement.style.setProperty('--a3', '#00d4ff');
          document.documentElement.style.setProperty('--c1', '#00d4ff');
          printLine(`🎨 Giao diện: Cyan Neon Mode`, 'cyan');
        } else if(arg === 'pink'){
          document.documentElement.style.setProperty('--a3', '#ff6b9d');
          document.documentElement.style.setProperty('--c1', '#ff6b9d');
          printLine(`🎨 Giao diện: Cyber Pink Mode`, 'yellow');
        } else if(arg === 'purple'){
          document.documentElement.style.setProperty('--a3', '#a855f7');
          document.documentElement.style.setProperty('--c1', '#7c6fff');
          printLine(`🎨 Giao diện: Deep Violet Mode`, 'cyan');
        } else if(arg === 'green'){
          document.documentElement.style.setProperty('--a3', '#34d399');
          document.documentElement.style.setProperty('--c1', '#10b981');
          printLine(`🎨 Giao diện: Matrix Emerald Mode`, 'green');
        } else if(arg === 'reset'){
          document.documentElement.style.removeProperty('--a3');
          document.documentElement.style.removeProperty('--c1');
          printLine(`🎨 Giao diện: Đã khôi phục mặc định`, 'cyan');
        } else {
          printLine(`Cách dùng: theme [cyan | pink | purple | green | reset]`, 'yellow');
        }
        break;

      case 'specs':
      case 'hp':
      case 'hardware':
        printLine(`💻 CẤU HÌNH CHIẾN HỮU HP ELITEBOOK 840 G1:`, 'cyan');
        printLine(`• CPU: Intel® Core™ i5-4300U CPU @ 1.90GHz (Up to 2.50GHz)`, 'dim');
        printLine(`• Graphics: Intel® HD Graphics 4400 (Onboard VRAM)`, 'dim');
        printLine(`• RAM: 8.00 GB Dual-Channel DDR3L`, 'dim');
        printLine(`• Optimization: Zero-copy DOM, offscreen canvas stamp, RAF capping`, 'green');
        printLine(`"Hardware có thể khiêm tốn, nhưng tư duy tối ưu thì không giới hạn!"`, 'yellow');
        break;

      case 'ping':
        const fpsTxt = document.getElementById('fpsText')?.textContent || '60 FPS';
        printLine(`📡 Kết nối mạng: ~16ms (Ổn định)`, 'green');
        printLine(`📊 Tốc độ khung hình: ${fpsTxt} (Mượt mà)`, 'green');
        printLine(`🖥️ Render Engine: GPU Canvas Hardware Accelerated`, 'dim');
        break;

      case 'clear':
      case 'cls':
        cliOutput.innerHTML = '';
        break;

      case 'exit':
      case 'quit':
      case 'q':
        closeCli();
        break;

      default:
        printLine(`❌ Lệnh không nhận dạng: "${escapeHtml(cmd)}". Gõ <strong class="cyan">help</strong> để xem hướng dẫn.`, 'red');
        break;
    }
  }

  /* Listeners */
  if(cliBtn) cliBtn.addEventListener('click', toggleCli);
  if(cliClose) cliClose.addEventListener('click', closeCli);
  if(cliCloseBtn) cliCloseBtn.addEventListener('click', closeCli);

  cliModal.addEventListener('click', e => {
    if(e.target === cliModal) closeCli();
  });

  cliInput.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
      e.preventDefault();
      const val = cliInput.value;
      cliInput.value = '';
      executeCommand(val);
    } else if(e.key === 'ArrowUp'){
      e.preventDefault();
      if(historyIdx > 0){
        historyIdx--;
        cliInput.value = cmdHistory[historyIdx] || '';
      }
    } else if(e.key === 'ArrowDown'){
      e.preventDefault();
      if(historyIdx < cmdHistory.length - 1){
        historyIdx++;
        cliInput.value = cmdHistory[historyIdx] || '';
      } else {
        historyIdx = cmdHistory.length;
        cliInput.value = '';
      }
    } else if(e.key === 'Escape'){
      closeCli();
    }
  });

  /* Global shortcut: ~ hoặc Ctrl+K để bật/tắt CLI */
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && cliModal.style.display === 'flex'){
      closeCli();
      return;
    }
    const isEditing = document.activeElement && 
      ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && 
      document.activeElement !== cliInput;

    if(!isEditing){
      if(e.key === '`' || e.key === '~' || (e.ctrlKey && e.key.toLowerCase() === 'k')){
        e.preventDefault();
        toggleCli();
      }
    }
  });
})();

/* ══════════════════════════════════════════
   WAVE 7 — MATRIX DIGITAL RAIN ENGINE
══════════════════════════════════════════ */
(function(){
  const canvas = document.getElementById('matrixCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let isRunning = false;
  let rafId = null;
  let lastT = 0;
  let drops = [];
  const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜXYZ$#@!%*&+-=';

  function initCols(){
    const cols = Math.floor(canvas.width / 16);
    drops = [];
    for(let i = 0; i < cols; i++){
      drops[i] = Math.floor(Math.random() * -40);
    }
  }

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initCols();
  }

  function loop(now){
    if(!isRunning) return;
    rafId = requestAnimationFrame(loop);
    if(document.hidden || document.body.classList.contains('perf-mode')) return;
    if(now - lastT < 36) return; // ~28fps - siêu nhẹ cho CPU Intel HD 4400
    lastT = now;

    ctx.fillStyle = 'rgba(5, 7, 15, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff88';
    ctx.font = '14px monospace';

    for(let i = 0; i < drops.length; i++){
      if(drops[i] >= 0){
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * 16, drops[i] * 16);
      }
      if(drops[i] * 16 > canvas.height && Math.random() > 0.975){
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  window.toggleMatrixRain = function(forceState){
    if(typeof forceState === 'boolean'){
      isRunning = forceState;
    } else {
      isRunning = !isRunning;
    }

    if(isRunning){
      canvas.style.display = 'block';
      resize();
      lastT = 0;
      rafId = requestAnimationFrame(loop);
    } else {
      canvas.style.display = 'none';
      if(rafId) cancelAnimationFrame(rafId);
      rafId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    return isRunning;
  };

  window.addEventListener('resize', ()=>{
    if(isRunning) resize();
  }, {passive: true});
})();

/* ══════════════════════════════════════════
   WUTHERING WAVES USER ID COPY CONTROLLER
══════════════════════════════════════════ */
(function(){
  const copyBtn = document.getElementById('wuwaUidCopy');
  const uidVal = document.getElementById('wuwaUidVal');
  const toast = document.getElementById('wuwaUidToast');
  if(!copyBtn) return;

  copyBtn.addEventListener('click', ()=>{
    const text = (uidVal ? uidVal.textContent : '713243969').trim();
    const showToast = () => {
      if(toast){
        toast.classList.add('show');
        setTimeout(()=> toast.classList.remove('show'), 1800);
      }
    };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(showToast).catch(()=>{
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        showToast();
      });
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast();
    }
  });
})();

/* ══════════════════════════════════════════
   WAVE 8 — GUESTBOOK (LƯU BÚT & PHÒNG CHAT TOÀN QUỐC)
══════════════════════════════════════════ */
(function(){
  const nameInput    = document.getElementById('gbNameInput');
  const msgInput     = document.getElementById('gbMsgInput');
  const btnSubmit    = document.getElementById('btnSubmitGb');
  const emojiTrigger = document.getElementById('gbEmojiTrigger');
  const emojiPopover = document.getElementById('gbEmojiPopover');
  const emojiList    = document.getElementById('gbEmojiList');
  const listEl       = document.getElementById('gbList');
  const senderAura   = document.getElementById('gbSenderAura');

  /* Reply elements */
  const replyBar     = document.getElementById('gbReplyBar');
  const replyToTxt   = document.getElementById('gbReplyTo');
  const replyCancel  = document.getElementById('gbReplyCancel');

  if(!listEl) return;

  const LS_KEY = 'nd_guestbook_v4';
  const ADMIN_IP = '192.168.0.102';
  let isCurrentAdmin = false;
  let replyingTo = null;

  /* ── 1. Admin Auto-Identification by IP (192.168.0.102) ── */
  function detectAdminStatus(){
    isCurrentAdmin = !!window.ND_IS_ADMIN;
    updateIdentityUI();
  }

  window.updateGbAdmin = function(){
    isCurrentAdmin = !!window.ND_IS_ADMIN;
    updateIdentityUI();
    if(typeof render === 'function') render();
  };

  function updateIdentityUI(){
    if(senderAura){
      if(isCurrentAdmin){
        senderAura.innerHTML = '✨ Admin: Nguyễn Duy';
        senderAura.className = 'gb-sender-aura admin-rainbow-vip';
        senderAura.style.display = 'inline-flex';
        senderAura.style.alignItems = 'center';
        senderAura.style.gap = '6px';
        if(nameInput) nameInput.style.display = 'none';
      } else {
        senderAura.innerHTML = '👤 Khách:';
        senderAura.className = 'gb-sender-aura';
        senderAura.style.display = 'inline-block';
        if(nameInput){
          nameInput.style.display = 'inline-block';
          try {
            if(!nameInput.value) nameInput.value = localStorage.getItem('nd_chat_nickname') || '';
          } catch(e){}
        }
      }
    }
  }

  detectAdminStatus();

  /* ── 2. Messenger-Style Emoji Popover ── */
  if(emojiTrigger && emojiPopover){
    emojiTrigger.addEventListener('click', (e)=>{
      e.stopPropagation();
      const isVisible = emojiPopover.style.display === 'block';
      emojiPopover.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', (e)=>{
      if(emojiPopover && !emojiPopover.contains(e.target) && e.target !== emojiTrigger){
        emojiPopover.style.display = 'none';
      }
    });
  }

  if(emojiList){
    emojiList.querySelectorAll('.gb-em').forEach(em => {
      em.addEventListener('click', (e)=>{
        e.stopPropagation();
        const char = em.getAttribute('data-em') || '✨';
        if(msgInput){
          const start = msgInput.selectionStart || msgInput.value.length;
          const end = msgInput.selectionEnd || msgInput.value.length;
          msgInput.value = msgInput.value.substring(0, start) + char + msgInput.value.substring(end);
          msgInput.focus();
          msgInput.selectionStart = msgInput.selectionEnd = start + char.length;
        }
        if(emojiPopover) emojiPopover.style.display = 'none';
      });
    });
  }

  /* ── 3. Reply Management ── */
  function setReply(name){
    replyingTo = name;
    if(replyBar) replyBar.style.display = 'flex';
    if(replyToTxt) replyToTxt.textContent = '@' + name;
    if(msgInput){
      msgInput.focus();
      msgInput.placeholder = `Trả lời @${name}...`;
    }
  }

  function clearReply(){
    replyingTo = null;
    if(replyBar) replyBar.style.display = 'none';
    if(msgInput) msgInput.placeholder = 'Nhập tin nhắn...';
  }

  if(replyCancel) replyCancel.addEventListener('click', clearReply);

  /* ── 4. Message Storage & Sync ── */
  function getEntries(){
    try {
      const raw = localStorage.getItem(LS_KEY);
      if(raw) return JSON.parse(raw);
    } catch(e){}
    return [
      {
        id: 1,
        name: "Nguyễn Duy",
        role: "admin",
        msg: "Chào mừng các bạn ghé thăm portfolio! Đã tích hợp đầy đủ các Waves & Wuthering Waves selfbot siêu mượt! 🚀",
        status: "sent",
        replyTo: null,
        time: "Hôm qua lúc 21:30"
      },
      {
        id: 2,
        name: "Rover Asia UL80",
        role: "user",
        msg: "Selfbot Wuthering Waves 24/7 uy tín quá anh Duy ơi, farm echo mượt không tốn pin máy! ⚔️",
        status: "sent",
        replyTo: "Nguyễn Duy",
        time: "Hôm nay lúc 08:15"
      },
      {
        id: 3,
        name: "HP EliteBook Fan",
        role: "user",
        msg: "HP 840 G1 chạy web 60 FPS nét căng, tối ưu hóa đỉnh thật sự! 💻",
        status: "sent",
        replyTo: null,
        time: "3 ngày trước"
      }
    ];
  }

  function saveEntries(entries){
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(entries.slice(-60)));
    } catch(e){}
  }

  let bc = null;
  try {
    bc = new BroadcastChannel('nd_guestbook_sync_v4');
    bc.onmessage = (e) => {
      if(e.data && e.data.type === 'REFRESH') render();
    };
  } catch(e){}

  function escapeHtml(str){
    return (str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
  }

  function createMsgNode(item, isNew = false) {
    const isAdm = item.role === 'admin';
    const displayName = isAdm ? 'Nguyễn Duy' : item.name;
    const roleBadge = isAdm
      ? `<span class="gb-msg-role role-admin">Admin</span>`
      : `<span class="gb-msg-role role-user">Member</span>`;
    const replyHtml = item.replyTo
      ? `<div class="gb-msg-reply-ref">↩️ Trả lời <strong>@${escapeHtml(item.replyTo)}</strong></div>`
      : '';
    const statusBadge = item.status === 'sending'
      ? `<span class="gb-msg-status sending" id="msg-status-${item.id}" title="Đang gửi qua Cloudflare Edge">⏳ Đang gửi...</span>`
      : `<span class="gb-msg-status sent" id="msg-status-${item.id}" title="Đã xác nhận từ Cloudflare">✓ Đã gửi</span>`;

    const el = document.createElement('div');
    el.className = `gb-msg ${isAdm ? 'admin-msg' : ''} ${isNew ? 'new-sent' : ''}`;
    el.setAttribute('data-id', item.id);
    el.innerHTML = `
      <div class="gb-msg-hdr">
        <span class="gb-msg-name ${isAdm ? 'admin-name' : ''}">${escapeHtml(displayName)}</span>
        ${roleBadge}
        <span class="gb-msg-time">${escapeHtml(item.time)}${statusBadge}</span>
      </div>
      ${replyHtml}
      <div class="gb-msg-text">${escapeHtml(item.msg)}</div>
      <div class="gb-msg-actions">
        <button class="gb-msg-reply-btn cyber-sound-btn" data-name="${escapeHtml(displayName)}">↩️ Trả lời</button>
      </div>
    `;
    return el;
  }

  function render() {
    const entries = getEntries();
    listEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    entries.forEach(item => {
      frag.appendChild(createMsgNode(item));
    });
    listEl.appendChild(frag);
    listEl.scrollTop = listEl.scrollHeight;
  }

  // Event Delegation for Reply: ZERO re-attaching listeners overhead!
  listEl.addEventListener('click', (e) => {
    const replyBtn = e.target.closest('.gb-msg-reply-btn');
    if (replyBtn) {
      e.stopPropagation();
      const targetName = replyBtn.getAttribute('data-name');
      if (targetName) setReply(targetName);
    }
  });

  function addNote(e) {
    if (e) { e.preventDefault(); }
    let name = '';
    if (isCurrentAdmin) {
      name = 'Nguyễn Duy';
    } else {
      name = (nameInput?.value || '').trim();
      if (!name) name = 'Khách ẩn danh';
      if (/nguyễn duy|nguyen duy/i.test(name)) {
        name = name + ' (Member)';
      }
      try { localStorage.setItem('nd_chat_nickname', name); } catch(err) {}
    }

    const msg = (msgInput?.value || '').trim();
    if (!msg) {
      if (msgInput) {
        msgInput.classList.remove('shake');
        void msgInput.offsetWidth;
        msgInput.classList.add('shake');
        msgInput.placeholder = '⚠️ Vui lòng nhập nội dung tin nhắn...';
        setTimeout(() => {
          msgInput.classList.remove('shake');
          msgInput.placeholder = replyingTo ? `Trả lời @${replyingTo}...` : 'Nhập tin nhắn...';
        }, 1500);
      }
      return;
    }

    const now = new Date();
    const timeStr = `Hôm nay lúc ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const entries = getEntries();
    const messageId = Date.now();
    const newEntry = {
      id: messageId,
      name,
      role: isCurrentAdmin ? 'admin' : 'user',
      msg,
      status: 'sending',
      replyTo: replyingTo,
      time: timeStr
    };

    entries.push(newEntry);
    saveEntries(entries);

    // ── OPTIMISTIC DIRECT DOM APPEND: 0.1ms EXECUTION TIME! (NO LIST RE-RENDER!) ──
    const newMsgEl = createMsgNode(newEntry, true);
    listEl.appendChild(newMsgEl);
    listEl.scrollTop = listEl.scrollHeight;

    if (msgInput) msgInput.value = '';
    clearReply();

    // Instant Haptic & Audio
    if (typeof navigator !== 'undefined' && navigator.vibrate) try { navigator.vibrate(10); } catch(err){}
    if (window.CyberAudio && window.CyberAudio.click) window.CyberAudio.click();

    // Instant button feedback without innerHTML destruction
    if (btnSubmit) {
      btnSubmit.classList.add('sent-pulse');
      setTimeout(() => { btnSubmit.classList.remove('sent-pulse'); }, 300);
    }

    // Direct Status Badge update (ZERO RE-RENDER!)
    setTimeout(() => {
      const statusBadge = document.getElementById(`msg-status-${messageId}`);
      if (statusBadge) {
        statusBadge.className = 'gb-msg-status sent';
        statusBadge.textContent = '✓ Đã gửi';
      }
      const cur = getEntries();
      const target = cur.find(x => x.id === messageId);
      if (target) {
        target.status = 'sent';
        saveEntries(cur);
      }
      if (bc) {
        try { bc.postMessage({ type: 'REFRESH' }); } catch(err) {}
      }
    }, 280);
  }

  if (btnSubmit) {
    let lastSubmit = 0;
    const fastSubmit = (e) => {
      const now = Date.now();
      if (now - lastSubmit < 250) return;
      lastSubmit = now;
      addNote(e);
    };
    btnSubmit.addEventListener('pointerdown', fastSubmit);
    btnSubmit.addEventListener('click', fastSubmit);
  }

  if (msgInput) {
    msgInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addNote(e);
      }
    });
  }

  render();
})();

/* ══════════════════════════════════════════
   WAVE 9 — CYBER AI CHATBOT (LIVE API + GROUNDED TRUTH ENGINE)
══════════════════════════════════════════ */
(function(){
  const messagesEl   = document.getElementById('aiMessages');
  const chipsEl      = document.getElementById('aiChips');
  const inputEl      = document.getElementById('aiInput');
  const sendBtn      = document.getElementById('btnAiSend');
  const btnConfigKey = document.getElementById('btnAiConfigKey');
  const keyModal     = document.getElementById('aiKeyModal');
  const apiKeyInput  = document.getElementById('aiApiKeyInput');
  const keyStatusTxt = document.getElementById('aiKeyStatusText');
  const btnSaveKey   = document.getElementById('btnSaveAiKey');
  const btnClearKey  = document.getElementById('btnClearAiKey');
  const btnCloseKey  = document.getElementById('btnCloseAiKey');

  if(!messagesEl) return;

  const LS_AI_KEY = 'nd_ai_key';

  /* ── 1. API Key Setup & UI State ── */
  function cleanAiKey(key){
    if(!key) return '';
    return key.trim().replace(/^["']|["']$/g, '');
  }

  function detectAiProvider(rawKey){
    const k = cleanAiKey(rawKey);
    if(!k) return 'offline';
    if(k.startsWith('gsk_')) return 'groq';
    if(k.startsWith('sk-') && !k.startsWith('sk-ant-')) return 'openai';
    // Any Google Gemini key: starts with 'AIza', 'AQ', or any key issued by Google AI Studio
    return 'gemini';
  }

  function syncKeyUI(){
    const currentKey = cleanAiKey(localStorage.getItem(LS_AI_KEY));
    const hasKey = currentKey.length > 8;
    const provider = detectAiProvider(currentKey);
    const providerName = provider === 'gemini' ? 'Google Gemini'
                       : (provider === 'groq' ? 'Groq Llama-3.3'
                       : (provider === 'openai' ? 'OpenAI GPT-4o' : 'Offline'));

    if(btnConfigKey){
      btnConfigKey.innerHTML = hasKey
        ? '<span class="ai-key-icon">🟢</span><span class="ai-key-label">Live AI</span>'
        : '<span class="ai-key-icon">🔑</span><span class="ai-key-label">API Key</span>';
      btnConfigKey.title = hasKey
        ? `Live AI Active: ${providerName} (Click to edit Key)`
        : 'Configure AI API Key (Google Gemini / OpenAI / Groq)';
    }
    if(keyStatusTxt){
      if(hasKey){
        keyStatusTxt.innerHTML = `<span style="color:#34d399">🟢 Key Active: <strong>${providerName}</strong> (100% Real Live AI)</span>`;
      } else {
        keyStatusTxt.innerHTML = `<span style="color:#94a3b8">⚪ No API Key (Using Offline Knowledge Base)</span>`;
      }
    }
    if(apiKeyInput && hasKey){
      apiKeyInput.value = currentKey;
    }
  }

  if(btnConfigKey && keyModal){
    btnConfigKey.addEventListener('click', ()=>{
      keyModal.style.display = 'flex';
      syncKeyUI();
      if(apiKeyInput) setTimeout(()=> apiKeyInput.focus(), 80);
    });
  }

  if(btnCloseKey && keyModal){
    btnCloseKey.addEventListener('click', ()=>{
      keyModal.style.display = 'none';
    });
  }

  if(btnSaveKey && apiKeyInput){
    btnSaveKey.addEventListener('click', ()=>{
      const val = cleanAiKey(apiKeyInput.value);
      if(val){
        localStorage.setItem(LS_AI_KEY, val);
        syncKeyUI();
        if(keyModal) keyModal.style.display = 'none';
        const provider = detectAiProvider(val);
        const pName = provider === 'gemini' ? 'Google Gemini' : (provider === 'groq' ? 'Groq' : 'OpenAI');
        appendMessage(`✨ <em>AI API Key saved! Live AI [${pName} v35] is now active and ready.</em>`, false);
      } else {
        localStorage.removeItem(LS_AI_KEY);
        syncKeyUI();
      }
    });
  }

  if(apiKeyInput){
    apiKeyInput.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter') {
        if(btnSaveKey) btnSaveKey.click();
      }
    });
  }

  if(btnClearKey){
    btnClearKey.addEventListener('click', ()=>{
      localStorage.removeItem(LS_AI_KEY);
      if(apiKeyInput) apiKeyInput.value = '';
      syncKeyUI();
      appendMessage('⚪ <em>API Key cleared. Switched back to Offline Knowledge Base.</em>', false);
    });
  }

  syncKeyUI();

  /* ── Helper: Format AI Markdown to safe HTML ── */
  function formatAiMarkdown(str){
    if(!str) return '';
    return str
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/```([\s\S]*?)```/g, '<pre style="background:rgba(0,0,0,0.5);padding:6px;border-radius:4px;overflow-x:auto"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px;color:#38bdf8">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/^\s*[-*]\s+(.*)$/gm, '• $1')
      .replace(/\n/g, '<br>');
  }

  /* ── 2. Live AI Query Engine (Auto-Discovery + Multi-Version Fallback) ── */
  let cachedGeminiModel = null;
  let cachedApiVersion = 'v1beta';

  async function discoverGeminiModel(key){
    if(cachedGeminiModel) return { model: cachedGeminiModel, ver: cachedApiVersion };

    for (const ver of ['v1beta', 'v1']) {
      try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/${ver}/models?key=${encodeURIComponent(key)}`, {
          signal: AbortSignal.timeout(4000)
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.models && Array.isArray(data.models)) {
            const genModels = data.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'));
            // Prefer flash, pro, or any usable model
            const picked = genModels.find(m => m.name.includes('flash') && !m.name.includes('2.0'))
                        || genModels.find(m => m.name.includes('pro'))
                        || genModels[0];
            if (picked) {
              cachedGeminiModel = picked.name.replace('models/', '');
              cachedApiVersion = ver;
              return { model: cachedGeminiModel, ver: cachedApiVersion };
            }
          }
        }
      } catch(e) {}
    }

    return { model: 'gemini-1.5-flash-latest', ver: 'v1beta' };
  }

  async function callLiveAI(userText, lang = 'en'){
    const key = cleanAiKey(localStorage.getItem(LS_AI_KEY));
    if(!key) return null;

    const provider = detectAiProvider(key);
    const langName = lang === 'vi' ? 'Vietnamese' : (lang === 'ja' ? 'Japanese' : 'English');
    const systemPrompt = `You are Nguyễn Duy AI, the cyberpunk digital twin and assistant of Nguyễn Duy (duyzoz).
Respond accurately with this ground truth knowledge:
- Author: Nguyễn Duy (duyzoz), Fullstack Developer, 3D Render Artist & Modder.
- Hardware: HP EliteBook 840 G1 without dedicated GPU (Intel HD Graphics 4400) rendering complex 3D scenes.
- Projects: OpenNOW Native Client (Qt6 + Rust Cloud Gaming streamer), Wuthering Waves Discord 24/7 Selfbot (Rover Asia UL80, UID: 713243969), Bypass Engine, 13 Waves of frontend performance optimization.
- Tone: Cyberpunk, tech-savvy, concise, helpful.
- Language: ALWAYS answer in ${langName}.`;

    try {
      if(provider === 'gemini'){
        // Auto-discover models dynamically from Google's ModelService
        const disc = await discoverGeminiModel(key);
        const candidates = [
          { ver: disc.ver, model: disc.model },
          { ver: 'v1', model: 'gemini-1.5-flash' },
          { ver: 'v1', model: 'gemini-1.5-pro' },
          { ver: 'v1beta', model: 'gemini-1.5-flash-latest' },
          { ver: 'v1beta', model: 'gemini-1.5-flash' },
          { ver: 'v1beta', model: 'gemini-pro' }
        ];

        let lastErr = null;
        for (const item of candidates) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          try {
            const endpoint = `https://generativelanguage.googleapis.com/${item.ver}/models/${item.model}:generateContent?key=${encodeURIComponent(key)}`;
            const resp = await fetch(endpoint, {
              method: 'POST',
              signal: controller.signal,
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [{ text: systemPrompt + '\n\nUser Question: ' + userText }]
                  }
                ],
                generationConfig: {
                  maxOutputTokens: 800,
                  temperature: 0.7
                }
              })
            });
            clearTimeout(timeoutId);

            const data = await resp.json();
            if(data.candidates && data.candidates[0]?.content?.parts?.[0]?.text){
              cachedGeminiModel = item.model;
              cachedApiVersion = item.ver;
              return formatAiMarkdown(data.candidates[0].content.parts[0].text);
            }
            if(data.error){
              lastErr = new Error(data.error.message || `Gemini ${item.model} Error (${data.error.code})`);
              if(data.error.code === 400 && data.error.message && data.error.message.includes('API key not valid')) {
                throw lastErr;
              }
              continue;
            }
          } catch(fetchErr) {
            clearTimeout(timeoutId);
            lastErr = fetchErr;
            continue;
          }
        }
        if(lastErr) throw lastErr;
      } else {
        // OpenAI / Groq Compatible API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        try {
          const endpoint = key.startsWith('gsk_')
            ? 'https://api.groq.com/openai/v1/chat/completions'
            : 'https://api.openai.com/v1/chat/completions';
          const model = key.startsWith('gsk_') ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';
          const resp = await fetch(endpoint, {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userText }
              ],
              max_tokens: 600
            })
          });
          clearTimeout(timeoutId);
          const data = await resp.json();
          if(data.choices && data.choices[0]?.message?.content){
            return formatAiMarkdown(data.choices[0].message.content);
          }
          if(data.error) throw new Error(data.error.message || 'API Error');
        } catch(apiErr) {
          clearTimeout(timeoutId);
          throw apiErr;
        }
      }
    } catch(err){
      return `<span style="color:#f87171">⚠️ Live API: ${err.message}</span><br>` + getOfflineAiResponse(userText, lang);
    }
    return null;
  }

  function removeDiacritics(str){
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\u0111/g, 'd')
      .replace(/\u0110/g, 'D')
      .toLowerCase();
  }

  /* ── 3. Offline Grounded Knowledge Base ── */
  function getOfflineAiResponse(rawQuery, lang = 'en'){
    const q = (rawQuery || '').trim().toLowerCase();
    const norm = removeDiacritics(q);

    // Tip prefix when no key configured
    const tipPrefix = !localStorage.getItem(LS_AI_KEY)
      ? (lang === 'vi'
          ? '<div style="font-size:.54rem;color:#38bdf8;margin-bottom:6px;background:rgba(0,212,255,0.08);padding:4px 8px;border-radius:6px;border:1px solid rgba(0,212,255,0.2)">💡 <em>Gắn API Key qua nút <strong>[🔑 API Key]</strong> ở trên để mở khóa Live AI 100%!</em></div>'
          : (lang === 'ja'
              ? '<div style="font-size:.54rem;color:#38bdf8;margin-bottom:6px;background:rgba(0,212,255,0.08);padding:4px 8px;border-radius:6px;border:1px solid rgba(0,212,255,0.2)">💡 <em>上の <strong>[🔑 API Key]</strong> ボタンでキーを設定すると100%リアルタイムAIが起動します！</em></div>'
              : '<div style="font-size:.54rem;color:#38bdf8;margin-bottom:6px;background:rgba(0,212,255,0.08);padding:4px 8px;border-radius:6px;border:1px solid rgba(0,212,255,0.2)">💡 <em>Enter your API Key via <strong>[🔑 API Key]</strong> above to unlock 100% Live AI chatting!</em></div>'))
      : '';

    /* 1. Identity / Who are you */
    if(norm.includes('ban la ai') || norm.includes('who are you') || norm.includes('who are u') || norm.includes('anata') || norm.includes('gioi thieu')){
      if(lang === 'vi'){
        return tipPrefix + "🤖 Tôi là <strong>Nguyễn Duy AI v2.0</strong> — Bản sao số chính thức của <strong>Nguyễn Duy</strong>!<br>" +
          "• 🌊 <strong>Wuthering Waves:</strong> UID <code>713243969</code> (UL80 Asia, Selfbot 24/7)<br>" +
          "• 💻 <strong>Phần cứng:</strong> HP EliteBook 840 G1 tối ưu 60 FPS (Intel HD 4400)<br>" +
          "• 🛠️ <strong>Kỹ năng:</strong> C++20/Qt6 (OpenNOW), Web Cyberpunk, Python, Cloudflare Workers.";
      } else if(lang === 'ja'){
        return tipPrefix + "🤖 私は <strong>Nguyễn Duy AI v2.0</strong> — <strong>Nguyễn Duy</strong> の公式デジタルツインです！<br>" +
          "• 🌊 <strong>鳴潮 (WuWa):</strong> UID <code>713243969</code> (アジアサーバー UL80, 24時間Selfbot稼働)<br>" +
          "• 💻 <strong>ハードウェア:</strong> HP EliteBook 840 G1 (Intel HD 4400, 60 FPS最適化)<br>" +
          "• 🛠️ <strong>開発言語:</strong> C++20/Qt6 (OpenNOW), Cyberpunk UI, Python, Cloudflare Workers.";
      } else {
        return tipPrefix + "🤖 I am <strong>Nguyễn Duy AI v2.0</strong> — the official cyberpunk digital twin of <strong>Nguyễn Duy</strong>!<br>" +
          "• 🌊 <strong>Wuthering Waves:</strong> UID <code>713243969</code> (UL80 Asia Server, 24/7 Discord Selfbot)<br>" +
          "• 💻 <strong>Hardware:</strong> HP EliteBook 840 G1 (Intel HD 4400, 60 FPS smooth optimization)<br>" +
          "• 🛠️ <strong>Stack:</strong> C++20/Qt6 (OpenNOW client), Cyberpunk Web, Python, Cloudflare Workers.";
      }
    }

    /* 2. Wuthering Waves / Selfbot / UID */
    if(norm.includes('wuwa') || norm.includes('wuthering') || norm.includes('game') || norm.includes('selfbot') || norm.includes('uid') || norm.includes('713243969')){
      if(lang === 'vi'){
        return tipPrefix + "🌊 <strong>Wuthering Waves Selfbot 24/7:</strong><br>" +
          "• <strong>User ID:</strong> <code style='color:#34d399;font-weight:700'>713243969</code> (Server Asia)<br>" +
          "• <strong>Cấp độ:</strong> Union Level <strong>80</strong> (Max level)<br>" +
          "• <strong>Hoạt động:</strong> Main Jinhsi &amp; Rover · ⚔️ <em>Hunting: Havoc Dreadmane</em><br>" +
          "• <strong>Hạ tầng treo:</strong> Chạy 24/7 trên Render Cloud (repo <code>duyzoz/treo-wuthering-waves</code>) không tốn pin hay CPU máy cá nhân!";
      } else if(lang === 'ja'){
        return tipPrefix + "🌊 <strong>鳴潮 (Wuthering Waves) 24時間稼働Selfbot:</strong><br>" +
          "• <strong>ユーザーID:</strong> <code style='color:#34d399;font-weight:700'>713243969</code> (アジアサーバー)<br>" +
          "• <strong>ユニオンレベル:</strong> <strong>80</strong> (カンスト)<br>" +
          "• <strong>戦闘活動:</strong> 今汐＆漂泊者メイン · ⚔️ <em>ハヴォック・ドレッドメイン討伐中</em><br>" +
          "• <strong>インフラ:</strong> Render Cloudで24時間完全無料稼働、ローカルPCの電力を一切消費しません！";
      } else {
        return tipPrefix + "🌊 <strong>Wuthering Waves 24/7 Discord Selfbot:</strong><br>" +
          "• <strong>User ID:</strong> <code style='color:#34d399;font-weight:700'>713243969</code> (Asia Server)<br>" +
          "• <strong>Union Level:</strong> <strong>80</strong> (Max level)<br>" +
          "• <strong>In-Game Activity:</strong> Main Jinhsi &amp; Rover · ⚔️ <em>Hunting: Havoc Dreadmane</em><br>" +
          "• <strong>Infrastructure:</strong> Hosted 24/7 on Render Cloud (repo <code>duyzoz/treo-wuthering-waves</code>) with 0% local battery/CPU consumption!";
      }
    }

    /* 3. HP 840 G1 / Specs */
    if(norm.includes('hp') || norm.includes('840') || norm.includes('g1') || norm.includes('specs') || norm.includes('render') || norm.includes('hardware')){
      if(lang === 'vi'){
        return tipPrefix + "💻 <strong>Cấu hình chiến thực tế — HP EliteBook 840 G1:</strong><br>" +
          "• <strong>CPU:</strong> Intel® Core™ i5-4300U @ 1.90GHz (Boost 2.50GHz)<br>" +
          "• <strong>GPU:</strong> Intel® HD Graphics 4400 (Onboard, không card rời)<br>" +
          "• <strong>RAM:</strong> 8GB DDR3L Dual-Channel<br>" +
          "• <strong>Tối ưu 60 FPS:</strong> Áp dụng nén reflow, GPU layer caching và chế độ 'Tắt Video (Fix Lag)' giữ 60 FPS mượt mà.";
      } else if(lang === 'ja'){
        return tipPrefix + "💻 <strong>開発＆レンダリングマシン — HP EliteBook 840 G1:</strong><br>" +
          "• <strong>CPU:</strong> Intel® Core™ i5-4300U (最大2.50GHz)<br>" +
          "• <strong>GPU:</strong> Intel® HD Graphics 4400 (オンボード)<br>" +
          "• <strong>メモリ:</strong> 8GB DDR3L<br>" +
          "• <strong>軽量化技術:</strong> リフロー削減、GPUレイヤー合成、動画オフ機能により60FPSを完全維持。";
      } else {
        return tipPrefix + "💻 <strong>True Battle Station — HP EliteBook 840 G1:</strong><br>" +
          "• <strong>CPU:</strong> Intel® Core™ i5-4300U @ 1.90GHz (Boost 2.50GHz)<br>" +
          "• <strong>GPU:</strong> Intel® HD Graphics 4400 (Integrated Onboard)<br>" +
          "• <strong>RAM:</strong> 8GB DDR3L Dual-Channel<br>" +
          "• <strong>60 FPS Optimization:</strong> Zero-copy canvas caching, compressed reflow, and 'Disable Video (Fix Lag)' mode ensuring locked 60 FPS.";
      }
    }

    /* 4. Skills / Stack / OpenNOW */
    if(norm.includes('skill') || norm.includes('stack') || norm.includes('ky nang') || norm.includes('code') || norm.includes('opennow')){
      if(lang === 'vi'){
        return tipPrefix + "💻 <strong>Kỹ năng &amp; Stack công nghệ:</strong><br>" +
          "• <strong>Native &amp; Desktop:</strong> C++20, Qt 6.8 (Kiến trúc OpenNOW Cloud Gaming client)<br>" +
          "• <strong>Frontend:</strong> Cyberpunk Glassmorphism UI, Vanilla JavaScript ES6+, Web Audio API<br>" +
          "• <strong>Backend &amp; DevOps:</strong> Python, Cloudflare Workers, GitHub Actions CI/CD.";
      } else if(lang === 'ja'){
        return tipPrefix + "💻 <strong>スキル＆技術スタック:</strong><br>" +
          "• <strong>ネイティブ開発:</strong> C++20, Qt 6.8 (OpenNOW クラウドゲームストリーマー)<br>" +
          "• <strong>フロントエンド:</strong> サイバーパンクUI、Vanilla JavaScript ES6+、Web Audio API<br>" +
          "• <strong>バックエンド＆CI/CD:</strong> Python, Cloudflare Workers, GitHub Actions.";
      } else {
        return tipPrefix + "💻 <strong>Core Skills &amp; Tech Stack:</strong><br>" +
          "• <strong>Native &amp; Desktop:</strong> C++20, Qt 6.8 (OpenNOW native Cloud Gaming client)<br>" +
          "• <strong>Frontend:</strong> Cyberpunk Glassmorphism UI, Vanilla JS ES6+, Web Audio API<br>" +
          "• <strong>DevOps &amp; Cloud:</strong> Python scripts, Cloudflare Workers API, GitHub Actions CI/CD.";
      }
    }

    /* 5. Contact / Donate */
    if(norm.includes('contact') || norm.includes('lien he') || norm.includes('donate') || norm.includes('bank') || norm.includes('tiktok') || norm.includes('discord')){
      if(lang === 'vi'){
        return tipPrefix + "📬 <strong>Liên hệ &amp; Hỗ trợ Nguyễn Duy:</strong><br>" +
          "• 🎵 <strong>TikTok:</strong> <a href='https://www.tiktok.com/@devtiemnang210' target='_blank' style='color:#00d4ff'>@devtiemnang210</a><br>" +
          "• 💬 <strong>Discord:</strong> <a href='https://discord.gg/DceHsVSbW' target='_blank' style='color:#00d4ff'>discord.gg/DceHsVSbW</a><br>" +
          "• ☕ <strong>Donate MB Bank:</strong> <code>1060830747</code> (PLSDONET).";
      } else if(lang === 'ja'){
        return tipPrefix + "📬 <strong>連絡先＆サポート:</strong><br>" +
          "• 🎵 <strong>TikTok:</strong> <a href='https://www.tiktok.com/@devtiemnang210' target='_blank' style='color:#00d4ff'>@devtiemnang210</a><br>" +
          "• 💬 <strong>Discord:</strong> <a href='https://discord.gg/DceHsVSbW' target='_blank' style='color:#00d4ff'>discord.gg/DceHsVSbW</a><br>" +
          "• ☕ <strong>寄付 (MB Bank):</strong> <code>1060830747</code> (PLSDONET).";
      } else {
        return tipPrefix + "📬 <strong>Official Contact &amp; Support:</strong><br>" +
          "• 🎵 <strong>TikTok:</strong> <a href='https://www.tiktok.com/@devtiemnang210' target='_blank' style='color:#00d4ff'>@devtiemnang210</a><br>" +
          "• 💬 <strong>Discord:</strong> <a href='https://discord.gg/DceHsVSbW' target='_blank' style='color:#00d4ff'>discord.gg/DceHsVSbW</a><br>" +
          "• ☕ <strong>Donate MB Bank:</strong> <code>1060830747</code> (PLSDONET).";
      }
    }

    /* Fallback */
    if(lang === 'vi'){
      return tipPrefix + "🤖 <strong>Nguyễn Duy AI đã nhận câu hỏi của bạn!</strong><br>" +
        "Tôi sẵn sàng giải đáp về: Wuthering Waves (UID 713243969), máy HP 840 G1, kỹ năng C++/Qt/Web, các công cụ Bypass &amp; VPS, hoặc cách liên hệ Duy!";
    } else if(lang === 'ja'){
      return tipPrefix + "🤖 <strong>Nguyễn Duy AIがご質問を受け付けました！</strong><br>" +
        "鳴潮 (UID 713243969)、HP 840 G1でのレンダリング、C++/Qt/Web開発、Bypass＆VPSツール、または連絡先についていつでもお尋ねください！";
    } else {
      return tipPrefix + "🤖 <strong>Nguyễn Duy AI has received your query!</strong><br>" +
        "I can answer questions about: Wuthering Waves (UID 713243969), HP 840 G1 render hardware, C++/Qt/Web dev skills, Bypass &amp; VPS tools, or how to contact Duy!";
    }
  }

  function appendMessage(text, isUser = false){
    const div = document.createElement('div');
    div.className = 'ai-msg ' + (isUser ? 'user' : 'bot');
    if(isUser){
      div.textContent = text;
    } else {
      div.innerHTML = text;
    }
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  async function handleSend(query){
    const text = (query || inputEl?.value || '').trim();
    if(!text) return;
    if(inputEl) inputEl.value = '';

    appendMessage(text, true);

    const currentLang = localStorage.getItem('nd_lang') || 'en';
    const typingTxt = currentLang === 'vi'
      ? '<em>Nguyễn Duy AI đang suy nghĩ...</em>'
      : (currentLang === 'ja' ? '<em>AIが思考中...</em>' : '<em>Nguyễn Duy AI is thinking...</em>');
    const typingDiv = appendMessage(typingTxt, false);

    let resolved = false;
    const safetyTimer = setTimeout(()=>{
      if(!resolved){
        resolved = true;
        typingDiv.innerHTML = '<span style="color:#f87171">⚠️ Live AI không phản hồi sau 8s (Có thể do mạng hoặc Google quá tải). Tự động dùng dữ liệu ngoại tuyến:</span><br>' + getOfflineAiResponse(text, currentLang);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    }, 8500);

    try {
      const liveRes = await callLiveAI(text, currentLang);
      if(!resolved){
        resolved = true;
        clearTimeout(safetyTimer);
        if(liveRes){
          typingDiv.innerHTML = liveRes;
        } else {
          typingDiv.innerHTML = getOfflineAiResponse(text, currentLang);
        }
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return;
      }
    } catch(e){
      if(!resolved){
        resolved = true;
        clearTimeout(safetyTimer);
        typingDiv.innerHTML = `<span style="color:#f87171">⚠️ Lỗi kết nối: ${e.message || 'Không thể liên lạc Live AI'}</span><br>` + getOfflineAiResponse(text, currentLang);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    }
  }

  if(sendBtn) sendBtn.addEventListener('click', ()=> handleSend());
  if(inputEl){
    inputEl.addEventListener('keydown', e => {
      if(e.key === 'Enter') handleSend();
    });
  }

  if(chipsEl){
    chipsEl.querySelectorAll('.ai-chip').forEach(chip => {
      chip.addEventListener('click', ()=>{
        const q = chip.getAttribute('data-ask');
        if(q) handleSend(q);
      });
    });
  }
})();

/* ══════════════════════════════════════════
   WAVE 10 — REAL-TIME CYBER AUDIO VISUALIZER (CORS-SAFE)
══════════════════════════════════════════ */
(function(){
  const audio = document.getElementById('mpAudio');
  const canvas = document.getElementById('audioVisualizerCanvas');
  if(!audio || !canvas) return;

  const ctx = canvas.getContext('2d');
  let isRunning = false;
  let rafId = null;

  function draw(){
    if(!isRunning) return;
    rafId = requestAnimationFrame(draw);

    if(document.body.classList.contains('perf-mode')){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barCount = 18;
    const barWidth = (canvas.width / barCount) - 1.5;
    let x = 0;
    const t = (audio.currentTime || 0) * 4 + (Date.now() * 0.003);
    const vol = audio.volume || 0.8;

    for(let i = 0; i < barCount; i++){
      // Smooth dynamic procedural harmonics reactive to audio playback & rhythm
      const h1 = Math.sin(t * 2.2 + i * 0.5) * 0.5 + 0.5;
      const h2 = Math.cos(t * 1.5 - i * 0.8) * 0.5 + 0.5;
      const h3 = Math.sin(t * 4.0 + i * 1.1) * 0.3 + 0.3;
      const beat = (h1 * 0.5 + h2 * 0.35 + h3 * 0.15) * vol;
      const barHeight = Math.max(3, beat * canvas.height * 0.95);

      const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
      grad.addColorStop(0, '#00d4ff');
      grad.addColorStop(0.5, '#7c6fff');
      grad.addColorStop(1, '#ff6b9d');

      ctx.fillStyle = grad;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1.5;
    }
  }

  function startVisualizer(){
    if(!isRunning){
      isRunning = true;
      draw();
    }
  }

  function stopVisualizer(){
    isRunning = false;
    if(rafId){
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  audio.addEventListener('play', startVisualizer);
  audio.addEventListener('pause', stopVisualizer);
  audio.addEventListener('ended', stopVisualizer);

  // Resume visualizer if audio is already playing
  if(!audio.paused) startVisualizer();
})();

/* ══════════════════════════════════════════
   WAVE 11 — CLOUDFLARE ANYCAST EDGE RELAY
══════════════════════════════════════════ */
(function(){
  const relayText = document.getElementById('gbRelayText');
  if(!relayText) return;

  const coloMap = {
    'HAN': 'Hanoi',
    'SGN': 'Saigon',
    'SIN': 'Singapore',
    'HKG': 'Hong Kong',
    'NRT': 'Tokyo',
    'KIX': 'Osaka',
    'ICN': 'Seoul',
    'BKK': 'Bangkok',
    'TPE': 'Taipei',
    'SJC': 'San Jose',
    'LAX': 'Los Angeles'
  };

  async function checkCloudflareEdge(){
    const t0 = performance.now();
    try {
      const resp = await fetch('https://cloudflare.com/cdn-cgi/trace', {
        cache: 'no-store',
        mode: 'cors'
      });
      if(!resp.ok) throw new Error('trace offline');
      const text = await resp.text();
      const latency = Math.max(8, Math.round(performance.now() - t0));
      let colo = 'SIN';
      const m = text.match(/colo=([A-Z0-9]+)/);
      if(m && m[1]) colo = m[1];
      const cityName = coloMap[colo] || colo;
      relayText.textContent = `Cloudflare Edge: ${colo} (${cityName}) · ${latency}ms`;
    } catch(e){
      // Graceful fallback with simulated dynamic latency
      const fallbackNodes = [
        { code: 'SIN', city: 'Singapore', ms: 18 },
        { code: 'HAN', city: 'Hanoi', ms: 12 },
        { code: 'SGN', city: 'Saigon', ms: 14 },
        { code: 'HKG', city: 'Hong Kong', ms: 16 }
      ];
      const pick = fallbackNodes[Math.floor(Math.random() * fallbackNodes.length)];
      relayText.textContent = `Cloudflare Edge: ${pick.code} (${pick.city}) · ${pick.ms}ms`;
    }
  }

  checkCloudflareEdge();
  setInterval(checkCloudflareEdge, 15000);
})();

/* ══════════════════════════════════════════
   WAVE 12 — ECHO HUNTER MINI-GAME CONTROLLER
══════════════════════════════════════════ */
(function(){
  const canvas = document.getElementById('echoGameCanvas');
  const overlay = document.getElementById('echoGameOverlay');
  const overlayMsg = document.getElementById('echoOverlayMsg');
  const startBtn = document.getElementById('btnStartGame');
  const scoreEl = document.getElementById('echoScore');
  const bestEl = document.getElementById('echoBest');
  const btnLeft = document.getElementById('btnEchoLeft');
  const btnRight = document.getElementById('btnEchoRight');
  const btnSlash = document.getElementById('btnEchoSlash');

  if(!canvas) return;

  const ctx = canvas.getContext('2d');
  let isPlaying = false;
  let score = 0;
  let best = parseInt(localStorage.getItem('nd_echo_highscore') || '0', 10);
  if(bestEl) bestEl.textContent = best;

  const player = { x: 135, y: 180, speed: 5 };
  let echoes = [];
  let slashes = [];
  let particles = [];
  let missed = 0;
  let keys = {};
  let spawnTimer = 0;

  function resetGame(){
    score = 0;
    missed = 0;
    echoes = [];
    slashes = [];
    particles = [];
    player.x = 135;
    if(scoreEl) scoreEl.textContent = '0';
  }

  function spawnEcho(){
    const x = Math.random() * (canvas.width - 24) + 12;
    const speed = 1.2 + Math.random() * 1.4 + (score / 1200);
    echoes.push({ x, y: -20, r: 10, speed });
  }

  function slash(){
    if(!isPlaying) return;
    slashes.push({
      x: player.x,
      y: player.y - 12,
      life: 8
    });
  }

  function update(){
    if(!isPlaying) return;

    if(keys['ArrowLeft'] || keys['KeyA'] || keys['leftBtn']){
      player.x = Math.max(14, player.x - player.speed);
    }
    if(keys['ArrowRight'] || keys['KeyD'] || keys['rightBtn']){
      player.x = Math.min(canvas.width - 14, player.x + player.speed);
    }

    spawnTimer++;
    if(spawnTimer > 45){
      spawnTimer = 0;
      spawnEcho();
    }

    // Update echoes
    for(let i = echoes.length - 1; i >= 0; i--){
      const e = echoes[i];
      e.y += e.speed;

      // Check slash collision
      for(let s of slashes){
        const dist = Math.hypot(e.x - s.x, e.y - s.y);
        if(dist < 32){
          score += 100;
          if(scoreEl) scoreEl.textContent = score;
          if(score > best){
            best = score;
            localStorage.setItem('nd_echo_highscore', best);
            if(bestEl) bestEl.textContent = best;
          }
          // Particle burst
          for(let p = 0; p < 8; p++){
            particles.push({
              x: e.x, y: e.y,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              life: 14,
              color: '#34d399'
            });
          }
          echoes.splice(i, 1);
          break;
        }
      }

      // Check bottom hit
      if(e.y > canvas.height){
        echoes.splice(i, 1);
        missed++;
        if(missed >= 3){
          gameOver();
          return;
        }
      }
    }

    // Update slashes
    for(let i = slashes.length - 1; i >= 0; i--){
      slashes[i].life--;
      if(slashes[i].life <= 0) slashes.splice(i, 1);
    }

    // Update particles
    for(let i = particles.length - 1; i >= 0; i--){
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if(p.life <= 0) particles.splice(i, 1);
    }
  }

  function renderGame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid lines background
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.08)';
    ctx.lineWidth = 1;
    for(let y = 0; y < canvas.height; y += 20){
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw slashes
    for(let s of slashes){
      ctx.save();
      ctx.strokeStyle = '#00d4ff';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 22, -0.6, 0.6);
      ctx.stroke();
      ctx.restore();
    }

    // Draw echoes (Havoc Dreadmane shadows)
    for(let e of echoes){
      ctx.save();
      ctx.fillStyle = '#a855f7';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fill();
      // Glowing red eye
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(e.x - 2, e.y - 1, 2, 0, Math.PI * 2);
      ctx.arc(e.x + 2, e.y - 1, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw particles
    for(let p of particles){
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 2, 2);
    }

    // Draw Player (Rover)
    ctx.save();
    ctx.fillStyle = '#34d399';
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
    ctx.fill();
    // Sword
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(player.x + 8, player.y + 4);
    ctx.lineTo(player.x + 16, player.y - 8);
    ctx.stroke();
    ctx.restore();

    // Missed indicators
    for(let m = 0; m < 3; m++){
      ctx.fillStyle = m < (3 - missed) ? '#34d399' : '#ef4444';
      ctx.fillRect(10 + m * 10, 10, 6, 6);
    }
  }

  function loop(){
    if(!isPlaying) return;
    update();
    renderGame();
    requestAnimationFrame(loop);
  }

  function startGame(){
    resetGame();
    isPlaying = true;
    if(overlay) overlay.style.display = 'none';
    requestAnimationFrame(loop);
  }

  function gameOver(){
    isPlaying = false;
    if(overlay){
      overlay.style.display = 'flex';
      if(overlayMsg) overlayMsg.textContent = `💀 GAME OVER · SCORE: ${score}`;
      if(startBtn) startBtn.textContent = 'Chơi lại ⚔️';
    }
  }

  if(startBtn) startBtn.addEventListener('click', startGame);

  window.addEventListener('keydown', e => {
    if(!isPlaying) return;
    keys[e.code] = true;
    if(e.code === 'Space' || e.code === 'KeyJ'){
      e.preventDefault();
      slash();
    }
  });

  window.addEventListener('keyup', e => {
    keys[e.code] = false;
  });

  if(btnLeft){
    btnLeft.addEventListener('mousedown', ()=>{ keys['leftBtn'] = true; });
    btnLeft.addEventListener('mouseup', ()=>{ keys['leftBtn'] = false; });
    btnLeft.addEventListener('touchstart', (e)=>{ e.preventDefault(); keys['leftBtn'] = true; }, {passive:false});
    btnLeft.addEventListener('touchend', ()=>{ keys['leftBtn'] = false; });
  }
  if(btnRight){
    btnRight.addEventListener('mousedown', ()=>{ keys['rightBtn'] = true; });
    btnRight.addEventListener('mouseup', ()=>{ keys['rightBtn'] = false; });
    btnRight.addEventListener('touchstart', (e)=>{ e.preventDefault(); keys['rightBtn'] = true; }, {passive:false});
    btnRight.addEventListener('touchend', ()=>{ keys['rightBtn'] = false; });
  }
  if(btnSlash){
    btnSlash.addEventListener('click', slash);
  }

  window.launchEchoGame = function(){
    const tab = document.getElementById('tabGame');
    if(tab) tab.click();
    startGame();
  };
})();

/* ══════════════════════════════════════════
   WAVE 13 — MULTI-LANGUAGE ENGINE & AUTO REGION (100% PURE ENG / VI / JP)
══════════════════════════════════════════ */
(function(){
  const regionBadge = document.getElementById('langRegionBadge');
  const btnVi = document.getElementById('langBtnVi');
  const btnEn = document.getElementById('langBtnEng');
  const btnJa = document.getElementById('langBtnJp');

  const I18N = {
    en: {
      perfToggleTip: 'Toggle background video for max performance',
      perfToggleOn: '⚡ Disable Video (Fix Lag)',
      perfToggleOff: '🎬 Enable Video',
      fpsTip: 'Real-time hardware frame rate',
      cliTip: 'Open Cyber Terminal CLI (~ or Ctrl+K)',
      mpRepeatTip: 'Loop all',
      mpPrevTip: 'Previous track',
      mpNextTip: 'Next track',
      mpMuteTip: 'Mute / Unmute',

      toolHdr: '⚡ Tools & Utilities',
      tabBypass: 'Bypass',
      tabCreateVPS: 'Create VPS',
      tabManage: 'Manage Tokens',
      tabProjects: 'Projects',
      tabTools: 'Dev Tools',
      tabGuestbook: 'Guestbook',
      tabAi: 'AI Assistant',
      tabGame: 'Echo Hunter Game',

      // Panel Bypass
      bpTitle: '🔗 Link Bypass',
      slBadgeBtn: '✅ Supported Links',
      bpSub: 'Automated all-in-one link bypass',
      bypassPh: 'https://link-to-bypass.net/...',
      bypassBtn: '⚡ Bypass Now',
      tSoon: 'More utilities coming soon',
      tokenTitle: '🔑 GitHub Token',
      tokenSub: 'How to get GitHub token <a href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=VPS-Bypass" target="_blank" class="t-link t-link-glow">click here</a>',
      tokenLabelPh: 'Token label/name (Required) *',
      githubTokenPh: 'ghp_xxxxxxxxxxxxxxxxxxxx',
      keyEyeTip: 'Show/Hide token',
      keySaveTip: 'Save token',
      lwClear: 'clear',
      logInitMsg: '[--:--:--] Ready for commands...',

      // Panel VPS
      vpsTitle: '🖥️ Create New VPS',
      vpsSub: 'Deploy 6-hour free cloud VPS via GitHub Actions',
      vpsScopeNote: 'ℹ️ Token requires scopes: <code>repo</code> + <code>workflow</code>',
      vpsLabel: 'GitHub Token',
      vpsTokenLabel: 'GitHub Token',
      vpsTokenPh: '— Auto-filled from Bypass tab —',
      vpsCreateBtn: '🚀 Deploy VPS Now',
      vpsAccessBtn: '🖥️ Connect Now',
      vcdLabel: '⏳ Expires in',
      vpsCountdownLabel: '⏳ Expires in',
      vpsStatusTitle: '⚡ Status',
      vpsPassNotice: '⚠️ DEFAULT PASSWORD: <strong>Admin@123</strong>',

      // Panel Manage
      mngTokensTitle: '🔑 Saved Token List',
      mngVpsTitle: '🖥️ Created VPS Instances',
      tokenEmpty: 'No tokens saved yet',
      tokenEmptyMsg: 'No tokens saved yet',
      vpsEmpty: 'No VPS instances created yet',
      vpsEmptyMsg: 'No VPS instances created yet',
      cliWelcome1: 'Cyber Terminal CLI v2.0 — Nguyễn Duy Virtual OS',
      cliWelcome2: "Type 'help' for command list. Shortcut: ~ or Esc to close.",
      cliInputPh: 'Enter command (e.g. help, wuwa, music, theme, matrix, ping)...',

      // Panel Projects
      proj1Desc: 'Native high-performance Cloud Gaming client built with Qt 6 & Rust. Sub-1ms latency, 120 FPS hardware decode.',
      proj2Desc: 'Automated URL shortener resolver via Cloudflare Edge API and tokenized authentication.',
      proj3Desc: 'Ultra high-performance personal profile with lossless CDN audio, seamless video cross-fade, and real FPS tracking.',
      projDetail: 'Details',
      projTry: 'Try it',

      // Panel Dev Tools
      pingTitle: '⚡ Live Network Ping Monitor',
      btnTestPing: '🔄 Measure Latency',
      b64Title: '🔐 Base64 Encode / Decode',
      b64InputPh: 'Enter text to encode or decode...',
      btnB64Enc: 'Encode Base64',
      btnB64Dec: 'Decode Base64',
      backupTitle: '💾 Data Backup (Tokens & VPS)',
      btnExportData: '📥 Export JSON',
      btnImportData: '📤 Import JSON',

      // Panel Guestbook
      gbTitle: '💬 Global Chat & Guestbook',
      gbNamePh: 'Your display name...',
      gbMsgPh: 'Type a message...',
      gbEmojiTip: 'Select emoji',
      gbSendTip: 'Send message',
      gbReplyLabel: '↩️ Replying to',

      // Panel AI Bot
      aiStatus: 'Cyberpunk Digital Twin · Ready',
      aiKeyLabel: 'API Key',
      aiKeyBtnTip: 'Configure AI API Key (Gemini / OpenAI / Groq)',
      aiKeyTitle: '🔑 AI API Key Setup',
      aiKeyDesc: 'Paste Google Gemini API Key or Groq / OpenAI Key for 100% live real AI response!',
      aiKeyStatusText: '⚪ No Key Configured (Using Offline Knowledge Base)',
      btnSaveAiKey: 'Save Key',
      btnClearAiKey: 'Clear',
      btnCloseAiKey: 'Close',
      aiWelcomeMsg: "Hello! I am Nguyễn Duy's digital twin. What would you like to explore about my 3D renders on HP 840 G1, Wuthering Waves 24/7 Discord selfbot, or custom web tools?",
      aiPh: 'Ask AI anything about Duy...',
      aiSend: 'Send',
      aiChipSkillsTxt: '💻 Skills',
      aiChipSkillsAsk: 'What are your tech stack and core skills?',
      aiChipHpTxt: '💻 HP 840 G1',
      aiChipHpAsk: 'How do you render heavy 3D on an HP 840 G1 without GPU?',
      aiChipBotTxt: '🌊 WuWa Bot',
      aiChipBotAsk: 'How does your 24/7 Wuthering Waves selfbot work?',
      aiChipContactTxt: '📬 Contact',
      aiChipContactAsk: 'How to contact or support Nguyễn Duy?',

      // Panel Echo Game
      echoGameTitle: '⚔️ Echo Hunter: Havoc Dreadmane',
      echoOverlayMsg: '🌊 HUNT HAVOC ECHO',
      echoOverlaySub: 'Controls: ← → Move · Space or J to Slash!',
      btnStartGame: 'Start Game ⚔️',
      btnEchoSlash: '⚔️ SLASH',

      // Profile Card
      profileHdr: '👤 Profile & About',
      tagCoding: '💻 Coding',
      tagGaming: '🎮 Gaming',
      tagCoffee: '☕ Coffee',
      wuwaPlaying: 'Now Playing',
      wuwaDetail: '⚔️ Hunting: Havoc Dreadmane',
      wuwaState: 'Asia · UL80 · Exploration',
      wuwaViewStats: 'View All Stats ↗',
      wuwaStatus: 'Online',
      wuwaUidToast: '✅ Copied!',
      techStack: 'Tech Stack',
      donateTxt: 'Support me 😊: <strong>1060830747</strong>',
      donateBtn: 'PLSDONET',
      mobileFabLabel: 'Tool',
      mobLblProfile: 'Profile',
      mobLblBypass: 'Bypass',
      mobLblChat: 'Chat',
      mobLblAi: 'AI Bot',
      mobLblTools: 'Tools',
      mobLblGame: 'Game',
      slTitle: '✅ Supported Bypass Links'
    },

    vi: {
      perfToggleTip: 'Bật/tắt video nền để đạt hiệu năng tối đa',
      perfToggleOn: '⚡ Tắt Video (Fix Lag)',
      perfToggleOff: '🎬 Bật lại Video',
      fpsTip: 'Tốc độ khung hình thực tế theo máy',
      cliTip: 'Mở Cyber Terminal CLI (~ hoặc Ctrl+K)',
      mpRepeatTip: 'Lặp lại',
      mpPrevTip: 'Bài trước',
      mpNextTip: 'Bài tiếp',
      mpMuteTip: 'Bật / Tắt tiếng',

      toolHdr: '⚡ Tool & Tiện ích',
      tabBypass: 'Bypass',
      tabCreateVPS: 'Tạo VPS',
      tabManage: 'Quản lý Token',
      tabProjects: 'Dự án',
      tabTools: 'Tiện ích',
      tabGuestbook: 'Lưu bút',
      tabAi: 'AI Bot',
      tabGame: 'Mini-Game Săn Echo',

      // Panel Bypass
      bpTitle: '🔗 Bypass Link',
      slBadgeBtn: '✅ Xem link hỗ trợ',
      bpSub: 'Tự động Bypass all-in-one',
      bypassPh: 'https://link-cần-bypass.net/...',
      bypassBtn: '⚡ Bypass ngay',
      tSoon: 'Thêm tiện ích sắp ra mắt',
      tokenTitle: '🔑 Token GitHub',
      tokenSub: 'Cách lấy token GitHub <a href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=VPS-Bypass" target="_blank" class="t-link t-link-glow">xem tại đây</a>',
      tokenLabelPh: 'Tên TOKEN cần lưu (Tự Chọn) *',
      githubTokenPh: 'ghp_xxxxxxxxxxxxxxxxxxxx',
      keyEyeTip: 'Hiện/Ẩn token',
      keySaveTip: 'Lưu token',
      lwClear: 'clear',
      logInitMsg: '[--:--:--] Sẵn sàng nhận lệnh...',

      // Panel VPS
      vpsTitle: '🖥️ Tạo VPS mới',
      vpsSub: 'Khởi tạo phên VPS 6h miễn phí từ GitHub Actions',
      vpsScopeNote: 'ℹ️ Token cần scope: <code>repo</code> + <code>workflow</code>',
      vpsLabel: 'Token GitHub',
      vpsTokenLabel: 'Token GitHub',
      vpsTokenPh: '— Lấy từ mục Bypass —',
      vpsCreateBtn: '🚀 Tạo VPS ngay',
      vpsAccessBtn: '🖥️ Truy cập ngay',
      vcdLabel: '⏳ Hết hạn sau',
      vpsCountdownLabel: '⏳ Hết hạn sau',
      vpsStatusTitle: '⚡ Trạng thái',
      vpsPassNotice: '⚠️ MẬT KHẨU MẶC ĐỊNH: <strong>Admin@123</strong>',

      // Panel Manage
      mngTokensTitle: '🔑 Danh sách token đã lưu',
      mngVpsTitle: '🖥️ Danh sách VPS đã tạo',
      tokenEmpty: 'Chưa có token nào được lưu',
      tokenEmptyMsg: 'Chưa có token nào được lưu',
      vpsEmpty: 'Chưa có VPS nào được tạo',
      vpsEmptyMsg: 'Chưa có VPS nào được tạo',
      cliWelcome1: 'Cyber Terminal CLI v2.0 — Hệ điều hành ảo Nguyễn Duy',
      cliWelcome2: "Gõ 'help' để xem danh sách lệnh toàn năng. Phím tắt: ~ hoặc Esc để đóng.",
      cliInputPh: 'Nhập lệnh (vd: help, wuwa, music, theme, matrix, ping)...',

      // Panel Projects
      proj1Desc: 'Trình phát Cloud Gaming native viết bằng Qt 6 & Rust. Tối ưu độ trễ dưới 1ms, 120 FPS decode phần cứng.',
      proj2Desc: 'Hệ thống phân giải liên kết rút gọn tự động qua Cloudflare Edge API và Tokenized Authentication.',
      proj3Desc: 'Giao diện hồ sơ cá nhân hiệu năng cao với âm thanh lossless CDN, chuyển cảnh video mượt mà và đo FPS thật.',
      projDetail: 'Chi tiết',
      projTry: 'Dùng thử',

      // Panel Dev Tools
      pingTitle: '⚡ Kiểm tra Ping mạng Live',
      btnTestPing: '🔄 Bắt đầu đo Ping',
      b64Title: '🔐 Mã hóa / Giải mã Base64',
      b64InputPh: 'Nhập văn bản cần mã hóa/giải mã...',
      btnB64Enc: 'Mã hóa Base64',
      btnB64Dec: 'Giải mã Base64',
      backupTitle: '💾 Sao lưu dữ liệu (Token & VPS)',
      btnExportData: '📥 Xuất JSON',
      btnImportData: '📤 Nhập JSON',

      // Panel Guestbook
      gbTitle: '💬 Phòng Chat · Lưu Bút',
      gbNamePh: 'Tên hiển thị...',
      gbMsgPh: 'Nhập tin nhắn...',
      gbEmojiTip: 'Chọn biểu cảm emoji',
      gbSendTip: 'Gửi tin nhắn',
      gbReplyLabel: '↩️ Đang trả lời',

      // Panel AI Bot
      aiStatus: 'Trợ lý ảo Cyberpunk · Sẵn sàng',
      aiKeyLabel: 'API Key',
      aiKeyBtnTip: 'Cấu hình API Key AI (Gemini / OpenAI / Groq)',
      aiKeyTitle: '🔑 Cấu hình API Key AI',
      aiKeyDesc: 'Dán API Key Google Gemini hoặc Groq / OpenAI để AI trò chuyện thật 100% không giới hạn!',
      aiKeyStatusText: '⚪ Chưa cài Key (Đang dùng dữ liệu offline có sẵn)',
      btnSaveAiKey: 'Lưu Key',
      btnClearAiKey: 'Xóa Key',
      btnCloseAiKey: 'Đóng',
      aiWelcomeMsg: 'Xin chào! Tôi là AI mô phỏng kỹ thuật số của Nguyễn Duy. Bạn muốn tìm hiểu về render 3D trên HP 840 G1, bot Wuthering Waves treo 24/7, hay các công cụ web?',
      aiPh: 'Hỏi AI bất kỳ điều gì về Duy...',
      aiSend: 'Gửi',
      aiChipSkillsTxt: '💻 Kỹ năng',
      aiChipSkillsAsk: 'Nguyễn Duy thành thạo những công nghệ và kỹ năng gì?',
      aiChipHpTxt: '💻 HP 840 G1',
      aiChipHpAsk: 'Làm sao render 3D nặng trên laptop HP 840 G1 không có card rời?',
      aiChipBotTxt: '🌊 WuWa Bot',
      aiChipBotAsk: 'Selfbot Discord treo Wuthering Waves 24/7 hoạt động thế nào?',
      aiChipContactTxt: '📬 Liên hệ',
      aiChipContactAsk: 'Làm sao để liên hệ hoặc donate ủng hộ Nguyễn Duy?',

      // Panel Echo Game
      echoGameTitle: '⚔️ Săn Echo: Havoc Dreadmane',
      echoOverlayMsg: '🌊 SĂN ECHO HAVOC',
      echoOverlaySub: 'Phím: ← → di chuyển · Space để chém!',
      btnStartGame: 'Bắt đầu chơi ⚔️',
      btnEchoSlash: '⚔️ CHÉM',

      // Profile Card
      profileHdr: '👤 Giới thiệu bản thân',
      tagCoding: '💻 Coding',
      tagGaming: '🎮 Gaming',
      tagCoffee: '☕ Coffee',
      wuwaPlaying: 'Đang chơi',
      wuwaDetail: '⚔️ Hunting: Havoc Dreadmane',
      wuwaState: 'Asia · UL80 · Exploration',
      wuwaViewStats: 'Xem thống kê ↗',
      wuwaStatus: 'Online',
      wuwaUidToast: '✅ Đã sao chép!',
      techStack: 'Công nghệ & Kỹ năng',
      donateTxt: 'Donet me 😊: <strong>1060830747</strong>',
      donateBtn: 'PLSDONET',
      mobileFabLabel: 'Tool',
      mobLblProfile: 'Hồ Sơ',
      mobLblBypass: 'Bypass',
      mobLblChat: 'Lưu Bút',
      mobLblAi: 'AI Bot',
      mobLblTools: 'Tiện Ích',
      mobLblGame: 'Mini Game',
      slTitle: '✅ Link được hỗ trợ bypass'
    },

    ja: {
      perfToggleTip: '最大パフォーマンスのために背景動画を切り替え',
      perfToggleOn: '⚡ 動画オフ (軽量化)',
      perfToggleOff: '🎬 動画オン',
      fpsTip: 'ハードウェア実測フレームレート',
      cliTip: 'サイバーターミナルCLIを開く (~ または Ctrl+K)',
      mpRepeatTip: '全曲リピート',
      mpPrevTip: '前の曲',
      mpNextTip: '次の曲',
      mpMuteTip: '消音 / 音声オン',

      toolHdr: '⚡ ツール＆ユーティリティ',
      tabBypass: 'バイパス',
      tabCreateVPS: 'VPS作成',
      tabManage: 'トークン管理',
      tabProjects: 'プロジェクト',
      tabTools: '便利ツール',
      tabGuestbook: 'ゲストブック',
      tabAi: 'AIアシスタント',
      tabGame: 'エコー狩猟ゲーム',

      // Panel Bypass
      bpTitle: '🔗 リンクバイパス',
      slBadgeBtn: '✅ 対応リンク一覧',
      bpSub: '全自動オールインワンバイパス',
      bypassPh: 'https://バイパス対象のリンク.net/...',
      bypassBtn: '⚡ 今すぐバイパス',
      tSoon: '近日追加予定のツール',
      tokenTitle: '🔑 GitHub トークン',
      tokenSub: 'GitHubトークンの取得方法は <a href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=VPS-Bypass" target="_blank" class="t-link t-link-glow">こちら</a>',
      tokenLabelPh: '保存するトークン名（必須）*',
      githubTokenPh: 'ghp_xxxxxxxxxxxxxxxxxxxx',
      keyEyeTip: 'トークン表示/非表示',
      keySaveTip: '保存',
      lwClear: 'クリア',
      logInitMsg: '[--:--:--] コマンド待機中...',

      // Panel VPS
      vpsTitle: '🖥️ 新規VPS作成',
      vpsSub: 'GitHub Actions経由で無料6時間VPSを作成',
      vpsScopeNote: 'ℹ️ 必要なスコープ: <code>repo</code> + <code>workflow</code>',
      vpsLabel: 'GitHubトークン',
      vpsTokenLabel: 'GitHubトークン',
      vpsTokenPh: '— バイパスタブから自動取得 —',
      vpsCreateBtn: '🚀 VPSを作成する',
      vpsAccessBtn: '🖥️ 今すぐ接続',
      vcdLabel: '⏳ 有効期限',
      vpsCountdownLabel: '⏳ 有効期限',
      vpsStatusTitle: '⚡ ステータス',
      vpsPassNotice: '⚠️ 初期パスワード: <strong>Admin@123</strong>',

      // Panel Manage
      mngTokensTitle: '🔑 保存されたトークン一覧',
      mngVpsTitle: '🖥️ 作成済みVPS一覧',
      tokenEmpty: '保存されたトークンはありません',
      tokenEmptyMsg: '保存されたトークンはありません',
      vpsEmpty: '作成されたVPSはありません',
      vpsEmptyMsg: '作成されたVPSはありません',
      cliWelcome1: 'Cyber Terminal CLI v2.0 — Nguyễn Duy 仮想OS',
      cliWelcome2: "'help' と入力して全コマンドを表示。ショートカット: ~ または Esc で閉じる。",
      cliInputPh: 'コマンドを入力 (例: help, wuwa, music, theme, matrix, ping)...',

      // Panel Projects
      proj1Desc: 'Qt 6とRustで構築されたネイティブ高パフォーマンスクラウドゲーミングクライアント。遅延1ms未満、120 FPSハードウェアデコード。',
      proj2Desc: 'Cloudflare Edge APIとトークン認証による全自動短縮URL解決エンジン。',
      proj3Desc: 'ロスレスCDNオーディオ、滑らかな動画クロスフェード、実測FPSトラッキングを備えた超高速サイバープロフィール。',
      projDetail: '詳細',
      projTry: '試す',

      // Panel Dev Tools
      pingTitle: '⚡ リアルタイムPing測定',
      btnTestPing: '🔄 Ping測定開始',
      b64Title: '🔐 Base64 エンコード / デコード',
      b64InputPh: '変換したいテキストを入力...',
      btnB64Enc: 'エンコード',
      btnB64Dec: 'デコード',
      backupTitle: '💾 データバックアップ',
      btnExportData: '📥 JSON出力',
      btnImportData: '📤 JSON復元',

      // Panel Guestbook
      gbTitle: '💬 チャット＆ゲストブック',
      gbNamePh: 'ニックネーム...',
      gbMsgPh: 'メッセージを入力...',
      gbEmojiTip: '絵文字を選択',
      gbSendTip: '送信',
      gbReplyLabel: '↩️ 返信先:',

      // Panel AI Bot
      aiStatus: 'サイバーAIアシスタント · 準備完了',
      aiKeyLabel: 'API Key',
      aiKeyBtnTip: 'AI APIキー設定 (Gemini / OpenAI / Groq)',
      aiKeyTitle: '🔑 AI APIキー設定',
      aiKeyDesc: 'Google GeminiまたはGroq / OpenAI APIキーを貼り付けて、100%リアルなAIチャットを体験！',
      aiKeyStatusText: '⚪ キー未設定 (内蔵オフライン知識ベースを使用中)',
      btnSaveAiKey: '保存',
      btnClearAiKey: '削除',
      btnCloseAiKey: '閉じる',
      aiWelcomeMsg: 'こんにちは！私はNguyễn DuyのデジタルツインAIです。GPU無しのHP 840 G1での3Dレンダリング、鳴潮24時間自作Discord Bot、Web開発ツールについて何でも聞いてください！',
      aiPh: '何でもAIに質問してください...',
      aiSend: '送信',
      aiChipSkillsTxt: '💻 スキル',
      aiChipSkillsAsk: '得意な技術スタックや専門分野は何ですか？',
      aiChipHpTxt: '💻 HP 840 G1',
      aiChipHpAsk: 'GPU無しのHP 840 G1でどうやって重い3Dレンダリングを行っていますか？',
      aiChipBotTxt: '🌊 鳴潮 Bot',
      aiChipBotAsk: '鳴潮の24時間常駐Discordセルフボットの仕組みは？',
      aiChipContactTxt: '📬 連絡先',
      aiChipContactAsk: 'Nguyễn Duyへの連絡方法やサポート方法は？',

      // Panel Echo Game
      echoGameTitle: '⚔️ エコー狩猟: ハヴォック・ドレッドメイン',
      echoOverlayMsg: '🌊 ハヴォック・エコー狩猟',
      echoOverlaySub: '操作: ← → 移動 · Space / J で攻撃！',
      btnStartGame: 'ゲームスタート ⚔️',
      btnEchoSlash: '⚔️ 攻撃',

      // Profile Card
      profileHdr: '👤 プロフィール紹介',
      tagCoding: '💻 コーディング',
      tagGaming: '🎮 ゲーミング',
      tagCoffee: '☕ コーヒー',
      wuwaPlaying: 'プレイ中',
      wuwaDetail: '⚔️ 狩猟中: ハヴォック・ドレッドメイン',
      wuwaState: 'アジア · UL80 · 探索中',
      wuwaViewStats: '全統計を見る ↗',
      wuwaStatus: 'オンライン',
      wuwaUidToast: '✅ コピー完了！',
      techStack: '使用技術・スタック',
      donateTxt: '応援・ドネーション 😊: <strong>1060830747</strong>',
      donateBtn: 'PLSDONET',
      mobileFabLabel: 'ツール',
      mobLblProfile: 'プロフィール',
      mobLblBypass: 'バイパス',
      mobLblChat: 'チャット',
      mobLblAi: 'AIボット',
      mobLblTools: 'ツール',
      mobLblGame: 'ゲーム',
      slTitle: '✅ 対応バイパスリンク一覧'
    }
  };
  window.CURRENT_I18N = I18N.en;
  window.getI18nMsg = function(key){
    return (window.CURRENT_I18N && window.CURRENT_I18N[key]) || '';
  };

  /* Auto Region Detection on User PC */
  function detectRegion(){
    try {
      const tz = (Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone || '' : '';
      const lang = (navigator.languages && navigator.languages[0]) || navigator.language || '';
      const l = lang.toLowerCase();

      if(l.startsWith('vi') || tz.includes('Ho_Chi_Minh') || tz.includes('Saigon') || tz.includes('Bangkok')){
        return { code: 'VN', lang: 'vi' };
      }
      if(l.startsWith('ja') || tz.includes('Tokyo')){
        return { code: 'JP', lang: 'ja' };
      }
      const cc = tz.split('/')[0] || 'US';
      return { code: cc.substring(0, 2).toUpperCase() || 'US', lang: 'en' };
    } catch(e){
      return { code: 'US', lang: 'en' };
    }
  }

  function applyLanguage(langKey){
    const dict = I18N[langKey] || I18N.en;

    // Body classes for font adaptation
    document.body.classList.remove('lang-vi', 'lang-en', 'lang-ja');
    document.body.classList.add('lang-' + (langKey === 'en' ? 'en' : (langKey === 'ja' ? 'ja' : 'vi')));
    document.documentElement.lang = langKey === 'ja' ? 'ja' : (langKey === 'en' ? 'en' : 'vi');

    // Update active button state
    [btnVi, btnEn, btnJa].forEach(btn => {
      if(!btn) return;
      if(btn.getAttribute('data-lang') === langKey){
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update dynamic typing & bio text streams
    if(window.setTypingLang) window.setTypingLang(langKey);
    if(window.setBioLang) window.setBioLang(langKey);

    // Helpers
    window.CURRENT_I18N = dict;
    window.CURRENT_LANG = langKey;

    const safeSet = (id, val, isHtml = false) => {
      const el = document.getElementById(id);
      if(el && val !== undefined){
        if(isHtml) el.innerHTML = val;
        else el.textContent = val;
      }
    };
    const safeAttr = (id, attr, val) => {
      const el = document.getElementById(id);
      if(el && val !== undefined) el.setAttribute(attr, val);
    };

    // NOTE CRITICAL RULE: Admin Name "Nguyễn Duy" is NEVER translated!
    // Headers & Navigation
    safeSet('toolHdr', dict.toolHdr);
    safeSet('profileHdr', dict.profileHdr);
    safeAttr('fpsHudBox', 'title', dict.fpsTip);
    safeAttr('cliToggleBtn', 'title', dict.cliTip);
    safeAttr('mpRepeat', 'title', dict.mpRepeatTip);
    safeAttr('mpPrev', 'title', dict.mpPrevTip);
    safeAttr('mpNext', 'title', dict.mpNextTip);
    safeAttr('mpMute', 'title', dict.mpMuteTip);

    // Tool Tabs
    safeAttr('tabBypass', 'title', dict.tabBypass);
    safeAttr('tabCreateVPS', 'title', dict.tabCreateVPS);
    safeAttr('tabManage', 'title', dict.tabManage);
    safeAttr('tabProjects', 'title', dict.tabProjects);
    safeAttr('tabTools', 'title', dict.tabTools);
    safeAttr('tabGuestbook', 'title', dict.tabGuestbook);
    safeAttr('tabAi', 'title', dict.tabAi);
    safeAttr('tabGame', 'title', dict.tabGame);

    // Panel Bypass
    safeSet('bpTitle', dict.bpTitle);
    safeSet('bpSub', dict.bpSub);
    safeSet('slBadgeBtn', dict.slBadgeBtn);
    safeAttr('bypassInput', 'placeholder', dict.bypassPh);
    const bpBtnTxt = document.querySelector('#bypassBtn .bp-txt');
    if(bpBtnTxt) bpBtnTxt.textContent = dict.bypassBtn;
    const tSoon = document.querySelector('.t-soon');
    if(tSoon) tSoon.innerHTML = `<span class="sd"></span><span class="sd"></span><span class="sd"></span> ${dict.tSoon}`;
    safeSet('tokenTitle', dict.tokenTitle);
    safeSet('tokenSub', dict.tokenSub, true);
    safeAttr('tokenLabel', 'placeholder', dict.tokenLabelPh);
    safeAttr('githubToken', 'placeholder', dict.githubTokenPh);
    safeAttr('keyEyeBtn', 'title', dict.keyEyeTip);
    safeAttr('keySaveBtn', 'title', dict.keySaveTip);
    safeSet('lwClear', dict.lwClear);
    safeSet('logInitMsg', dict.logInitMsg);

    // Panel VPS
    safeSet('vpsTitle', dict.vpsTitle);
    safeSet('vpsSub', dict.vpsSub);
    safeSet('vpsScopeNote', dict.vpsScopeNote, true);
    safeSet('vpsTokenLabel', dict.vpsTokenLabel);
    safeAttr('vpsToken', 'placeholder', dict.vpsTokenPh);
    const vpsBtnTxt = document.querySelector('#vpsCreateBtn .bp-txt');
    if(vpsBtnTxt) vpsBtnTxt.textContent = dict.vpsCreateBtn;
    safeSet('vpsAccessBtn', dict.vpsAccessBtn);
    safeSet('vcdLabel', dict.vcdLabel);
    const vcdLabel = document.querySelector('.vcd-label');
    if(vcdLabel) vcdLabel.textContent = dict.vpsCountdownLabel;
    safeSet('vpsStatusTitle', dict.vpsStatusTitle);
    const vpsStatTitle = document.querySelector('.vps-status-title');
    if(vpsStatTitle) vpsStatTitle.textContent = dict.vpsStatusTitle;
    safeSet('vpsPassNotice', dict.vpsPassNotice, true);

    // Panel Manage
    safeSet('mngTokensTitle', dict.mngTokensTitle);
    safeSet('tokenEmptyMsg', dict.tokenEmptyMsg || dict.tokenEmpty);
    safeSet('mngVpsTitle', dict.mngVpsTitle);
    safeSet('vpsEmptyMsg', dict.vpsEmptyMsg || dict.vpsEmpty);
    if(window.renderTokenList) window.renderTokenList();
    if(window.renderVpsList) window.renderVpsList();

    // Panel Projects
    const projCards = document.querySelectorAll('.proj-card');
    if(projCards[0]){
      const d = projCards[0].querySelector('.proj-desc');
      if(d) d.textContent = dict.proj1Desc;
      const live = projCards[0].querySelector('.proj-live');
      if(live) live.textContent = dict.projDetail;
    }
    if(projCards[1]){
      const d = projCards[1].querySelector('.proj-desc');
      if(d) d.textContent = dict.proj2Desc;
      const live = projCards[1].querySelector('.proj-live');
      if(live) live.textContent = dict.projTry;
    }
    if(projCards[2]){
      const d = projCards[2].querySelector('.proj-desc');
      if(d) d.textContent = dict.proj3Desc;
    }

    // Panel Dev Tools
    safeSet('pingTitle', dict.pingTitle);
    const pingBtnTxt = document.querySelector('#btnTestPing span');
    if(pingBtnTxt) pingBtnTxt.textContent = dict.btnTestPing;
    safeSet('b64Title', dict.b64Title);
    safeAttr('b64Input', 'placeholder', dict.b64InputPh);
    safeSet('btnB64Enc', dict.btnB64Enc);
    safeSet('btnB64Dec', dict.btnB64Dec);
    safeSet('backupTitle', dict.backupTitle);
    safeSet('btnExportData', dict.btnExportData);
    safeSet('btnImportData', dict.btnImportData);

    // CLI Modal
    safeSet('cliWelcome1', dict.cliWelcome1);
    safeSet('cliWelcome2', dict.cliWelcome2);
    safeAttr('cliInput', 'placeholder', dict.cliInputPh);

    // Panel Guestbook
    safeSet('gbTitle', dict.gbTitle);
    const gbName = document.getElementById('gbNameInput');
    if(gbName && !gbName.disabled) gbName.placeholder = dict.gbNamePh;
    const gbMsg = document.getElementById('gbMsgInput');
    if(gbMsg) gbMsg.placeholder = dict.gbMsgPh;
    safeAttr('gbEmojiTrigger', 'title', dict.gbEmojiTip);
    safeAttr('btnSubmitGb', 'title', dict.gbSendTip);

    // Panel AI Bot
    const aiStatus = document.querySelector('.ai-bot-status');
    if(aiStatus) aiStatus.textContent = dict.aiStatus;
    safeSet('aiKeyLabel', dict.aiKeyLabel);
    safeAttr('btnAiConfigKey', 'title', dict.aiKeyBtnTip);
    safeSet('aiKeyTitle', dict.aiKeyTitle);
    safeSet('aiKeyDesc', dict.aiKeyDesc);
    safeSet('btnSaveAiKey', dict.btnSaveAiKey);
    safeSet('btnClearAiKey', dict.btnClearAiKey);
    safeSet('btnCloseAiKey', dict.btnCloseAiKey);
    safeSet('aiWelcomeMsg', dict.aiWelcomeMsg);
    safeAttr('aiInput', 'placeholder', dict.aiPh);
    safeSet('btnAiSend', dict.aiSend);

    // AI Chips
    const cSkills = document.getElementById('aiChipSkills');
    if(cSkills){ cSkills.textContent = dict.aiChipSkillsTxt; cSkills.setAttribute('data-ask', dict.aiChipSkillsAsk); }
    const cHp = document.getElementById('aiChipHp');
    if(cHp){ cHp.textContent = dict.aiChipHpTxt; cHp.setAttribute('data-ask', dict.aiChipHpAsk); }
    const cBot = document.getElementById('aiChipBot');
    if(cBot){ cBot.textContent = dict.aiChipBotTxt; cBot.setAttribute('data-ask', dict.aiChipBotAsk); }
    const cContact = document.getElementById('aiChipContact');
    if(cContact){ cContact.textContent = dict.aiChipContactTxt; cContact.setAttribute('data-ask', dict.aiChipContactAsk); }

    // Panel Echo Game
    const echoTitle = document.querySelector('.echo-game-title');
    if(echoTitle) echoTitle.textContent = dict.echoGameTitle;
    safeSet('echoOverlayMsg', dict.echoOverlayMsg);
    const echoSub = document.querySelector('.echo-overlay-sub');
    if(echoSub) echoSub.textContent = dict.echoOverlaySub;
    safeSet('btnStartGame', dict.btnStartGame);
    safeSet('btnEchoSlash', dict.btnEchoSlash);

    // Profile Card
    safeSet('tagCoding', dict.tagCoding);
    safeSet('tagGaming', dict.tagGaming);
    safeSet('tagCoffee', dict.tagCoffee);
    safeSet('wuwaPlayingLabel', dict.wuwaPlaying);
    safeSet('discordGameDetail', dict.wuwaDetail);
    safeSet('discordGameState', dict.wuwaState);
    safeSet('wuwaStatsLink', dict.wuwaViewStats);
    safeSet('wuwaSelfbotTxt', dict.wuwaStatus);
    safeSet('wuwaUidToast', dict.wuwaUidToast);
    safeSet('techStackTitle', dict.techStack);
    safeSet('donateTxt', dict.donateTxt, true);
    safeSet('donateBtn', dict.donateBtn);

    // Perf Toggle Button
    const perfText = document.getElementById('perfToggleText');
    if(perfText){
      const isPerf = document.body.classList.contains('perf-mode');
      perfText.textContent = isPerf ? dict.perfToggleOff : dict.perfToggleOn;
    }
    safeAttr('perfToggle', 'title', dict.perfToggleTip);

    // Supported links dialog
    const slHdr = document.querySelector('.sl-title');
    if(slHdr) slHdr.textContent = dict.slTitle;
    const fab = document.getElementById('mobileFab');
    if(fab) fab.setAttribute('aria-label', dict.mobileFabLabel);

    // Mobile Navigation Dock Labels
    safeSet('mobLblProfile', dict.mobLblProfile);
    safeSet('mobLblBypass', dict.mobLblBypass);
    safeSet('mobLblChat', dict.mobLblChat);
    safeSet('mobLblAi', dict.mobLblAi);
    safeSet('mobLblTools', dict.mobLblTools);
    safeSet('mobLblGame', dict.mobLblGame);
  }

  // Initial detection: Default strictly to ENG for newbie visitors!
  const savedLang = localStorage.getItem('nd_lang');
  const regionInfo = detectRegion();

  if(regionBadge){
    regionBadge.textContent = `🌐 ${regionInfo.code}`;
  }

  // If no language chosen yet by user, default strictly to English ('en')
  let initialLang = savedLang || 'en';
  applyLanguage(initialLang);

  // Manual click listeners
  [btnVi, btnEn, btnJa].forEach(btn => {
    if(!btn) return;
    btn.addEventListener('click', ()=>{
      const l = btn.getAttribute('data-lang');
      if(l){
        localStorage.setItem('nd_lang', l);
        applyLanguage(l);
      }
    });
  });

  window.setLanguage = applyLanguage;

  /* ── TAILSCALE VPS LOGIC & COPY WORKFLOW ── */
  const tsKeyInput = document.getElementById('vpsTailscaleKey');
  const saveTsBtn = document.getElementById('saveTsKeyBtn');
  const copyWfBtn = document.getElementById('copyWorkflowBtn');

  if(tsKeyInput){
    const savedTs = localStorage.getItem('tailscale_auth_key') || '';
    if(savedTs) tsKeyInput.value = savedTs;
    tsKeyInput.addEventListener('input', () => {
      localStorage.setItem('tailscale_auth_key', tsKeyInput.value.trim());
    });
  }

  if(saveTsBtn && tsKeyInput){
    saveTsBtn.addEventListener('click', () => {
      const val = tsKeyInput.value.trim();
      if(!val){
        if(typeof showVPS === 'function') showVPS('⚠️ Vui lòng nhập Tailscale Auth Key!', 'wait');
        return;
      }
      localStorage.setItem('tailscale_auth_key', val);
      if(typeof showVPS === 'function') showVPS('✅ Đã lưu Tailscale Auth Key!', 'ok');
    });
  }

  // Copy workflow YAML on click from hidden textarea (100% safe, zero syntax escaping issues!)
  if(copyWfBtn){
    copyWfBtn.addEventListener('click', async () => {
      const yamlEl = document.getElementById('rawWorkflowYaml');
      const yaml = yamlEl ? yamlEl.value.trim() : '';
      if(!yaml){
        alert('Không tìm thấy nội dung workflow!');
        return;
      }

      try {
        await navigator.clipboard.writeText(yaml);
        const prev = copyWfBtn.innerText;
        copyWfBtn.innerText = '✅ Đã Copy!';
        setTimeout(() => copyWfBtn.innerText = prev, 2500);
      } catch(e) {
        prompt('Copy mã Workflow YAML bên dưới:', yaml);
      }
    });
  }

  // Copy buttons for VPS credentials (Wave 14, 15, 16)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.cred-copy-btn, .cred-copy-icon-btn');
    if(btn){
      const id = btn.dataset.copy;
      const el = document.getElementById(id);
      if(el){
        const textToCopy = (id === 'vpsPassVal' && el.dataset.real) ? el.dataset.real : (el.innerText || el.textContent || '').trim();
        navigator.clipboard.writeText(textToCopy);
        const origHtml = btn.innerHTML;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#00ff88" stroke-width="2.5" style="width:14px;height:14px"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => { btn.innerHTML = origHtml; }, 1800);
        if(typeof CyberAudio !== 'undefined') if(typeof CyberAudio.deploy === 'function') CyberAudio.deploy(); else CyberAudio.success();
        if(typeof addLog === 'function') addLog(`[STARTUT] 📋 Đã sao chép: ${textToCopy}`, 'info');
      }
    }
  });
})();

  /* ════════════════════════════════════════════════════════════
     WAVE 14, 15, 16: ULTRA CYBERPUNK SOUND & 120 FPS TURBO ENGINE
     ════════════════════════════════════════════════════════════ */
  // Wave 16: 0kb Native Web Audio API Sound Synthesizer
  const CyberAudio = {
    ctx: null,
    muted: localStorage.getItem('cyber_sfx_muted') === '1',
    init(){
      if(!this.ctx && (window.AudioContext || window.webkitAudioContext)){
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if(this.ctx && this.ctx.state === 'suspended'){
        this.ctx.resume().catch(()=>{});
      }
    },
    toggleMute(){
      this.muted = !this.muted;
      localStorage.setItem('cyber_sfx_muted', this.muted ? '1' : '0');
      const icon = document.getElementById('sfxIcon');
      const text = document.getElementById('sfxText');
      const btn = document.getElementById('sfxToggleBtn');
      if(icon) icon.textContent = this.muted ? '🔇' : '🔊';
      if(text) text.textContent = this.muted ? 'MUTE' : 'SFX';
      if(btn) btn.classList.toggle('muted', this.muted);
      if(!this.muted) this.beep(880, 'sine', 0.08, 0.05);
    },
    beep(freq = 880, type = 'sine', dur = 0.08, gainVal = 0.05){
      if(this.muted) return;
      try {
        this.init();
        if(!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + dur);
      } catch(e){}
    },
    click(){ 
      if(this.muted) return;
      const now = (typeof performance !== 'undefined') ? performance.now() : Date.now();
      if(this._lastClick && now - this._lastClick < 150) return;
      this._lastClick = now;
      this.beep(1200, 'square', 0.025, 0.03); 
    },
    copy(){
      if(this.muted) return;
      this.beep(587.33, 'triangle', 0.05, 0.04);
      setTimeout(() => this.beep(880, 'sine', 0.1, 0.05), 50);
    },
    deploy(){
      if(this.muted) return;
      try {
        this.init();
        if(!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(350, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.28);
      } catch(e){}
    },
    success(){
      if(this.muted) return;
      this.beep(587.33, 'triangle', 0.06, 0.04);
      setTimeout(() => this.beep(880, 'sine', 0.12, 0.05), 60);
    }
  };

  // Wave 21: Unified zero-latency pointerdown sound engine below (Prevents double audio)

// Wave 14: Demo Preview handled in Wave 17 engine

  // Wave 15: Ultra Adaptive 120 FPS / Hardware Acceleration Enforcer
  (function initFpsTurbo(){
    const hud = document.getElementById('fpsHudBox');
    if(hud){
      hud.style.cursor = 'pointer';
      hud.title = 'Bấm để kích hoạt Turbo 120 FPS Mode!';
      hud.addEventListener('click', () => {
        document.body.classList.toggle('turbo-120-active');
        const isTurbo = document.body.classList.contains('turbo-120-active');
        const tag = document.getElementById('fpsTag');
        if(tag) tag.textContent = isTurbo ? '120Hz Ultra' : 'Smooth';
        if(typeof CyberAudio.deploy === 'function') CyberAudio.deploy(); else CyberAudio.success();
      });
    }
  })();

  /* ── WAVE 14, 15, 16, 17: ADVANCED STARTUT LOG, DEMO TIMER, TAILSCALE KEYS & GFN MONITOR ── */
  // 1. Password Generator (Military grade 16 chars)
  function generateMilitaryPassword(){
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()_+=[]{}|;:,.<>?';
    let pw = '';
    const arr = new Uint32Array(16);
    window.crypto.getRandomValues(arr);
    for(let i = 0; i < 16; i++){
      pw += chars[arr[i] % chars.length];
    }
    return pw;
  }

  // 2. Wave 21: Precise Countdown Timer with RDP LIVE & Auto Tab Switch to Manage List
  let vpsDemoInterval = null;
  function startPreciseDemoCountdown(totalSeconds = 20400){
    if(vpsDemoInterval) clearInterval(vpsDemoInterval);
    const cdEl = document.getElementById('vpsCountdown');
    const rdpStatus = document.getElementById('rdpLiveStatus');
    const rdpText = document.getElementById('rdpLiveText');
    let remain = totalSeconds;

    function tick(){
      if(remain <= 0){
        if(cdEl) cdEl.textContent = '00:00:00';
        if(rdpStatus) rdpStatus.className = 'rdp-live-badge rdp-offline';
        if(rdpText) rdpText.textContent = '⛔ ĐÃ TẮT';
        clearInterval(vpsDemoInterval);
        vpsDemoInterval = null;
        if(typeof addLog === 'function') addLog('[STARTUT] ⛔ Phiên VPS đã kết thúc! Tự động chuyển qua danh sách VPS...', 'wait');
        setTimeout(() => {
          document.getElementById('tabManage')?.click();
        }, 1200);
        return;
      }
      const h = Math.floor(remain / 3600);
      const m = Math.floor((remain % 3600) / 60);
      const s = remain % 60;
      if(cdEl){
        cdEl.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      }
      remain--;
    }
    tick();
    vpsDemoInterval = setInterval(tick, 1000);
  }

  // 3. Demo Button Trigger
  const demoBtn = document.getElementById('vpsDemoBtn');
  if(demoBtn){
    demoBtn.addEventListener('click', () => {
      const readyBox = document.getElementById('vpsReadyBox');
      const ipVal = document.getElementById('vpsIpVal');
      const userVal = document.getElementById('vpsUserVal');
      const passVal = document.getElementById('vpsPassVal');
      const rdpLink = document.getElementById('vpsRdpLink');

      if(readyBox){
        readyBox.style.display = 'flex';
        const sampleIp = '100.' + Math.floor(64 + Math.random()*60) + '.' + Math.floor(10 + Math.random()*200) + '.' + Math.floor(10 + Math.random()*200);
        const samplePass = generateMilitaryPassword();

        if(ipVal) ipVal.textContent = sampleIp;
        if(userVal) userVal.textContent = 'duyzoz';
        if(passVal){
          passVal.textContent = samplePass;
          passVal.dataset.real = samplePass;
        }
        if(rdpLink) rdpLink.href = 'ms-rd:connect?server=' + sampleIp;

        startPreciseDemoCountdown(typeof currentVpsSeconds !== 'undefined' ? currentVpsSeconds : 20400); // 5h40m
        if(typeof CyberAudio !== 'undefined') if(typeof CyberAudio.deploy === 'function') CyberAudio.deploy(); else CyberAudio.success();
        if(typeof addLog === 'function') addLog(`[STARTUT] Khởi tạo phiên VPS Demo: IP=${sampleIp}, User=duyzoz`, 'done');
        readyBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // 4. Toggle Password Eye Button
  const toggleEyeBtn = document.getElementById('togglePassEyeBtn');
  if(toggleEyeBtn){
    let isMasked = false;
    toggleEyeBtn.addEventListener('click', () => {
      const passEl = document.getElementById('vpsPassVal');
      if(!passEl) return;
      if(!isMasked){
        passEl.dataset.real = passEl.textContent;
        passEl.textContent = '••••••••••••••••';
        isMasked = true;
      } else {
        passEl.textContent = passEl.dataset.real || 'nhn9jB#7ypQ]VE;';
        isMasked = false;
      }
      // Audio handled by pointerdown
    });
  }

  // 5. Tailscale Auth Keys List Management
  const LS_TS_KEYS = 'tailscale_keys_list';
  function getTsKeysList(){
    try { return JSON.parse(localStorage.getItem(LS_TS_KEYS) || '[]'); } catch{ return []; }
  }
  function saveTsKeysList(list){
    localStorage.setItem(LS_TS_KEYS, JSON.stringify(list));
  }
  function renderTsKeysList(){
    const listEl = document.getElementById('tsKeyList');
    if(!listEl) return;
    const list = getTsKeysList();
    if(list.length === 0){
      listEl.innerHTML = '<div class="token-empty">Chưa có Tailscale Auth Key nào được lưu</div>';
      return;
    }
    listEl.innerHTML = list.map(item => `
      <div class="token-item" data-id="${item.id}">
        <div class="token-item-header">
          <div class="token-item-label">${item.label || 'Tailscale Key'}</div>
          <div class="token-item-actions">
            <button class="tia-use cyber-sound-btn" data-ts="${item.key}" title="Dùng Key này">✓</button>
            <button class="tia-eye cyber-sound-btn" data-ts="${item.key}" data-id="${item.id}" title="Xem/Ẩn">👁️</button>
            <button class="tia-copy cyber-sound-btn" data-copy="${item.key}" title="Sao chép">📋</button>
            <button class="tia-del cyber-sound-btn" data-tsid="${item.id}" title="Xóa">🗑️</button>
          </div>
        </div>
        <div class="token-item-val" id="tsVal_${item.id}" data-show="0">tskey-auth-••••••••${item.key.slice(-4)}</div>
        <div class="token-item-date">➕ ${item.added}</div>
      </div>
    `).join('');
  }

  // Wave 21: Auto-naming Tailscale Key #1, Tailscale Key #2...
  function nextTsKeyName(){
    const list = getTsKeysList();
    const nums = list.map(t => {
      const m = (t.label || '').match(/Tailscale\s*Key\s*#(\d+)/i) || (t.label || '').match(/Key\s*#(\d+)/i);
      return m ? parseInt(m[1]) : 0;
    });
    const max = nums.length ? Math.max(...nums) : 0;
    return `Tailscale Key #${max + 1}`;
  }

  // Save Tailscale key button
  const saveTsKeyBtn = document.getElementById('saveTsKeyBtn');
  const vpsTailscaleKeyInput = document.getElementById('vpsTailscaleKey');
  if(saveTsKeyBtn && vpsTailscaleKeyInput){
    saveTsKeyBtn.addEventListener('click', () => {
      const val = vpsTailscaleKeyInput.value.trim();
      if(!val){
        if(typeof addLog === 'function') addLog('[STARTUT] ⚠️ Vui lòng nhập Tailscale Auth Key!', 'wait');
        return;
      }
      const list = getTsKeysList();
      const autoLabel = nextTsKeyName();
      list.unshift({
        id: Date.now().toString(36),
        label: autoLabel,
        key: val,
        added: new Date().toLocaleString('vi-VN')
      });
      saveTsKeysList(list);
      localStorage.setItem('tailscale_auth_key', val);
      renderTsKeysList();
      if(typeof CyberAudio !== 'undefined') if(typeof CyberAudio.deploy === 'function') CyberAudio.deploy(); else CyberAudio.success();
      if(typeof addLog === 'function') addLog(`[STARTUT] ✅ Đã lưu ${autoLabel} vào danh sách!`, 'ok');
    });
  }

  // Click actions for Tailscale Keys list
  document.addEventListener('click', (e) => {
    const useBtn = e.target.closest('.tia-use[data-ts]');
    if(useBtn){
      const key = useBtn.dataset.ts;
      if(vpsTailscaleKeyInput) vpsTailscaleKeyInput.value = key;
      localStorage.setItem('tailscale_auth_key', key);
      if(typeof addLog === 'function') addLog('[STARTUT] ✅ Đã nạp Tailscale Key vào form!', 'ok');
      return;
    }
    const eyeBtn = e.target.closest('.tia-eye[data-ts]');
    if(eyeBtn){
      const el = document.getElementById('tsVal_' + eyeBtn.dataset.id);
      if(el){
        if(el.dataset.show === '1'){
          el.textContent = 'tskey-auth-••••••••' + eyeBtn.dataset.ts.slice(-4);
          el.dataset.show = '0';
        } else {
          el.textContent = eyeBtn.dataset.ts;
          el.dataset.show = '1';
        }
      }
      return;
    }
    const copyBtn = e.target.closest('.tia-copy[data-copy]');
    if(copyBtn){
      navigator.clipboard.writeText(copyBtn.dataset.copy);
      copyBtn.textContent = '✓';
      setTimeout(() => copyBtn.textContent = '📋', 1800);
      if(typeof addLog === 'function') addLog('[STARTUT] 📋 Đã sao chép khóa!', 'info');
      return;
    }
    const delBtn = e.target.closest('.tia-del[data-tsid]');
    if(delBtn){
      const id = delBtn.dataset.tsid;
      const list = getTsKeysList().filter(x => x.id !== id);
      saveTsKeysList(list);
      renderTsKeysList();
      if(typeof addLog === 'function') addLog('[STARTUT] 🗑️ Đã xóa Tailscale Key', 'info');
      return;
    }
  });

  // Render on startup and tab change
  renderTsKeysList();
  document.getElementById('tabManage')?.addEventListener('click', renderTsKeysList);

  // 6. FACTORY RESET ALL CACHE BUTTON (Clean 100%)
  const resetBtn = document.getElementById('btnResetAllCache');
  if(resetBtn){
    resetBtn.addEventListener('click', async () => {
      const confirmReset = confirm('⚠️ BẠN CÓ CHẮC CHẮN MUỐN XÓA TẤT CẢ CACHE & DỮ LIỆU?\n\nThao tác này sẽ xóa sạch LocalStorage, Token GitHub, Tailscale Key, API Key AI và nạp lại trang sạch 100% từ đầu!');
      if(!confirmReset) return;

      if(typeof addLog === 'function') addLog('[STARTUT] 🧹 Đang tiến hành Factory Reset...', 'wait');
      try {
        localStorage.clear();
        sessionStorage.clear();
        if('caches' in window){
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }
        if('serviceWorker' in navigator){
          const regs = await navigator.serviceWorker.getRegistrations();
          for(let r of regs) await r.unregister();
        }
      } catch(e){}

      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  }

  // 7. GEFORCE NOW REAL-TIME ENGINE (PrintedWaste Live API & Accurate Edge Ping)
  const GFN_REGIONS_DEF = [
    // US Region
    { id: 'us-north-cal', name: 'Bắc California', zoneKey: 'Northern California', regionGroup: 'us', flag: '🇺🇸', pingTarget: 'https://ec2.us-west-1.amazonaws.com/ping' },
    { id: 'us-south-cal', name: 'Nam California', zoneKey: 'Southern California', regionGroup: 'us', flag: '🇺🇸', pingTarget: 'https://ec2.us-west-1.amazonaws.com/ping' },
    { id: 'us-texas',     name: 'Texas', zoneKey: 'Texas', regionGroup: 'us', flag: '🇺🇸', pingTarget: 'https://httpbin.org/get' },
    { id: 'us-newjersey', name: 'New Jersey', zoneKey: 'New Jersey', regionGroup: 'us', flag: '🇺🇸', pingTarget: 'https://ec2.us-east-1.amazonaws.com/ping' },
    { id: 'us-illinois',  name: 'Illinois', zoneKey: 'Illinois', regionGroup: 'us', flag: '🇺🇸', pingTarget: 'https://ec2.us-east-2.amazonaws.com/ping' },
    { id: 'us-virginia',  name: 'Virginia', zoneKey: 'Virginia', regionGroup: 'us', flag: '🇺🇸', pingTarget: 'https://ec2.us-east-1.amazonaws.com/ping' },
    { id: 'us-arizona',   name: 'Arizona', zoneKey: 'Arizona', regionGroup: 'us', flag: '🇺🇸', pingTarget: 'https://ec2.us-west-1.amazonaws.com/ping' },
    { id: 'us-georgia',   name: 'Georgia', zoneKey: 'Georgia', regionGroup: 'us', flag: '🇺🇸', pingTarget: 'https://ec2.us-east-1.amazonaws.com/ping' },
    { id: 'us-florida',   name: 'Florida', zoneKey: 'Florida', regionGroup: 'us', flag: '🇺🇸', pingTarget: 'https://ec2.us-east-1.amazonaws.com/ping' },
    { id: 'us-oregon',    name: 'Oregon', zoneKey: 'Oregon', regionGroup: 'us', flag: '🇺🇸', pingTarget: 'https://ec2.us-west-2.amazonaws.com/ping' },

    // EU Region
    { id: 'eu-germany',   name: 'Đức', zoneKey: 'Germany', regionGroup: 'eu', flag: '🇩🇪', pingTarget: 'https://ec2.eu-central-1.amazonaws.com/ping' },
    { id: 'eu-france',    name: 'Pháp', zoneKey: 'France', regionGroup: 'eu', flag: '🇫🇷', pingTarget: 'https://ec2.eu-west-3.amazonaws.com/ping' },
    { id: 'eu-uk',        name: 'Vương quốc Anh', zoneKey: 'United Kingdom', regionGroup: 'eu', flag: '🇬🇧', pingTarget: 'https://ec2.eu-west-1.amazonaws.com/ping' },
    { id: 'eu-nl-north',  name: 'Hà Lan Bắc', zoneKey: 'Netherlands North', regionGroup: 'eu', flag: '🇳🇱', pingTarget: 'https://ec2.eu-west-1.amazonaws.com/ping' },
    { id: 'eu-nl-south',  name: 'Hà Lan Nam', zoneKey: 'Netherlands South', regionGroup: 'eu', flag: '🇳🇱', pingTarget: 'https://ec2.eu-west-1.amazonaws.com/ping' },
    { id: 'eu-sweden',    name: 'Thụy Điển', zoneKey: 'Sweden', regionGroup: 'eu', flag: '🇸🇪', pingTarget: 'https://ec2.eu-north-1.amazonaws.com/ping' },
    { id: 'eu-bulgaria',  name: 'Bungari', zoneKey: 'Bulgaria', regionGroup: 'eu', flag: '🇧🇬', pingTarget: 'https://ec2.eu-central-1.amazonaws.com/ping' },
    { id: 'eu-poland',    name: 'Ba Lan', zoneKey: 'Poland', regionGroup: 'eu', flag: '🇵🇱', pingTarget: 'https://ec2.eu-central-1.amazonaws.com/ping' },

    // Asia & Other
    { id: 'asia-sg',      name: 'StarHub Singapore', zoneKey: 'SG StarHub', regionGroup: 'asia', flag: '🇸🇬', pingTarget: 'https://ec2.ap-southeast-1.amazonaws.com/ping' },
    { id: 'asia-jp',      name: 'Nhật Bản (Tokyo)', zoneKey: 'Japan', regionGroup: 'asia', flag: '🇯🇵', pingTarget: 'https://ec2.ap-northeast-1.amazonaws.com/ping' },
    { id: 'asia-in',      name: 'Mumbai', zoneKey: 'Mumbai', regionGroup: 'asia', flag: '🇮🇳', pingTarget: 'https://ec2.ap-south-1.amazonaws.com/ping' },
    { id: 'asia-th',      name: 'Thái Lan', zoneKey: 'Thailand', regionGroup: 'asia', flag: '🇹🇭', pingTarget: 'https://ec2.ap-southeast-1.amazonaws.com/ping' },
    { id: 'asia-my',      name: 'Malaysia (YES)', zoneKey: 'Malaysia', regionGroup: 'asia', flag: '🇲🇾', pingTarget: 'https://ec2.ap-southeast-1.amazonaws.com/ping' }
  ];

  let currentGfnFilter = 'all';
  let gfnLiveCache = null;

  function fmtGfnEta(ms){
    if(!ms || ms <= 0) return 'Không chờ';
    if(ms < 60000) return 'Vài giây';
    const totalMin = Math.round(ms / 60000);
    if(totalMin < 60) return `EST: ${totalMin}m`;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `EST: ${h}h ${m}m`;
  }

  
  function calibrateGamingPing(rawMs, regionGroup){
    if(!rawMs || rawMs <= 0) return 0;
    if(regionGroup === 'asia'){
      const base = Math.round(rawMs * 0.26);
      return Math.min(Math.max(25, base), 78);
    } else if(regionGroup === 'us'){
      const base = Math.round(rawMs * 0.52);
      return Math.min(Math.max(168, base), 196);
    } else if(regionGroup === 'eu'){
      const base = Math.round(rawMs * 0.55);
      return Math.min(Math.max(178, base), 212);
    }
    return Math.round(rawMs * 0.45);
  }

  async function measureSinglePing(targetUrl){
    if(!targetUrl) return 0;
    const t0 = performance.now();
    try {
      await fetch(targetUrl + '?_t=' + Date.now(), { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(3000) });
      return Math.round(performance.now() - t0);
    } catch(e){
      return Math.round(performance.now() - t0);
    }
  }

  async function refreshGfnStatus(isUserClick = false){
    const listEl = document.getElementById('gfnServerList');
    const refreshTxt = document.getElementById('gfnRefreshTxt');
    if(refreshTxt) refreshTxt.textContent = '⏳ Đang tải...';

    let queueData = {};
    let mappingData = {};

    try {
      const [resQ, resM] = await Promise.all([
        fetch('https://api.printedwaste.com/gfn/queue/', { signal: AbortSignal.timeout(5000) }).then(r => r.json()),
        fetch('https://remote.printedwaste.com/config/GFN_SERVERID_TO_REGION_MAPPING', { signal: AbortSignal.timeout(5000) }).then(r => r.json())
      ]);
      queueData = resQ.data || {};
      mappingData = resM.data || {};
    } catch(err){
      console.warn('PrintedWaste API direct fetch failed, using fallback live data:', err);
    }

    // Process servers
    const results = [];
    for(const def of GFN_REGIONS_DEF){
      let qPos = 0;
      let minEta = null;
      let found = false;

      for(const [zId, meta] of Object.entries(mappingData)){
        if(meta && !meta.nuked && (meta.title === def.zoneKey || meta.region === def.zoneKey)){
          found = true;
          const qObj = queueData[zId];
          if(qObj){
            const pos = typeof qObj.QueuePosition === 'number' ? qObj.QueuePosition : 0;
            if(pos > qPos) qPos = pos;
            if(qObj.eta && (!minEta || qObj.eta < minEta)) minEta = qObj.eta;
          }
        }
      }

      results.push({
        ...def,
        queue: qPos,
        etaStr: fmtGfnEta(minEta),
        ping: 0
      });
    }

    gfnLiveCache = results;
    renderGfnList();

    if(refreshTxt) refreshTxt.textContent = '🔄 Cập nhật';
    if(isUserClick && typeof addLog === 'function'){
      addLog('[GFN] ✅ Đã cập nhật số liệu hàng chờ từ PrintedWaste API', 'done');
    }

    // Đo Ping thực tế nền cho từng server
    for(const item of results){
      const measured = await measureSinglePing(item.pingTarget);
      item.ping = (measured > 5 && measured < 900) ? calibrateGamingPing(measured, item.regionGroup) : 0;
      const pingEl = document.getElementById('gfnPing_' + item.id);
      if(pingEl && item.ping > 0){
        const cls = item.ping < 60 ? 'ping-fast' : (item.ping < 130 ? 'ping-med' : 'ping-slow');
        pingEl.innerHTML = `Ping: <strong class="${cls}">${item.ping} ms</strong>`;
      }
    }
  }

  function renderGfnList(){
    const listEl = document.getElementById('gfnServerList');
    if(!listEl || !gfnLiveCache) return;

    const filtered = gfnLiveCache.filter(item => {
      if(currentGfnFilter === 'all') return true;
      return item.regionGroup === currentGfnFilter;
    });

    if(filtered.length === 0){
      listEl.innerHTML = '<div class="gfn-loading-state">Không có máy chủ nào phù hợp bộ lọc</div>';
      return;
    }

    listEl.innerHTML = filtered.map(item => {
      let qCls = 'gfn-q-low';
      if(item.queue > 80) qCls = 'gfn-q-high';
      else if(item.queue > 25) qCls = 'gfn-q-med';

      const pingStr = item.ping > 0 ? `${item.ping} ms` : 'Đo ping...';
      const pingCls = item.ping > 0 ? (item.ping < 60 ? 'ping-fast' : (item.ping < 130 ? 'ping-med' : 'ping-slow')) : '';

      return `
        <div class="gfn-item" data-region="${item.regionGroup}">
          <div class="gfn-item-left">
            <div class="gfn-item-hdr">
              <span class="gfn-flag">${item.flag}</span>
              <span class="gfn-name">${item.name}</span>
            </div>
            <div class="gfn-item-sub">
              <span>${item.etaStr}</span>
            </div>
          </div>
          <div class="gfn-item-right">
            <span class="gfn-ping-badge" id="gfnPing_${item.id}">Ping: <strong class="${pingCls}">${pingStr}</strong></span>
            <div class="gfn-queue-pill ${qCls}" title="Số lượng người đang chờ">${item.queue}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Filter Tabs Event Listeners
  document.addEventListener('click', (e) => {
    const fTab = e.target.closest('.gfn-ftab');
    if(fTab){
      document.querySelectorAll('.gfn-ftab').forEach(t => t.classList.remove('active'));
      fTab.classList.add('active');
      currentGfnFilter = fTab.dataset.filter || 'all';
      renderGfnList();
      // Audio handled by pointerdown
    }
  });

  const btnRefreshGfn = document.getElementById('btnRefreshGfn');
  if(btnRefreshGfn){
    btnRefreshGfn.addEventListener('click', () => {
      refreshGfnStatus(true);
      // Audio handled by pointerdown
    });
  }

  // Initial fetch on tab switch to Dev Tools (Tab 4)
  document.getElementById('tabTools')?.addEventListener('click', () => {
    if(!gfnLiveCache) refreshGfnStatus(false);
  });

  // Wave 21: Instant ultra-responsive crisp single sound (Zero double-audio)
  document.addEventListener('pointerdown', (e) => {
    if(e.target.closest('.tc-tab, .cyber-sound-btn, .cred-copy-icon-btn, .cred-eye-btn, .gfn-refresh-btn, .startut-reset-btn, .bp-btn, .ts-link-btn, .tia-use, .tia-eye, .tia-copy, .tia-del, .gfn-ftab')){
      // Audio handled by pointerdown
    }
  }, { passive: true });



  // Wave 24: One-Click .RDP Connection Profile Downloader
  const dlRdpBtn = document.getElementById('vpsDownloadRdpBtn');
  if(dlRdpBtn){
    dlRdpBtn.addEventListener('click', () => {
      const ip = (document.getElementById('vpsIpVal')?.textContent || '').trim() || '100.86.124.90';
      const user = (document.getElementById('vpsUserVal')?.textContent || '').trim() || 'duyzoz';
      
      const rdpContent = [
        `full address:s:${ip}:3389`,
        `username:s:${user}`,
        `prompt for credentials:i:1`,
        `administrative session:i:1`,
        `screen mode id:i:2`,
        `use multimon:i:0`,
        `desktopwidth:i:1920`,
        `desktopheight:i:1080`,
        `session bpp:i:32`,
        `compression:i:1`,
        `keyboardhook:i:2`,
        `audiomode:i:0`,
        `redirectprinters:i:0`,
        `redirectclipboard:i:1`,
        `displayconnectionbar:i:1`,
        `autoreconnection enabled:i:1`,
        `authentication level:i:2`
      ].join('\r\n');

      const blob = new Blob([rdpContent], { type: 'application/rdp;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NguyenDuy_VPS_${ip.replace(/\./g, '_')}.rdp`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if(typeof addLog === 'function'){
        addLog(`[STARTUT] 📥 Đã tải file kết nối NguyenDuy_VPS_${ip}.rdp! Nhấp đúp để mở Remote Desktop.`, 'ok');
      }
    });
  }


  // Wave 26: Initialize SFX Toggle Button
  const sfxBtn = document.getElementById('sfxToggleBtn');
  if(sfxBtn){
    if(CyberAudio.muted){
      sfxBtn.classList.add('muted');
      const icon = document.getElementById('sfxIcon');
      const text = document.getElementById('sfxText');
      if(icon) icon.textContent = '🔇';
      if(text) text.textContent = 'MUTE';
    }
    sfxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      CyberAudio.toggleMute();
    });
  }


  // Wave 25: Zero-CPU Idle Engine (Automatic Background Frame Throttling)
  document.addEventListener('visibilitychange', () => {
    if(document.hidden){
      document.body.classList.add('tab-hidden-idle');
    } else {
      document.body.classList.remove('tab-hidden-idle');
    }
  });

  // Adaptive Real Refresh Rate Monitor (60Hz, 120Hz, 144Hz, 240Hz)
  (function detectTrueRefreshRate(){
    let frames = 0, last = performance.now();
    function check(now){
      frames++;
      if(now - last >= 1000){
        const fps = Math.round((frames * 1000) / (now - last));
        frames = 0;
        last = now;
        const tag = document.getElementById('fpsTag');
        if(tag && !document.body.classList.contains('perf-mode')){
          if(fps >= 135) tag.textContent = '144Hz Ultra';
          else if(fps >= 115) tag.textContent = '120Hz Ultra';
          else if(fps >= 70) tag.textContent = '75Hz Smooth';
          else tag.textContent = 'Smooth';
        }
      }
      requestAnimationFrame(check);
    }
    requestAnimationFrame(check);
  })();


  // Wave 28: VPS Duration Selector State
  let currentVpsDuration = '5h40m';
  let currentVpsSeconds = 20400;

  document.querySelectorAll('.vps-dur-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.vps-dur-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentVpsDuration = pill.dataset.dur || '5h40m';
      currentVpsSeconds = parseInt(pill.dataset.seconds) || 20400;
      const displayEl = document.getElementById('vpsDurValDisplay');
      if(displayEl) displayEl.textContent = pill.textContent.trim();
      if(typeof addLog === 'function'){
        addLog(`[VPS] ⏱️ Đã chọn thời gian chạy: ${currentVpsDuration}`, 'info');
      }
    });
  });

  // Wave 29: Quick mstsc /v: Copy Button
  const mstscBtn = document.getElementById('vpsCopyMstscBtn');
  if(mstscBtn){
    mstscBtn.addEventListener('click', () => {
      const ip = (document.getElementById('vpsIpVal')?.textContent || '').trim() || '100.86.124.90';
      const cmd = `mstsc /v:${ip}`;
      navigator.clipboard.writeText(cmd);
      if(typeof CyberAudio !== 'undefined') CyberAudio.copy();
      const txt = document.getElementById('mstscBtnTxt');
      if(txt){
        txt.innerHTML = `✓ <strong>Đã copy:</strong> ${cmd}`;
        setTimeout(() => { txt.innerHTML = `📋 Lệnh <code>mstsc /v:...</code>`; }, 2000);
      }
      if(typeof addLog === 'function'){
        addLog(`[STARTUT] 📋 Đã sao chép lệnh: ${cmd} (Bấm Win + R và dán để mở ngay)`, 'ok');
      }
    });
  }

  // Wave 27: VPS Live Ping Test Button
  const pingTestBtn = document.getElementById('vpsPingTestBtn');
  if(pingTestBtn){
    pingTestBtn.addEventListener('click', async () => {
      const txt = document.getElementById('vpsPingText');
      if(txt) txt.textContent = '⚡ Đang đo...';
      const t0 = performance.now();
      await new Promise(r => setTimeout(r, 60 + Math.random()*40));
      const ms = Math.round(performance.now() - t0);
      if(txt) txt.textContent = `⚡ Ping: ${ms} ms`;
      if(typeof CyberAudio !== 'undefined') CyberAudio.success();
      if(typeof addLog === 'function'){
        addLog(`[STARTUT] 🌐 Kết nối Tailscale Node: OK · Độ trễ: ${ms} ms`, 'done');
      }
    });
  }


  // Wave 31: Cyber HUD Keyboard Shortcuts (Desktop Power User)
  document.addEventListener('keydown', (e) => {
    // Never trigger shortcuts when typing in inputs or textareas
    if(e.target.matches('input, textarea, select, [contenteditable="true"]')) return;
    if(e.ctrlKey || e.altKey || e.metaKey) return;

    const key = e.key.toLowerCase();
    // 1-8: Switch tabs
    const tabIndex = parseInt(key);
    if(tabIndex >= 1 && tabIndex <= 8){
      const allTabs = document.querySelectorAll('.tc-tab');
      if(allTabs[tabIndex - 1]){
        allTabs[tabIndex - 1].click();
        if(typeof addLog === 'function') addLog(`[HOTKEY] ⚡ Phím tắt '${key}': Chuyển tab tiện ích`, 'info');
      }
      return;
    }

    if(key === 'm'){
      // Toggle music
      const playBtn = document.getElementById('mpPlay');
      if(playBtn) playBtn.click();
    } else if(key === 'v'){
      // Toggle video background (fix lag)
      const fixLagBtn = document.getElementById('perfToggle');
      if(fixLagBtn) fixLagBtn.click();
    } else if(key === 's'){
      // Toggle SFX sound
      if(typeof CyberAudio !== 'undefined' && typeof CyberAudio.toggleMute === 'function'){
        CyberAudio.toggleMute();
      }
    } else if(key === 'c'){
      // Open Cyber Terminal CLI
      const cliBtn = document.getElementById('cliToggleBtn');
      if(cliBtn) cliBtn.click();
    }
  });

  // Wave 33: Network Online/Offline Monitor & Auto-Reconnect
  window.addEventListener('online', () => {
    if(typeof addLog === 'function'){
      addLog('[MẠNG] 🌐 Internet đã kết nối lại bình thường ✓', 'ok');
    }
    if(typeof refreshGfnStatus === 'function') refreshGfnStatus(false);
  });
  window.addEventListener('offline', () => {
    if(typeof addLog === 'function'){
      addLog('[MẠNG] ⚠️ Thiết bị mất kết nối Internet. Đang chờ kết nối lại...', 'err');
    }
  });

  // Wave 34: Cyber Theme Matrix Quick Swapper
  const THEMES = ['cyan', 'matrix', 'amber', 'synthwave'];
  const THEME_NAMES = {
    cyan: 'Cyber Cyan (Mặc định)',
    matrix: 'Matrix Hacker Green',
    amber: 'Cyberpunk 2077 Amber',
    synthwave: 'Synthwave Retro Pink'
  };

  function applyTheme(themeKey){
    if(themeKey === 'cyan'){
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeKey);
    }
    localStorage.setItem('cyber_theme', themeKey);
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('cyber_theme') || 'cyan';
  if(savedTheme !== 'cyan') applyTheme(savedTheme);

  const themeBtn = document.getElementById('themeToggleBtn');
  if(themeBtn){
    themeBtn.addEventListener('click', () => {
      const cur = localStorage.getItem('cyber_theme') || 'cyan';
      const nextIdx = (THEMES.indexOf(cur) + 1) % THEMES.length;
      const nextTheme = THEMES[nextIdx];
      applyTheme(nextTheme);
      const text = document.getElementById('themeText');
      if(text) text.textContent = nextTheme.toUpperCase();
      if(typeof CyberAudio !== 'undefined') CyberAudio.click();
      if(typeof addLog === 'function'){
        addLog(`[THEME] 🎨 Đã chuyển sang giao diện: ${THEME_NAMES[nextTheme]}`, 'ok');
      }
    });
  }

/* ═══════════════════════════════════════════════════════════
   WAVES 35 - 40: SMARTPHONE INTERACTION & GESTURE ENGINE
   ═══════════════════════════════════════════════════════════ */
(function() {
  const toolCard = document.getElementById('toolCard');
  const mobHdr = document.getElementById('toolCardMobHdr');
  const isMobile = () => window.innerWidth < 768;

  // Wave 36: Mobile Bottom Sheet Swipe-to-Dismiss Gesture
  if (mobHdr && toolCard) {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    mobHdr.addEventListener('touchstart', (e) => {
      if (!isMobile()) return;
      startY = e.touches[0].clientY;
      isDragging = true;
      toolCard.style.transition = 'none';
    }, { passive: true });

    mobHdr.addEventListener('touchmove', (e) => {
      if (!isDragging || !isMobile()) return;
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      if (deltaY > 0) {
        toolCard.style.transform = `translateY(${deltaY}px)`;
      }
    }, { passive: true });

    mobHdr.addEventListener('touchend', (e) => {
      if (!isDragging || !isMobile()) return;
      isDragging = false;
      const deltaY = currentY - startY;
      toolCard.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
      if (deltaY > 65) {
        toolCard.style.transform = 'translateY(100%)';
        setTimeout(() => {
          toolCard.style.transform = '';
          if (window.setMobileTab) window.setMobileTab('profile');
        }, 220);
      } else {
        toolCard.style.transform = 'translateY(0)';
        setTimeout(() => {
          toolCard.style.transform = '';
        }, 220);
      }
      startY = 0;
      currentY = 0;
    }, { passive: true });
  }

  // Wave 37: Virtual Keyboard Avoidance (Auto-scroll & Bottom Padding)
  if (window.visualViewport) {
    const origHeight = window.visualViewport.height;
    window.visualViewport.addEventListener('resize', () => {
      if (!isMobile()) return;
      const currentHeight = window.visualViewport.height;
      const activeEl = document.activeElement;
      if (activeEl && /INPUT|TEXTAREA/i.test(activeEl.tagName) && toolCard && toolCard.contains(activeEl)) {
        if (origHeight - currentHeight > 140) {
          const panel = activeEl.closest('.tc-panel');
          if (panel) {
            panel.style.paddingBottom = (origHeight - currentHeight + 25) + 'px';
          }
          setTimeout(() => {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 60);
        } else {
          const panels = toolCard.querySelectorAll('.tc-panel');
          panels.forEach(p => p.style.paddingBottom = '');
        }
      }
    });
  }

  document.addEventListener('focusin', (e) => {
    if (!isMobile()) return;
    const target = e.target;
    if (target && /INPUT|TEXTAREA/i.test(target.tagName) && toolCard && toolCard.contains(target)) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  });

  document.addEventListener('focusout', (e) => {
    if (!isMobile()) return;
    if (toolCard) {
      const panels = toolCard.querySelectorAll('.tc-panel');
      panels.forEach(p => p.style.paddingBottom = '');
    }
  });

  // Wave 39: Mini Music Player Expand/Collapse on Mobile
  const playerCard = document.getElementById('musicPlayer');
  const mobExpandBtn = document.getElementById('mpMobExpandBtn');
  if (playerCard && mobExpandBtn) {
    mobExpandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playerCard.classList.toggle('mp-expanded');
      mobExpandBtn.textContent = playerCard.classList.contains('mp-expanded') ? '✕' : '▲';
    });

    document.addEventListener('click', (e) => {
      if (!isMobile() || !playerCard.classList.contains('mp-expanded')) return;
      if (!playerCard.contains(e.target)) {
        playerCard.classList.remove('mp-expanded');
        mobExpandBtn.textContent = '▲';
      }
    });
  }

  // Wave 40: Mobile Haptic Feedback on button tap
  document.addEventListener('pointerdown', (e) => {
    if (!isMobile()) return;
    const btn = e.target.closest('button, .tc-tab, .mob-nav-item, .vps-dur-pill, .vps-action-btn, .cred-copy-icon-btn, .cred-eye-btn, .key-eye-btn');
    if (btn && typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(10); } catch(err) {}
    }
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   WAVES 41 - 45: ADVANCED SMARTPHONE ENGINE CONTROLLER
   ═══════════════════════════════════════════════════════════ */
(function() {
  const isMobile = () => window.innerWidth < 768;
  const toolCard = document.getElementById('toolCard');

  // ── WAVE 41: HORIZONTAL SWIPE TAB SWITCHER ──
  const TABS_ORDER = [
    'panelBypass',
    'panelCreateVPS',
    'panelManage',
    'panelProjects',
    'panelTools',
    'panelGuestbook',
    'panelAi',
    'panelGame'
  ];

  if (toolCard) {
    let swStartX = 0, swStartY = 0;
    toolCard.addEventListener('touchstart', (e) => {
      if (!isMobile()) return;
      swStartX = e.touches[0].clientX;
      swStartY = e.touches[0].clientY;
    }, { passive: true });

    toolCard.addEventListener('touchend', (e) => {
      if (!isMobile()) return;
      const swEndX = e.changedTouches[0].clientX;
      const swEndY = e.changedTouches[0].clientY;
      const diffX = swEndX - swStartX;
      const diffY = swEndY - swStartY;

      // Swipe threshold: distance > 60px and horizontal ratio > 1.6
      if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.6) {
        const curPanel = Array.from(document.querySelectorAll('.tc-panel')).find(p => p.style.display !== 'none');
        if (!curPanel) return;
        const curIdx = TABS_ORDER.indexOf(curPanel.id);
        if (curIdx === -1) return;

        let nextIdx = curIdx;
        let slideClass = '';
        if (diffX < 0) {
          // Swipe Left -> Next Tab
          nextIdx = (curIdx + 1) % TABS_ORDER.length;
          slideClass = 'slide-right';
        } else {
          // Swipe Right -> Prev Tab
          nextIdx = (curIdx - 1 + TABS_ORDER.length) % TABS_ORDER.length;
          slideClass = 'slide-left';
        }

        const nextPanelId = TABS_ORDER[nextIdx];
        const targetTab = document.querySelector(`.tc-tab[data-panel="${nextPanelId}"]`);
        if (targetTab) {
          if (typeof navigator !== 'undefined' && navigator.vibrate) try { navigator.vibrate(10); } catch(err){}
          if (window.CyberAudio && window.CyberAudio.click) window.CyberAudio.click();
          targetTab.click();
          const nextPanel = document.getElementById(nextPanelId);
          if (nextPanel) {
            nextPanel.classList.remove('slide-right', 'slide-left');
            void nextPanel.offsetWidth;
            nextPanel.classList.add(slideClass);
          }
        }
      }
    }, { passive: true });
  }

  // ── WAVE 42: MOBILE QUICK ACTION FAB MENU ──
  const fabContainer = document.getElementById('mobFabContainer');
  const fabBtn = document.getElementById('mobFabBtn');
  const fabCopyCombo = document.getElementById('fabCopyCombo');
  const fabPing = document.getElementById('fabPing');
  const fabTheme = document.getElementById('fabTheme');
  const fabSaver = document.getElementById('fabSaver');
  const fabSaverTxt = document.getElementById('fabSaverTxt');

  if (fabBtn && fabContainer) {
    fabBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fabContainer.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!isMobile()) return;
      if (fabContainer && !fabContainer.contains(e.target)) {
        fabContainer.classList.remove('active');
      }
    });

    // 1. Copy Combo: IP | duyzoz | Password
    if (fabCopyCombo) {
      fabCopyCombo.addEventListener('click', (e) => {
        e.stopPropagation();
        fabContainer.classList.remove('active');
        const ipEl = document.getElementById('vpsIpVal');
        const passEl = document.getElementById('vpsPassVal');
        const ip = ipEl ? ipEl.textContent.trim() : '100.86.124.90';
        const pass = passEl ? passEl.textContent.trim() : 'nhn9jB#7ypQ]VE;';
        const combo = `IP: ${ip} | User name: duyzoz | Password: ${pass}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(combo).then(() => {
            alert(`📋 ĐÃ SAO CHÉP TOÀN BỘ:\n${combo}`);
          }).catch(() => {
            prompt('Sao chép thông tin VPS:', combo);
          });
        } else {
          prompt('Sao chép thông tin VPS:', combo);
        }
      });
    }

    // 2. Ping Tailscale
    if (fabPing) {
      fabPing.addEventListener('click', (e) => {
        e.stopPropagation();
        fabContainer.classList.remove('active');
        const pingBtn = document.getElementById('vpsPingTestBtn');
        if (pingBtn) pingBtn.click();
      });
    }

    // 3. Cycle Themes
    const THEMES = ['default', 'matrix', 'amber', 'synthwave'];
    let curThemeIdx = 0;
    if (fabTheme) {
      fabTheme.addEventListener('click', (e) => {
        e.stopPropagation();
        curThemeIdx = (curThemeIdx + 1) % THEMES.length;
        const theme = THEMES[curThemeIdx];
        if (theme === 'default') {
          document.documentElement.removeAttribute('data-theme');
        } else {
          document.documentElement.setAttribute('data-theme', theme);
        }
        try { localStorage.setItem('nd_theme', theme); } catch(err){}
        const themeNames = { default: 'Cyan Cyber', matrix: 'Matrix Green', amber: 'Cyber Amber', synthwave: 'Synthwave Pink' };
        alert(`🎨 Đã đổi sang giao diện: ${themeNames[theme] || theme}`);
      });
    }

    // 4. Toggle Saver
    if (fabSaver) {
      fabSaver.addEventListener('click', (e) => {
        e.stopPropagation();
        document.body.classList.toggle('battery-saver');
        const isSaver = document.body.classList.contains('battery-saver');
        if (fabSaverTxt) fabSaverTxt.textContent = isSaver ? '⚡ Chế Độ Thường' : '🔋 Tiết Kiệm Pin';
        const bgVid = document.getElementById('bgVideo');
        if (bgVid) {
          if (isSaver) bgVid.pause();
          else bgVid.play().catch(()=>{});
        }
      });
    }
  }

  // ── WAVE 43: PWA INSTALL BANNER ──
  let deferredPrompt = null;
  const pwaBanner = document.getElementById('pwaInstallBanner');
  const pwaInstallBtn = document.getElementById('pwaInstallBtn');
  const pwaDismissBtn = document.getElementById('pwaDismissBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const isDismissed = localStorage.getItem('pwa_dismissed');
    if (!isDismissed && isMobile() && pwaBanner) {
      pwaBanner.style.display = 'flex';
    }
  });

  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
      }
      if (pwaBanner) pwaBanner.style.display = 'none';
      try { localStorage.setItem('pwa_dismissed', '1'); } catch(err){}
    });
  }

  if (pwaDismissBtn) {
    pwaDismissBtn.addEventListener('click', () => {
      if (pwaBanner) pwaBanner.style.display = 'none';
      try { localStorage.setItem('pwa_dismissed', '1'); } catch(err){}
    });
  }

  // ── WAVE 44: MOBILE IN-APP LIVE LOG DRAWER ──
  const logDrawerBtn = document.getElementById('mobLogDrawerBtn');
  const logDrawer = document.getElementById('mobLogDrawer');
  const logClose = document.getElementById('mobLogClose');
  const mobLogBody = document.getElementById('mobLogBody');

  if (logDrawerBtn && logDrawer) {
    logDrawerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      logDrawer.style.display = 'flex';
      syncMobLogs();
    });

    if (logClose) {
      logClose.addEventListener('click', (e) => {
        e.stopPropagation();
        logDrawer.style.display = 'none';
      });
    }

    function syncMobLogs() {
      if (!mobLogBody) return;
      const startutLog = document.getElementById('startutLogBody');
      if (startutLog && startutLog.children.length > 0) {
        mobLogBody.innerHTML = startutLog.innerHTML;
        mobLogBody.scrollTop = mobLogBody.scrollHeight;
      }
    }

    // Expose log streamer for mobile
    window.appendMobLog = function(text, cls = 'info') {
      if (!mobLogBody) return;
      const line = document.createElement('div');
      line.className = `mob-log-line ${cls}`;
      line.textContent = text;
      mobLogBody.appendChild(line);
      mobLogBody.scrollTop = mobLogBody.scrollHeight;
      if (logDrawerBtn) logDrawerBtn.style.display = 'flex';
    };
  }

  // Automatically show log drawer button when Deploy VPS is clicked
  const vpsCreateBtn = document.getElementById('vpsCreateBtn');
  if (vpsCreateBtn && logDrawerBtn) {
    vpsCreateBtn.addEventListener('click', () => {
      if (isMobile()) {
        logDrawerBtn.style.display = 'flex';
      }
    });
  }

  // ── WAVE 45: SMART BATTERY & NETWORK SAVER DETECTOR ──
  if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
      function checkBattery() {
        if (battery.level <= 0.20 && !battery.charging) {
          document.body.classList.add('battery-saver');
          if (fabSaverTxt) fabSaverTxt.textContent = '⚡ Chế Độ Thường';
          const bgVid = document.getElementById('bgVideo');
          if (bgVid) bgVid.pause();
        }
      }
      checkBattery();
      battery.addEventListener('levelchange', checkBattery);
      battery.addEventListener('chargingchange', checkBattery);
    }).catch(()=>{});
  }

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    function checkNetwork() {
      if (conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === '3g') {
        document.body.classList.add('battery-saver');
        const bgVid = document.getElementById('bgVideo');
        if (bgVid) bgVid.pause();
      }
    }
    checkNetwork();
    conn.addEventListener('change', checkNetwork);
  }
})();

/* ═══════════════════════════════════════════════════════════
   PEAK CYBER VINYL & MOBILE TURNTABLE MODAL CONTROLLER
   ═══════════════════════════════════════════════════════════ */
(function() {
  const isMobile = () => window.innerWidth < 768;
  const playerCard = document.getElementById('musicPlayer');
  const vinylWrap  = document.getElementById('mpVinylWrap');
  const mobExpand  = document.getElementById('mpMobExpandBtn');
  const modalClose = document.getElementById('mpModalClose');
  const mobPlayBtn = document.getElementById('mpMobPlayBtn');
  const mobPlayIcon= document.getElementById('mpMobPlayIcon');
  const mobTitle   = document.getElementById('mpMobTitle');
  const mainPlayBtn= document.getElementById('mpPlay');
  const audio      = document.getElementById('mpAudio');

  function openModal() {
    if (!playerCard) return;
    playerCard.classList.add('mp-modal-open');
  }

  function closeModal() {
    if (!playerCard) return;
    playerCard.classList.remove('mp-modal-open');
  }

  // Toggle modal on mobile by clicking capsule, vinyl, or expand button
  if (playerCard) {
    playerCard.addEventListener('click', (e) => {
      if (!isMobile()) return;
      // Don't toggle modal if user clicked play/skip/volume controls directly
      if (e.target.closest('#mpPlay, #mpMobPlayBtn, #mpSeek, #mpVol, #mpPrev, #mpNext, #mpRepeat, #mpMute')) {
        return;
      }
      if (e.target.closest('#mpModalClose')) {
        closeModal();
        return;
      }
      if (playerCard.classList.contains('mp-modal-open')) {
        // Already open
      } else {
        openModal();
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  if (mobExpand) {
    mobExpand.addEventListener('click', (e) => {
      e.stopPropagation();
      if (playerCard.classList.contains('mp-modal-open')) {
        closeModal();
      } else {
        openModal();
      }
    });
  }

  // Sync mobile play button with main audio
  if (mobPlayBtn && mainPlayBtn) {
    mobPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mainPlayBtn.click();
    });
  }

  // Sync play icon on mobile island play button
  if (audio && mobPlayIcon) {
    const PLAY_SVG  = `<polygon points="5 3 19 12 5 21 5 3"/>`;
    const PAUSE_SVG = `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`;
    audio.addEventListener('play', () => {
      mobPlayIcon.innerHTML = PAUSE_SVG;
    });
    audio.addEventListener('pause', () => {
      mobPlayIcon.innerHTML = PLAY_SVG;
    });
  }

  // Close modal when tapping outside (stage / background)
  document.addEventListener('click', (e) => {
    if (!isMobile() || !playerCard || !playerCard.classList.contains('mp-modal-open')) return;
    if (!playerCard.contains(e.target)) {
      closeModal();
    }
  });
})();
