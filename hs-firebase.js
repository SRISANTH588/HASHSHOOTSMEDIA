// hs-firebase.js — Shared Firebase helper for Hash Shoots
// Usage: <script type="module" src="hs-firebase.js"></script>

const FB_CFG = {
  apiKey: 'AIzaSyAtkcHfgNx9xEcyMC50eRX5VPv1r7O5XyE',
  authDomain: 'hash-shoots.firebaseapp.com',
  projectId: 'hash-shoots',
  storageBucket: 'hash-shoots.firebasestorage.app',
  messagingSenderId: '1093054616221',
  appId: '1:1093054616221:web:55bdebafc895acfd04fa74'
};

let _db = null;
let _fbMod = null;
let _fbStore = null;

async function getDB() {
  if (_db) return _db;
  _fbMod   = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
  _fbStore = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
  const apps = _fbMod.getApps();
  const app  = apps.find(a => a.name === 'hs') || _fbMod.initializeApp(FB_CFG, 'hs');
  _db = _fbStore.getFirestore(app);
  return _db;
}

// Save a document to a collection
window.fbSave = async function(collectionName, data) {
  try {
    const db = await getDB();
    await _fbStore.addDoc(_fbStore.collection(db, collectionName), {
      ...data,
      createdAt: _fbStore.serverTimestamp()
    });
    return true;
  } catch(e) {
    console.error('fbSave error:', e);
    return false;
  }
};

// Update a document
window.fbUpdate = async function(collectionName, docId, data) {
  try {
    const db = await getDB();
    await _fbStore.updateDoc(_fbStore.doc(db, collectionName, docId), data);
    return true;
  } catch(e) {
    console.error('fbUpdate error:', e);
    return false;
  }
};

// Listen to a collection in real time
window.fbListen = async function(collectionName, callback) {
  try {
    const db = await getDB();
    const q  = _fbStore.query(_fbStore.collection(db, collectionName), _fbStore.orderBy('createdAt', 'desc'));
    return _fbStore.onSnapshot(q, snapshot => {
      const docs = [];
      snapshot.forEach(d => docs.push({ _id: d.id, ...d.data() }));
      callback(docs);
    });
  } catch(e) {
    console.error('fbListen error:', e);
  }
};

console.log('hs-firebase.js loaded');
