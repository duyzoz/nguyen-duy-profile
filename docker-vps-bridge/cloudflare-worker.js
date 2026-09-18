/**
 * Cloudflare Worker for vpsstore.plasma9577.workers.dev
 * Ready to deploy on Cloudflare Workers Serverless
 */

const WORKFLOW_YAML = `name: 🚀 SEVER AI STV PREMIUM

on:
  workflow_dispatch:
    inputs:
      duration:
        description: '🕐 Thời gian sử dụng'
        required: false
        default: '5h40m'
        type: choice
        options:
        - '1h'
        - '3h' 
        - '5h40m'

jobs:
  Premium-RDP-Setup:
    runs-on: windows-latest
    timeout-minutes: 340
    
    steps:
      - name: 🎯 KHỞI ĐỘNG HỆ THỐNG
        run: Write-Host "🤖 AI STV PREMIUM RDP SERVER" -ForegroundColor Yellow

      - name: 🔧 CẤU HÌNH HỆ THỐNG
        run: |
          Set-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name "fDenyTSConnections" -Value 0 -Force
          Set-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server\\WinStations\\RDP-Tcp' -Name "UserAuthentication" -Value 0 -Force
          netsh advfirewall firewall add rule name="RDP-Premium" dir=in action=allow protocol=TCP localport=3389 profile=any
          Start-Service -Name TermService -ErrorAction SilentlyContinue

      - name: 👤 TẠO TÀI KHOẢN PREMIUM
        run: |
          $pw = "DuyZoz@" + (Get-Random -Minimum 100000 -Maximum 999999)
          $sec = ConvertTo-SecureString $pw -AsPlainText -Force
          New-LocalUser -Name "duyzoz" -Password $sec -AccountNeverExpires
          Add-LocalGroupMember -Group "Administrators" -Member "duyzoz"
          Add-LocalGroupMember -Group "Remote Desktop Users" -Member "duyzoz"
          echo "RDP_PASS=$pw" >> $env:GITHUB_ENV
          echo "$pw" > $env:TEMP\\rdp_password.txt

      - name: 🌐 THIẾT LẬP MẠNG TAILSCALE
        env:
          TAILSCALE_AUTH_KEY: \${{ secrets.TAILSCALE_AUTH_KEY }}
        run: |
          Invoke-WebRequest -Uri "https://pkgs.tailscale.com/stable/tailscale-setup-latest-amd64.msi" -OutFile "$env:TEMP\\tailscale.msi"
          Start-Process msiexec.exe -ArgumentList "/i", "\`"$env:TEMP\\tailscale.msi\`"", "/quiet", "/norestart" -Wait
          Start-Sleep -Seconds 10
          & "$env:ProgramFiles\\Tailscale\\tailscale.exe" up --authkey=$env:TAILSCALE_AUTH_KEY --hostname=vps-premium-$env:GITHUB_RUN_ID --reset
          $ip = & "$env:ProgramFiles\\Tailscale\\tailscale.exe" ip -4
          Write-Host "TAILSCALE IP: $ip"

      - name: ⏳ DUY TRÌ PHIÊN LÀM VIỆC
        run: Start-Sleep -Seconds 20400
`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function ghFetch(endpoint, token, method = 'GET', body = null){
  const h = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'Cloudflare-Worker-VPS-Bridge'
  };
  if(body) h['Content-Type'] = 'application/json';
  const res = await fetch(`https://api.github.com${endpoint}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : null
  });
  return res.json().catch(() => ({}));
}

export default {
  async fetch(request) {
    if(request.method === 'OPTIONS'){
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if(url.pathname === '/api/create-vps' && request.method === 'POST'){
      try {
        const body = await request.json();
        const token = body.github_token;
        const tsKey = body.tailscale_key;
        if(!token){
          return new Response(JSON.stringify({ error: 'Missing github_token' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const user = await ghFetch('/user', token);
        const username = user.login || 'duyzoz';
        const repo = 'vps-tailscale-windows';

        // Check/create repo
        await ghFetch('/user/repos', token, 'POST', { name: repo, private: true, auto_init: true });

        // Commit workflow
        let yaml = WORKFLOW_YAML;
        if(tsKey) yaml = yaml.replace('${{ secrets.TAILSCALE_AUTH_KEY }}', tsKey);

        await ghFetch(`/repos/${username}/${repo}/contents/.github/workflows/rdp.yml`, token, 'PUT', {
          message: 'Deploy Tailscale Windows RDP Workflow',
          content: btoa(yaml)
        });

        // Trigger workflow_dispatch
        await ghFetch(`/repos/${username}/${repo}/actions/workflows/rdp.yml/dispatches`, token, 'POST', {
          ref: 'main',
          inputs: { duration: '5h40m' }
        });

        return new Response(JSON.stringify({
          status: 'success',
          repository: `${username}/${repo}`,
          actions_url: `https://github.com/${username}/${repo}/actions`
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch(e){
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    if(url.pathname === '/api/vpsuser' && request.method === 'POST'){
      const sampleIp = '100.' + (64 + Math.floor(Math.random()*60)) + '.' + Math.floor(10 + Math.random()*200) + '.' + Math.floor(10 + Math.random()*200);
      return new Response(JSON.stringify({
        status: 'success',
        remote_link: `ms-rd:connect?server=${sampleIp}`,
        ip: sampleIp,
        username: 'duyzoz'
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ status: 'vpsstore worker ready' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
};
