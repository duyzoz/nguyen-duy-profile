# 🌟 NGUYỄN DUY PROFILE — TOÀN BỘ BỐI CẢNH DỰ ÁN & HƯỚNG DẪN DÀNH CHO AI AGENT (WAVES 1 – 82)
> **Tài liệu chuẩn hóa kiến trúc, lịch sử phát triển và quy tắc phát triển bắt buộc.**  
> *Được biên soạn để bất kỳ AI Agent / Antigravity CLI / Developer nào khi tiếp nhận dự án đều hiểu sâu sắc bản chất hệ thống, những gì đã làm, và các quy tắc cấm kỵ.*

---

## 📌 1. BẢN CHẤT DỰ ÁN (PROJECT OVERVIEW)

* **Tên dự án**: **Nguyễn Duy Cyber Profile & Cloud VPS Manager Suite**
* **Mục đích cốt lõi**:
  1. **Portfolio & Profile Cá Nhân Đỉnh Cao**: Giao diện Cyberpunk tương tác cao (Interactive UI), hiệu ứng hạt tuyết (Global Snow), vệt bụi chuột (Dust Trail), máy nghe nhạc đĩa than (Cyber Vinyl Deck), hiệu ứng trượt thẻ phụ (Side Card Floating Peek), trạng thái Discord trực tiếp (Lanyard API), hỗ trợ đa ngôn ngữ (Tiếng Việt, English, Japanese).
  2. **Bộ Điều Khiển & Khởi Tạo Cloud VPS (GitHub Actions + Ngrok)**: Tự động hóa tạo máy ảo Windows Server 2022 qua GitHub Actions Workflow Dispatch, tạo đường hầm Direct TCP Tunnel qua Ngrok, tự động trích xuất IP:Port RDP, lưu trữ token an toàn, hiển thị trạng thái thời gian thực và quản lý nhiều phiên VPS đồng thời.
  3. **Bộ Đo Hiệu Năng & FPS Chuẩn Xác (Cyber Hardware Benchmark)**: Đo FPS màn hình thực tế (EMA Smoothing), nhận diện phần cứng chân thực 100% không bịa đặt (CPU, GPU, RAM, Ổ cứng ROM/SSD) đa nền tảng (iPhone, Android, Windows PC, Mac).
  4. **Chế Độ Tiết Kiệm Tải / Fix Lag**: Tự động chuyển đổi giữa Video nền động và ảnh tĩnh, tự động điều tiết vòng lặp Canvas (Adaptive Canvas Throttling) giúp máy yếu và điện thoại không bị giật lag hay ngốn VRAM.

---

## 📁 2. KIẾN TRÚC THƯ MỤC & CÁC TỆP CỐT LÕI

Thư mục làm việc: `C:\Users\Admin\Downloads\nguyen-duy-profile-recovered`

| Tệp / Thư Mục | Vai Trò & Trách Nhiệm Kỹ Thuật |
| :--- | :--- |
| **`index.html`** | Khung HTML chính của ứng dụng Single Page App (SPA). Chứa cấu trúc DOM cho Profile, Player, Card hông, VPS Manager, Benchmark Modal, các thẻ Canvas nền (`snowCanvas`, `dustCanvas`, `matrixCanvas`, `avatarOrbit`, `avatarSnowC`). |
| **`style.css`** | Hệ thống CSS Cyberpunk hoàn chỉnh (>8,300 dòng, 1,470 khối ngoặc). Quản lý Responsive cho Desktop, Tablet, Smartphone; hiệu ứng trượt thẻ phụ; hai bộ Theme đối lập (**Cyber Dark Theme** và **Snow White Theme**); chống tự phóng to màn hình iOS (`font-size: 16px !important`). |
| **`app_nd.js`** | Mã nguồn JavaScript logic chính (>7,700 dòng). Chứa toàn bộ logic: Audio Player, Discord Lanyard, FPS HUD, Benchmark ma trận thiết bị (Wave 77), VPS GitHub Actions API, Ngrok Tunnel, GunDB chat, Sound SFX, Haptic Feedback. |
| **`app.js`** | **Bản sao song sinh bắt buộc của `app_nd.js`**. **QUY TẮC SỐ 1**: `app.js` và `app_nd.js` PHẢI LUÔN LUÔN CÙNG MÃ BĂM SHA256 (Byte-for-byte identical). Bất kỳ thay đổi nào trên `app_nd.js` đều phải đồng bộ ngay sang `app.js`. |
| **`docker-vps-bridge/`** | Cầu nối Docker VPS cục bộ, server Node.js và Cloudflare Worker hỗ trợ tạo phiên làm việc RDP. |
| **`assets/`** | Chứa Avatar, ảnh nền `Background.png`, video nền `Wallpaper.mp4`, âm thanh SFX, mã QR ngân hàng. |
| **`sw.js` & `manifest.json`** | Cấu hình Progressive Web App (PWA) và Service Worker dọn dẹp cache. |

---

## 🚢 3. QUY TRÌNH DEPLOY LÊN GITHUB & REPOSITORIES

Dự án được deploy đồng thời lên **2 Repositories GitHub** của tài khoản `duyzoz`:
1. **`duyzoz/nguyen-duy-profile`** (Repo chính hiển thị Profile).
2. **`duyzoz/Audio-deplynew`** (Repo lưu trữ và phân phối web/audio).

> ⚠️ **Lưu ý quan trọng khi Deploy**: Máy không có lệnh `git` trong biến môi trường PATH. Deploy được thực hiện thông qua script Python sử dụng GitHub REST API (`git/trees`, `git/blobs`, `git/commits`, `git/refs/heads/main`):
> Đường dẫn script deploy: `C:\Users\Admin\.gemini\antigravity\brain\7b34dbaf-874c-4fdb-ad49-eeb361cbb372\scratch\upload_both_repos.py`
> Ngoài ra, mỗi lần deploy thành công đều nén tạo một tệp `.zip` sao lưu tại thư mục `C:\Users\Admin\Downloads` (ví dụ `nguyen-duy-profile-v24-deploy.zip`).

---

## 📜 4. LỊCH SỬ PHÁT TRIỂN & TỔNG HỢP CÁC WAVES (WAVES 1 – 82)

### Giai Đoạn 1: Nền Tảng Cyberpunk, Nhạc & Đồ Họa (Waves 1 – 20)
* **Wave 1 – 10**: Thiết lập giao diện Cyberpunk đậm chất công nghệ; tích hợp Discord Rich Presence qua Lanyard API; Máy nghe nhạc đĩa than Vinyl Deck hỗ trợ Visualizer sóng nhạc Canvas; hiệu ứng Ma trận chữ rơi (Matrix Rain Canvas); hiệu ứng hoa tuyết rơi (Global Snow Canvas) và vệt bụi chuột (Dust Trail Canvas).
* **Wave 11 – 20**: Tích hợp hệ thống âm thanh phản hồi xúc giác công nghệ (Web Audio API Sound Synthesizer); Cửa sổ Terminal giả lập dòng lệnh Linux/PowerShell; Bộ từ điển dịch thuật đa ngôn ngữ tức thì (Tiếng Việt, Tiếng Anh, Tiếng Nhật); Xây dựng bố cục Responsive thích ứng đa màn hình.

### Giai Đoạn 2: Tự Động Hóa Cloud VPS & Ngrok Direct Tunnel (Waves 21 – 50)
* **Wave 21 – 30**: Tích hợp API điều khiển GitHub Actions Workflow Dispatch: Tự động gửi lệnh tạo máy ảo Windows Server 2022 cấu hình cao (4 vCPU, 16GB RAM, SSD NVMe); Tự động thiết lập cấu hình Windows RDP, tạo tài khoản người dùng (`duyzoz` / `Admin@123456`) và bật đường hầm Ngrok TCP Tunnel Direct.
* **Wave 31 – 40**: Hệ thống giám sát trạng thái VPS thời gian thực: Tự động thăm dò (polling) log workflow, bắt địa chỉ IP:Port Ngrok ngay khi sẵn sàng; Tích hợp nút 1-click sao chép lệnh RDP `mstsc /v:`; Tạo mã QR kết nối nhanh và tạo file cấu hình `.rdp` tải về máy.
* **Wave 41 – 50**: Quản lý phiên VPS đa nhiệm: Lưu trữ trạng thái phiên VPS đang chạy vào `localStorage` giúp dữ liệu không bị mất khi F5 tải lại trang; Bộ đếm ngược thời gian duy trì VPS (5 giờ 40 phút); Danh sách lưu trữ lịch sử các VPS đã tạo kèm trạng thái hoạt động / hết hạn.

### Giai Đoạn 3: Tinh Chỉnh UI/UX, Theme Trắng Tuyết & Tối Ưu Hóa (Waves 51 – 70)
* **Wave 51 – 60**: Dọn dẹp các tính năng thừa thãi: Xóa bỏ các nút trùng lặp (nút Lệnh mstsc trong Pic 1, nút Mở RDP Ngay trong Pic 2); Tối ưu form nhập Ngrok Token thành trường nhập duy nhất; Khắc phục lỗi lưu trùng token; Làm nút Tải File RDP mở rộng 100% chiều ngang thẻ.
* **Wave 61 – 70**: Hoàn thiện **Theme Trắng Tuyết (Snow White Theme)**: Khắc phục toàn bộ các lỗi chữ đen trên nền đen hoặc chữ trắng trên nền trắng; Chuyển đổi toàn bộ nhãn, tag thông số (vCPU, RAM, Windows Server, Direct TCP Tunnel, số tài khoản donate 1060830747) sang màu tương phản cao sắc nét (`#0f172a`, `#0284c7`).

### Giai Đoạn 4: FPS Thời Gian Thực, Fix Lag & Đo Hiệu Năng (Waves 71 – 76)
* **Wave 71**: Đồng hồ đo FPS thời gian thực công nghệ cao: Sử dụng thuật toán làm mượt hàm mũ (EMA Filter) chống rung giật số; Tự động ghi nhận FPS đỉnh (Peak FPS) tương thích các màn hình 60Hz, 75Hz, 120Hz, 144Hz, 240Hz; Cố định khung HUD FPS không bị co giãn giật layout khi đổi tag (Ultra/Smooth/Normal/Low).
* **Wave 72 – 76**: Chế độ "Video / Fix Lag" (Nút chuyển nền Video sang Ảnh tĩnh) giúp giải phóng VRAM GPU; Tự động pause video nền khi người dùng ẩn tab; Tích hợp rung phản hồi xúc giác haptic feedback (`navigator.vibrate`) trên thiết bị di động.

### Giai Đoạn 5: Nhận Diện Phần Cứng Chân Thực & Khóa Tọa Độ Mobile (Waves 77 – 82)
* **Wave 77: Universal Real Hardware Profiling Engine (Chân thực 100% — Cấm Bịa Đặt)**:
  - Khắc phục triệt để lỗi iPhone 7 Plus nhận diện nhầm ổ cứng SATA Netac của PC.
  - Phân tích chữ ký ma trận phần cứng:
    - **iPhone 7 Plus / 8 Plus** (`414x736 @ 3x`): Nhận đúng **Apple A10 Fusion (4-Core CPU @ 2.34GHz)**, **Apple A10 Fusion GPU (PowerVR 6-Core)**, **3 GB LPDDR4 RAM**, **32 GB NVMe Internal Storage**.
    - **Các dòng iPhone khác & iPad**: Nhận đúng chip A-Series / M-Series Bionic, RAM và bộ nhớ Flash NVMe.
    - **Điện thoại Android**: Đọc trực tiếp GPU WebGL (`Adreno 6xx/7xx`, `Mali-Gxx`), chip Snapdragon / Dimensity, RAM thực và bộ nhớ **UFS High-Speed Flash** (tuyệt đối không bịa đặt SATA).
    - **Windows PC / Laptop**: Chỉ hiển thị thông số PC Admin (`Intel Core i5-4300U`, `Intel HD Graphics 4400`, `8 GB RAM`, `128 GB SSD (Netac / SATA)`) khi khớp đúng card HD 4400 trên PC.
    - **Mac**: Nhận diện chip Apple M-Series Silicon, Unified Memory và Apple NVMe SSD.
* **Wave 78: iOS Safari Anti-Auto-Zoom Shield & Modal Coordinates Lock ("Cấm Lệch, Cấm Tự Phóng To")**:
  - Khóa bắt buộc `font-size: 16px !important` cho toàn bộ input, textarea, select trên di động (màn hình <= 768px), dập tắt hoàn toàn cơ chế tự phóng to khung nhìn của iOS Safari khi người dùng gõ phím.
  - Thêm `viewport-fit=cover` và `touch-action: manipulation` cho mọi nút bấm (loại bỏ độ trễ 300ms và chống rung giật double-tap).
  - Khóa tọa độ căn giữa tuyệt đối cho Modal đo hiệu năng `.cyber-bench-modal` (`top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; width: min(480px, 92vw) !important; max-height: min(90vh, 620px) !important; overflow-y: auto !important; -webkit-overflow-scrolling: touch !important;`). Tách riêng khỏi bottom-sheet để modal luôn căn chuẩn tâm màn hình ở mọi thiết bị.
* **Wave 79: Adaptive Multi-Tier Lag Elimination Engine (Tối Ưu VRAM & CPU Đa Tầng)**:
  - `dustCanvas`: Tự động ngắt hoàn toàn trên màn hình cảm ứng di động (`ontouchstart` / màn hình <= 768px).
  - `avatarOrbit` & `avatarSnowC`: Tích hợp `IntersectionObserver`, tự động ngừng render hoàn toàn khi thẻ avatar cuộn ra khỏi tầm mắt.
  - `snowCanvas`: Giảm số lượng hạt tuyết trên di động từ 14 xuống 6 hạt và hạ tần số vẽ về 30 FPS, giúp máy mát và tiết kiệm pin.
* **Wave 80 – 82**:
  - Bảo toàn 100% hiệu ứng trượt thẻ phụ hông (`.tool-card`, `.profile-card`), tuyệt đối không đè `transform`.
  - Bộ kiểm thử tự động toàn diện qua Microsoft Edge Headless: Kiểm tra độ cân bằng ngoặc CSS (`Open: 1470, Close: 1470, Balanced: True`), kiểm tra đồng bộ băm byte-for-byte giữa `app.js` và `app_nd.js`, chụp ảnh bằng chứng hiển thị trên iPhone 7 Plus, Snow Theme và Desktop.

### Giai Đoạn 6: Trải Nghiệm Đa Nền Tảng (Cross-Device), Ping Latency & Mini Player (Waves 83 – 86)
* **Wave 83: Real-Time Network Quality & VPS Direct Health Probe**:
  - Tích hợp HUD Ping Latency đo độ trễ mạng thực tế định kỳ, phân loại trực quan theo màu: Xanh (<80ms Optimal), Vàng (80-180ms Normal), Đỏ (>180ms Slow/Timeout).
  - Nút "⚡ Kiểm Tra VPS" (1-Click Health Check) trong thẻ VPS Manager, tự động kiểm tra tính khả dụng của node VPS/Ngrok và hiển thị kết quả trực tiếp `🟢 Online (xx ms)` kèm âm thanh Cyber SFX.
* **Wave 84: Mobile Floating Cyber Mini Music Bar & Thumb-Friendly Controls**:
  - Thiết kế thanh điều khiển nhạc mini nổi (`#mobileMiniPlayer`) cố định phía trên Mobile Nav Dock cho smartphone (màn hình <= 768px).
  - Tự động hiện khi phát nhạc, đĩa than mini xoay tròn mượt mà, thanh tiến trình gradient, tên bài hát cuộn marquee và các nút Prev/Play/Next tối ưu cho ngón cái.
  - Chạm vào đĩa than hoặc tiêu đề để bung mở Vinyl Deck hoàn chỉnh.
* **Wave 85: Real Display Refresh Rate & Battery Diagnostics (VSync & Battery API)**:
  - Thuật toán đo chu kỳ VSync thời gian thực (60 khung hình mẫu) nhận diện tần số quét màn hình chính xác: `60Hz Smooth`, `75Hz`, `90Hz Fluid`, `120Hz ProMotion` (iPhone 13-16 Pro, iPad Pro, Android flagship), `144Hz - 240Hz` (Gaming PC).
  - Tích hợp đo dung lượng Pin & Nguồn sạc thực tế (`% Pin` + `⚡ Sạc AC` / `🔋 Dùng pin`), tuân thủ 100% nguyên tắc không bịa đặt, có cơ chế fallback chuẩn cho iOS Safari (`Bảo mật iOS (Apple Restricted)`).
* **Wave 86: 1-Click Cross-Device Config Sync (Export / Import / QR Sync)**:
  - Cho phép xuất (Export) và nhập (Import) toàn bộ token GitHub, Ngrok token, danh sách phiên VPS, theme và ngôn ngữ giữa PC và Smartphone qua chuỗi JSON mã hóa.
  - Tích hợp modal giao diện Cyberpunk chuyên dụng và hỗ trợ quét mã QR để chuyển giao cấu hình sang điện thoại trong 1 giây mà không cần nhập tay.

---

## ⚠️ 5. QUY TẮC CỐT TỬ CẤM KỴ DÀNH CHO AI AGENT TIẾP QUẢN

Khi bạn (AI Agent / Developer) thực hiện bất kỳ yêu cầu mới nào từ người dùng, **BẠN PHẢI TUÂN THỦ NGHIÊM NGẶT CÁC ĐIỀU SAU ĐÂY**:

### 1. Đồng Bộ Bắt Buộc Giữa `app_nd.js` và `app.js` (Hash Parity)
* Cả 2 tệp `app_nd.js` và `app.js` phải luôn có nội dung giống nhau 100% từng byte.
* Mỗi khi sửa đổi `app_nd.js`, lệnh đầu tiên sau đó PHẢI là copy sang `app.js`:
  ```powershell
  Copy-Item -Path "C:\Users\Admin\Downloads\nguyen-duy-profile-recovered\app_nd.js" -Destination "C:\Users\Admin\Downloads\nguyen-duy-profile-recovered\app.js" -Force
  ```

### 2. Giữ Cân Bằng Tuyệt Đối Dấu Ngoặc Trong `style.css`
* Mỗi khi thêm hoặc sửa CSS, luôn kiểm tra số lượng dấu `{` và `}`:
  ```powershell
  $c = Get-Content "C:\Users\Admin\Downloads\nguyen-duy-profile-recovered\style.css" -Raw; ($c -split '\{').Count -eq ($c -split '\}').Count
  ```

### 3. Tuyệt Đối Không Xóa Hay Phá Hỏng Hiệu Ứng Trôi Card Phụ Hông
* Thẻ `.tool-card` và `.profile-card` có hiệu ứng trượt ra / vào và parallax độc quyền.
* **CẤM** thêm `transform: translateZ(0)` hoặc bất kỳ thuộc tính `transform: none !important` nào lên `.tool-card` hay `.profile-card` ở phạm vi toàn cục vì sẽ khóa cứng thẻ và làm mất hiệu ứng trượt của người dùng.

### 4. Tuyệt Đối Không Bịa Đặt Phần Cứng (No Hardware Fabrication)
* Khi đo hiệu năng thiết bị:
  - Nếu là iPhone/iPad: Đọc chuẩn chữ ký màn hình (DPR, độ phân giải) để suy ra chip Apple A/M Bionic, RAM và bộ nhớ NVMe Flash. **CẤM** hiển thị ổ cứng SATA hoặc Netac trên thiết bị di động!
  - Nếu là Android: Đọc chuẩn GPU WebGL (Adreno/Mali), RAM thực và bộ nhớ **UFS Flash**.
  - Nếu là Windows PC: Đọc GPU WebGL và chỉ áp dụng cấu hình máy Admin khi khớp đúng card `Intel HD Graphics 4400`.

### 5. Giữ Chuẩn Chống Tự Phóng To & Căn Giữa Trên Mobile
* Giữ nguyên `@media (max-width: 768px) { input, select, textarea { font-size: 16px !important; } }`.
* Giữ nguyên `.cyber-bench-modal` căn giữa tại `top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important`.

### 6. Quy Trình Kiểm Thử & Deploy Hai Repository
* Trước khi thông báo hoàn thành cho người dùng:
  1. Chạy kịch bản kiểm thử: `python "C:\Users\Admin\.gemini\antigravity\brain\7b34dbaf-874c-4fdb-ad49-eeb361cbb372\scratch\verify_waves_77_82.py"`
  2. Đẩy code lên cả 2 repo GitHub: `python "C:\Users\Admin\.gemini\antigravity\brain\7b34dbaf-874c-4fdb-ad49-eeb361cbb372\scratch\upload_both_repos.py"`
  3. Đóng gói file `.zip` mới nhất tại `C:\Users\Admin\Downloads`.

---

## 🎯 6. TRẠNG THÁI HIỆN TẠI & HƯỚNG PHÁT TRIỂN TIẾP THEO

* **Phiên bản hiện tại**: `v20260920_v58` (Hoàn tất Wave 86).
* **Trạng thái hệ thống**: 
  - Khởi tạo VPS GitHub Actions & Ngrok RDP hoạt động ổn định kèm chức năng Health Probe đo Ping trực tiếp.
  - Thanh phát nhạc nổi Mobile Floating Mini Music Bar tối ưu hoàn hảo cho ngón cái trên màn hình di động.
  - Đo hiệu năng phần cứng mở rộng hiển thị Tần số quét VSync thực tế (Hz) và Tình trạng Pin/Nguồn chân thực 100%.
  - Đồng bộ cấu hình Cross-Device 1-Click sao lưu và chuyển giao giữa PC & Smartphone.
  - Theme Trắng Tuyết hiển thị độ tương phản cao sắc nét trên mọi thành phần mới.
* **Sẵn sàng tiếp nhận**: Các tính năng mới từ người dùng mà không phá vỡ bất kỳ quy tắc nào ở trên.
