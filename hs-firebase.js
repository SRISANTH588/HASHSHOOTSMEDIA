// hs-firebase.js — OG Shoots Firebase Sync Engine
// Single source of truth for all Firestore operations

const FB_CFG = {
  apiKey: 'AIzaSyAtkcHfgNx9xEcyMC50eRX5VPv1r7O5XyE',
  authDomain: 'hash-shoots.firebaseapp.com',
  projectId: 'hash-shoots',
  storageBucket: 'hash-shoots.firebasestorage.app',
  messagingSenderId: '1093054616221',
  appId: '1:1093054616221:web:55bdebafc895acfd04fa74'
};

let _db = null, _fbMod = null, _fbStore = null;

async function getDB() {
  if (_db) return _db;
  _fbMod   = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
  _fbStore = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
  const app = _fbMod.getApps().find(a => a.name === 'hs-main') || _fbMod.initializeApp(FB_CFG, 'hs-main');
  _db = _fbStore.getFirestore(app);
  return _db;
}

// ── CORE CRUD ─────────────────────────────────────────────────────────────────

window.fbSave = async function(col, data) {
  try {
    const db = await getDB();
    const ref = await _fbStore.addDoc(_fbStore.collection(db, col), { ...data, createdAt: _fbStore.serverTimestamp() });
    return ref.id;
  } catch(e) { console.error('fbSave:', col, e); return null; }
};

window.fbUpdate = async function(col, docId, data) {
  try {
    const db = await getDB();
    await _fbStore.setDoc(_fbStore.doc(db, col, String(docId)), { ...data, updatedAt: _fbStore.serverTimestamp() }, { merge: true });
    return true;
  } catch(e) { console.error('fbUpdate:', col, docId, e); return false; }
};

window.fbDelete = async function(col, docId) {
  try {
    const db = await getDB();
    await _fbStore.deleteDoc(_fbStore.doc(db, col, String(docId)));
    return true;
  } catch(e) { console.error('fbDelete:', e); return false; }
};

window.fbGet = async function(col, docId) {
  try {
    const db = await getDB();
    const snap = await _fbStore.getDoc(_fbStore.doc(db, col, String(docId)));
    return snap.exists() ? { _fbId: snap.id, ...snap.data() } : null;
  } catch(e) { console.error('fbGet:', e); return null; }
};

window.fbGetAll = async function(col) {
  try {
    const db = await getDB();
    const snap = await _fbStore.getDocs(_fbStore.collection(db, col));
    const docs = [];
    snap.forEach(d => docs.push({ _fbId: d.id, ...d.data() }));
    return docs;
  } catch(e) { console.error('fbGetAll:', e); return []; }
};

window.fbListen = async function(col, callback, orderField) {
  try {
    const db = await getDB();
    const q = orderField
      ? _fbStore.query(_fbStore.collection(db, col), _fbStore.orderBy(orderField, 'desc'))
      : _fbStore.collection(db, col);
    return _fbStore.onSnapshot(q, snap => {
      const docs = [];
      snap.forEach(d => docs.push({ _fbId: d.id, ...d.data() }));
      callback(docs);
    });
  } catch(e) { console.error('fbListen:', col, e); }
};

window.fbListenDoc = async function(col, docId, callback) {
  try {
    const db = await getDB();
    return _fbStore.onSnapshot(_fbStore.doc(db, col, String(docId)), snap => {
      if (snap.exists()) callback({ _fbId: snap.id, ...snap.data() });
    });
  } catch(e) { console.error('fbListenDoc:', col, docId, e); }
};

// ── STAFF WALLET ──────────────────────────────────────────────────────────────

window.fbCreditWallet = async function(staffId, amount, label, note) {
  try {
    const db  = await getDB();
    const ref = _fbStore.doc(db, 'wallets', String(staffId));
    const snap = await _fbStore.getDoc(ref);
    const w = snap.exists() ? snap.data() : { balance:0, totalEarned:0, pending:0, withdrawn:0, transactions:[] };
    const txns = Array.isArray(w.transactions) ? w.transactions : [];
    txns.push({ type:'credit', amount, label, note, date: new Date().toLocaleString() });
    await _fbStore.setDoc(ref, {
      balance:      (w.balance      || 0) + amount,
      totalEarned:  (w.totalEarned  || 0) + amount,
      pending:      Math.max(0, (w.pending || 0) - amount),
      withdrawn:    w.withdrawn || 0,
      transactions: txns,
      updatedAt:    _fbStore.serverTimestamp()
    }, { merge: true });
    const key = 'hs_wallet_' + staffId;
    const local = JSON.parse(localStorage.getItem(key) || '{}');
    local.balance     = (local.balance     || 0) + amount;
    local.totalEarned = (local.totalEarned || 0) + amount;
    local.pending     = Math.max(0, (local.pending || 0) - amount);
    if (!Array.isArray(local.transactions)) local.transactions = [];
    local.transactions.push({ type:'credit', amount, label, note, date: new Date().toLocaleString() });
    localStorage.setItem(key, JSON.stringify(local));
    return true;
  } catch(e) { console.error('fbCreditWallet:', e); return false; }
};

// ── RAZORPAY ──────────────────────────────────────────────────────────────────

window.saveRazorpayToFirebase = async function(cfg) {
  try {
    const db = await getDB();
    await _fbStore.setDoc(_fbStore.doc(db, 'razorpay_config', 'main'), { ...cfg, updatedAt: _fbStore.serverTimestamp() }, { merge: true });
    localStorage.setItem('hs_razorpay', JSON.stringify(cfg));
    return true;
  } catch(e) { console.error('saveRazorpayToFirebase:', e); return false; }
};

window.loadRazorpayFromFirebase = async function() {
  try {
    const db = await getDB();
    const snap = await _fbStore.getDoc(_fbStore.doc(db, 'razorpay_config', 'main'));
    if (snap.exists()) {
      const cfg = snap.data();
      delete cfg.updatedAt;
      localStorage.setItem('hs_razorpay', JSON.stringify(cfg));
      return cfg;
    }
  } catch(e) { console.error('loadRazorpayFromFirebase:', e); }
  return JSON.parse(localStorage.getItem('hs_razorpay') || '{}');
};

// ── CITIES ────────────────────────────────────────────────────────────────────

window.saveCitiesToFirebase = async function(cities) {
  try {
    const db = await getDB();
    await _fbStore.setDoc(_fbStore.doc(db, 'settings', 'cities'), { items: cities, updatedAt: _fbStore.serverTimestamp() }, { merge: true });
    localStorage.setItem('hs_cities', JSON.stringify(cities));
    return true;
  } catch(e) { console.error('saveCitiesToFirebase:', e); return false; }
};

window.loadCitiesFromFirebase = async function() {
  try {
    const db = await getDB();
    const snap = await _fbStore.getDoc(_fbStore.doc(db, 'settings', 'cities'));
    if (snap.exists() && snap.data().items) {
      localStorage.setItem('hs_cities', JSON.stringify(snap.data().items));
      return snap.data().items;
    }
  } catch(e) { console.error('loadCitiesFromFirebase:', e); }
  return JSON.parse(localStorage.getItem('hs_cities') || '[]');
};

// ── BLOG ──────────────────────────────────────────────────────────────────────

window.saveBlogToFirebase = async function(posts) {
  try {
    const db = await getDB();
    await _fbStore.setDoc(_fbStore.doc(db, 'settings', 'blogs'), { items: posts, updatedAt: _fbStore.serverTimestamp() }, { merge: true });
    localStorage.setItem('hs_blogs', JSON.stringify(posts));
    return true;
  } catch(e) { console.error('saveBlogToFirebase:', e); return false; }
};

window.loadBlogFromFirebase = async function() {
  try {
    const db = await getDB();
    const snap = await _fbStore.getDoc(_fbStore.doc(db, 'settings', 'blogs'));
    if (snap.exists() && snap.data().items) {
      localStorage.setItem('hs_blogs', JSON.stringify(snap.data().items));
      return snap.data().items;
    }
  } catch(e) { console.error('loadBlogFromFirebase:', e); }
  return JSON.parse(localStorage.getItem('hs_blogs') || '[]');
};

// ── PRESS ─────────────────────────────────────────────────────────────────────

window.savePressToFirebase = async function(items) {
  try {
    const db = await getDB();
    await _fbStore.setDoc(_fbStore.doc(db, 'settings', 'press'), { items, updatedAt: _fbStore.serverTimestamp() }, { merge: true });
    localStorage.setItem('hs_press', JSON.stringify(items));
    return true;
  } catch(e) { console.error('savePressToFirebase:', e); return false; }
};

window.savePressStatsToFirebase = async function(stats) {
  try {
    const db = await getDB();
    await _fbStore.setDoc(_fbStore.doc(db, 'settings', 'press_stats'), { ...stats, updatedAt: _fbStore.serverTimestamp() }, { merge: true });
    localStorage.setItem('hs_press_stats', JSON.stringify(stats));
    return true;
  } catch(e) { console.error('savePressStatsToFirebase:', e); return false; }
};

window.loadPressFromFirebase = async function() {
  try {
    const db = await getDB();
    const snap = await _fbStore.getDoc(_fbStore.doc(db, 'settings', 'press'));
    if (snap.exists() && snap.data().items) localStorage.setItem('hs_press', JSON.stringify(snap.data().items));
    const sSnap = await _fbStore.getDoc(_fbStore.doc(db, 'settings', 'press_stats'));
    if (sSnap.exists()) localStorage.setItem('hs_press_stats', JSON.stringify(sSnap.data()));
  } catch(e) { console.error('loadPressFromFirebase:', e); }
};

// ── CUSTOMER WALLETS ──────────────────────────────────────────────────────────

window.setCustWalletFirebase = async function(email, balance) {
  try {
    const db = await getDB();
    const key = 'cw_' + email.replace(/[^a-zA-Z0-9]/g, '_');
    await _fbStore.setDoc(_fbStore.doc(db, 'customer_wallets', key), { email, balance, updatedAt: _fbStore.serverTimestamp() }, { merge: true });
    localStorage.setItem('hs_cw_' + email, String(balance));
    return true;
  } catch(e) { console.error('setCustWalletFirebase:', e); return false; }
};

window.loadCustWalletFromFirebase = async function(email) {
  try {
    const db = await getDB();
    const key = email.replace(/[.#$\[\]]/g,'_');
    const snap = await _fbStore.getDoc(_fbStore.doc(db, 'customer_wallets', key));
    if (snap.exists()) {
      const bal = snap.data().balance || 0;
      localStorage.setItem('hs_cw_' + email, String(bal));
      localStorage.setItem('hs_customer_wallet', String(bal));
      return bal;
    }
  } catch(e) { console.error('loadCustWalletFromFirebase:', e); }
  return parseInt(localStorage.getItem('hs_cw_' + email) || localStorage.getItem('hs_customer_wallet') || '0');
};

window.loadCustWalletsFromFirebase = async function() {
  try {
    const db = await getDB();
    const snap = await _fbStore.getDocs(_fbStore.collection(db, 'customer_wallets'));
    snap.forEach(d => {
      const data = d.data();
      if (data.email) localStorage.setItem('hs_cw_' + data.email, String(data.balance || 0));
    });
  } catch(e) { console.error('loadCustWalletsFromFirebase:', e); }
};

// Alias
window.saveCustWalletToFirebase = window.setCustWalletFirebase;
window.saveCustWalletFirebase   = window.setCustWalletFirebase;

// ── STAFF VIDEOS ──────────────────────────────────────────────────────────────

window.loadStaffVideosFromFirebase = async function() {
  try {
    const db = await getDB();
    const snap = await _fbStore.getDocs(_fbStore.query(_fbStore.collection(db, 'staff_videos'), _fbStore.orderBy('createdAt', 'desc')));
    const list = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    if (list.length) localStorage.setItem('hs_staff_videos', JSON.stringify(list));
    return list;
  } catch(e) { console.error('loadStaffVideosFromFirebase:', e); return JSON.parse(localStorage.getItem('hs_staff_videos') || '[]'); }
};

window.syncStaffVideosRealtime = async function(callback) {
  try {
    const db = await getDB();
    return _fbStore.onSnapshot(
      _fbStore.query(_fbStore.collection(db, 'staff_videos'), _fbStore.orderBy('createdAt', 'desc')),
      snap => {
        const list = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        localStorage.setItem('hs_staff_videos', JSON.stringify(list));
        if (callback) callback(list);
      }
    );
  } catch(e) { console.error('syncStaffVideosRealtime:', e); }
};

// ── TESTIMONIAL VIDEOS ────────────────────────────────────────────────────────

window.loadTestiVideosFromFirebase = async function() {
  try {
    const db = await getDB();
    const snap = await _fbStore.getDocs(_fbStore.query(_fbStore.collection(db, 'testimonial_videos'), _fbStore.orderBy('createdAt', 'desc')));
    const list = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    if (list.length) localStorage.setItem('hs_testi_videos', JSON.stringify(list));
    return list;
  } catch(e) { console.error('loadTestiVideosFromFirebase:', e); return JSON.parse(localStorage.getItem('hs_testi_videos') || '[]'); }
};

window.listenTestiVideos = async function(callback) {
  try {
    const db = await getDB();
    return _fbStore.onSnapshot(_fbStore.collection(db, 'testimonial_videos'), snap => {
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      localStorage.setItem('hs_testi_videos', JSON.stringify(list));
      if (callback) callback(list);
    });
  } catch(e) { console.error('listenTestiVideos:', e); }
};

// ── WITHDRAW REQUESTS ─────────────────────────────────────────────────────────

window.loadWithdrawFromFirebase = async function() {
  try {
    const db = await getDB();
    const snap = await _fbStore.getDocs(_fbStore.query(_fbStore.collection(db, 'payout_requests'), _fbStore.orderBy('createdAt', 'desc')));
    const list = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    if (list.length) localStorage.setItem('hs_payout_requests', JSON.stringify(list));
    return list;
  } catch(e) { console.error('loadWithdrawFromFirebase:', e); return JSON.parse(localStorage.getItem('hs_payout_requests') || '[]'); }
};

window.listenPayoutRequests = async function(callback) {
  try {
    const db = await getDB();
    return _fbStore.onSnapshot(_fbStore.collection(db, 'payout_requests'), snap => {
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      localStorage.setItem('hs_payout_requests', JSON.stringify(list));
      if (callback) callback(list);
    });
  } catch(e) { console.error('listenPayoutRequests:', e); }
};

// ── CAREER & AFFILIATE APPS ───────────────────────────────────────────────────

window.loadCareerAppsFromFirebase = async function() {
  try {
    const db = await getDB();
    const snap = await _fbStore.getDocs(_fbStore.query(_fbStore.collection(db, 'career_applications'), _fbStore.orderBy('createdAt', 'desc')));
    const list = [];
    snap.forEach(d => list.push({ _fbId: d.id, ...d.data() }));
    if (list.length) localStorage.setItem('hs_career_applications', JSON.stringify(list));
    return list;
  } catch(e) { console.error('loadCareerAppsFromFirebase:', e); return JSON.parse(localStorage.getItem('hs_career_applications') || '[]'); }
};

window.listenCareerApps = async function(callback) {
  try {
    const db = await getDB();
    return _fbStore.onSnapshot(_fbStore.collection(db, 'career_applications'), snap => {
      const list = [];
      snap.forEach(d => list.push({ _fbId: d.id, ...d.data() }));
      localStorage.setItem('hs_career_applications', JSON.stringify(list));
      if (callback) callback(list);
    });
  } catch(e) { console.error('listenCareerApps:', e); }
};

window.loadAffiliateAppsFromFirebase = async function() {
  try {
    const db = await getDB();
    const snap = await _fbStore.getDocs(_fbStore.query(_fbStore.collection(db, 'affiliate_applications'), _fbStore.orderBy('createdAt', 'desc')));
    const list = [];
    snap.forEach(d => list.push({ _fbId: d.id, ...d.data() }));
    if (list.length) localStorage.setItem('hs_affiliate_applications', JSON.stringify(list));
    return list;
  } catch(e) { console.error('loadAffiliateAppsFromFirebase:', e); return JSON.parse(localStorage.getItem('hs_affiliate_applications') || '[]'); }
};

window.listenAffiliateApps = async function(callback) {
  try {
    const db = await getDB();
    return _fbStore.onSnapshot(_fbStore.collection(db, 'affiliate_applications'), snap => {
      const list = [];
      snap.forEach(d => list.push({ _fbId: d.id, ...d.data() }));
      localStorage.setItem('hs_affiliate_applications', JSON.stringify(list));
      if (callback) callback(list);
    });
  } catch(e) { console.error('listenAffiliateApps:', e); }
};

// ── ADMIN NOTIFICATIONS ───────────────────────────────────────────────────────

window.pushAdminNotif = async function(type, title, message, actionTab) {
  try {
    const db = await getDB();
    await _fbStore.addDoc(_fbStore.collection(db, 'admin_notifications'), {
      type, title, message, actionTab: actionTab || '', read: false, createdAt: _fbStore.serverTimestamp()
    });
  } catch(e) { console.error('pushAdminNotif:', e); }
};

window.listenAdminNotifications = async function(callback) {
  try {
    const db = await getDB();
    return _fbStore.onSnapshot(
      _fbStore.query(_fbStore.collection(db, 'admin_notifications'), _fbStore.orderBy('createdAt', 'desc')),
      snap => {
        const list = [];
        snap.forEach(d => list.push({ _fbId: d.id, ...d.data() }));
        localStorage.setItem('hs_admin_notifications', JSON.stringify(list));
        if (callback) callback(list);
      }
    );
  } catch(e) { console.error('listenAdminNotifications:', e); }
};

window.markNotifRead = async function(fbId) {
  try {
    const db = await getDB();
    await _fbStore.setDoc(_fbStore.doc(db, 'admin_notifications', String(fbId)), { read: true }, { merge: true });
  } catch(e) { console.error('markNotifRead:', e); }
};

// ── SETTINGS ──────────────────────────────────────────────────────────────────

window.saveSettingsToFirebase = async function(cfg) {
  try {
    const db = await getDB();
    await _fbStore.setDoc(_fbStore.doc(db, 'config', 'settings'), { ...cfg, updatedAt: _fbStore.serverTimestamp() }, { merge: true });
    localStorage.setItem('hs_settings', JSON.stringify(cfg));
    return true;
  } catch(e) { console.error('saveSettingsToFirebase:', e); return false; }
};

window.loadSettingsFromFirebase = async function() {
  try {
    const db = await getDB();
    const snap = await _fbStore.getDoc(_fbStore.doc(db, 'config', 'settings'));
    if (snap.exists()) { localStorage.setItem('hs_settings', JSON.stringify(snap.data())); return snap.data(); }
  } catch(e) { console.error('loadSettingsFromFirebase:', e); }
  return JSON.parse(localStorage.getItem('hs_settings') || '{}');
};

// Aliases used by older code
window.saveSettingToFirebase   = window.saveSettingsToFirebase;
window.loadSettingFromFirebase = window.loadSettingsFromFirebase;

console.log('[OG Shoots] hs-firebase.js ready — project: hash-shoots');

// ── UNIVERSAL SYNC ENGINE ─────────────────────────────────────────────────────
// Maps every localStorage key → Firestore collection.
// On page load: pulls Firebase → localStorage (Firebase wins).
// On every write: saves to localStorage AND Firebase simultaneously.
// Real-time listeners keep localStorage always in sync with Firebase.

const HS_SYNC_MAP = [
  { ls: 'hs_bookings',         col: 'bookings',          isArray: true  },
  { ls: 'hs_staff',            col: 'staff',             isArray: true  },
  { ls: 'hs_assigned_shoots',  col: 'assigned_shoots',   isArray: true  },
  { ls: 'hs_career_apps',      col: 'career_apps',       isArray: true  },
  { ls: 'hs_affiliate_apps',   col: 'affiliate_apps',    isArray: true  },
  { ls: 'hs_enquiries',        col: 'enquiries',         isArray: true  },
  { ls: 'hs_payout_requests',  col: 'payout_requests',   isArray: true  },
  { ls: 'hs_notifications',    col: 'admin_notifications',isArray: true },
  { ls: 'hs_staff_videos',     col: 'staff_videos',      isArray: true  },
  { ls: 'hs_about',            col: 'config',            isArray: false, docId: 'about'    },
  { ls: 'hs_homepage',         col: 'config',            isArray: false, docId: 'homepage' },
  { ls: 'hs_customer_page',    col: 'config',            isArray: false, docId: 'customer_page' },
  { ls: 'hs_opening',          col: 'config',            isArray: false, docId: 'opening'  },
];

// ── Pull all collections from Firebase into localStorage on load ──
window.hsSyncFromFirebase = async function() {
  try {
    const db = await getDB();
    for (const m of HS_SYNC_MAP) {
      try {
        if (m.isArray) {
          const snap = await _fbStore.getDocs(_fbStore.collection(db, m.col));
          const docs = [];
          snap.forEach(d => docs.push({ _fbId: d.id, id: d.id, ...d.data() }));
          if (docs.length) localStorage.setItem(m.ls, JSON.stringify(docs));
        } else {
          const snap = await _fbStore.getDoc(_fbStore.doc(db, m.col, m.docId));
          if (snap.exists()) localStorage.setItem(m.ls, JSON.stringify(snap.data()));
        }
      } catch(e) { console.warn('[sync] pull failed:', m.col, e.message); }
    }
    // Wallets — pull per staff
    const staffRaw = localStorage.getItem('hs_staff');
    if (staffRaw) {
      const staff = JSON.parse(staffRaw);
      for (const s of staff) {
        try {
          const snap = await _fbStore.getDoc(_fbStore.doc(db, 'wallets', String(s.id)));
          if (snap.exists()) localStorage.setItem('hs_wallet_' + s.id, JSON.stringify(snap.data()));
        } catch(e) {}
      }
    }
    console.log('[OG Shoots] Firebase → localStorage sync complete');
  } catch(e) { console.error('[hsSyncFromFirebase]', e); }
};

// ── Real-time listeners: Firebase → localStorage (live updates) ──
window.hsStartListeners = async function() {
  try {
    const db = await getDB();
    for (const m of HS_SYNC_MAP) {
      if (!m.isArray) continue;
      try {
        _fbStore.onSnapshot(_fbStore.collection(db, m.col), snap => {
          const docs = [];
          snap.forEach(d => docs.push({ _fbId: d.id, id: d.id, ...d.data() }));
          localStorage.setItem(m.ls, JSON.stringify(docs));
          // Dispatch event so any open page can react
          window.dispatchEvent(new CustomEvent('hs_sync', { detail: { key: m.ls, col: m.col } }));
        });
      } catch(e) { console.warn('[listener] failed:', m.col, e.message); }
    }
    console.log('[OG Shoots] Real-time listeners active');
  } catch(e) { console.error('[hsStartListeners]', e); }
};

// ── Write helpers: localStorage + Firebase simultaneously ──

// Save/update a single item in an array collection
window.hsSave = async function(lsKey, col, item) {
  // Ensure item has an id
  if (!item.id) item.id = Date.now().toString();
  // localStorage
  const arr = JSON.parse(localStorage.getItem(lsKey) || '[]');
  const idx = arr.findIndex(x => String(x.id) === String(item.id));
  if (idx > -1) arr[idx] = { ...arr[idx], ...item };
  else arr.push(item);
  localStorage.setItem(lsKey, JSON.stringify(arr));
  // Firebase
  try {
    const db = await getDB();
    await _fbStore.setDoc(_fbStore.doc(db, col, String(item.id)), { ...item, updatedAt: _fbStore.serverTimestamp() }, { merge: true });
  } catch(e) { console.warn('[hsSave] Firebase write failed:', col, e.message); }
  return item.id;
};

// Update a field on an existing item
window.hsUpdate = async function(lsKey, col, id, data) {
  const arr = JSON.parse(localStorage.getItem(lsKey) || '[]');
  const updated = arr.map(x => String(x.id) === String(id) ? { ...x, ...data } : x);
  localStorage.setItem(lsKey, JSON.stringify(updated));
  try {
    const db = await getDB();
    await _fbStore.setDoc(_fbStore.doc(db, col, String(id)), { ...data, updatedAt: _fbStore.serverTimestamp() }, { merge: true });
  } catch(e) { console.warn('[hsUpdate] Firebase write failed:', col, e.message); }
};

// Delete an item
window.hsDelete = async function(lsKey, col, id) {
  const arr = JSON.parse(localStorage.getItem(lsKey) || '[]').filter(x => String(x.id) !== String(id));
  localStorage.setItem(lsKey, JSON.stringify(arr));
  try {
    const db = await getDB();
    await _fbStore.deleteDoc(_fbStore.doc(db, col, String(id)));
  } catch(e) { console.warn('[hsDelete] Firebase delete failed:', col, e.message); }
};

// Save a config doc (non-array)
window.hsSaveConfig = async function(lsKey, col, docId, data) {
  localStorage.setItem(lsKey, JSON.stringify(data));
  try {
    const db = await getDB();
    await _fbStore.setDoc(_fbStore.doc(db, col, docId), { ...data, updatedAt: _fbStore.serverTimestamp() }, { merge: true });
  } catch(e) { console.warn('[hsSaveConfig] Firebase write failed:', col, e.message); }
};

// ── Auto-start on page load ──
(async function() {
  await hsSyncFromFirebase();
  await hsStartListeners();
})();

console.log('[OG Shoots] Universal sync engine loaded');

// ── localStorage INTERCEPTOR ──────────────────────────────────────────────────
// Wraps localStorage.setItem so every write to a synced key
// automatically fires to Firebase. Zero changes needed in existing code.

const HS_LS_TO_COL = {
  'hs_bookings':        { col: 'bookings',           isArray: true  },
  'hs_staff':           { col: 'staff',              isArray: true  },
  'hs_assigned_shoots': { col: 'assigned_shoots',    isArray: true  },
  'hs_career_apps':     { col: 'career_apps',        isArray: true  },
  'hs_affiliate_apps':  { col: 'affiliate_apps',     isArray: true  },
  'hs_enquiries':       { col: 'enquiries',          isArray: true  },
  'hs_payout_requests': { col: 'payout_requests',    isArray: true  },
  'hs_notifications':   { col: 'admin_notifications',isArray: true  },
  'hs_staff_videos':    { col: 'staff_videos',       isArray: true  },
  'hs_about':           { col: 'config', docId: 'about',         isArray: false },
  'hs_homepage':        { col: 'config', docId: 'homepage',      isArray: false },
  'hs_customer_page':   { col: 'config', docId: 'customer_page', isArray: false },
  'hs_opening':         { col: 'config', docId: 'opening',       isArray: false },
};

// Wallet keys are dynamic: hs_wallet_<staffId>
const HS_WALLET_PREFIX = 'hs_wallet_';

const _origSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function(key, value) {
  _origSetItem(key, value);
  // Sync to Firebase async (non-blocking)
  const map = HS_LS_TO_COL[key];
  if (map) {
    (async () => {
      try {
        const db = await getDB();
        if (map.isArray) {
          const items = JSON.parse(value || '[]');
          if (!Array.isArray(items)) return;
          for (const item of items) {
            const docId = String(item.id || item._fbId || Date.now());
            const clean = { ...item };
            delete clean._fbId;
            await _fbStore.setDoc(_fbStore.doc(db, map.col, docId), { ...clean, _synced: true }, { merge: true });
          }
        } else {
          const data = JSON.parse(value || '{}');
          await _fbStore.setDoc(_fbStore.doc(db, map.col, map.docId), { ...data, _synced: true }, { merge: true });
        }
      } catch(e) { /* silent — localStorage already saved */ }
    })();
  }
  // Wallet sync
  if (key.startsWith(HS_WALLET_PREFIX)) {
    const staffId = key.replace(HS_WALLET_PREFIX, '');
    (async () => {
      try {
        const db = await getDB();
        const data = JSON.parse(value || '{}');
        await _fbStore.setDoc(_fbStore.doc(db, 'wallets', staffId), { ...data, _synced: true }, { merge: true });
      } catch(e) {}
    })();
  }
};

console.log('[OG Shoots] localStorage interceptor active — all writes sync to Firebase');
