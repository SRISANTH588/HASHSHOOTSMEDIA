// ── OG Shoots App Feedback Widget ──
(function(){
  var fbCfg = {apiKey:'AIzaSyAtkcHfgNx9xEcyMC50eRX5VPv1r7O5XyE',authDomain:'hash-shoots.firebaseapp.com',projectId:'hash-shoots',storageBucket:'hash-shoots.firebasestorage.app',messagingSenderId:'1093054616221',appId:'1:1093054616221:web:55bdebafc895acfd04fa74'};

  // ── Styles ──
  var st = document.createElement('style');
  st.textContent = `
    #ogFbBtn {
      position:fixed;bottom:28px;right:28px;z-index:99990;
      width:52px;height:52px;border-radius:50%;
      background:linear-gradient(135deg,#c9a84c,#a07830);
      border:none;cursor:pointer;
      box-shadow:0 4px 20px rgba(201,168,76,0.5);
      display:flex;align-items:center;justify-content:center;
      font-size:1.3rem;color:#000;
      transition:transform 0.2s,box-shadow 0.2s;
      animation:ogFbPulse 2.5s ease-in-out infinite;
    }
    #ogFbBtn:hover{transform:scale(1.1);box-shadow:0 8px 30px rgba(201,168,76,0.7);}
    @keyframes ogFbPulse{0%,100%{box-shadow:0 4px 20px rgba(201,168,76,0.5)}50%{box-shadow:0 4px 35px rgba(201,168,76,0.9)}}

    #ogFbPanel {
      position:fixed;bottom:90px;right:28px;z-index:99991;
      width:340px;background:#111;
      border:1px solid rgba(201,168,76,0.25);border-radius:20px;
      box-shadow:0 20px 60px rgba(0,0,0,0.7);
      overflow:hidden;
      transform:translateY(20px) scale(0.95);opacity:0;pointer-events:none;
      transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
      font-family:'Inter',sans-serif;
    }
    #ogFbPanel.open{transform:translateY(0) scale(1);opacity:1;pointer-events:all;}

    .ogfb-header{
      background:linear-gradient(135deg,#1a1408,#111);
      padding:1rem 1.25rem;
      border-bottom:1px solid rgba(201,168,76,0.12);
      display:flex;align-items:center;justify-content:space-between;
    }
    .ogfb-header-left{display:flex;align-items:center;gap:0.6rem;}
    .ogfb-header-icon{width:32px;height:32px;border-radius:8px;background:rgba(201,168,76,0.15);border:1px solid rgba(201,168,76,0.3);display:flex;align-items:center;justify-content:center;font-size:0.9rem;}
    .ogfb-header-title{font-size:0.9rem;font-weight:800;color:#fff;}
    .ogfb-header-sub{font-size:0.65rem;color:rgba(255,255,255,0.3);}
    .ogfb-close{background:none;border:none;color:rgba(255,255,255,0.3);font-size:1rem;cursor:pointer;padding:0.2rem;transition:color 0.2s;}
    .ogfb-close:hover{color:#fff;}

    .ogfb-body{padding:1.1rem 1.25rem;}

    .ogfb-types{display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap;}
    .ogfb-type{padding:0.3rem 0.75rem;border-radius:50px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:rgba(255,255,255,0.4);font-size:0.72rem;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;}
    .ogfb-type:hover{border-color:rgba(201,168,76,0.3);color:rgba(201,168,76,0.8);}
    .ogfb-type.active{background:rgba(201,168,76,0.12);border-color:rgba(201,168,76,0.4);color:#c9a84c;}

    .ogfb-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px 12px;color:#fff;font-size:0.85rem;font-family:'Inter',sans-serif;outline:none;transition:border-color 0.2s;margin-bottom:0.75rem;}
    .ogfb-input:focus{border-color:rgba(201,168,76,0.5);}
    .ogfb-input::placeholder{color:rgba(255,255,255,0.2);}
    .ogfb-textarea{min-height:90px;resize:none;}

    .ogfb-rating{display:flex;gap:0.3rem;margin-bottom:0.75rem;}
    .ogfb-star{font-size:1.4rem;cursor:pointer;color:rgba(255,255,255,0.15);transition:color 0.15s;}
    .ogfb-star.on{color:#c9a84c;}

    .ogfb-submit{width:100%;background:linear-gradient(135deg,#c9a84c,#a07830);border:none;border-radius:10px;padding:0.75rem;color:#000;font-size:0.88rem;font-weight:800;cursor:pointer;font-family:'Inter',sans-serif;transition:opacity 0.2s,transform 0.1s;display:flex;align-items:center;justify-content:center;gap:0.5rem;}
    .ogfb-submit:hover{opacity:0.88;transform:translateY(-1px);}
    .ogfb-submit:disabled{opacity:0.4;cursor:not-allowed;transform:none;}

    .ogfb-success{display:none;text-align:center;padding:1.5rem 1rem;}
    .ogfb-success-icon{font-size:2.5rem;margin-bottom:0.5rem;}
    .ogfb-success-title{font-size:1rem;font-weight:800;color:#fff;margin-bottom:0.3rem;}
    .ogfb-success-sub{font-size:0.78rem;color:rgba(255,255,255,0.35);}

    .ogfb-label{font-size:0.68rem;color:rgba(255,255,255,0.3);font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:0.4rem;display:block;}

    #ogFbBadge{position:absolute;top:-4px;right:-4px;width:16px;height:16px;background:#ef4444;border-radius:50%;font-size:0.55rem;font-weight:900;color:#fff;display:none;align-items:center;justify-content:center;border:2px solid #111;}
  `;
  document.head.appendChild(st);

  // ── HTML ──
  var wrap = document.createElement('div');
  wrap.innerHTML = `
    <button id="ogFbBtn" title="Send Feedback">
      <i class="fas fa-comment-dots"></i>
      <div id="ogFbBadge"></div>
    </button>
    <div id="ogFbPanel">
      <div class="ogfb-header">
        <div class="ogfb-header-left">
          <div class="ogfb-header-icon">💬</div>
          <div>
            <div class="ogfb-header-title">App Feedback</div>
            <div class="ogfb-header-sub">Help us improve OG Shoots</div>
          </div>
        </div>
        <button class="ogfb-close" id="ogFbClose"><i class="fas fa-times"></i></button>
      </div>
      <div class="ogfb-body" id="ogFbForm">
        <span class="ogfb-label">Type</span>
        <div class="ogfb-types">
          <button class="ogfb-type active" data-type="Bug Report">🐛 Bug</button>
          <button class="ogfb-type" data-type="Suggestion">💡 Suggestion</button>
          <button class="ogfb-type" data-type="Complaint">😤 Complaint</button>
          <button class="ogfb-type" data-type="Compliment">🌟 Compliment</button>
          <button class="ogfb-type" data-type="Other">📝 Other</button>
        </div>

        <span class="ogfb-label">Your Rating</span>
        <div class="ogfb-rating" id="ogFbStars">
          <span class="ogfb-star" data-v="1">★</span>
          <span class="ogfb-star" data-v="2">★</span>
          <span class="ogfb-star" data-v="3">★</span>
          <span class="ogfb-star" data-v="4">★</span>
          <span class="ogfb-star" data-v="5">★</span>
        </div>

        <input class="ogfb-input" id="ogFbName" placeholder="Your name (optional)"/>
        <input class="ogfb-input" id="ogFbPage" placeholder="Page / Feature (optional)" value="${window.location.pathname.split('/').pop() || 'Home'}"/>
        <textarea class="ogfb-input ogfb-textarea" id="ogFbMsg" placeholder="Describe the issue or suggestion *"></textarea>

        <button class="ogfb-submit" id="ogFbSubmit"><i class="fas fa-paper-plane"></i> Send Feedback</button>
      </div>
      <div class="ogfb-success" id="ogFbSuccess">
        <div class="ogfb-success-icon">🎉</div>
        <div class="ogfb-success-title">Thanks for your feedback!</div>
        <div class="ogfb-success-sub">We'll review it and improve the app.</div>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  // ── State ──
  var selectedType = 'Bug Report';
  var selectedRating = 0;
  var isOpen = false;

  // ── Toggle ──
  document.getElementById('ogFbBtn').addEventListener('click', function(){
    isOpen = !isOpen;
    document.getElementById('ogFbPanel').classList.toggle('open', isOpen);
  });
  document.getElementById('ogFbClose').addEventListener('click', function(){
    isOpen = false;
    document.getElementById('ogFbPanel').classList.remove('open');
  });

  // ── Type buttons ──
  document.querySelectorAll('.ogfb-type').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.ogfb-type').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      selectedType = btn.getAttribute('data-type');
    });
  });

  // ── Stars ──
  document.querySelectorAll('.ogfb-star').forEach(function(star){
    star.addEventListener('click', function(){
      selectedRating = parseInt(star.getAttribute('data-v'));
      document.querySelectorAll('.ogfb-star').forEach(function(s){
        s.classList.toggle('on', parseInt(s.getAttribute('data-v')) <= selectedRating);
      });
    });
    star.addEventListener('mouseover', function(){
      var v = parseInt(star.getAttribute('data-v'));
      document.querySelectorAll('.ogfb-star').forEach(function(s){
        s.classList.toggle('on', parseInt(s.getAttribute('data-v')) <= v);
      });
    });
    star.addEventListener('mouseout', function(){
      document.querySelectorAll('.ogfb-star').forEach(function(s){
        s.classList.toggle('on', parseInt(s.getAttribute('data-v')) <= selectedRating);
      });
    });
  });

  // ── Submit ──
  document.getElementById('ogFbSubmit').addEventListener('click', async function(){
    var msg = document.getElementById('ogFbMsg').value.trim();
    if(!msg){ document.getElementById('ogFbMsg').style.borderColor='rgba(239,68,68,0.5)'; return; }
    document.getElementById('ogFbMsg').style.borderColor='';

    var btn = document.getElementById('ogFbSubmit');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    var entry = {
      id: Date.now().toString(),
      type: selectedType,
      rating: selectedRating,
      name: document.getElementById('ogFbName').value.trim() || 'Anonymous',
      page: document.getElementById('ogFbPage').value.trim(),
      message: msg,
      url: window.location.href,
      submittedAt: new Date().toLocaleString(),
      status: 'new'
    };

    // Save to localStorage
    var list = JSON.parse(localStorage.getItem('hs_app_feedback')||'[]');
    list.unshift(entry);
    localStorage.setItem('hs_app_feedback', JSON.stringify(list));

    // Save to Firebase
    try {
      var fbMod   = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
      var fbStore = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
      var app = fbMod.getApps().find(function(a){ return a.name==='ogfb'; }) || fbMod.initializeApp(fbCfg,'ogfb');
      var db  = fbStore.getFirestore(app);
      await fbStore.setDoc(fbStore.doc(db,'app_feedback',entry.id), entry);
    } catch(e){ console.log('FB save error:',e); }

    // Show success
    document.getElementById('ogFbForm').style.display = 'none';
    document.getElementById('ogFbSuccess').style.display = 'block';

    setTimeout(function(){
      isOpen = false;
      document.getElementById('ogFbPanel').classList.remove('open');
      setTimeout(function(){
        document.getElementById('ogFbForm').style.display = 'block';
        document.getElementById('ogFbSuccess').style.display = 'none';
        document.getElementById('ogFbMsg').value = '';
        document.getElementById('ogFbName').value = '';
        selectedRating = 0;
        document.querySelectorAll('.ogfb-star').forEach(function(s){ s.classList.remove('on'); });
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Feedback';
      }, 400);
    }, 2500);
  });

})();
