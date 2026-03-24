// hs-firebase.js — Full Two-Way Real-Time Sync Engine for Hash Shoots

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
  const apps = _fbMod.getApps();
  const app  = apps.find(a => a.name === 'hs') || _fbMod.initializeApp(FB_CFG, 'hs');
  _db = _fbStore.getFirestore(app);
  return _db;
}

// Save a document
window.fbSave = async function(col, data) {
  try {
    const db = await getDB();
    const ref = await _fbStore.addDoc(_fbStore.collection(db, col), { ...data, createdAt: _fbStore.serverTimestamp() });
    return ref.id;
  } catch(e) { console.error('fbSave error:', e); return null; }
};

// Update a document by ID
window.fbUpdate = async function(col, docId, data) {
  try {
    const db = await getDB();
    await _fbStore.setDoc(_fbStore.doc(db, col, String(docId)), data, { merge: true });
    return true;
  } catch(e) { console.error('fbUpdate error:', e); return false; }
};

// Listen to a collection in real time
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
  } catch(e) { console.error('fbListen error:', e); }
};

// Listen to a single document
window.fbListenDoc = async function(col, docId, callback) {
  try {
    const db = await getDB();
    return _fbStore.onSnapshot(_fbStore.doc(db, col, String(docId)), snap => {
      if (snap.exists()) callback({ _fbId: snap.id, ...snap.data() });
    });
  } catch(e) { console.error('fbListenDoc error:', e); }
};

console.log('[HashShoots] Firebase two-way sync ready');
