// hs-update-check.js
(function(){
  if(window._hsUpdateCheckRunning) return;
  window._hsUpdateCheckRunning = true;

  var SEEN_KEY = 'hs_last_seen_sha';

  function injectBanner(remoteSha){
    if(document.getElementById('hs_update_banner')) return;
    var b = document.createElement('div');
    b.id = 'hs_update_banner';
    b.style.cssText = 'position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:#111;border:1px solid rgba(201,168,76,0.6);border-radius:14px;padding:0.9rem 1.25rem;z-index:99999;box-shadow:0 8px 32px rgba(0,0,0,0.8);display:flex;align-items:center;gap:0.85rem;min-width:300px;max-width:90vw;';
    b.innerHTML = '<div style="width:32px;height:32px;background:linear-gradient(135deg,#c9a84c,#a07830);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-rocket" style="color:#fff;font-size:0.85rem;"></i></div>'
      + '<div style="flex:1;"><div style="font-size:0.85rem;font-weight:800;color:#fff;">🚀 New Update Available!</div><div style="font-size:0.7rem;color:#9a9080;margin-top:0.1rem;">OG Shoots has been updated. Refresh to get the latest.</div></div>'
      + '<button onclick="location.reload()" style="background:#c9a84c;color:#000;border:none;border-radius:8px;padding:0.4rem 0.9rem;font-size:0.75rem;font-weight:800;cursor:pointer;font-family:inherit;white-space:nowrap;">Refresh</button>'
      + '<button onclick="localStorage.setItem(\'hs_last_seen_sha\',\''+remoteSha+'\');this.parentElement.remove();" style="background:none;border:none;color:#666;cursor:pointer;font-size:1rem;line-height:1;padding:0 0.2rem;">&#10005;</button>';
    document.body.appendChild(b);
  }

  function check(){
    fetch('https://api.github.com/repos/SRISANTH588/HASHSHOOTSMEDIA/commits/main', {cache:'no-store'})
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(!d.sha) return;
        var seen = localStorage.getItem(SEEN_KEY);
        // First ever visit — just store the sha silently, no banner
        if(!seen){ localStorage.setItem(SEEN_KEY, d.sha); return; }
        // Only show banner if sha changed since last time user saw/dismissed
        if(d.sha !== seen) injectBanner(d.sha);
      }).catch(function(){});
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(check, 4000); });
  } else {
    setTimeout(check, 4000);
  }
  setInterval(check, 300000);
})();
