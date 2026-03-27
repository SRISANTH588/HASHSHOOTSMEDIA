path = '/Users/boddusrisanthsasibhushan/Desktop/HASH SHOOTS WEBSITE/index.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

start = c.find('  <!-- APP LAUNCH SCREEN')
end   = c.find('</body>\n</html>', start)

new_block = r"""  <!-- APP LAUNCH SCREEN — Premium Gold Edition -->
  <script type="module">
    (async function(){
      // ── Load config from Firestore ──────────────────────────────
      var cfg = {};
      try {
        var m = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
        var s = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        var FB = {apiKey:'AIzaSyAtkcHfgNx9xEcyMC50eRX5VPv1r7O5XyE',authDomain:'hash-shoots.firebaseapp.com',projectId:'hash-shoots',storageBucket:'hash-shoots.firebasestorage.app',messagingSenderId:'1093054616221',appId:'1:1093054616221:web:55bdebafc895acfd04fa74'};
        var app = m.getApps().find(function(a){return a.name==='launch';}) || m.initializeApp(FB,'launch');
        var db  = s.getFirestore(app);
        var snap = await s.getDoc(s.doc(db,'config','launch'));
        if(snap.exists()){ cfg = snap.data(); localStorage.setItem('hs_launch_config', JSON.stringify(cfg)); }
        else cfg = JSON.parse(localStorage.getItem('hs_launch_config')||'{}');
      } catch(e){ cfg = JSON.parse(localStorage.getItem('hs_launch_config')||'{}'); }

      if(!cfg.enabled) return;

      // ── Config ───────────────────────────────────────────────────
      var dur            = cfg.duration      || 10;
      var founder        = cfg.founder       || 'Boddu Srisanth';
      var founderTitle   = cfg.founderTitle  || 'Founder & CEO';
      var cofounder      = cfg.cofounder     || 'Gulimi Sumanth';
      var cofounderTitle = cfg.cofounderTitle|| 'Managing Director';
      var brand          = cfg.brand         || 'OG SHOOTS';
      var tagline        = cfg.tagline       || 'Premium Reels. Real Moments.';
      var logo           = cfg.logo          || '';
      var founderPhoto   = cfg.founderPhoto  || 'srisanth.jpeg';
      var cofounderPhoto = cfg.cofounderPhoto|| 'sumanth.jpeg';

      // ── Web Audio ────────────────────────────────────────────────
      var _actx = null;
      function actx(){ if(!_actx) _actx = new (window.AudioContext||window.webkitAudioContext)(); return _actx; }

      function beep(freq, dur_s, type, vol, startTime){
        try{
          var ctx = actx();
          var o = ctx.createOscillator(), g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.type = type||'sine';
          o.frequency.setValueAtTime(freq, startTime||ctx.currentTime);
          g.gain.setValueAtTime(vol||0.2, startTime||ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, (startTime||ctx.currentTime)+dur_s);
          o.start(startTime||ctx.currentTime);
          o.stop((startTime||ctx.currentTime)+dur_s+0.01);
        }catch(e){}
      }

      function playTick(n){
        // n = remaining count. Higher pitch as it gets closer to 0
        var freq = 440 + (dur - n) * 30;
        beep(freq, 0.08, 'square', 0.15);
        // Subtle harmonic
        beep(freq*2, 0.06, 'sine', 0.05);
      }

      function playFanfare(){
        try{
          var ctx = actx();
          var t = ctx.currentTime;
          // Rising arpeggio: C5 E5 G5 C6
          [[523,0],[659,0.08],[784,0.16],[1047,0.24]].forEach(function(p){
            beep(p[0], 1.2, 'sine', 0.18, t+p[1]);
          });
          // Octave below
          beep(262, 0.9, 'sine', 0.25, t);
          // Sparkle high notes
          [[2093,0.35],[2637,0.45],[3136,0.55]].forEach(function(p){
            beep(p[0], 0.3, 'sine', 0.06, t+p[1]);
          });
        }catch(e){}
      }

      // ── Build overlay ────────────────────────────────────────────
      var ov = document.createElement('div');
      ov.id = 'hs_prem_ov';
      ov.style.cssText = [
        'position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999',
        'display:flex;flex-direction:column;align-items:center;justify-content:center',
        'background:#080808',
        'font-family:Inter,sans-serif;overflow:hidden',
        'transition:opacity 1.5s ease',
        'cursor:pointer'
      ].join(';');

      ov.innerHTML =
        // ── Keyframes ──
        '<style>' +
        '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap");' +
        '@keyframes _glow{0%,100%{opacity:0.4;transform:scale(1);}50%{opacity:1;transform:scale(1.15);}}' +
        '@keyframes _rot{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}' +
        '@keyframes _rotR{from{transform:rotate(360deg);}to{transform:rotate(0deg);}}' +
        '@keyframes _fadeUp{from{opacity:0;transform:translateY(60px);}to{opacity:1;transform:translateY(0);}}' +
        '@keyframes _pop{0%{transform:scale(0.2);opacity:0;}60%{transform:scale(1.25);}80%{transform:scale(0.92);}100%{transform:scale(1);opacity:1;}}' +
        '@keyframes _shimmer{0%{background-position:-300% center;}100%{background-position:300% center;}}' +
        '@keyframes _ring{0%{transform:translate(-50%,-50%) scale(0.5);opacity:1;}100%{transform:translate(-50%,-50%) scale(3);opacity:0;}}' +
        '@keyframes _confetti{0%{transform:translateY(-10px) rotate(0deg);opacity:1;}100%{transform:translateY(110vh) rotate(720deg);opacity:0;}}' +
        '@keyframes _pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}' +
        '@keyframes _scanline{0%{top:-10%;}100%{top:110%;}}' +
        '@keyframes _flicker{0%,100%{opacity:1;}92%{opacity:1;}93%{opacity:0.85;}94%{opacity:1;}97%{opacity:0.9;}98%{opacity:1;}}' +
        '</style>' +

        // ── Background layers ──
        '<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden;">' +
          // Deep gold radial
          '<div style="position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 40%,rgba(201,168,76,0.12) 0%,transparent 65%);"></div>' +
          // Rotating outer ring
          '<div style="position:absolute;top:50%;left:50%;width:min(90vw,700px);height:min(90vw,700px);margin:-350px 0 0 -350px;border-radius:50%;border:1px solid rgba(201,168,76,0.08);animation:_rot 30s linear infinite;"></div>' +
          '<div style="position:absolute;top:50%;left:50%;width:min(70vw,550px);height:min(70vw,550px);margin:-275px 0 0 -275px;border-radius:50%;border:1px solid rgba(201,168,76,0.06);animation:_rotR 20s linear infinite;"></div>' +
          // Corner glows
          '<div style="position:absolute;top:-150px;left:-150px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.07),transparent 70%);animation:_glow 5s ease-in-out infinite;"></div>' +
          '<div style="position:absolute;bottom:-150px;right:-150px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.07),transparent 70%);animation:_glow 6s ease-in-out infinite reverse;"></div>' +
          // Scanline effect
          '<div style="position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.15),transparent);animation:_scanline 4s linear infinite;pointer-events:none;"></div>' +
        '</div>' +

        // ── COUNTDOWN SCREEN ──
        '<div id="_lc_count" style="text-align:center;position:relative;z-index:2;animation:_fadeUp 0.8s ease;padding:1rem;">' +

          // Brand
          '<div style="margin-bottom:1.5rem;">' +
            (logo
              ? '<img src="'+logo+'" style="height:70px;object-fit:contain;filter:drop-shadow(0 0 20px rgba(201,168,76,0.6));" />'
              : '<div style="font-size:clamp(1.6rem,4vw,2.4rem);font-weight:900;letter-spacing:4px;background:linear-gradient(135deg,#c9a84c,#fff,#f5d76e,#c9a84c);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:_shimmer 4s linear infinite;">'+brand+'</div>'
            ) +
            '<div style="font-size:0.65rem;color:rgba(201,168,76,0.5);letter-spacing:6px;text-transform:uppercase;margin-top:0.3rem;">PREMIUM LAUNCH</div>' +
          '</div>' +

          // Ring + number
          '<div style="position:relative;display:inline-flex;align-items:center;justify-content:center;width:200px;height:200px;">' +
            // SVG ring
            '<svg style="position:absolute;top:0;left:0;width:200px;height:200px;" viewBox="0 0 200 200">' +
              '<circle cx="100" cy="100" r="90" fill="none" stroke="rgba(201,168,76,0.1)" stroke-width="2"/>' +
              '<circle id="_prog_ring" cx="100" cy="100" r="90" fill="none" stroke="url(#goldGrad)" stroke-width="3" stroke-linecap="round" stroke-dasharray="565" stroke-dashoffset="565" transform="rotate(-90 100 100)" style="transition:stroke-dashoffset 0.9s linear;"/>' +
              '<defs><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#c9a84c"/><stop offset="50%" stop-color="#fff"/><stop offset="100%" stop-color="#c9a84c"/></linearGradient></defs>' +
            '</svg>' +
            // Pulse ring
            '<div id="_pulse_ring" style="position:absolute;top:50%;left:50%;width:160px;height:160px;border-radius:50%;border:2px solid rgba(201,168,76,0.5);animation:_ring 1s ease-out;"></div>' +
            // Number
            '<div id="_lc_num" style="font-size:5.5rem;font-weight:900;color:#c9a84c;line-height:1;text-shadow:0 0 60px rgba(201,168,76,0.6),0 0 120px rgba(201,168,76,0.2);animation:_pop 0.5s cubic-bezier(0.34,1.56,0.64,1);position:relative;z-index:1;">'+dur+'</div>' +
          '</div>' +

          // Launch button
          '<div style="margin-top:2rem;" id="_launch_btn_wrap">' +
            '<button id="_launch_btn" style="' +
              'background:linear-gradient(135deg,#c9a84c 0%,#f5d76e 50%,#a07830 100%);' +
              'background-size:200%;' +
              'color:#000;border:none;border-radius:50px;' +
              'padding:0.9rem 2.8rem;' +
              'font-size:1rem;font-weight:900;cursor:pointer;' +
              'font-family:Inter,sans-serif;letter-spacing:2px;text-transform:uppercase;' +
              'box-shadow:0 0 40px rgba(201,168,76,0.5),0 0 80px rgba(201,168,76,0.2),inset 0 1px 0 rgba(255,255,255,0.3);' +
              'animation:_pulse 1.8s ease-in-out infinite,_shimmer 3s linear infinite;' +
              'display:inline-flex;align-items:center;gap:0.6rem;' +
              'position:relative;overflow:hidden;' +
            '">' +
              '<span style="position:absolute;inset:0;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.25) 50%,transparent 100%);background-size:200%;animation:_shimmer 2s linear infinite;border-radius:50px;"></span>' +
              '<i class="fas fa-rocket" style="position:relative;z-index:1;"></i>' +
              '<span style="position:relative;z-index:1;">LAUNCH</span>' +
            '</button>' +
          '</div>' +

          // Tagline
          '<div style="margin-top:1.25rem;font-size:0.72rem;color:rgba(201,168,76,0.4);letter-spacing:3px;text-transform:uppercase;">'+tagline+'</div>' +

        '</div>' +

        // ── CONGRATS SCREEN ──
        '<div id="_lc_congrats" style="display:none;text-align:center;position:relative;z-index:2;animation:_fadeUp 1s ease;padding:1.5rem;max-width:600px;width:100%;">' +

          // Live badge
          '<div style="display:inline-flex;align-items:center;gap:0.5rem;background:rgba(76,175,80,0.12);border:1px solid rgba(76,175,80,0.3);border-radius:50px;padding:0.4rem 1.1rem;margin-bottom:1.5rem;">' +
            '<div style="width:8px;height:8px;border-radius:50%;background:#4caf50;box-shadow:0 0 8px #4caf50;animation:_pulse 1s ease-in-out infinite;"></div>' +
            '<span style="font-size:0.72rem;font-weight:800;color:#4caf50;letter-spacing:2px;text-transform:uppercase;">LIVE NOW</span>' +
          '</div>' +

          // Brand name
          '<div style="font-size:clamp(2.5rem,8vw,5rem);font-weight:900;letter-spacing:4px;background:linear-gradient(135deg,#c9a84c,#fff,#f5d76e,#fff,#c9a84c);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:_shimmer 3s linear infinite;line-height:1;margin-bottom:0.3rem;">'+brand+'</div>' +
          '<div style="font-size:0.7rem;color:rgba(201,168,76,0.5);letter-spacing:6px;text-transform:uppercase;margin-bottom:2rem;">IS LIVE</div>' +

          // Divider
          '<div style="display:flex;align-items:center;gap:1rem;margin-bottom:2rem;">' +
            '<div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.3));"></div>' +
            '<div style="font-size:0.65rem;color:rgba(201,168,76,0.4);letter-spacing:3px;text-transform:uppercase;white-space:nowrap;">Proudly Presented By</div>' +
            '<div style="flex:1;height:1px;background:linear-gradient(90deg,rgba(201,168,76,0.3),transparent);"></div>' +
          '</div>' +

          // Founders card
          '<div style="background:rgba(255,255,255,0.02);border:1px solid rgba(201,168,76,0.15);border-radius:24px;padding:2rem;margin-bottom:2rem;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);">' +
            '<div style="display:flex;flex-direction:column;gap:1.5rem;">' +

              // Founder 1
              '<div style="display:flex;align-items:center;gap:1.25rem;">' +
                '<div style="position:relative;flex-shrink:0;">' +
                  '<div style="position:absolute;inset:-3px;border-radius:50%;background:linear-gradient(135deg,#c9a84c,#fff,#c9a84c);animation:_rot 4s linear infinite;"></div>' +
                  '<img src="'+founderPhoto+'" onerror="this.src=\'\';this.style.display=\'none\'" style="position:relative;width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #080808;display:block;"/>' +
                '</div>' +
                '<div style="text-align:left;">' +
                  '<div style="font-size:1.35rem;font-weight:900;color:#fff;letter-spacing:-0.5px;">'+founder+'</div>' +
                  '<div style="font-size:0.78rem;color:#c9a84c;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-top:0.15rem;">'+founderTitle+'</div>' +
                '</div>' +
              '</div>' +

              // Divider
              '<div style="display:flex;align-items:center;gap:0.75rem;">' +
                '<div style="flex:1;height:1px;background:rgba(201,168,76,0.12);"></div>' +
                '<div style="width:4px;height:4px;border-radius:50%;background:#c9a84c;opacity:0.4;"></div>' +
                '<div style="flex:1;height:1px;background:rgba(201,168,76,0.12);"></div>' +
              '</div>' +

              // Founder 2
              '<div style="display:flex;align-items:center;gap:1.25rem;">' +
                '<div style="position:relative;flex-shrink:0;">' +
                  '<div style="position:absolute;inset:-3px;border-radius:50%;background:linear-gradient(135deg,#c9a84c,#fff,#c9a84c);animation:_rotR 4s linear infinite;"></div>' +
                  '<img src="'+cofounderPhoto+'" onerror="this.src=\'\';this.style.display=\'none\'" style="position:relative;width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #080808;display:block;"/>' +
                '</div>' +
                '<div style="text-align:left;">' +
                  '<div style="font-size:1.35rem;font-weight:900;color:#fff;letter-spacing:-0.5px;">'+cofounder+'</div>' +
                  '<div style="font-size:0.78rem;color:#c9a84c;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-top:0.15rem;">'+cofounderTitle+'</div>' +
                '</div>' +
              '</div>' +

            '</div>' +
          '</div>' +

          // Tagline
          '<div style="font-size:0.85rem;color:rgba(201,168,76,0.5);letter-spacing:2px;text-transform:uppercase;">'+tagline+'</div>' +

        '</div>';

      document.body.appendChild(ov);

      // ── Countdown logic ──────────────────────────────────────────
      var count   = dur;
      var numEl   = document.getElementById('_lc_num');
      var ringEl  = document.getElementById('_pulse_ring');
      var progRing= document.getElementById('_prog_ring');
      var timer   = null;
      var started = false;
      var circumference = 565; // 2*pi*90

      function updateRing(remaining){
        if(!progRing) return;
        var pct = 1 - (remaining / dur);
        progRing.style.strokeDashoffset = circumference * (1 - pct);
      }

      function startCountdown(){
        if(started) return;
        started = true;
        try{ actx().resume(); }catch(e){}

        // Hide button, show "Launching..."
        var btnWrap = document.getElementById('_launch_btn_wrap');
        if(btnWrap) btnWrap.innerHTML = '<div style="font-size:0.78rem;color:rgba(201,168,76,0.5);letter-spacing:4px;text-transform:uppercase;margin-top:0.5rem;">Launching in...</div>';

        // Animate ring to full over dur seconds
        setTimeout(function(){ updateRing(0); if(progRing) progRing.style.transition='stroke-dashoffset '+(dur)+'s linear'; }, 50);

        // First tick immediately
        playTick(count);

        timer = setInterval(function(){
          count--;

          // Pulse ring
          if(ringEl){ ringEl.style.animation='none'; void ringEl.offsetWidth; ringEl.style.animation='_ring 1s ease-out'; }

          if(count > 0){
            playTick(count);
            if(numEl){
              numEl.textContent = count;
              numEl.style.animation = 'none';
              void numEl.offsetWidth;
              numEl.style.animation = '_pop 0.5s cubic-bezier(0.34,1.56,0.64,1)';
            }
            // Glow intensifies last 3
            if(count <= 3 && numEl){
              numEl.style.textShadow = '0 0 '+(80+(3-count)*40)+'px rgba(201,168,76,0.9),0 0 '+(160+(3-count)*60)+'px rgba(201,168,76,0.4)';
            }
          } else {
            clearInterval(timer);
            playFanfare();

            // Switch screens
            document.getElementById('_lc_count').style.display = 'none';
            var cg = document.getElementById('_lc_congrats');
            cg.style.display = 'block';

            // Confetti — 150 pieces
            for(var i=0;i<150;i++){
              var cf = document.createElement('div');
              var cols = ['#c9a84c','#fff','#f5d76e','#4caf50','#2196f3','#ff9800','#e8c96a','#d4b870'];
              var sz = 4 + Math.random()*10;
              cf.style.cssText = [
                'position:fixed','top:-20px',
                'left:'+Math.random()*100+'vw',
                'width:'+sz+'px','height:'+sz+'px',
                'background:'+cols[Math.floor(Math.random()*cols.length)],
                'border-radius:'+(Math.random()>0.4?'50%':'2px'),
                'animation:_confetti '+(2+Math.random()*3)+'s linear '+(Math.random()*2)+'s forwards',
                'z-index:100000','pointer-events:none'
              ].join(';');
              ov.appendChild(cf);
            }

            // Auto-dismiss after 6s
            setTimeout(function(){
              ov.style.opacity = '0';
              setTimeout(function(){ if(ov.parentNode) ov.remove(); }, 1500);
            }, 6000);
          }
        }, 1000);
      }

      // Wire up button
      var btn = document.getElementById('_launch_btn');
      if(btn){
        btn.addEventListener('click', function(e){ e.stopPropagation(); startCountdown(); });
        btn.addEventListener('touchstart', function(e){ e.stopPropagation(); startCountdown(); }, {passive:true});
      }
    })();
  </script>

</body>
</html>"""

c = c[:start] + new_block
with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print('Done. Lines: ' + str(c.count('\n')))
