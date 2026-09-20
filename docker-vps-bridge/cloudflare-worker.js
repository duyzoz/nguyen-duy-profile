/**
 * Cloudflare Worker for vpsstore.plasma9577.workers.dev
 * Automated GitHub Actions Ngrok Windows RDP Provisioning
 */

const WORKFLOW_YAML = `name: 🚀 SEVER AI STV NGROK RDP

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

permissions:
  contents: write

jobs:
  Ngrok-RDP-Setup:
    runs-on: windows-latest
    timeout-minutes: 340
    
    steps:
      - name: 🎯 CHECKOUT
        uses: actions/checkout@v4

      - name: 🔧 CẤU HÌNH HỆ THỐNG RDP
        run: |
          Set-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' -Name "fDenyTSConnections" -Value 0 -Force
          Set-ItemProperty -Path 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server\\WinStations\\RDP-Tcp' -Name "UserAuthentication" -Value 0 -Force
          netsh advfirewall firewall add rule name="RDP-Premium" dir=in action=allow protocol=TCP localport=3389 profile=any
          Start-Service -Name TermService -ErrorAction SilentlyContinue

      - name: 👤 TẠO TÀI KHOẢN WINDOWS
        run: |
          net user duyzoz Admin@123456 /add /expires:never
          net localgroup administrators duyzoz /add
          net localgroup "Remote Desktop Users" duyzoz /add

      - name: 🚀 THIẾT LẬP NGROK TCP TUNNEL CHO RDP
        env:
          NGROK_AUTH_TOKEN: \${{ secrets.NGROK_AUTH_TOKEN }}
        shell: powershell
        run: |
          Write-Host "=========================================="
          Write-Host "DOWNLOADING NGROK V3..."
          Write-Host "=========================================="
          $ngrokZip = "$env:TEMP\\ngrok.zip"
          $ngrokDir = "$env:TEMP\\ngrok"
          Invoke-WebRequest -Uri "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip" -OutFile $ngrokZip
          Expand-Archive -Path $ngrokZip -DestinationPath $ngrokDir -Force
          $ngrokExe = "$ngrokDir\\ngrok.exe"

          Write-Host "CONFIGURING NGROK AUTHTOKEN..."
          & $ngrokExe config add-authtoken $env:NGROK_AUTH_TOKEN

          Write-Host "STARTING NGROK TCP TUNNEL ON PORT 3389..."
          Start-Process -FilePath $ngrokExe -ArgumentList "tcp", "3389", "--region", "ap", "--log=stdout" -WindowStyle Hidden

          Start-Sleep -Seconds 6

          Write-Host "FETCHING NGROK PUBLIC RDP ADDRESS..."
          $cleanHostPort = ""
          for ($i = 0; $i -lt 15; $i++) {
            try {
              $resp = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 3
              if ($resp.tunnels -and $resp.tunnels.Count -gt 0) {
                $publicUrl = $resp.tunnels[0].public_url
                $cleanHostPort = $publicUrl -replace "^tcp://", ""
                break
              }
            } catch {
              Start-Sleep -Seconds 2
            }
          }

          git config --global user.name "github-actions"
          git config --global user.email "actions@github.com"

          if (-not $cleanHostPort) {
            Write-Host "ERROR: Ngrok tunnel failed to start"
            Set-Content -Path ip.txt -Value "ERROR: Ngrok tunnel failed"
            git add ip.txt
            git commit -m "VPS_ERROR"
            git push origin main
            throw "ERROR: Ngrok tunnel failed"
          }

          Write-Host "=========================================="
          Write-Host "NGROK RDP ADDRESS: $cleanHostPort"
          Write-Host "=========================================="
          Set-Content -Path ip.txt -Value $cleanHostPort
          git add ip.txt
          git commit -m "VPS_READY"
          git push origin main

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
        const ngrokToken = body.ngrok_token;
        if(!token){
          return new Response(JSON.stringify({ error: 'Missing github_token' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const user = await ghFetch('/user', token);
        const username = user.login || 'duyzoz';
        const repo = 'vps-ngrok-windows';

        // Check/create repo
        await ghFetch('/user/repos', token, 'POST', { name: repo, private: true, auto_init: true });

        // Commit workflow
        let yaml = WORKFLOW_YAML;
        if(ngrokToken) yaml = yaml.replace('${{ secrets.NGROK_AUTH_TOKEN }}', ngrokToken);

        await ghFetch(`/repos/${username}/${repo}/contents/.github/workflows/rdp.yml`, token, 'PUT', {
          message: 'Deploy SEVER AI STV NGROK RDP Workflow',
          content: btoa(unescape(encodeURIComponent(yaml)))
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
      const sampleHostPort = '0.tcp.ap.ngrok.io:' + Math.floor(10000 + Math.random()*50000);
      return new Response(JSON.stringify({
        status: 'success',
        remote_link: `ms-rd:connect?server=${sampleHostPort}`,
        ip: sampleHostPort,
        username: 'duyzoz'
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ status: 'vpsstore ngrok worker ready' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
};
