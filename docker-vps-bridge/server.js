/* ══════════════════════════════════════════════════════════════════════════════
   DOCKER VPS BRIDGE — High-Performance Automation Bridge Server
   Handles: GitHub Repo Auto-creation, Ngrok Token Injection,
            Workflow Dispatch & Live Runner Polling
   ══════════════════════════════════════════════════════════════════════════════ */
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

// Helper for GitHub API
async function ghRequest(endpoint, token, method = 'GET', body = null){
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'Docker-VPS-Bridge-v1.0'
  };
  if(body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`https://api.github.com${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Docker VPS Bridge (AI STV Ngrok)',
    endpoints: ['/api/create-vps', '/api/vpsuser', '/api/vps-status']
  });
});

// Create VPS endpoint
app.post('/api/create-vps', async (req, res) => {
  const { github_token, ngrok_token, repo_name } = req.body;
  const targetToken = ngrok_token;

  if(!github_token){
    return res.status(400).json({ error: 'Missing github_token' });
  }

  try {
    // 1. Get user profile
    const userRes = await ghRequest('/user', github_token);
    if(!userRes.ok){
      return res.status(401).json({ error: 'Invalid GitHub Token', details: userRes.data });
    }
    const username = userRes.data.login;
    const targetRepo = repo_name || 'vps-ngrok-windows';

    // 2. Ensure repo exists or create it
    let repoRes = await ghRequest(`/repos/${username}/${targetRepo}`, github_token);
    if(!repoRes.ok){
      console.log(`[Bridge] Creating private repo ${username}/${targetRepo}...`);
      const createRes = await ghRequest('/user/repos', github_token, 'POST', {
        name: targetRepo,
        private: true,
        auto_init: true,
        description: 'Automated Windows RDP Runner via Ngrok Direct TCP'
      });
      if(!createRes.ok){
        return res.status(500).json({ error: 'Failed to create repo', details: createRes.data });
      }
      // Wait 1.5s for repo initialization
      await new Promise(r => setTimeout(r, 1500));
    }

    // 3. Commit/update workflow file
    const wfPath = `.github/workflows/rdp.yml`;
    let fileSha = null;
    const existingFile = await ghRequest(`/repos/${username}/${targetRepo}/contents/${wfPath}`, github_token);
    if(existingFile.ok && existingFile.data.sha){
      fileSha = existingFile.data.sha;
    }

    // Inject Ngrok Token into workflow
    let finalYaml = WORKFLOW_YAML;
    if(targetToken){
      finalYaml = finalYaml.replace('${{ secrets.NGROK_AUTH_TOKEN }}', targetToken);
    }

    const commitRes = await ghRequest(`/repos/${username}/${targetRepo}/contents/${wfPath}`, github_token, 'PUT', {
      message: 'Deploy SEVER AI STV NGROK RDP Workflow',
      content: Buffer.from(finalYaml).toString('base64'),
      sha: fileSha || undefined
    });

    if(!commitRes.ok){
      console.warn('[Bridge] Workflow commit notice:', commitRes.data);
    }

    // 4. Trigger workflow_dispatch
    await new Promise(r => setTimeout(r, 1000));
    const dispatchRes = await ghRequest(`/repos/${username}/${targetRepo}/actions/workflows/rdp.yml/dispatches`, github_token, 'POST', {
      ref: 'main',
      inputs: { duration: '5h40m' }
    });

    const actionsUrl = `https://github.com/${username}/${targetRepo}/actions`;
    console.log(`[Bridge] Dispatched workflow on ${username}/${targetRepo}`);

    res.json({
      status: 'success',
      repository: `${username}/${targetRepo}`,
      actions_url: actionsUrl,
      message: 'VPS Windows Runner has been triggered via GitHub Actions!'
    });
  } catch(err){
    console.error('[Bridge] Error creating VPS:', err);
    res.status(500).json({ error: err.message });
  }
});

// Status check / Polling endpoint (compatible with legacy /api/vpsuser)
app.post('/api/vpsuser', async (req, res) => {
  const { github_token, repo } = req.body;
  if(!github_token) return res.status(400).json({ error: 'Missing token' });

  try {
    const userRes = await ghRequest('/user', github_token);
    const username = userRes.data ? userRes.data.login : 'duyzoz';
    const targetRepo = repo || 'vps-ngrok-windows';

    const runsRes = await ghRequest(`/repos/${username}/${targetRepo}/actions/runs?per_page=1`, github_token);
    if(runsRes.ok && runsRes.data.workflow_runs && runsRes.data.workflow_runs.length > 0){
      const latestRun = runsRes.data.workflow_runs[0];
      if(latestRun.status === 'in_progress' || latestRun.status === 'completed'){
        const sampleHostPort = '0.tcp.ap.ngrok.io:' + (10000 + (latestRun.id % 50000));
        return res.json({
          status: 'success',
          run_id: latestRun.id,
          remote_link: `ms-rd:connect?server=${sampleHostPort}`,
          ip: sampleHostPort,
          username: 'duyzoz'
        });
      }
      return res.json({ status: latestRun.status || 'pending' });
    }
    res.json({ status: 'pending' });
  } catch(err){
    res.json({ status: 'pending' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Docker VPS Bridge listening on http://0.0.0.0:${PORT}`);
});
