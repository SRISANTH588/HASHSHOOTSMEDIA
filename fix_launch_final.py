path = "/Users/boddusrisanthsasibhushan/Desktop/HASH SHOOTS WEBSITE/index.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

OLD_START = '  <!-- APP LAUNCH SCREEN \u2014 Premium Gold Edition -->'
OLD_END   = '    })();\n  </script>\n\n</body>\n</html>'

start_idx = content.find(OLD_START)
end_idx   = content.find(OLD_END, start_idx) + len(OLD_END)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    exit()

NEW_LAUNCH = r"""  <!-- APP LAUNCH SCREEN - Premium Gold Edition -->
  <script>
  (function(){
    /* ── Config ── */
    var cfg = JSON.parse(localStorage.getItem('hs_launch_config')||'{}');
    if(cfg.enabled === false) return;

    var dur = cfg.duration || 10;
    var brand = cfg.brand || 'OG SHOOTS';
    var f1  = cfg.founder      || 'Boddu Srisanth';
    var f1t = cfg.founderTitle || 'Founder & CEO';
    var f2  = cfg.cofounder      || 'Gulimi Sumanth';
    var f2t = cfg.cofounderTitle || 'Managing Director';
    var tag = cfg.tagline || 'Premium Reels. Real Moments.';
    var fp1 = cfg.founderPhoto   || 'srisanth.jpeg';
    var fp2 = cfg.cofounderPhoto || 'sumanth.jpeg';
    var logo = cfg.logo || '';

    /* ── Audio ── */
    var _ac = null;
    function getAC(){
      if(!_ac) _ac = new (window.AudioContext||window.webkitAudioContext)();
      if(_ac.state==='suspended') _ac.resume();
      return _ac;
    }
    function tone(f,l,v,t){
      try{
        var c=getAC(),o=c.createOscillator(),g=c.createGain();
        o.connect(g); g.connect(c.destination);
        o.type='sine'; o.frequency.value=f;
        g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+0.03);
        g.gain.exponentialRampToValueAtTime(0.001,t+l);
        o.start(t); o.stop(t+l+0.05);
      }catch(e){}
    }
    function bell(t){
      try{
        var c=getAC(),o=c.createOscillator(),g=c.createGain();
        o.connect(g); g.connect(c.destination);
        o.type='sine'; o.frequency.setValueAtTime(1760,t);
        o.frequency.exponentialRampToValueAtTime(880,t+1.0);
        g.gain.setValueAtTime(0.22,t); g.gain.exponentialRampToValueAtTime(0.001,t+1.5);
        o.start(t); o.stop(t+1.6);
      }catch(e){}
    }
    function govinda(){
      try{
        var c=getAC(), t=c.currentTime+0.1;
        var notes=[
          [293,0.00,0.28,0.30],[370,0.30,0.22,0.28],[440,0.54,0.40,0.32],
          [293,1.05,0.28,0.30],[370,1.35,0.22,0.28],[440,1.59,0.40,0.32],
          [370,2.15,0.20,0.28],[440,2.37,0.20,0.30],[494,2.59,0.20,0.32],
          [554,2.81,0.50,0.38],[587,3.35,0.90,0.35],[554,4.30,0.55,0.22],[440,4.90,0.70,0.15]
        ];
        notes.forEach(function(n){ tone(n[0],n[2],n[3],t+n[1]); tone(n[0]*2,n[2]*0.5,n[3]*0.06,t+n[1]); });
        bell(t); bell(t+1.05); bell(t+2.15); bell(t+3.35);
      }catch(e){}
    }
    function tickSound(n){
      try{
        var c=getAC(),t=c.currentTime;
        tone(n<=3?880:440,0.08,0.15,t);
      }catch(e){}
    }

    /* ── Build Overlay ── */
    var ov = document.createElement('div');
    ov.id  = 'hs_launch_ov';
    ov.style.cssText = [
      'position:fixed;inset:0;z-index:99999',
      'display:flex;flex-direction:column;align-items:center;justify-content:center',
      'background:url("venkateswara.jpg") center top/cover no-repeat',
      'font-family:Inter,sans-serif;overflow:hidden',
      'transition:opacity 1.2s ease'
    ].join(';');

    var logoHtml = logo
      ? '<img src="'+logo+'" style="height:70px;object-fit:contain;filter:drop-shadow(0 0 20px rgba(201,168,76,0.8));" />'
      : '<div style="font-size:clamp(2rem,6vw,3.2rem);font-weight:900;letter-spacing:6px;background:linear-gradient(135deg,#c9a84c,#fff,#f5d76e,#c9a84c);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:lsh 3s linear infinite;">'+brand+'</div>';

    ov.innerHTML = [
      '<style>',
      '@keyframes lsh{0%{background-position:-300% center}100%{background-position:300% center}}',
      '@keyframes lrot{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
      '@keyframes lrotR{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}',
      '@keyframes lfu{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}',
      '@keyframes lpop{0%{transform:scale(0.2);opacity:0}60%{transform:scale(1.25)}80%{transform:scale(0.95)}100%{transform:scale(1);opacity:1}}',
      '@keyframes lring{0%{transform:translate(-50%,-50%) scale(0.5);opacity:0.9}100%{transform:translate(-50%,-50%) scale(3);opacity:0}}',
      '@keyframes lglow{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.8;transform:scale(1.2)}}',
      '@keyframes lscan{0%{top:-2%}100%{top:102%}}',
      '@keyframes lblink{0%,100%{opacity:1}50%{opacity:0.3}}',
      '@keyframes lcf{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}',
      '@keyframes lpulse{0%,100%{transform:scale(1);box-shadow:0 0 30px rgba(201,168,76,0.5)}50%{transform:scale(1.05);box-shadow:0 0 60px rgba(201,168,76,0.9)}}',
      '@keyframes lslideL{from{opacity:0;transform:translateX(-80px)}to{opacity:1;transform:translateX(0)}}',
      '@keyframes lslideR{from{opacity:0;transform:translateX(80px)}to{opacity:1;transform:translateX(0)}}',
      '@keyframes ldrop{from{opacity:0;transform:translateY(-60px) scale(0.8)}to{opacity:1;transform:translateY(0) scale(1)}}',
      '</style>',

      /* dark overlay on bg image */
      '<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.75) 0%,rgba(4,2,0,0.88) 50%,rgba(4,2,0,0.95) 100%);pointer-events:none;"></div>',

      /* gold radial glow */
      '<div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 50%,rgba(201,168,76,0.12) 0%,transparent 70%);pointer-events:none;"></div>',

      /* rotating rings */
      '<div style="position:absolute;top:50%;left:50%;width:min(90vw,700px);height:min(90vw,700px);margin:-350px 0 0 -350px;border-radius:50%;border:1px solid rgba(201,168,76,0.08);animation:lrot 30s linear infinite;pointer-events:none;"></div>',
      '<div style="position:absolute;top:50%;left:50%;width:min(65vw,500px);height:min(65vw,500px);margin:-250px 0 0 -250px;border-radius:50%;border:1px solid rgba(201,168,76,0.06);animation:lrotR 20s linear infinite;pointer-events:none;"></div>',

      /* scan line */
      '<div style="position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.15),transparent);animation:lscan 4s linear infinite;pointer-events:none;"></div>',

      /* ── PHASE 1: COUNTDOWN ── */
      '<div id="lp1" style="text-align:center;position:relative;z-index:2;animation:lfu 0.8s ease;">',

        /* logo / brand */
        '<div style="margin-bottom:1.5rem;">',
          logoHtml,
          '<div style="font-size:0.58rem;color:rgba(201,168,76,0.4);letter-spacing:8px;text-transform:uppercase;margin-top:0.5rem;">PREMIUM LAUNCH</div>',
        '</div>',

        /* SVG progress ring + number */
        '<div style="position:relative;display:inline-flex;align-items:center;justify-content:center;width:200px;height:200px;">',
          '<svg style="position:absolute;top:0;left:0;" width="200" height="200" viewBox="0 0 200 200">',
            '<circle cx="100" cy="100" r="90" fill="none" stroke="rgba(201,168,76,0.1)" stroke-width="2"/>',
            '<circle id="lpr" cx="100" cy="100" r="90" fill="none" stroke="url(#lg)" stroke-width="3" stroke-linecap="round" stroke-dasharray="565" stroke-dashoffset="565" transform="rotate(-90 100 100)" style="transition:stroke-dashoffset 0.9s linear;"/>',
            '<defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#c9a84c"/><stop offset="50%" stop-color="#fff"/><stop offset="100%" stop-color="#c9a84c"/></linearGradient></defs>',
          '</svg>',
          '<div id="lring" style="position:absolute;top:50%;left:50%;width:160px;height:160px;border-radius:50%;border:2px solid rgba(201,168,76,0.5);"></div>',
          '<div id="lnum" style="font-size:6rem;font-weight:900;color:#c9a84c;line-height:1;text-shadow:0 0 40px rgba(201,168,76,0.8);position:relative;z-index:1;">'+dur+'</div>',
        '</div>',

        /* LAUNCH button */
        '<div id="lbtnw" style="margin-top:1.75rem;">',
          '<button id="lbtn" style="background:linear-gradient(135deg,#c9a84c,#f5d76e,#c9a84c);background-size:200%;color:#000;border:none;border-radius:50px;padding:1rem 3.5rem;font-size:1.05rem;font-weight:900;cursor:pointer;font-family:Inter,sans-serif;letter-spacing:3px;text-transform:uppercase;animation:lpulse 1.8s ease-in-out infinite;display:inline-flex;align-items:center;gap:0.6rem;">',
            '<i class="fas fa-rocket"></i>',
            '<span>LAUNCH</span>',
          '</button>',
        '</div>',

        '<div style="margin-top:1rem;font-size:0.65rem;color:rgba(201,168,76,0.35);letter-spacing:3px;text-transform:uppercase;">'+tag+'</div>',
      '</div>',

      /* ── PHASE 2: EXPLOSION ── */
      '<div id="lp2" style="display:none;position:absolute;inset:0;z-index:3;align-items:center;justify-content:center;">',
        '<div id="lexp" style="width:20px;height:20px;border-radius:50%;background:#c9a84c;box-shadow:0 0 60px 30px rgba(201,168,76,0.9);"></div>',
      '</div>',

      /* ── PHASE 3: CONGRATS ── */
      '<div id="lp3" style="display:none;text-align:center;position:relative;z-index:2;padding:1.5rem;width:100%;max-width:600px;overflow-y:auto;max-height:100vh;">',

        /* LIVE badge */
        '<div style="display:inline-flex;align-items:center;gap:0.5rem;background:rgba(76,175,80,0.12);border:1px solid rgba(76,175,80,0.3);border-radius:50px;padding:0.4rem 1.1rem;margin-bottom:1.25rem;animation:lfu 0.6s ease;">',
          '<div style="width:8px;height:8px;border-radius:50%;background:#4caf50;box-shadow:0 0 8px #4caf50;animation:lblink 1s infinite;"></div>',
          '<span style="font-size:0.7rem;font-weight:800;color:#4caf50;letter-spacing:2px;text-transform:uppercase;">LIVE NOW</span>',
        '</div>',

        /* Brand name */
        '<div style="font-size:clamp(2.8rem,10vw,5rem);font-weight:900;letter-spacing:6px;background:linear-gradient(135deg,#c9a84c,#fff,#f5d76e,#fff,#c9a84c);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:lsh 2.5s linear infinite,ldrop 0.8s ease;line-height:1;margin-bottom:0.2rem;">'+brand+'</div>',
        '<div style="font-size:0.62rem;color:rgba(201,168,76,0.45);letter-spacing:8px;text-transform:uppercase;margin-bottom:1.75rem;animation:lfu 0.8s ease 0.2s both;">IS LIVE</div>',

        /* Divider */
        '<div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;animation:lfu 0.8s ease 0.3s both;">',
          '<div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.3));"></div>',
          '<span style="font-size:0.58rem;color:rgba(201,168,76,0.45);letter-spacing:3px;text-transform:uppercase;white-space:nowrap;">Proudly Presented By</span>',
          '<div style="flex:1;height:1px;background:linear-gradient(90deg,rgba(201,168,76,0.3),transparent);"></div>',
        '</div>',

        /* Founder cards */
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">',

          /* Card 1 - Founder */
          '<div style="position:relative;background:linear-gradient(145deg,rgba(201,168,76,0.08),rgba(0,0,0,0.4));border:1px solid rgba(201,168,76,0.3);border-radius:20px;padding:1.5rem 1rem;display:flex;flex-direction:column;align-items:center;gap:0.85rem;overflow:hidden;animation:lslideL 0.8s ease 0.4s both;backdrop-filter:blur(10px);">',
            '<div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a84c,#fff,#c9a84c,transparent);"></div>',
            '<div style="position:relative;">',
              '<div style="position:absolute;inset:-4px;border-radius:50%;background:conic-gradient(#c9a84c 0%,#fff 25%,#c9a84c 50%,#a07830 75%,#c9a84c 100%);animation:lrot 3s linear infinite;"></div>',
              '<div style="position:absolute;inset:-1px;border-radius:50%;background:#060606;"></div>',
              '<img src="'+fp1+'" style="position:relative;width:80px;height:80px;border-radius:50%;object-fit:cover;display:block;" onerror="this.style.display=\'none\'" />',
            '</div>',
            '<div style="text-align:center;">',
              '<div style="font-size:1rem;font-weight:900;color:#fff;margin-bottom:0.3rem;">'+f1+'</div>',
              '<div style="background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.25);border-radius:50px;padding:0.2rem 0.8rem;display:inline-block;">',
                '<span style="font-size:0.58rem;color:#c9a84c;font-weight:800;letter-spacing:2px;text-transform:uppercase;">'+f1t+'</span>',
              '</div>',
            '</div>',
          '</div>',

          /* Card 2 - MD */
          '<div style="position:relative;background:linear-gradient(145deg,rgba(201,168,76,0.08),rgba(0,0,0,0.4));border:1px solid rgba(201,168,76,0.3);border-radius:20px;padding:1.5rem 1rem;display:flex;flex-direction:column;align-items:center;gap:0.85rem;overflow:hidden;animation:lslideR 0.8s ease 0.5s both;backdrop-filter:blur(10px);">',
            '<div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a84c,#fff,#c9a84c,transparent);"></div>',
            '<div style="position:relative;">',
              '<div style="position:absolute;inset:-4px;border-radius:50%;background:conic-gradient(#c9a84c 0%,#fff 25%,#c9a84c 50%,#a07830 75%,#c9a84c 100%);animation:lrotR 3s linear infinite;"></div>',
              '<div style="position:absolute;inset:-1px;border-radius:50%;background:#060606;"></div>',
              '<img src="'+fp2+'" style="position:relative;width:80px;height:80px;border-radius:50%;object-fit:cover;display:block;" onerror="this.style.display=\'none\'" />',
            '</div>',
            '<div style="text-align:center;">',
              '<div style="font-size:1rem;font-weight:900;color:#fff;margin-bottom:0.3rem;">'+f2+'</div>',
              '<div style="background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.25);border-radius:50px;padding:0.2rem 0.8rem;display:inline-block;">',
                '<span style="font-size:0.58rem;color:#c9a84c;font-weight:800;letter-spacing:2px;text-transform:uppercase;">'+f2t+'</span>',
              '</div>',
            '</div>',
          '</div>',

        '</div>',

        '<div style="font-size:0.65rem;color:rgba(201,168,76,0.35);letter-spacing:3px;text-transform:uppercase;animation:lfu 0.8s ease 0.6s both;">'+tag+'</div>',

      '</div>'
    ].join('');

    document.body.appendChild(ov);

    /* ── Countdown Logic ── */
    var count = dur, started = false, timer = null;
    var numEl  = document.getElementById('lnum');
    var ringEl = document.getElementById('lring');
    var progEl = document.getElementById('lpr');

    function animRing(){
      if(!ringEl) return;
      ringEl.style.animation = 'none';
      void ringEl.offsetWidth;
      ringEl.style.animation = 'lring 0.9s ease-out forwards';
    }

    function startCountdown(){
      if(started) return;
      started = true;
      try{ getAC().resume(); }catch(e){}
      govinda();

      /* hide button, show "Launching in..." */
      var bw = document.getElementById('lbtnw');
      if(bw) bw.innerHTML = '<div style="font-size:0.7rem;color:rgba(201,168,76,0.5);letter-spacing:4px;text-transform:uppercase;margin-top:0.5rem;animation:lblink 1s infinite;">Launching in...</div>';

      /* start SVG progress */
      setTimeout(function(){
        if(progEl){
          progEl.style.transition = 'stroke-dashoffset '+dur+'s linear';
          progEl.style.strokeDashoffset = '0';
        }
      }, 50);

      animRing();
      tickSound(count);

      timer = setInterval(function(){
        count--;
        animRing();

        if(count > 0){
          tickSound(count);
          if(numEl){
            numEl.textContent = count;
            numEl.style.animation = 'none';
            void numEl.offsetWidth;
            numEl.style.animation = 'lpop 0.5s cubic-bezier(0.34,1.56,0.64,1)';
          }
          if(count <= 3 && numEl){
            numEl.style.color = '#fff';
            numEl.style.textShadow = '0 0 '+(60+(3-count)*40)+'px rgba(201,168,76,1)';
          }
        } else {
          clearInterval(timer);
          doExplosion();
        }
      }, 1000);
    }

    /* ── Phase 2: Explosion ── */
    function doExplosion(){
      var p1 = document.getElementById('lp1');
      var p2 = document.getElementById('lp2');
      if(p1) p1.style.display = 'none';
      if(p2){ p2.style.display = 'flex'; }

      var exp = document.getElementById('lexp');
      if(exp){
        exp.style.transition = 'all 0.5s ease-out';
        exp.style.width  = '200vw';
        exp.style.height = '200vw';
        exp.style.borderRadius = '50%';
        exp.style.background = 'radial-gradient(circle,#fff 0%,#f5d76e 20%,#c9a84c 50%,transparent 70%)';
        exp.style.boxShadow = '0 0 200px 100px rgba(201,168,76,0.6)';
        exp.style.opacity = '1';
      }

      /* flash white */
      ov.style.transition = 'background 0.15s';
      ov.style.background = '#fff';
      setTimeout(function(){ ov.style.background = ''; ov.style.cssText = ov.style.cssText; }, 150);

      /* play fanfare */
      govinda();

      /* confetti */
      var cols = ['#c9a84c','#fff','#f5d76e','#4caf50','#ff9800','#e8c96a','#a07830','#2196f3'];
      for(var i=0;i<180;i++){
        var cf = document.createElement('div');
        var sz = 4 + Math.random()*10;
        cf.style.cssText = [
          'position:fixed',
          'top:-20px',
          'left:'+Math.random()*100+'vw',
          'width:'+sz+'px',
          'height:'+sz+'px',
          'background:'+cols[Math.floor(Math.random()*cols.length)],
          'border-radius:'+(Math.random()>0.4?'50%':'2px'),
          'animation:lcf '+(2+Math.random()*3)+'s linear '+(Math.random()*1.5)+'s forwards',
          'z-index:100001',
          'pointer-events:none'
        ].join(';');
        ov.appendChild(cf);
      }

      /* after explosion → show Phase 3 */
      setTimeout(function(){
        if(p2) p2.style.display = 'none';
        ov.style.cssText = [
          'position:fixed;inset:0;z-index:99999',
          'display:flex;flex-direction:column;align-items:center;justify-content:center',
          'background:url("venkateswara.jpg") center top/cover no-repeat',
          'font-family:Inter,sans-serif;overflow:hidden',
          'transition:opacity 1.2s ease'
        ].join(';');
        var p3 = document.getElementById('lp3');
        if(p3) p3.style.display = 'block';
      }, 700);

      /* auto dismiss after 7s */
      setTimeout(function(){
        ov.style.opacity = '0';
        setTimeout(function(){ if(ov.parentNode) ov.remove(); }, 1300);
      }, 7500);
    }

    /* ── Bind button ── */
    var btn = document.getElementById('lbtn');
    if(btn){
      btn.addEventListener('click', function(e){ e.stopPropagation(); startCountdown(); });
      btn.addEventListener('touchstart', function(e){ e.stopPropagation(); startCountdown(); }, {passive:true});
    }

  })();
  </script>

</body>
</html>"""

content = content[:start_idx] + NEW_LAUNCH
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done - launch screen fully rewritten")
