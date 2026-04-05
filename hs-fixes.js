// hs-fixes.js — OG Shoots real-time wiring (runs after hs-firebase.js)
// Patches admin switchTab, blog/press/vibe pages, customer wallet, notifications

(function waitForFB() {
  // Wait until hs-firebase.js has exposed getDB via fbSave
  if (typeof window.fbSave === 'undefined') { setTimeout(waitForFB, 80); return; }

  var FB_CFG = {
    apiKey: 'AIzaSyAtkcHfgNx9xEcyMC50eRX5VPv1r7O5XyE',
    authDomain: 'hash-shoots.firebaseapp.com',
    projectId: 'hash-shoots',
    storageBucket: 'hash-shoots.firebasestorage.app',
    messagingSenderId: '1093054616221',
    appId: '1:1093054616221:web:55bdebafc895acfd04fa74'
  };

  var _db = null, _s = null;
  async function db() {
    if (_db) return { db: _db, s: _s };
    var m = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    _s    = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    var app = m.getApps().find(function(a){ return a.name === 'hs-fixes'; }) || m.initializeApp(FB_CFG, 'hs-fixes');
    _db = _s.getFirestore(app);
    return { db: _db, s: _s };
  }

  // ── 1. STAFF VIDEOS real-time in admin ──────────────────────────────────
  window.syncStaffVideosRealtime = async function(callback) {
    try {
      var f = await db();
      return f.s.onSnapshot(
        f.s.query(f.s.collection(f.db, 'staff_videos'), f.s.orderBy('createdAt', 'desc')),
        function(snap) {
          var list = [];
          snap.forEach(function(d){ list.push(Object.assign({ id: d.id }, d.data())); });
          localStorage.setItem('hs_staff_videos', JSON.stringify(list));
          if (callback) callback(list);
        }
      );
    } catch(e) { console.error('syncStaffVideosRealtime:', e); }
  };

  // ── 2. CITIES — admin saves, customer/booking loads ──────────────────────
  window.saveCitiesToFirebase = async function(cities) {
    try {
      var f = await db();
      await f.s.setDoc(f.s.doc(f.db, 'settings', 'cities'), { items: cities, updatedAt: f.s.serverTimestamp() }, { merge: true });
      localStorage.setItem('hs_cities', JSON.stringify(cities));
      return true;
    } catch(e) { console.error('saveCitiesToFirebase:', e); return false; }
  };

  window.loadCitiesFromFirebase = async function() {
    try {
      var f = await db();
      var snap = await f.s.getDoc(f.s.doc(f.db, 'settings', 'cities'));
      if (snap.exists() && snap.data().items) {
        localStorage.setItem('hs_cities', JSON.stringify(snap.data().items));
        return snap.data().items;
      }
    } catch(e) { console.error('loadCitiesFromFirebase:', e); }
    return JSON.parse(localStorage.getItem('hs_cities') || '[]');
  };

  // ── 3. WITHDRAW — load from Firestore ────────────────────────────────────
  window.loadWithdrawFromFirebase = async function() {
    try {
      var f = await db();
      var snap = await f.s.getDocs(f.s.query(f.s.collection(f.db, 'payout_requests'), f.s.orderBy('createdAt', 'desc')));
      var list = [];
      snap.forEach(function(d){ list.push(Object.assign({ id: d.id }, d.data())); });
      if (list.length) localStorage.setItem('hs_payout_requests', JSON.stringify(list));
      return list;
    } catch(e) { return JSON.parse(localStorage.getItem('hs_payout_requests') || '[]'); }
  };

  window.listenPayoutRequests = async function(callback) {
    try {
      var f = await db();
      return f.s.onSnapshot(f.s.collection(f.db, 'payout_requests'), function(snap) {
        var list = [];
        snap.forEach(function(d){ list.push(Object.assign({ id: d.id }, d.data())); });
        localStorage.setItem('hs_payout_requests', JSON.stringify(list));
        if (callback) callback(list);
      });
    } catch(e) { console.error('listenPayoutRequests:', e); }
  };

  // ── 4. RAZORPAY — save from admin, load in customer & staff ──────────────
  window.saveRazorpayToFirebase = async function(cfg) {
    try {
      var f = await db();
      await f.s.setDoc(f.s.doc(f.db, 'razorpay_config', 'main'), Object.assign({}, cfg, { updatedAt: f.s.serverTimestamp() }), { merge: true });
      localStorage.setItem('hs_razorpay', JSON.stringify(cfg));
      return true;
    } catch(e) { console.error('saveRazorpayToFirebase:', e); return false; }
  };

  window.loadRazorpayFromFirebase = async function() {
    try {
      var f = await db();
      var snap = await f.s.getDoc(f.s.doc(f.db, 'razorpay_config', 'main'));
      if (snap.exists()) {
        var cfg = Object.assign({}, snap.data());
        delete cfg.updatedAt;
        localStorage.setItem('hs_razorpay', JSON.stringify(cfg));
        return cfg;
      }
    } catch(e) { console.error('loadRazorpayFromFirebase:', e); }
    return JSON.parse(localStorage.getItem('hs_razorpay') || '{}');
  };

  // ── 5. SETTINGS — save/load ───────────────────────────────────────────────
  window.saveSettingsToFirebase = async function(cfg) {
    try {
      var f = await db();
      await f.s.setDoc(f.s.doc(f.db, 'config', 'settings'), Object.assign({}, cfg, { updatedAt: f.s.serverTimestamp() }), { merge: true });
      localStorage.setItem('hs_settings', JSON.stringify(cfg));
      return true;
    } catch(e) { console.error('saveSettingsToFirebase:', e); return false; }
  };

  window.loadSettingsFromFirebase = async function() {
    try {
      var f = await db();
      var snap = await f.s.getDoc(f.s.doc(f.db, 'config', 'settings'));
      if (snap.exists()) { localStorage.setItem('hs_settings', JSON.stringify(snap.data())); return snap.data(); }
    } catch(e) {}
    return JSON.parse(localStorage.getItem('hs_settings') || '{}');
  };

  // ── 6. CUSTOMER WALLETS ───────────────────────────────────────────────────
  window.setCustWalletFirebase = async function(email, balance) {
    try {
      var f = await db();
      var key = 'cw_' + email.replace(/[^a-zA-Z0-9]/g, '_');
      await f.s.setDoc(f.s.doc(f.db, 'customer_wallets', key), { email: email, balance: balance, updatedAt: f.s.serverTimestamp() }, { merge: true });
      localStorage.setItem('hs_cw_' + email, String(balance));
      return true;
    } catch(e) { console.error('setCustWalletFirebase:', e); return false; }
  };
  window.saveCustWalletFirebase   = window.setCustWalletFirebase;
  window.saveCustWalletToFirebase = window.setCustWalletFirebase;

  window.loadCustWalletFromFirebase = async function(email) {
    try {
      var f = await db();
      var key = 'cw_' + email.replace(/[^a-zA-Z0-9]/g, '_');
      var snap = await f.s.getDoc(f.s.doc(f.db, 'customer_wallets', key));
      if (snap.exists()) {
        var bal = snap.data().balance || 0;
        localStorage.setItem('hs_cw_' + email, String(bal));
        localStorage.setItem('hs_customer_wallet', String(bal));
        return bal;
      }
    } catch(e) {}
    return parseInt(localStorage.getItem('hs_cw_' + email) || localStorage.getItem('hs_customer_wallet') || '0');
  };

  window.loadCustWalletsFromFirebase = async function() {
    try {
      var f = await db();
      var snap = await f.s.getDocs(f.s.collection(f.db, 'customer_wallets'));
      snap.forEach(function(d){ var data = d.data(); if (data.email) localStorage.setItem('hs_cw_' + data.email, String(data.balance || 0)); });
    } catch(e) {}
  };

  // ── 7. TESTIMONIAL VIDEOS — Discover page ────────────────────────────────
  window.loadTestiVideosFromFirebase = async function() {
    try {
      var f = await db();
      var snap = await f.s.getDocs(f.s.query(f.s.collection(f.db, 'testimonial_videos'), f.s.orderBy('createdAt', 'desc')));
      var list = [];
      snap.forEach(function(d){ list.push(Object.assign({ id: d.id }, d.data())); });
      if (list.length) localStorage.setItem('hs_testi_videos', JSON.stringify(list));
      return list;
    } catch(e) { return JSON.parse(localStorage.getItem('hs_testi_videos') || '[]'); }
  };

  window.listenTestiVideos = async function(callback) {
    try {
      var f = await db();
      return f.s.onSnapshot(f.s.collection(f.db, 'testimonial_videos'), function(snap) {
        var list = [];
        snap.forEach(function(d){ list.push(Object.assign({ id: d.id }, d.data())); });
        localStorage.setItem('hs_testi_videos', JSON.stringify(list));
        if (callback) callback(list);
      });
    } catch(e) { console.error('listenTestiVideos:', e); }
  };

  // ── 8. ADMIN NOTIFICATIONS ────────────────────────────────────────────────
  window.pushAdminNotif = async function(type, title, message, actionTab) {
    try {
      var f = await db();
      await f.s.addDoc(f.s.collection(f.db, 'admin_notifications'), {
        type: type, title: title, message: message, actionTab: actionTab || '', read: false, createdAt: f.s.serverTimestamp()
      });
    } catch(e) { console.error('pushAdminNotif:', e); }
  };

  window.listenAdminNotifications = async function(callback) {
    try {
      var f = await db();
      return f.s.onSnapshot(
        f.s.query(f.s.collection(f.db, 'admin_notifications'), f.s.orderBy('createdAt', 'desc')),
        function(snap) {
          var list = [];
          snap.forEach(function(d){ list.push(Object.assign({ _fbId: d.id }, d.data())); });
          localStorage.setItem('hs_admin_notifications', JSON.stringify(list));
          if (callback) callback(list);
        }
      );
    } catch(e) { console.error('listenAdminNotifications:', e); }
  };

  window.markNotifRead = async function(fbId) {
    try {
      var f = await db();
      await f.s.setDoc(f.s.doc(f.db, 'admin_notifications', String(fbId)), { read: true }, { merge: true });
    } catch(e) {}
  };

  // ── 9. BLOG ───────────────────────────────────────────────────────────────
  window.saveBlogToFirebase = async function(posts) {
    try {
      var f = await db();
      await f.s.setDoc(f.s.doc(f.db, 'settings', 'blogs'), { items: posts, updatedAt: f.s.serverTimestamp() }, { merge: true });
      localStorage.setItem('hs_blogs', JSON.stringify(posts));
      return true;
    } catch(e) { console.error('saveBlogToFirebase:', e); return false; }
  };

  window.loadBlogFromFirebase = async function() {
    try {
      var f = await db();
      var snap = await f.s.getDoc(f.s.doc(f.db, 'settings', 'blogs'));
      if (snap.exists() && snap.data().items) {
        localStorage.setItem('hs_blogs', JSON.stringify(snap.data().items));
        return snap.data().items;
      }
    } catch(e) {}
    return JSON.parse(localStorage.getItem('hs_blogs') || '[]');
  };

  // ── 10. PRESS ─────────────────────────────────────────────────────────────
  window.savePressToFirebase = async function(items) {
    try {
      var f = await db();
      await f.s.setDoc(f.s.doc(f.db, 'settings', 'press'), { items: items, updatedAt: f.s.serverTimestamp() }, { merge: true });
      localStorage.setItem('hs_press', JSON.stringify(items));
      return true;
    } catch(e) { console.error('savePressToFirebase:', e); return false; }
  };

  window.savePressStatsToFirebase = async function(stats) {
    try {
      var f = await db();
      await f.s.setDoc(f.s.doc(f.db, 'settings', 'press_stats'), Object.assign({}, stats, { updatedAt: f.s.serverTimestamp() }), { merge: true });
      localStorage.setItem('hs_press_stats', JSON.stringify(stats));
      return true;
    } catch(e) { console.error('savePressStatsToFirebase:', e); return false; }
  };

  window.loadPressFromFirebase = async function() {
    try {
      var f = await db();
      var snap = await f.s.getDoc(f.s.doc(f.db, 'settings', 'press'));
      if (snap.exists() && snap.data().items) localStorage.setItem('hs_press', JSON.stringify(snap.data().items));
      var sSnap = await f.s.getDoc(f.s.doc(f.db, 'settings', 'press_stats'));
      if (sSnap.exists()) localStorage.setItem('hs_press_stats', JSON.stringify(sSnap.data()));
    } catch(e) {}
  };

  // ── 11. CAREER APPS ───────────────────────────────────────────────────────
  window.loadCareerAppsFromFirebase = async function() {
    try {
      var f = await db();
      var snap = await f.s.getDocs(f.s.query(f.s.collection(f.db, 'career_applications'), f.s.orderBy('createdAt', 'desc')));
      var list = [];
      snap.forEach(function(d){ list.push(Object.assign({ _fbId: d.id }, d.data())); });
      if (list.length) localStorage.setItem('hs_career_applications', JSON.stringify(list));
      return list;
    } catch(e) { return JSON.parse(localStorage.getItem('hs_career_applications') || '[]'); }
  };

  window.listenCareerApps = async function(callback) {
    try {
      var f = await db();
      return f.s.onSnapshot(f.s.collection(f.db, 'career_applications'), function(snap) {
        var list = [];
        snap.forEach(function(d){ list.push(Object.assign({ _fbId: d.id }, d.data())); });
        localStorage.setItem('hs_career_applications', JSON.stringify(list));
        if (callback) callback(list);
      });
    } catch(e) { console.error('listenCareerApps:', e); }
  };

  // ── 12. AFFILIATE APPS ────────────────────────────────────────────────────
  window.loadAffiliateAppsFromFirebase = async function() {
    try {
      var f = await db();
      var snap = await f.s.getDocs(f.s.query(f.s.collection(f.db, 'affiliate_applications'), f.s.orderBy('createdAt', 'desc')));
      var list = [];
      snap.forEach(function(d){ list.push(Object.assign({ _fbId: d.id }, d.data())); });
      if (list.length) localStorage.setItem('hs_affiliate_applications', JSON.stringify(list));
      return list;
    } catch(e) { return JSON.parse(localStorage.getItem('hs_affiliate_applications') || '[]'); }
  };

  window.listenAffiliateApps = async function(callback) {
    try {
      var f = await db();
      return f.s.onSnapshot(f.s.collection(f.db, 'affiliate_applications'), function(snap) {
        var list = [];
        snap.forEach(function(d){ list.push(Object.assign({ _fbId: d.id }, d.data())); });
        localStorage.setItem('hs_affiliate_applications', JSON.stringify(list));
        if (callback) callback(list);
      });
    } catch(e) { console.error('listenAffiliateApps:', e); }
  };

  console.log('[OG Shoots] hs-fixes.js ready — project: hash-shoots');
})();

// ── SECURITY: XSS Sanitization ───────────────────────────────────────────────
window.hsSanitize = function(str) {
  if (typeof str !== 'string') return '';
  // Only encode characters that are dangerous in HTML context
  // Do NOT encode ' or / as they break JS strings when used in innerHTML
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

// Sanitize all text rendered into innerHTML across the site
window.hsRenderSafe = function(el, html) {
  if (!el) return;
  // Only allow safe HTML — strip script tags
  var safe = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                 .replace(/on\w+\s*=/gi, 'data-blocked=');
  el.innerHTML = safe;
};

// Rate limiting for login attempts
(function() {
  var _attempts = 0, _lockUntil = 0;
  window.hsCheckRateLimit = function() {
    var now = Date.now();
    if (now < _lockUntil) {
      var secs = Math.ceil((_lockUntil - now) / 1000);
      alert('Too many attempts. Please wait ' + secs + ' seconds.');
      return false;
    }
    _attempts++;
    if (_attempts >= 5) { _lockUntil = now + 30000; _attempts = 0; }
    return true;
  };
})();

console.log('[OG Shoots] Security helpers ready');
