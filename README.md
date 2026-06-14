<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smartktec Academy | Higher Diploma in Computational Mathematics</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <style>
    :root {
      --primary: #1a1f5e;
      --accent: #f97316;
      --light: #f0f4ff;
      --card: #ffffff;
      --muted: #6b7280;
      --success: #10b981;
      --danger: #ef4444;
      --warn: #f59e0b;
    }
    * { font-family: 'Space Grotesk', sans-serif; box-sizing: border-box; }
    body { background: #f0f4ff; min-height: 100vh; }
    .mono { font-family: 'DM Mono', monospace; }

    /* Sidebar */
    #sidebar {
      width: 260px; min-height: 100vh; background: var(--primary);
      position: fixed; left: 0; top: 0; z-index: 50;
      transition: transform 0.3s ease;
    }
    #sidebar.closed { transform: translateX(-260px); }
    #mainContent { margin-left: 260px; transition: margin 0.3s ease; }
    #mainContent.full { margin-left: 0; }

    /* Cards */
    .glass-card {
      background: rgba(255,255,255,0.95);
      border: 1px solid rgba(255,255,255,0.8);
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(26,31,94,0.08);
    }
    .stat-card {
      background: var(--primary); color: white;
      border-radius: 14px; padding: 20px;
    }
    .stat-card.accent { background: var(--accent); }
    .stat-card.success { background: var(--success); }
    .stat-card.warn { background: var(--warn); }

    /* Progress ring */
    .progress-ring { transform: rotate(-90deg); }
    .progress-ring circle { transition: stroke-dashoffset 0.8s ease; }

    /* Tabs */
    .tab-btn { border-bottom: 2px solid transparent; transition: all 0.2s; }
    .tab-btn.active { border-bottom-color: var(--accent); color: var(--accent); font-weight: 600; }

    /* Week card */
    .week-card {
      border-left: 3px solid var(--accent);
      background: white;
      border-radius: 0 12px 12px 0;
      padding: 14px 16px;
      margin-bottom: 10px;
      transition: box-shadow 0.2s;
    }
    .week-card:hover { box-shadow: 0 4px 16px rgba(249,115,22,0.15); }
    .week-card.done { border-left-color: var(--success); background: #f0fdf4; }

    /* Exam overlay */
    #examOverlay {
      position: fixed; inset: 0; background: rgba(10,10,40,0.97);
      z-index: 200; display: none; overflow-y: auto;
    }

    /* Face monitor */
    #faceMonitor {
      position: fixed; bottom: 16px; right: 16px;
      width: 160px; border-radius: 12px; overflow: hidden;
      border: 2px solid var(--accent); z-index: 300;
      display: none;
    }
    #faceVideo { width: 100%; }
    .face-badge {
      position: absolute; top: 6px; left: 6px;
      background: rgba(0,0,0,0.7); color: #4ade80;
      font-size: 10px; padding: 2px 7px; border-radius: 20px;
    }
    .face-badge.warn { color: #fbbf24; }
    .face-badge.danger { color: #f87171; }

    /* Notification toast */
    #toastContainer { position: fixed; top: 16px; right: 16px; z-index: 999; }
    .toast {
      background: var(--primary); color: white;
      padding: 12px 18px; border-radius: 10px;
      margin-bottom: 8px; font-size: 13px;
      border-left: 4px solid var(--accent);
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease;
    }
    .toast.success { border-left-color: var(--success); }
    .toast.error { border-left-color: var(--danger); }
    @keyframes slideIn { from { transform: translateX(60px); opacity:0; } to { transform:translateX(0); opacity:1; } }

    /* Auth */
    #authContainer { max-width: 440px; margin: 60px auto; }
    .input-field {
      width: 100%; padding: 12px 16px;
      border: 1.5px solid #e5e7eb; border-radius: 10px;
      font-size: 14px; outline: none; transition: border 0.2s;
    }
    .input-field:focus { border-color: var(--primary); }
    .btn-primary {
      background: var(--primary); color: white;
      padding: 12px 24px; border-radius: 10px;
      font-weight: 600; cursor: pointer; border: none;
      transition: opacity 0.2s; width: 100%;
    }
    .btn-primary:hover { opacity: 0.88; }
    .btn-accent {
      background: var(--accent); color: white;
      padding: 12px 24px; border-radius: 10px;
      font-weight: 600; cursor: pointer; border: none;
      transition: opacity 0.2s; width: 100%;
    }
    .btn-accent:hover { opacity: 0.88; }

    /* Certificate */
    #certCanvas {
      border: 8px double gold;
      background: linear-gradient(135deg,#fffbeb 0%,#fef3c7 50%,#fffbeb 100%);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      #sidebar { transform: translateX(-260px); }
      #sidebar.open { transform: translateX(0); }
      #mainContent { margin-left: 0; }
    }

    /* Leaderboard */
    .lb-row { transition: background 0.2s; }
    .lb-row:hover { background: #f0f4ff; }

    /* Discussion */
    .msg-bubble {
      background: white; border-radius: 0 12px 12px 12px;
      padding: 10px 14px; max-width: 80%;
    }
    .msg-bubble.own { background: var(--primary); color: white; border-radius: 12px 0 12px 12px; margin-left: auto; }

    /* Watermark */
    .watermark {
      position: fixed; bottom: 20px; left: 50%;
      transform: translateX(-50%) rotate(-30deg);
      font-size: 64px; color: rgba(26,31,94,0.04);
      font-weight: 900; pointer-events: none; z-index: 1;
      white-space: nowrap; letter-spacing: 8px;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 3px; }
  </style>
</head>
<body>
<div class="watermark">KALMA</div>
<div id="toastContainer"></div>

<!-- ═══════════════════ AUTH SCREEN ═══════════════════ -->
<div id="authScreen">
  <div id="authContainer" class="glass-card p-8">
    <div class="text-center mb-6">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style="background:var(--primary)">
        <i class="fas fa-graduation-cap text-2xl text-orange-400"></i>
      </div>
      <h1 class="text-2xl font-bold" style="color:var(--primary)">Smartktec International Academy</h1>
      <p class="text-sm text-gray-500 mt-1">Higher Diploma in Computational Mathematics</p>
      <p class="text-xs mono mt-1" style="color:var(--accent)">Basic → Advanced AI & ML | 12 Months</p>
      <!-- QR Code -->
      <div class="flex flex-col items-center mt-4">
        <div id="qrCode" class="mb-1"></div>
        <p class="text-xs text-gray-400">Scan to enrol via Selar</p>
      </div>
    </div>
    <!-- Tabs -->
    <div class="flex border-b mb-5">
      <button id="loginTab" class="tab-btn active px-5 py-2 text-sm" onclick="switchAuthTab('login')">Login</button>
      <button id="signupTab" class="tab-btn px-5 py-2 text-sm text-gray-500" onclick="switchAuthTab('signup')">Sign Up</button>
    </div>
    <!-- Login -->
    <div id="loginForm">
      <div class="space-y-3 mb-4">
        <input id="loginEmail" type="email" class="input-field" placeholder="Email address">
        <input id="loginPassword" type="password" class="input-field" placeholder="Password">
      </div>
      <button class="btn-primary" onclick="doLogin()">Login to Dashboard</button>
      <p id="loginErr" class="text-red-500 text-xs text-center mt-2"></p>
      <p class="text-xs text-center text-gray-400 mt-3">Demo: any email + password "1234"</p>
    </div>
    <!-- Signup -->
    <div id="signupForm" class="hidden">
      <div class="space-y-3 mb-4">
        <input id="signupName" type="text" class="input-field" placeholder="Full Name">
        <input id="signupEmail" type="email" class="input-field" placeholder="Email address">
        <input id="signupPass" type="password" class="input-field" placeholder="Password (min 4 chars)">
      </div>
      <button class="btn-accent" onclick="doSignup()">Create Account</button>
      <p id="signupErr" class="text-red-500 text-xs text-center mt-2"></p>
    </div>
    <!-- Verify -->
    <div id="verifyPanel" class="hidden mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
      <p class="text-sm font-semibold">📧 Email Verification</p>
      <p id="verifyEmailTxt" class="text-xs text-gray-600 mb-2"></p>
      <input id="verifyCode" type="text" class="input-field text-center mono text-lg" placeholder="6-digit code">
      <button class="btn-primary mt-2" onclick="doVerify()">Verify & Continue</button>
      <p id="verifyErr" class="text-red-500 text-xs mt-1"></p>
      <p class="text-xs text-gray-400 mt-2">Demo code shown in console & alert</p>
    </div>
  </div>
</div>

<!-- ═══════════════════ LMS APP ═══════════════════ -->
<div id="lmsApp" class="hidden">
  <!-- Sidebar -->
  <aside id="sidebar">
    <div class="p-5 border-b border-indigo-800">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-orange-500">
          <i class="fas fa-graduation-cap text-white text-sm"></i>
        </div>
        <div>
          <p class="text-white text-sm font-bold leading-none">Smartktec</p>
          <p class="text-indigo-300 text-xs">Academy LMS</p>
        </div>
      </div>
    </div>
    <nav class="p-4 space-y-1">
      <a class="nav-link active" onclick="showSection('dashboard')"><i class="fas fa-house-chimney w-5"></i> Dashboard</a>
      <a class="nav-link" onclick="showSection('courses')"><i class="fas fa-book-open w-5"></i> Course Content</a>
      <a class="nav-link" onclick="showSection('exams')"><i class="fas fa-pen-to-square w-5"></i> Exams & Tests</a>
      <a class="nav-link" onclick="showSection('certificates')"><i class="fas fa-certificate w-5"></i> Certificates</a>
      <a class="nav-link" onclick="showSection('leaderboard')"><i class="fas fa-trophy w-5"></i> Leaderboard</a>
      <a class="nav-link" onclick="showSection('discussions')"><i class="fas fa-comments w-5"></i> Discussion</a>
      <a class="nav-link" onclick="showSection('resources')"><i class="fas fa-file-pdf w-5"></i> Resources & PDFs</a>
      <a class="nav-link" onclick="showSection('profile')"><i class="fas fa-user-circle w-5"></i> Profile</a>
    </nav>
    <div class="absolute bottom-4 left-0 right-0 px-4">
      <div class="p-3 rounded-xl bg-indigo-800 mb-3">
        <p class="text-xs text-indigo-300">Watermarked by</p>
        <p class="text-white text-sm font-bold mono">© Kalma</p>
      </div>
      <button class="w-full text-indigo-300 text-sm hover:text-white py-2" onclick="doLogout()">
        <i class="fas fa-sign-out-alt mr-2"></i>Logout
      </button>
    </div>
  </aside>

  <!-- Topbar -->
  <div id="mainContent">
    <header class="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-40" style="box-shadow:0 1px 8px rgba(26,31,94,0.07)">
      <div class="flex items-center gap-4">
        <button id="sidebarToggle" class="text-gray-500 hover:text-gray-700" onclick="toggleSidebar()">
          <i class="fas fa-bars text-xl"></i>
        </button>
        <h2 id="pageTitle" class="font-semibold text-gray-800">Dashboard</h2>
      </div>
      <div class="flex items-center gap-3">
        <div id="xpBadge" class="mono text-xs px-3 py-1 rounded-full font-bold" style="background:#fef3c7;color:#b45309">0 XP</div>
        <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style="background:var(--accent)" id="avatarCircle">K</div>
      </div>
    </header>

    <!-- SECTIONS -->
    <main class="p-6">

      <!-- ── DASHBOARD ── -->
      <section id="sec-dashboard" class="section-page">
        <div id="welcomeBanner" class="rounded-2xl p-6 mb-6 text-white" style="background:linear-gradient(135deg,#1a1f5e 0%,#2d3494 100%)">
          <h2 class="text-2xl font-bold mb-1">Welcome back, <span id="dashUserName">Student</span>! 👋</h2>
          <p class="text-indigo-200 text-sm">Your Higher Diploma journey continues. Keep going!</p>
          <div class="mt-4 flex gap-4 flex-wrap">
            <div class="bg-white bg-opacity-10 rounded-xl px-4 py-2 text-sm">
              <span id="daysActive">0</span> days active
            </div>
            <div class="bg-white bg-opacity-10 rounded-xl px-4 py-2 text-sm">
              <span id="weeksDone">0</span> weeks completed
            </div>
            <div class="bg-white bg-opacity-10 rounded-xl px-4 py-2 text-sm">
              <span id="examsPassed">0</span>/4 exams passed
            </div>
          </div>
        </div>

        <!-- Stat Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="stat-card">
            <p class="text-xs text-indigo-200 mb-1">Overall Progress</p>
            <p class="text-3xl font-bold" id="statProgress">0%</p>
            <i class="fas fa-chart-line mt-2 text-indigo-300"></i>
          </div>
          <div class="stat-card accent">
            <p class="text-xs text-orange-100 mb-1">XP Points</p>
            <p class="text-3xl font-bold" id="statXP">0</p>
            <i class="fas fa-star mt-2 text-orange-200"></i>
          </div>
          <div class="stat-card success">
            <p class="text-xs text-green-100 mb-1">Weeks Done</p>
            <p class="text-3xl font-bold" id="statWeeks">0/39</p>
            <i class="fas fa-check-circle mt-2 text-green-200"></i>
          </div>
          <div class="stat-card warn">
            <p class="text-xs text-amber-100 mb-1">Current Streak</p>
            <p class="text-3xl font-bold" id="statStreak">0🔥</p>
            <i class="fas fa-fire mt-2 text-amber-200"></i>
          </div>
        </div>

        <!-- Progress ring + recent activity -->
        <div class="grid md:grid-cols-2 gap-6">
          <div class="glass-card p-6">
            <h3 class="font-semibold mb-4 text-gray-700">Course Progress by Quarter</h3>
            <div id="quarterBars"></div>
          </div>
          <div class="glass-card p-6">
            <h3 class="font-semibold mb-4 text-gray-700">Recent Activity</h3>
            <div id="activityFeed" class="space-y-3 text-sm text-gray-600">
              <p class="text-gray-400 text-sm">No activity yet. Start a lesson!</p>
            </div>
          </div>
        </div>

        <!-- Announcements -->
        <div class="glass-card p-5 mt-6">
          <h3 class="font-semibold mb-3 text-gray-700"><i class="fas fa-bullhorn text-orange-400 mr-2"></i>Announcements</h3>
          <div class="space-y-2 text-sm">
            <div class="flex gap-3 p-3 rounded-xl bg-indigo-50">
              <span class="text-lg">📌</span>
              <div><p class="font-medium text-gray-800">Q1 Exam is now available</p><p class="text-xs text-gray-500">Complete Months 1–3 before attempting</p></div>
            </div>
            <div class="flex gap-3 p-3 rounded-xl bg-amber-50">
              <span class="text-lg">🎓</span>
              <div><p class="font-medium text-gray-800">Certificates available for 4-quarter completions</p><p class="text-xs text-gray-500">Auto-generated with your name &amp; watermark</p></div>
            </div>
            <div class="flex gap-3 p-3 rounded-xl bg-green-50">
              <span class="text-lg">📥</span>
              <div><p class="font-medium text-gray-800">All course PDFs available in Resources</p><p class="text-xs text-gray-500">Download study material per month</p></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── COURSES ── -->
      <section id="sec-courses" class="section-page hidden">
        <div class="flex items-center gap-3 mb-5">
          <div>
            <h3 class="text-xl font-bold text-gray-800">Course Content</h3>
            <p class="text-sm text-gray-500">12-month Higher Diploma — Basic to Advanced</p>
          </div>
          <div class="ml-auto">
            <select id="quarterFilter" class="input-field text-sm" style="width:auto;padding:8px 14px" onchange="renderCourses()">
              <option value="all">All Quarters</option>
              <option value="1">Quarter 1</option>
              <option value="2">Quarter 2</option>
              <option value="3">Quarter 3</option>
              <option value="4">Quarter 4</option>
            </select>
          </div>
        </div>
        <div id="coursesGrid"></div>
      </section>

      <!-- ── EXAMS ── -->
      <section id="sec-exams" class="section-page hidden">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Exams & Assessments</h3>
        <p class="text-sm text-gray-500 mb-5">Face monitoring is active during all exams. Ensure good lighting and stay in frame.</p>
        <div class="grid md:grid-cols-2 gap-4" id="examCards"></div>
      </section>

      <!-- ── CERTIFICATES ── -->
      <section id="sec-certificates" class="section-page hidden">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Your Certificates</h3>
        <p class="text-sm text-gray-500 mb-5">Certificates are awarded upon passing all 4 quarterly exams.</p>
        <div id="certArea"></div>
      </section>

      <!-- ── LEADERBOARD ── -->
      <section id="sec-leaderboard" class="section-page hidden">
        <h3 class="text-xl font-bold text-gray-800 mb-5">🏆 Global Leaderboard</h3>
        <div class="glass-card overflow-hidden">
          <table class="w-full text-sm">
            <thead style="background:var(--primary);color:white">
              <tr><th class="py-3 px-4 text-left">#</th><th class="py-3 px-4 text-left">Student</th><th class="py-3 px-4 text-center">XP</th><th class="py-3 px-4 text-center">Weeks</th><th class="py-3 px-4 text-center">Exams</th></tr>
            </thead>
            <tbody id="lbBody"></tbody>
          </table>
        </div>
      </section>

      <!-- ── DISCUSSIONS ── -->
      <section id="sec-discussions" class="section-page hidden">
        <h3 class="text-xl font-bold text-gray-800 mb-5">💬 Discussion Forum</h3>
        <div class="glass-card p-5">
          <div id="msgFeed" class="space-y-4 mb-4 max-h-96 overflow-y-auto"></div>
          <div class="flex gap-3">
            <input id="msgInput" type="text" class="input-field flex-1" placeholder="Ask a question or share insight...">
            <button class="btn-accent" style="width:auto;padding:12px 20px" onclick="postMsg()"><i class="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </section>

      <!-- ── RESOURCES ── -->
      <section id="sec-resources" class="section-page hidden">
        <h3 class="text-xl font-bold text-gray-800 mb-2">📚 Resources & PDF Downloads</h3>
        <p class="text-sm text-gray-500 mb-5">Download detailed course notes for each month. Watermarked by Kalma.</p>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4" id="resourceGrid"></div>
      </section>

      <!-- ── PROFILE ── -->
      <section id="sec-profile" class="section-page hidden">
        <h3 class="text-xl font-bold text-gray-800 mb-5">My Profile</h3>
        <div class="glass-card p-6 max-w-lg">
          <div class="flex items-center gap-4 mb-5">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold" style="background:var(--primary)" id="profileAvatar">K</div>
            <div>
              <p class="font-bold text-gray-800" id="profileName">Student</p>
              <p class="text-sm text-gray-500" id="profileEmail">email</p>
              <span class="text-xs px-2 py-1 rounded-full mono" style="background:#fef3c7;color:#b45309" id="
