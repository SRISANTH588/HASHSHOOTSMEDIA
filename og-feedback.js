/* ── OG Shoots App Feedback Widget ── */
(function(){
  var FB_CFG = {apiKey:'AIzaSyAtkcHfgNx9xEcyMC50eRX5VPv1r7O5XyE',authDomain:'hash-shoots.firebaseapp.com',projectId:'hash-shoots',storageBucket:'hash-shoots.firebasestorage.app',messagingSenderId:'1093054616221',appId:'1:1093054616221:web:55bdebafc895acfd04fa74'};

  // ── Inject styles ──
  var st = document.createElement('style');
  st.textContent = `
    #ogFbBtn{position:fixed;bottom:28px;left:28px;z-index:99990;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#c9a84c,#a07830);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(201,168,76,0.5);transition:transform 0.2s,box-shadow 0.2s;font-size:1.3rem;}
    #ogFbBtn:hover{transform:scale(1.1);box-shadow:0 8px 30px rgba(201,168,76,0.7);}
    #ogFbBtn .og-fb-pulse{position:absolute;width:100%;height:100%;border-radius:50%;background:rgba(201,168,76,0.4);animation:ogFbPulse 2s ease-out infinite;}
    @keyframes ogFbPulse{0%{transform:scale(1);opacity:0.8}100%{transform:scale(2);opacity:0}}
    #ogFbPanel{position:fixed;bottom:92px;left:28px;z-index:99991;width:340px;background:#111;border:1px solid rgba(201,168,76,0.25);border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.7);overflow:hidden;transform:scale(0.9) translateY(20px);opacity:0;pointer-events:none;transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);transform-origin:bottom left;}
    #ogFbPanel.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;}
    .og-fb-header{background:linear-gradient(135deg,#1a1408,#111);padding:1.1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(201,168,76,0.1);}
    .og-fb-header-left{display:flex;align-items:center;gap:0.6rem;}
    .og-fb-header-icon{width:32px;height:32px;border-radius:10px;background:rgba(201,168,76,0.15);display:flex;align-items:center;justify-content:center;color:#c9a84c;font-size:0.9rem;}
    .og-fb-header-title{font-size:0.9rem;font-weight:800;color:#fff;font-family:'Inter',sans-serif;}
    .og-fb-header-sub{font-size:0.65rem;color:rgba(255,255,255,0.3);font-family:'Inter',sans-serif;}
    .og-fb-close{background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:1rem;padding:0.2rem;transition:color 0.2s;}
    .og-fb-close:hover{color:#fff;}
    .og-fb-body{padding:1.25rem;}
    .og-fb-types{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;margin-bottom:1rem;}
    .og-fb-type{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.6rem 0.4rem;text-align:center;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
    .og-fb-type:hover{border-color:rgba(201,168,76,0.3);background:rgba(201,168,76,0.06);}
    .og-fb-type.active{border-color:#c9a84c;background:rgba(201,168,76,0.12);}
    .og-fb-type-icon{font-size:1.2rem;display:block;margin-bottom:0.2rem;}
    .og-fb-type-label{font-size:0.62rem;color:rgba(255,255,255,0.5);font-weight:600;letter-spacing:0.5px;}
    .og-fb-type.active .og-fb-type-label{color:#c9a84c;}
    .og-fb-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px 12px;color:#fff;font-size:0.85rem;font-family:'Inter',sans-serif;outline:none;transition:border-color 0.2s;margin-bottom:0.75rem;}
    .og-fb-input:focus{border-color:#c9a84c;}
    .og-fb-input::placeholder{color:rgba(255,255,255,0.2);}
    .og-fb-textarea{min-height:90px;resize:none;}
    .og-fb-rating{display:flex;gap:0.4rem;margin-bottom:0.75rem;}
    .og-fb-star{font-size:1.4rem;cursor:pointer;color:rgba(255,255,255,0.15);transition:color 0.15s;}
    .og-fb-star.active{color:#c9a84c;}
    .og-fb-submit{width:100%;background:linear-gradient(135deg,#c9a84c,#a07830);border:none;border-radius:10px;padding:0.75rem;color:#000;font-size:0.88rem;font-weight:800;cursor:pointer;font-family:'Inter',sans-serif;transition:opacity 0.2s,transform 0.1s;display:flex;align-items:center;justify-content:center;gap:0.5rem;}
    .og-fb-submit:hover{opacity:0.88;transform:translateY(-1px);}
    .og-fb-submit:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
    .og-fb-success{text-align:center;padding:2rem 1rem;}
    .og-fb-success-icon{font-size:2.5rem;margin-bottom:0.75rem;}
    .og-fb-success-title{font-size:1rem;font-weight:800;color:#fff;margin-bottom:0.3rem;font-family:'Inter',sans-serif;}
    .og-fb-success-sub{font-size:0.8rem;color:rgba(255,255,255,0.4);font-family:'Inter',sans-serif;}
    .og-fb-label{font-size:0.68rem;color:rgba(255,255,255,0.3);font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:0.4rem;display:block;}
    @media(max-width:400px){#ogFbPanel{width:calc(100vw - 40px);left:20px;}#ogFbBtn{left:20px;bottom:20px;}}
  `;
  document.head.appendChild(st);

  // ── Build HTML ──
  var btn = document.createElement('button');
  btn.id = 'ogFbBtn';
  btn.title = 'Send Feedback';
  btn.innerHTML = '<span class="og-fb-pulse"></span>💬';

  var panel = document.createElement('div');
  panel.id = 'ogFbPanel';
  panel.innerHTML = `
    <div class="og-fb-header">
      <div class="og-fb-header-left">
        <div class="og-fb-header-icon"><i class="fas fa-comment-dots"></i></div>
        <div>
          <div class="og-fb-header-title">App Feedback</div>
          <div class="og-fb-header-sub">Help us improve OG Shoots</div>
        </div>
      </div>
      <button class="og-fb-close" id="ogFbClose"><i class="fas fa-times"></i></button>
    </div>
    <div class="og-fb-body" id="ogFbBody">
      <div class="og-fb-types">
        <div class="og-fb-type active" data-type="bug" onclick="ogFbSelectType(this)">
          <span class="og-fb-type-icon">🐛</span>
          <span class="og-fb-type-label">Bug</span>
        </div>
        <div class="og-fb-type" data-type="suggestion" onclick="ogFbSelectType(this)">
          <span class="og-fb-type-icon">💡</span>
          <span class="og-fb-type-label">Suggestion</span>
        </div>
        <div class="og-fb-type" data-type="general" onclick="ogFbSelectType(this)">
          <span class="og-fb-type-icon">⭐</span>
          <span class="og-fb-type-label">General</span>
        </div>
      </div>

      <label class="og-fb-label">Your Name (optional)</label>
      <input class="og-fb-input" id="ogFbName" placeholder="e.g. Rahul"/>

      <label class="og-fb-label">Message *</label>
      <textarea class="og-fb-input og-fb-textarea" id="ogFbMsg" placeholder="Describe the issue or suggestion..."></textarea>

      <label class="og-fb-label">Rate your experience</label>
      <div class="og-fb-rating" id="ogFbRating">
        <span class="og-fb-star" data-val="1" onclick="ogFbRate(1)">★</span>
        <span class="og-fb-star" data-val="2" onclick="ogFbRate(2)">★</span>
        <span class="og-fb-star" data-val="3" onclick="ogFbRate(3)">★</span>
        <span class="og-fb-star" data-val="4" onclick="ogFbRate(4)">★</span>
        <span class="og-fb-star" data-val="5" onclick="ogFbRate(5)">★</span>
      </div>

      <button class="og-fb-submit" id="ogFbSubmit" onclick="ogFbSubmit()">
        <i class="fas fa-paper-plane"></i> Send Feedback
      </button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  // ── State ──
  var _type = 'bug';
  var _rating = 0;
  var _open = false;

  // ── Toggle ──
  btn.addEventListener('click', function(){
    _open = !_open;
    panel.classList.toggle('open', _open);
    btn.innerHTML = _open ? '<i class="fas fa-times" style="color:#000;font-size:1.1rem;"></i>' : '<span class="og-fb-pulse"></span>💬';
  });

  document.getElementById('ogFbClose').addEventListener('click', function(){
    _open = false;
    panel.classList.remove('open');
    btn.innerHTML = '<span class="og-fb-pulse"></span>💬';
  });

  // ── Type select ──
  window.ogFbSelectType = function(el){
    document.querySelectorAll('.og-fb-type').forEach(function(t){ t.classList.remove('active'); });
    el.classList.add('active');
    _type = el.getAttribute('data-type');
  };

  // ── Rating ──
  window.ogFbRate = function(val){
    _rating = val;
    document.querySelectorAll('.og-fb-star').forEach(function(s){
      s.classList.toggle('active', parseInt(s.getAttribute('data-val')) <= val);
    });
  };

  // ── Submit ──
  window.ogFbSubmit = async function(){
    var msg = (document.getElementById('ogFbMsg').value || '').trim();
    var name = (document.getElementById('ogFbName').value || '').trim();
    if(!msg){ document.getElementById('ogFbMsg').style.borderColor='#ef4444'; return; }

    var submitBtn = document.getElementById('ogFbSubmit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    var entry = {
      id: Date.now().toString(),
      type: _type,
      name: name || 'Anonymous',
      message: msg,
      rating: _rating,
      page: window.location.pathname.split('/').pop() || 'index.html',
      submittedAt: new Date().toLocaleString(),
      read: false
    };

    // Save to localStorage
    var list = JSON.parse(localStorage.getItem('hs_app_feedback') || '[]');
    list.unshift(entry);
    localStorage.setItem('hs_app_feedback', JSON.stringify(list));

    // Save to Firebase
    try {
      var fbMod   = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
      var fbStore = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
      var app = fbMod.getApps().find(function(a){ return a.name==='ogfb'; }) || fbMod.initializeApp(FB_CFG,'ogfb');
      var db  = fbStore.getFirestore(app);
      await fbStore.addDoc(fbStore.collection(db,'app_feedback'), entry);
    } catch(e){ console.log('FB save error:', e); }

    // Show success
    document.getElementById('ogFbBody').innerHTML = `
      <div class="og-fb-success">
        <div class="og-fb-success-icon">🎉</div>
        <div class="og-fb-success-title">Thanks for your feedback!</div>
        <div class="og-fb-success-sub">We'll review it and make improvements soon.</div>
      </div>
    `;

    setTimeout(function(){
      _open = false;
      panel.classList.remove('open');
      btn.innerHTML = '<span class="og-fb-pulse"></span>💬';
      // Reset form after close
      setTimeout(function(){ resetFbForm(); }, 400);
    }, 2500);
  };

  function resetFbForm(){
    _type = 'bug'; _rating = 0;
    document.getElementById('ogFbBody').innerHTML = `
      <div class="og-fb-types">
        <div class="og-fb-type active" data-type="bug" onclick="ogFbSelectType(this)">
          <span class="og-fb-type-icon">🐛</span><span class="og-fb-type-label">Bug</span>
        </div>
        <div class="og-fb-type" data-type="suggestion" onclick="ogFbSelectType(this)">
          <span class="og-fb-type-icon">💡</span><span class="og-fb-type-label">Suggestion</span>
        </div>
        <div class="og-fb-type" data-type="general" onclick="ogFbSelectType(this)">
          <span class="og-fb-type-icon">⭐</span><span class="og-fb-type-label">General</span>
        </div>
      </div>
      <label class="og-fb-label">Your Name (optional)</label>
      <input class="og-fb-input" id="ogFbName" placeholder="e.g. Rahul"/>
      <label class="og-fb-label">Message *</label>
      <textarea class="og-fb-input og-fb-textarea" id="ogFbMsg" placeholder="Describe the issue or suggestion..."></textarea>
      <label class="og-fb-label">Rate your experience</label>
      <div class="og-fb-rating" id="ogFbRating">
        <span class="og-fb-star" data-val="1" onclick="ogFbRate(1)">★</span>
        <span class="og-fb-star" data-val="2" onclick="ogFbRate(2)">★</span>
        <span class="og-fb-star" data-val="3" onclick="ogFbRate(3)">★</span>
        <span class="og-fb-star" data-val="4" onclick="ogFbRate(4)">★</span>
        <span class="og-fb-star" data-val="5" onclick="ogFbRate(5)">★</span>
      </div>
      <button class="og-fb-submit" id="ogFbSubmit" onclick="ogFbSubmit()">
        <i class="fas fa-paper-plane"></i> Send Feedback
      </button>
    `;
  }
})();
