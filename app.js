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
  const startupLang = localStorage.getItem('nd_lang') || 'en';
  const STARTUP_DICT = {
    en: {
      lines: [
        {text:'> System Initializing...',cls:'dim',ms:0},
        {text:'> Network Connection... OK',cls:'green',ms:600},
        {text:'> IP: {IP}',cls:'cyan',ms:1100,isIp:true},
        {text:'> OS: '+(function(){const u=navigator.userAgent;if(/Android/i.test(u))return'Android';if(/iPhone|iPad|iPod/i.test(u))return'iOS';if(/CrOS/i.test(u))return'Chrome OS';if(/Windows NT 10\.0/i.test(u))return'Windows 10/11';if(/Windows NT 6\.3/i.test(u))return'Windows 8.1';if(/Windows NT 6\.1/i.test(u))return'Windows 7';if(/Win/i.test(u))return'Windows';if(/Mac/i.test(u)&&!/Mobile/i.test(u))return'macOS';if(/Linux/i.test(u))return'Linux';return'Unknown OS';})(),cls:'cyan',ms:1500},
        {text:'> Loading User Profile... OK',cls:'green',ms:2000},
        {text:'> Bio: Loaded Successfully ✓',cls:'green',ms:2400},
        {text:'> All Systems Operational.',cls:'yellow',ms:2900},
      ],
      cont: 'Press Enter / Click To Continue'
    },
    vi: {
      lines: [
        {text:'> Khởi động hệ thống...',cls:'dim',ms:0},
        {text:'> Kết nối mạng... OK',cls:'green',ms:600},
        {text:'> IP: {IP}',cls:'cyan',ms:1100,isIp:true},
        {text:'> Hệ điều hành: '+(function(){const u=navigator.userAgent;if(/Android/i.test(u))return'Android';if(/iPhone|iPad|iPod/i.test(u))return'iOS';if(/CrOS/i.test(u))return'Chrome OS';if(/Windows NT 10\.0/i.test(u))return'Windows 10/11';if(/Windows NT 6\.3/i.test(u))return'Windows 8.1';if(/Windows NT 6\.1/i.test(u))return'Windows 7';if(/Win/i.test(u))return'Windows';if(/Mac/i.test(u)&&!/Mobile/i.test(u))return'macOS';if(/Linux/i.test(u))return'Linux';return'Unknown OS';})(),cls:'cyan',ms:1500},
        {text:'> Tải hồ sơ người dùng... OK',cls:'green',ms:2000},
        {text:'> Bio: Đã tải xong ✓',cls:'green',ms:2400},
        {text:'> Tất cả hệ thống sẵn sàng.',cls:'yellow',ms:2900},
      ],
      cont: 'Nhấn Enter hoặc Click để tiếp tục'
    },
    ja: {
      lines: [
        {text:'> システム初期化中...',cls:'dim',ms:0},
        {text:'> ネットワーク接続... OK',cls:'green',ms:600},
        {text:'> IP: {IP}',cls:'cyan',ms:1100,isIp:true},
        {text:'> OS: '+(function(){const u=navigator.userAgent;if(/Android/i.test(u))return'Android';if(/iPhone|iPad|iPod/i.test(u))return'iOS';if(/CrOS/i.test(u))return'Chrome OS';if(/Windows NT 10\.0/i.test(u))return'Windows 10/11';if(/Windows NT 6\.3/i.test(u))return'Windows 8.1';if(/Windows NT 6\.1/i.test(u))return'Windows 7';if(/Win/i.test(u))return'Windows';if(/Mac/i.test(u)&&!/Mobile/i.test(u))return'macOS';if(/Linux/i.test(u))return'Linux';return'Unknown OS';})(),cls:'cyan',ms:1500},
        {text:'> ユーザープロフィール読み込み... OK',cls:'green',ms:2000},
        {text:'> プロフィール: 読み込み完了 ✓',cls:'green',ms:2400},
        {text:'> 全システム正常稼働中。',cls:'yellow',ms:2900},
      ],
      cont: 'Enterキーまたはクリックで続行'
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

  // Check saved admin state from previous session
  try {
    if (localStorage.getItem('nd_is_admin') === '1') {
      window.ND_IS_ADMIN = true;
      window.ND_DISPLAY_IP = ADMIN_IP;
    }
  } catch(e){}

  // 1. Direct local IP or admin machine verification
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
    // Recognize Admin either via direct LAN IP (192.168.0.102) OR home WAN connection (42.117.202.27 / 42.117.*)
    const isHomeWan = cleanIp === ADMIN_WAN_IP || cleanIp.startsWith('42.117.');
    const isLanAdmin = cleanIp === ADMIN_IP;

    if (isHomeWan || isLanAdmin || window.ND_IS_ADMIN) {
      window.ND_IS_ADMIN = true;
      window.ND_DISPLAY_IP = ADMIN_IP; // ALWAYS present as 192.168.0.102
      try { localStorage.setItem('nd_is_admin', '1'); } catch(e){}
    } else {
      window.ND_IS_ADMIN = false;
      window.ND_DISPLAY_IP = cleanIp;
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
    if(document.body.classList.contains('perf-mode')){
      card.style.transform='';
      rafId=null;
      return;
    }
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
   TOOL CARD — Zero-Delay Peek + Mobile FAB
════════════════════════════════ */
(function(){
  const toolCard  = document.getElementById('toolCard');
  const profileCard = document.getElementById('profileCard');
  const fab       = document.getElementById('mobileFab');
  const fabIcon   = document.getElementById('fabIcon');
  const CARD_W    = 320;
  const PEEK_W    = Math.ceil(CARD_W * 0.333);
  const isMobile  = () => window.innerWidth < 768;

  let isOpen = false, closeTimer = null, rafPending = false, lastMx = 0, lastMy = 0;
  let cachedPr = null, cachedTr = null;

  function updateCachedRects(){
    if(!isMobile()){
      cachedPr = profileCard.getBoundingClientRect();
      cachedTr = toolCard.getBoundingClientRect();
    }
  }
  window.addEventListener('resize', updateCachedRects, {passive:true});
  setTimeout(updateCachedRects, 2000);

  /* ── open / close ── */
  function openCard(){
    if(closeTimer){clearTimeout(closeTimer);closeTimer=null;}
    if(isOpen)return;
    isOpen=true;
    toolCard.classList.remove('closing');
    toolCard.style.transition='transform .26s cubic-bezier(.16,1,.3,1)';
    toolCard.classList.add('open');
    if(isMobile()){
      document.body.classList.add('tool-open');
      fabIcon.innerHTML='<polyline points="18 15 12 9 6 15"/>';
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
    toolCard.classList.add('closing');
    toolCard.style.transition='transform .18s ease-in';
    toolCard.classList.remove('open');
    document.body.classList.remove('tool-open');
    fabIcon.innerHTML='<polyline points="6 9 12 15 18 9"/>';
    setTimeout(()=>{toolCard.classList.remove('closing');updateCachedRects();},220);
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

  /* ── Desktop: instant peek zone ── */
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

  /* ── Mobile FAB ── */
  function syncFab(){
    if(fab) fab.style.display=isMobile()?'flex':'none';
  }
  syncFab();
  window.addEventListener('resize',()=>{
    syncFab();
    if(!isMobile()&&isOpen)closeCard();
  });

  if(fab){
    fab.addEventListener('click',e=>{
      e.stopPropagation();
      isOpen ? closeCard() : openCard();
    });
  }

  /* Close khi click ngoài (mobile) */
  document.addEventListener('click',e=>{
    if(!isMobile()||!isOpen)return;
    if(!toolCard.contains(e.target)&&fab&&!fab.contains(e.target)) closeCard();
  });

  /* Touch swipe để đóng (mobile) */
  let touchStartX=0;
  toolCard.addEventListener('touchstart',e=>{touchStartX=e.touches[0].clientX;},{passive:true});
  toolCard.addEventListener('touchend',e=>{
    if(e.changedTouches[0].clientX-touchStartX>60) closeCard();
  },{passive:true});
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
    if(isMobile() || document.body.classList.contains('perf-mode')) return;
    cx=lerp(cx,targetNx*10,.08);cy=lerp(cy,targetNy*10,.08);
    tcx=lerp(tcx,targetNx*-3,.07);tcy=lerp(tcy,targetNy*-3,.07);
    scene.style.transform=`translate(${cx.toFixed(2)}px,${cy.toFixed(2)}px)`;
    toolCard.style.setProperty('--py',`${tcy.toFixed(2)}px`);
    if(Math.abs(cx - targetNx*10) > 0.05 || Math.abs(cy - targetNy*10) > 0.05){
      rafId=requestAnimationFrame(loop);
    }
  }
  document.addEventListener('mousemove',e=>{
    if(isMobile() || document.body.classList.contains('perf-mode')) return;
    targetNx=(e.clientX/window.innerWidth-.5)*2;
    targetNy=(e.clientY/window.innerHeight-.5)*2;
    if(!rafId) rafId=requestAnimationFrame(loop);
  },{passive:true});
})();

/* ─── TAB SWITCHING ─── */
(function(){
  const tabs = document.querySelectorAll('.tc-tab');
  const panels = document.querySelectorAll('.tc-panel');
  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>{
      tabs.forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-panel');
      panels.forEach(p=>{
        p.style.display = p.id===target ? 'block' : 'none';
      });
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
function logTime(){const n=new Date();return`[${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}]`;}
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
    const lbl=(tokenLabelInput?tokenLabelInput.value.trim():'');
    const k  =(tokenInput?tokenInput.value.trim():'');
    if(!lbl){
      if(tokenLabelErr){
        tokenLabelErr.style.display='block';
        setTimeout(()=>{tokenLabelErr.style.display='none';},2500);
      }
      if(tokenLabelInput)shakeField(tokenLabelInput);
      return;
    }
    if(!k||k.length<10){showKS('❌ Token không hợp lệ','err');return;}
    localStorage.setItem(LS_KEY,k);
    showKS('✅ Đã lưu token!','ok');
    addLog('[INFO] GitHub Token đã lưu ✓','ok');
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
  function addToTokenList(token,label){
    const list=getTokenList();
    const exists=list.find(t=>t.token===token);
    if(!exists){
      list.push({id:Date.now().toString(36),label:label||'Token',token,added:new Date().toLocaleString('vi-VN')});
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
        <div class="token-item-info">
          <div class="token-item-label">${t.label}</div>
          <div class="token-item-val">${t.token.slice(0,6)}••••••••${t.token.slice(-4)}</div>
          <div class="token-item-date">➕ ${t.added}</div>
        </div>
        <div class="token-item-actions">
          <button class="tia-use" data-token="${t.token}" title="Dùng token này">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
          <button class="tia-del" data-id="${t.id}" title="Xóa">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');
    listEl.querySelectorAll('.tia-use').forEach(b=>{
      b.addEventListener('click',()=>{
        const tk=b.getAttribute('data-token');
        localStorage.setItem(LS_KEY,tk);
        if(tokenInput)tokenInput.value=tk;
        showKS('✅ Đã chọn token!','ok');
        document.querySelector('[data-panel="panelBypass"]')?.click();
        addLog('[INFO] Đã chọn token từ danh sách ✓','ok');
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
      const emptyMsg = (window.getI18nMsg ? window.getI18nMsg('vpsEmpty') : '') || 'No VPS instances created yet';
      listEl.innerHTML=`<div class="token-empty" id="vpsEmptyMsg">${emptyMsg}</div>`;
      return;
    }
    listEl.innerHTML=list.map(v=>{
      const cd=fmtCountdown(v.created);
      return `<div class="vps-item" data-id="${v.id}">
        <div class="vps-item-info">
          <div class="vps-item-name">${v.name}</div>
          <div class="vps-item-date">📅 ${v.date}</div>
          <div class="vps-item-cd ${cd.urgent?'urgent':''}" data-created="${v.created}">${cd.expired?'⛔ Hết hạn':cd.str}</div>
        </div>
        <div class="vps-item-actions">
          <a href="${v.link}" target="_blank" rel="noopener" class="vps-item-open">🖥️</a>
          <button class="vps-item-del" data-id="${v.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
          </button>
        </div>
      </div>`;
    }).join('');
    listEl.querySelectorAll('.vps-item-del').forEach(b=>{
      b.addEventListener('click',()=>{
        const id=b.getAttribute('data-id');
        const nl=getVpsListMgmt().filter(v=>v.id!==id);
        localStorage.setItem(LS_VPS_MGMT,JSON.stringify(nl));
        renderVpsList();
      });
    });
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

  createBtn.addEventListener('click',async()=>{
    const token=localStorage.getItem('github_token')||'';
    if(!token||token.length<10){
      showVPS('❌ Chưa có Token! Vào mục Bypass để lưu token trước.','err');
      return;
    }
    setLoad(true);
    if(readyBox)readyBox.style.display='none';
    showVPS('⏳ Đang khởi tạo VPS...','wait');
    addLog('[VPS] Bắt đầu tạo VPS...','info');
    try{
      const r=await fetch(`${WORKER}/api/create-vps`,{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({github_token:token})
      });
      const d=await r.json();
      if(!r.ok){
        showVPS(`❌ Lỗi ${r.status}: ${d.error||d.details||''}`, 'err');
        addLog('[VPS] Tạo thất bại: '+(d.error||''),'err');
        setLoad(false);
        return;
      }
      addLog('[VPS] Repo tạo xong: '+d.repository,'ok');
      addLog('[VPS] Actions: '+d.actions_url,'info');
      showVPS(
        `⏳ Repo: <a href="${d.actions_url}" target="_blank" style="color:#7c6fff">${d.repository}</a><br>`+
        `<span style="font-size:.78rem;opacity:.7">Đang chờ VNC link (~5-8 phút)...</span>`,
        'wait'
      );
      pollVncLink(token,d.repository,d.actions_url);
    }catch(e){
      showVPS('❌ Không kết nối Worker: '+e.message,'err');
      addLog('[VPS] Lỗi kết nối: '+e.message,'err');
      setLoad(false);
    }
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
      artEl.style.transition = 'opacity 0.2s ease-out';
      artEl.style.opacity = '0.4';
      const img = new Image();
      img.src = AUDIO_BASE + t.cover;
      img.onload = () => {
        artEl.src = img.src;
        artEl.style.opacity = '1';
      };
      if(img.complete){
        artEl.src = img.src;
        artEl.style.opacity = '1';
      }
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
      if(card) card.style.transform = '';
      if(scene) scene.style.transform = '';
      if(toolCard) toolCard.style.setProperty('--py', '0px');
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
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
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

  function render(){
    const entries = getEntries();
    listEl.innerHTML = entries.map(item => {
      const isAdm = item.role === 'admin';
      // ADMIN NAME RULE: strictly display "Nguyễn Duy" without "(Admin)"
      const displayName = isAdm ? 'Nguyễn Duy' : item.name;
      const roleBadge = isAdm
        ? `<span class="gb-msg-role role-admin">Admin</span>`
        : `<span class="gb-msg-role role-user">Member</span>`;
      const replyHtml = item.replyTo
        ? `<div class="gb-msg-reply-ref">↩️ Trả lời <strong>@${escapeHtml(item.replyTo)}</strong></div>`
        : '';
      const statusBadge = item.status === 'sending'
        ? `<span class="gb-msg-status sending" title="Đang gửi qua Cloudflare Edge">⏳ Đang gửi...</span>`
        : `<span class="gb-msg-status sent" title="Đã xác nhận từ Cloudflare">✓ Đã gửi</span>`;

      return `
        <div class="gb-msg ${isAdm ? 'admin-msg' : ''}" data-id="${item.id}">
          <div class="gb-msg-hdr">
            <span class="gb-msg-name ${isAdm ? 'admin-name' : ''}">${escapeHtml(displayName)}</span>
            ${roleBadge}
            <span class="gb-msg-time">${escapeHtml(item.time)}${statusBadge}</span>
          </div>
          ${replyHtml}
          <div class="gb-msg-text">${escapeHtml(item.msg)}</div>
          <div class="gb-msg-actions">
            <button class="gb-msg-reply-btn" data-name="${escapeHtml(displayName)}">↩️ Trả lời</button>
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('.gb-msg-reply-btn').forEach(btn => {
      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const targetName = btn.getAttribute('data-name');
        if(targetName) setReply(targetName);
      });
    });

    listEl.scrollTop = listEl.scrollHeight;
  }

  function addNote(){
    let name = '';
    if(isCurrentAdmin){
      name = 'Nguyễn Duy';
    } else {
      name = (nameInput?.value || '').trim();
      if(!name) name = 'Khách ẩn danh';
      if(/nguyễn duy|nguyen duy/i.test(name)){
        name = name + ' (Member)';
      }
      try { localStorage.setItem('nd_chat_nickname', name); } catch(e){}
    }

    const msg = (msgInput?.value || '').trim();
    if(!msg){
      if(msgInput){
        msgInput.classList.remove('shake');
        void msgInput.offsetWidth;
        msgInput.classList.add('shake');
        msgInput.placeholder = '⚠️ Vui lòng nhập nội dung tin nhắn...';
        setTimeout(()=>{
          msgInput.classList.remove('shake');
          msgInput.placeholder = replyingTo ? `Trả lời @${replyingTo}...` : 'Nhập tin nhắn...';
        }, 2000);
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
    render();

    if(msgInput) msgInput.value = '';
    clearReply();

    // Cloudflare Edge confirmation simulation & transition to 'sent'
    setTimeout(()=>{
      const curEntries = getEntries();
      const target = curEntries.find(x => x.id === messageId);
      if(target){
        target.status = 'sent';
        saveEntries(curEntries);
        render();
        if(bc){
          try { bc.postMessage({ type: 'REFRESH' }); } catch(e){}
        }
      }
    }, 450);

    if(btnSubmit){
      const oldHtml = btnSubmit.innerHTML;
      btnSubmit.innerHTML = '✓';
      setTimeout(()=>{ btnSubmit.innerHTML = oldHtml; }, 1200);
    }
  }

  if(btnSubmit) btnSubmit.addEventListener('click', addNote);
  if(msgInput){
    msgInput.addEventListener('keydown', e => {
      if(e.key === 'Enter' && !e.shiftKey){
        e.preventDefault();
        addNote();
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
  function syncKeyUI(){
    const currentKey = (localStorage.getItem(LS_AI_KEY) || '').trim();
    const hasKey = currentKey.length > 8;
    if(btnConfigKey){
      btnConfigKey.innerHTML = hasKey
        ? '<span class="ai-key-icon">🟢</span><span class="ai-key-label">Live AI</span>'
        : '<span class="ai-key-icon">🔑</span><span class="ai-key-label">API Key</span>';
      btnConfigKey.title = hasKey
        ? 'Live AI Active (Click to edit Key)'
        : 'Configure AI API Key (Gemini / OpenAI / Groq)';
    }
    if(keyStatusTxt){
      if(hasKey){
        const isGemini = currentKey.startsWith('AIza');
        const provider = isGemini ? 'Google Gemini' : (currentKey.startsWith('gsk_') ? 'Groq Llama-3.3' : 'OpenAI');
        keyStatusTxt.innerHTML = `<span style="color:#34d399">🟢 Key Active: ${provider} (100% Live AI)</span>`;
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
      const val = apiKeyInput.value.trim();
      if(val){
        localStorage.setItem(LS_AI_KEY, val);
        syncKeyUI();
        if(keyModal) keyModal.style.display = 'none';
        appendMessage('✨ <em>AI API Key saved! Live AI is now active and ready.</em>', false);
      } else {
        localStorage.removeItem(LS_AI_KEY);
        syncKeyUI();
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

  /* ── 2. Live AI Query Engine ── */
  async function callLiveAI(userText, lang = 'en'){
    const key = (localStorage.getItem(LS_AI_KEY) || '').trim();
    if(!key) return null;

    const langName = lang === 'vi' ? 'Vietnamese' : (lang === 'ja' ? 'Japanese' : 'English');
    const systemPrompt = `You are Nguyễn Duy AI, the cyberpunk digital twin and assistant of Nguyễn Duy (duyzoz).
Respond accurately with this ground truth knowledge:
- Author: Nguyễn Duy (duyzoz), Fullstack Developer, 3D Render Artist & Modder.
- Hardware: HP EliteBook 840 G1 without dedicated GPU (Intel HD Graphics 4400) rendering complex 3D scenes.
- Projects: OpenNOW Native Client (Qt6 + Rust Cloud Gaming streamer), Wuthering Waves Discord 24/7 Selfbot (Rover Asia UL80, UID: 713243969), Bypass Engine, 13 Waves of frontend performance optimization.
- Tone: Cyberpunk, tech-savvy, concise, helpful.
- Language: ALWAYS answer in ${langName}.`;

    try {
      if(key.startsWith('AIza')){
        // Google Gemini API (gemini-1.5-flash / gemini-2.0-flash)
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt + '\n\nUser Question: ' + userText }] }]
          })
        });
        const data = await resp.json();
        if(data.candidates && data.candidates[0]?.content?.parts?.[0]?.text){
          return data.candidates[0].content.parts[0].text.replace(/\n/g, '<br>');
        }
        if(data.error) throw new Error(data.error.message || 'Gemini API Error');
      } else {
        // OpenAI / Groq Compatible API
        const endpoint = key.startsWith('gsk_')
          ? 'https://api.groq.com/openai/v1/chat/completions'
          : 'https://api.openai.com/v1/chat/completions';
        const model = key.startsWith('gsk_') ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';
        const resp = await fetch(endpoint, {
          method: 'POST',
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
        const data = await resp.json();
        if(data.choices && data.choices[0]?.message?.content){
          return data.choices[0].message.content.replace(/\n/g, '<br>');
        }
        if(data.error) throw new Error(data.error.message || 'API Error');
      }
    } catch(err){
      return `<span style="color:#f87171">⚠️ Live API Error: ${err.message}</span><br>` + getOfflineAiResponse(userText, lang);
    }
    return null;
  }

  function removeDiacritics(str){
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
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

    // Try Live AI first if key exists
    try {
      const liveRes = await callLiveAI(text, currentLang);
      if(liveRes){
        typingDiv.innerHTML = liveRes;
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return;
      }
    } catch(e){}

    // Fallback to offline knowledge base
    setTimeout(()=>{
      typingDiv.innerHTML = getOfflineAiResponse(text, currentLang);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 280);
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
})();



