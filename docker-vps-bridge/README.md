# 🚀 DOCKER VPS BRIDGE — CẦU NỐI TỰ ĐỘNG TẠO VPS WINDOWS RDP

Bộ mã nguồn cầu nối (Docker Bridge & Cloudflare Worker) giúp tự động hóa 100% quy trình:
1. Nhận GitHub Token & Tailscale Key từ Web Profile.
2. Tự động tạo private repository trên GitHub của user.
3. Tự động nạp file workflow `SEVER AI STV PREMIUM` cấu hình Windows + Tailscale.
4. Kích hoạt GitHub Actions Runner (`windows-latest`) chạy liên tục 5h40m.
5. Lấy IP Tailscale và thông tin kết nối trả về Web Profile.

## 🐳 1. Chạy Bằng Docker:
```bash
# Build image
docker build -t vps-bridge .

# Chạy container port 3000
docker run -d -p 3000:3000 --name vps-bridge-service vps-bridge
```

## ☁️ 2. Chạy Bằng Cloudflare Workers:
- Vào Cloudflare Dashboard -> **Workers & Pages** -> **Create Application** -> Tên: `vpsstore`.
- Dán toàn bộ mã nguồn file `cloudflare-worker.js` vào trình soạn thảo và bấm **Deploy**.
- Web của bạn sẽ ngay lập tức kết nối thành công tới `https://vpsstore.plasma9577.workers.dev/api/create-vps`!
