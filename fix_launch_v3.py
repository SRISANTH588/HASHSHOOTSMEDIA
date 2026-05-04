path = "/Users/boddusrisanthsasibhushan/Desktop/HASH SHOOTS WEBSITE/index.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

START = '  <!-- APP LAUNCH SCREEN - Premium Gold Edition -->'
END   = '</body>\n</html>'

si = content.find(START)
ei = content.rfind(END)

if si == -1 or ei == -1:
    print("Markers not found"); exit()

NEW = '''  <!-- APP LAUNCH SCREEN - Premium Gold Edition -->
  <script>
  (function(){
    var cfg = JSON.parse(localStorage.getItem('hs_launch_config')||'{}');
    if(cfg.enabled === false) return;

    var dur = cfg.duration||10;
    var brand = cfg.brand||'OG SHOOTS';
    var f1  = cfg.founder||'Boddu Srisanth';
    var f1t = cfg.founderTitle||'Founder & CEO';
    var f2  = cfg.cofounder||'Gulimi Sumanth';
    var f2t = cfg.cofounderTitle||'Managing Director';
    var tag = cfg.tagline||'Premium Reels. Real Moments.';
    var fp1 = cfg.founderPhoto||'srisanth.jpeg';
    var fp2 = cfg.cofounderPhoto||'sumanth.jpeg';
    var logo = cfg.logo||'';

    /* ── AUDIO ── */
    var _ac=null;
    function AC(){
      if(!_ac) _ac=new(window.AudioContext||window.webkitAudioContext)();
      if(_ac.state==='suspended') _ac.resume();
      return _ac;
    }
    function tn(f,l,v,t){
      try{
        var c=AC(),o=c.createOscillator(),g=c.createGain();
        o.connect(g);g.connect(c.destination);
        o.type='sine';o.frequency.value=f;
        g.gain.setValueAtTime(0,t);
        g.gain.linearRampToValueAtTime(v,t+0.04);
        g.gain.exponentialRampToValueAtTime(0.001,t+l);
        o.start(t);o.stop(t+l+0.05);
      }catch(e){}
    }
    function bell(t){
      try{
        var c=AC(),o=c.createOscillator(),g=c.createGain();
        o.connect(g);g.connect(c.destination);
        o.type='sine';
        o.frequency.setValueAtTime(1760,t);
        o.frequency.exponentialRampToValueAtTime(880,t+1.2);
        g.gain.setValueAtTime(0.25,t);
        g.gain.exponentialRampToValueAtTime(0.001,t+1.8);
        o.start(t);o.stop(t+1.9);
        var o2=c.createOscillator(),g2=c.createGain();
        o2.connect(g2);g2.connect(c.destination);
        o2.type='sine';o2.frequency.value=2637;
        g2.gain.setValueAtTime(0.08,t);
        g2.gain.exponentialRampToValueAtTime(0.001,t+0.7);
        o2.start(t);o2.stop(t+0.8);
      }catch(e){}
    }
    function govinda(){
      try{
        var c=AC(),t=c.currentTime+0.1;
        var n=[[293,0,0.28,0.32],[370,0.30,0.22,0.30],[440,0.54,0.42,0.34],
               [293,1.08,0.28,0.32],[370,1.38,0.22,0.30],[440,1.62,0.42,0.34],
               [370,2.18,0.20,0.30],[440,2.40,0.20,0.32],[494,2.62,0.20,0.34],
               [554,2.84,0.52,0.40],[587,3.40,0.95,0.38],[554,4.40,0.55,0.24],[440,5.00,0.75,0.16]];
        n.forEach(function(x){tn(x[0],x[2],x[3],t+x[1]);tn(x[0]*2,x[2]*0.5,x[3]*0.07,t+x[1]);});
        bell(t);bell(t+1.08);bell(t+2.18);bell(t+3.40);
      }catch(e){}
    }
    function tickSnd(n){try{tn(n<=3?1047:523,0.09,0.18,AC().currentTime);}catch(e){}}

    /* ── STYLES ── */
    var st=document.createElement('style');
    st.textContent=[
      '@keyframes LSH{0%{background-position:-300% center}100%{background-position:300% center}}',
      '@keyframes LROT{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
      '@keyframes LROTR{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}',
      '@keyframes LFU{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}',
      '@keyframes LPOP{0%{transform:scale(0.1);opacity:0}55%{transform:scale(1.3)}80%{transform:scale(0.92)}100%{transform:scale(1);opacity:1}}',
      '@keyframes LRING{0%{transform:translate(-50%,-50%) scale(0.4);opacity:1}100%{transform:translate(-50%,-50%) scale(3.5);opacity:0}}',
      '@keyframes LGLOW{0%,100%{opacity:0.25;transform:scale(1)}50%{opacity:0.75;transform:scale(1.25)}}',
      '@keyframes LSCAN{0%{top:-1%}100%{top:101%}}',
      '@keyframes LBLINK{0%,100%{opacity:1}50%{opacity:0.2}}',
      '@keyframes LCF{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(115vh) rotate(800deg);opacity:0}}',
      '@keyframes LPULSE{0%,100%{transform:scale(1);box-shadow:0 0 35px rgba(201,168,76,0.6),0 0 70px rgba(201,168,76,0.2)}50%{transform:scale(1.06);box-shadow:0 0 60px rgba(201,168,76,1),0 0 120px rgba(201,168,76,0.4)}}',
      '@keyframes LSLIDEL{from{opacity:0;transform:translateX(-100px) scale(0.9)}to{opacity:1;transform:translateX(0) scale(1)}}',
      '@keyframes LSLIDER{from{opacity:0;transform:translateX(100px) scale(0.9)}to{opacity:1;transform:translateX(0) scale(1)}}',
      '@keyframes LDROP{from{opacity:0;transform:translateY(-80px) scale(0.7)}to{opacity:1;transform:translateY(0) scale(1)}}',
      '@keyframes LSHINE{0%{left:-100%}100%{left:200%}}',
      '@keyframes LEXP{0%{transform:scale(0);opacity:1}100%{transform:scale(40);opacity:0}}',
      '.lcard-img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;}',
      '.lcard-img-wrap{width:100%;overflow:hidden;position:relative;}',
      '.lcard-img-wrap::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.85) 100%);}',
      '.lcard-name{position:absolute;bottom:0;left:0;right:0;padding:0.75rem;z-index:1;text-align:center;}',
    ].join('');
    document.head.appendChild(st);

    /* ── OVERLAY ── */
    var ov=document.createElement('div');
    ov.id='hs_launch_ov';
    ov.style.cssText='position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:url("venkateswara.jpg") center top/cover no-repeat;font-family:Inter,sans-serif;overflow:hidden;transition:opacity 1.2s ease;';

    /* bg overlays */
    var bgd=document.createElement('div');
    bgd.style.cssText='position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.78) 0%,rgba(3,1,0,0.88) 45%,rgba(3,1,0,0.96) 100%);pointer-events:none;z-index:0;';
    ov.appendChild(bgd);

    var bgr=document.createElement('div');
    bgr.style.cssText='position:absolute;inset:0;background:radial-gradient(ellipse 65% 45% at 50% 50%,rgba(201,168,76,0.14) 0%,transparent 70%);pointer-events:none;z-index:0;';
    ov.appendChild(bgr);

    /* rotating rings */
    [700,520,340].forEach(function(s,i){
      var r=document.createElement('div');
      var half=s/2;
      r.style.cssText='position:absolute;top:50%;left:50%;width:'+s+'px;height:'+s+'px;margin:-'+half+'px 0 0 -'+half+'px;border-radius:50%;border:1px solid rgba(201,168,76,'+(0.08-i*0.02)+');animation:'+(i%2===0?'LROT':'LROTR')+' '+(28+i*8)+'s linear infinite;pointer-events:none;z-index:0;';
      ov.appendChild(r);
    });

    /* scan line */
    var sc=document.createElement('div');
    sc.style.cssText='position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.2),transparent);animation:LSCAN 4s linear infinite;pointer-events:none;z-index:0;';
    ov.appendChild(sc);

    /* corner accents */
    ['top:0;left:0;border-top:2px solid;border-left:2px solid',
     'top:0;right:0;border-top:2px solid;border-right:2px solid',
     'bottom:0;left:0;border-bottom:2px solid;border-left:2px solid',
     'bottom:0;right:0;border-bottom:2px solid;border-right:2px solid'
    ].forEach(function(s){
      var c=document.createElement('div');
      c.style.cssText='position:absolute;'+s+';border-color:rgba(201,168,76,0.4);width:40px;height:40px;pointer-events:none;z-index:1;';
      ov.appendChild(c);
    });

    /* ── PHASE 1: COUNTDOWN ── */
    var p1=document.createElement('div');
    p1.id='lp1';
    p1.style.cssText='text-align:center;position:relative;z-index:2;animation:LFU 0.9s ease;padding:1rem;';

    var logoHtml = logo
      ? '<img src="'+logo+'" style="height:68px;object-fit:contain;filter:drop-shadow(0 0 25px rgba(201,168,76,0.9));margin-bottom:0.4rem;" />'
      : '<div style="font-size:clamp(2rem,6vw,3rem);font-weight:900;letter-spacing:6px;background:linear-gradient(135deg,#c9a84c,#fff,#f5d76e,#c9a84c);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:LSH 3s linear infinite;margin-bottom:0.4rem;">'+brand+'</div>';

    p1.innerHTML = logoHtml
      +'<div style="font-size:0.55rem;color:rgba(201,168,76,0.45);letter-spacing:9px;text-transform:uppercase;margin-bottom:1.75rem;">PREMIUM LAUNCH</div>'

      /* SVG ring */
      +'<div style="position:relative;display:inline-flex;align-items:center;justify-content:center;width:210px;height:210px;">'
        +'<svg style="position:absolute;top:0;left:0;" width="210" height="210" viewBox="0 0 210 210">'
          +'<circle cx="105" cy="105" r="92" fill="none" stroke="rgba(201,168,76,0.1)" stroke-width="2"/>'
          +'<circle id="lpr" cx="105" cy="105" r="92" fill="none" stroke="url(#lg1)" stroke-width="4" stroke-linecap="round" stroke-dasharray="578" stroke-dashoffset="578" transform="rotate(-90 105 105)"/>'
          +'<defs><linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#a07830"/><stop offset="50%" stop-color="#fff"/><stop offset="100%" stop-color="#a07830"/></linearGradient></defs>'
        +'</svg>'
        +'<div id="lring" style="position:absolute;top:50%;left:50%;width:165px;height:165px;border-radius:50%;border:2px solid rgba(201,168,76,0.6);"></div>'
        +'<div id="lnum" style="font-size:6.5rem;font-weight:900;color:#c9a84c;line-height:1;text-shadow:0 0 50px rgba(201,168,76,0.9),0 0 100px rgba(201,168,76,0.3);position:relative;z-index:1;animation:LPOP 0.5s cubic-bezier(0.34,1.56,0.64,1);">'+dur+'</div>'
      +'</div>'

      /* LAUNCH button */
      +'<div id="lbtnw" style="margin-top:2rem;">'
        +'<button id="lbtn" style="position:relative;overflow:hidden;background:linear-gradient(135deg,#a07830,#c9a84c,#f5d76e,#c9a84c,#a07830);background-size:300%;color:#000;border:none;border-radius:50px;padding:1.1rem 4rem;font-size:1.1rem;font-weight:900;cursor:pointer;font-family:Inter,sans-serif;letter-spacing:4px;text-transform:uppercase;animation:LPULSE 1.6s ease-in-out infinite;display:inline-flex;align-items:center;gap:0.7rem;">'
          +'<span style="position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);animation:LSHINE 2s linear infinite;"></span>'
          +'<i class="fas fa-rocket" style="position:relative;z-index:1;font-size:1.2rem;"></i>'
          +'<span style="position:relative;z-index:1;">LAUNCH</span>'
        +'</button>'
      +'</div>'

      +'<div style="margin-top:1.1rem;font-size:0.62rem;color:rgba(201,168,76,0.35);letter-spacing:3px;text-transform:uppercase;">'+tag+'</div>';

    ov.appendChild(p1);

    /* ── PHASE 2: EXPLOSION ── */
    var p2=document.createElement('div');
    p2.id='lp2';
    p2.style.cssText='display:none;position:absolute;inset:0;z-index:10;align-items:center;justify-content:center;';
    var expDot=document.createElement('div');
    expDot.id='lexp';
    expDot.style.cssText='width:24px;height:24px;border-radius:50%;background:radial-gradient(circle,#fff 0%,#f5d76e 40%,#c9a84c 70%,transparent 100%);box-shadow:0 0 80px 40px rgba(201,168,76,0.95);';
    p2.appendChild(expDot);
    ov.appendChild(p2);

    /* ── PHASE 3: CONGRATS ── */
    var p3=document.createElement('div');
    p3.id='lp3';
    p3.style.cssText='display:none;text-align:center;position:relative;z-index:2;padding:1.25rem;width:100%;max-width:640px;';

    /* LIVE badge */
    var liveBadge='<div style="display:inline-flex;align-items:center;gap:0.5rem;background:rgba(76,175,80,0.12);border:1px solid rgba(76,175,80,0.35);border-radius:50px;padding:0.4rem 1.2rem;margin-bottom:1.25rem;animation:LFU 0.6s ease;">'
      +'<div style="width:9px;height:9px;border-radius:50%;background:#4caf50;box-shadow:0 0 10px #4caf50;animation:LBLINK 1s infinite;"></div>'
      +'<span style="font-size:0.68rem;font-weight:800;color:#4caf50;letter-spacing:3px;text-transform:uppercase;">LIVE NOW</span>'
    +'</div>';

    /* Brand */
    var brandHtml='<div style="font-size:clamp(2.5rem,9vw,5rem);font-weight:900;letter-spacing:6px;background:linear-gradient(135deg,#a07830,#c9a84c,#fff,#f5d76e,#fff,#c9a84c,#a07830);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:LSH 2.5s linear infinite,LDROP 0.8s ease;line-height:1;margin-bottom:0.2rem;">'+brand+'</div>'
      +'<div style="font-size:0.6rem;color:rgba(201,168,76,0.45);letter-spacing:9px;text-transform:uppercase;margin-bottom:1.5rem;animation:LFU 0.8s ease 0.2s both;">IS LIVE</div>';

    /* Divider */
    var divider='<div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem;animation:LFU 0.8s ease 0.3s both;">'
      +'<div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.4));"></div>'
      +'<span style="font-size:0.58rem;color:rgba(201,168,76,0.5);letter-spacing:3px;text-transform:uppercase;white-space:nowrap;">Proudly Presented By</span>'
      +'<div style="flex:1;height:1px;background:linear-gradient(90deg,rgba(201,168,76,0.4),transparent);"></div>'
    +'</div>';

    /* Founder cards — FULL SQUARE IMAGE */
    function makeCard(photo, name, title, animClass){
      return '<div style="position:relative;border-radius:16px;overflow:hidden;border:2px solid rgba(201,168,76,0.5);box-shadow:0 0 30px rgba(201,168,76,0.2),0 20px 60px rgba(0,0,0,0.7);animation:'+animClass+' 0.9s cubic-bezier(0.34,1.2,0.64,1) 0.4s both;">'
        /* full square image */
        +'<div style="width:100%;aspect-ratio:1/1;overflow:hidden;position:relative;">'
          +'<img src="'+photo+'" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.parentElement.style.background=\'linear-gradient(135deg,#1a1408,#0a0a0a)\'" />'
          /* gradient overlay on image */
          +'<div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.92) 100%);"></div>'
          /* gold top bar */
          +'<div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#c9a84c,#fff,#c9a84c,transparent);"></div>'
          /* spinning gold ring overlay on top-right */
          +'<div style="position:absolute;top:-30px;right:-30px;width:80px;height:80px;border-radius:50%;border:1px solid rgba(201,168,76,0.3);animation:LROT 6s linear infinite;"></div>'
        +'</div>'
        /* name & title over image bottom */
        +'<div style="position:absolute;bottom:0;left:0;right:0;padding:1rem 0.85rem 0.85rem;text-align:center;">'
          +'<div style="font-size:1rem;font-weight:900;color:#fff;letter-spacing:0.3px;text-shadow:0 2px 8px rgba(0,0,0,0.8);margin-bottom:0.35rem;">'+name+'</div>'
          +'<div style="display:inline-block;background:linear-gradient(135deg,rgba(201,168,76,0.25),rgba(160,120,48,0.15));border:1px solid rgba(201,168,76,0.5);border-radius:50px;padding:0.22rem 0.85rem;backdrop-filter:blur(4px);">'
            +'<span style="font-size:0.58rem;color:#f5d76e;font-weight:800;letter-spacing:2px;text-transform:uppercase;">'+title+'</span>'
          +'</div>'
        +'</div>'
      +'</div>';
    }

    var cards='<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">'
      +makeCard(fp1,f1,f1t,'LSLIDEL')
      +makeCard(fp2,f2,f2t,'LSLIDER')
    +'</div>';

    var tagline='<div style="font-size:0.62rem;color:rgba(201,168,76,0.4);letter-spacing:3px;text-transform:uppercase;animation:LFU 0.8s ease 0.7s both;">'+tag+'</div>';

    p3.innerHTML = liveBadge + brandHtml + divider + cards + tagline;
    ov.appendChild(p3);
    document.body.appendChild(ov);

    /* ── COUNTDOWN LOGIC ── */
    var count=dur, started=false, timer=null;
    var numEl=document.getElementById('lnum');
    var ringEl=document.getElementById('lring');
    var progEl=document.getElementById('lpr');

    function animRing(){
      if(!ringEl) return;
      ringEl.style.animation='none';
      void ringEl.offsetWidth;
      ringEl.style.animation='LRING 0.85s ease-out forwards';
    }

    function startCountdown(){
      if(started) return;
      started=true;
      try{AC().resume();}catch(e){}
      govinda();

      var bw=document.getElementById('lbtnw');
      if(bw) bw.innerHTML='<div style="font-size:0.68rem;color:rgba(201,168,76,0.55);letter-spacing:5px;text-transform:uppercase;margin-top:0.5rem;animation:LBLINK 1.2s infinite;">Launching in...</div>';

      setTimeout(function(){
        if(progEl){
          progEl.style.transition='stroke-dashoffset '+dur+'s linear';
          progEl.style.strokeDashoffset='0';
        }
      },60);

      animRing();
      tickSnd(count);

      timer=setInterval(function(){
        count--;
        animRing();
        if(count>0){
          tickSnd(count);
          if(numEl){
            numEl.textContent=count;
            numEl.style.animation='none';
            void numEl.offsetWidth;
            numEl.style.animation='LPOP 0.5s cubic-bezier(0.34,1.56,0.64,1)';
          }
          if(count<=3 && numEl){
            numEl.style.color='#fff';
            numEl.style.textShadow='0 0 '+(50+(3-count)*50)+'px rgba(201,168,76,1),0 0 '+(100+(3-count)*80)+'px rgba(201,168,76,0.5)';
          }
        } else {
          clearInterval(timer);
          doExplosion();
        }
      },1000);
    }

    /* ── EXPLOSION ── */
    function doExplosion(){
      var p1el=document.getElementById('lp1');
      var p2el=document.getElementById('lp2');
      if(p1el) p1el.style.display='none';
      if(p2el){ p2el.style.display='flex'; }

      /* expand dot */
      var exp=document.getElementById('lexp');
      if(exp){
        exp.style.transition='transform 0.6s ease-out, opacity 0.6s ease-out';
        exp.style.transform='scale(80)';
        exp.style.opacity='0';
      }

      /* white flash */
      var flash=document.createElement('div');
      flash.style.cssText='position:absolute;inset:0;background:#fff;z-index:20;opacity:0.95;transition:opacity 0.4s ease;';
      ov.appendChild(flash);
      setTimeout(function(){ flash.style.opacity='0'; setTimeout(function(){ if(flash.parentNode) flash.remove(); },400); },80);

      /* confetti */
      var cols=['#c9a84c','#fff','#f5d76e','#4caf50','#ff9800','#e8c96a','#a07830','#2196f3','#ffeb3b'];
      for(var i=0;i<200;i++){
        var cf=document.createElement('div');
        var sz=3+Math.random()*12;
        cf.style.cssText='position:fixed;top:-20px;left:'+Math.random()*100+'vw;width:'+sz+'px;height:'+sz+'px;background:'+cols[Math.floor(Math.random()*cols.length)]+';border-radius:'+(Math.random()>0.4?'50%':'2px')+';animation:LCF '+(2.5+Math.random()*3)+'s linear '+(Math.random()*1.5)+'s forwards;z-index:100001;pointer-events:none;';
        ov.appendChild(cf);
      }

      govinda();

      /* show phase 3 */
      setTimeout(function(){
        if(p2el) p2el.style.display='none';
        /* restore bg */
        ov.style.background='url("venkateswara.jpg") center top/cover no-repeat';
        var p3el=document.getElementById('lp3');
        if(p3el) p3el.style.display='block';
      },750);

      /* auto dismiss */
      setTimeout(function(){
        ov.style.opacity='0';
        setTimeout(function(){ if(ov.parentNode) ov.remove(); },1300);
      },8000);
    }

    /* bind button */
    var btn=document.getElementById('lbtn');
    if(btn){
      btn.addEventListener('click',function(e){ e.stopPropagation(); startCountdown(); });
      btn.addEventListener('touchstart',function(e){ e.stopPropagation(); startCountdown(); },{passive:true});
    }

  })();
  </script>

</body>
</html>'''

content = content[:si] + NEW
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
