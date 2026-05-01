// hs-update-check.js — Shows notification when new version is deployed
(function(){
  var CURRENT = '32d24edd8b4e781715e337b0730b0ed3199f2667';
  // Inject banner HTML
  var banner = document.createElement('div');
  banner.id = 'hs_update_banner';
  banner.style.cssText = 'display:none;position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:#111;border:1px solid rgba(201,168,76,0.6);border-radius:14px;padding:0.9rem 1.25rem;z-index:99999;box-shadow:0 8px 32px rgba(0,0,0,0.8);align-items:center;gap:0.85rem;min-width:300px;max-width:90vw;';
  banner.innerHTML = '<div style="width:32px;height:32px;background:linear-gradient(135deg,#c9a84c,#a07830);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-rocket" style="color:#fff;font-size:0.85rem;"></i></div>'
    + '<div style="flex:1;"><div style="font-size:0.85rem;font-weight:800;color:#fff;">🚀 New Update Available!</div><div style="font-size:0.7rem;color:#9a9080;margin-top:0.1rem;">OG Shoots has been updated. Refresh to get the latest.</div></div>'
    + '<button onclick="location.reload()" style="background:#c9a84c;color:#000;border:none;border-radius:8px;padding:0.4rem 0.9rem;font-size:0.75rem;font-weight:800;cursor:pointer;font-family:inherit;white-space:nowrap;">Refresh</button>'
    + '<button onclick="document.getElementById(\'hs_update_banner\').style.display=\'none\'" style="background:none;border:none;color:#666;cursor:pointer;font-size:1rem;line-height:1;padding:0 0.2rem;">&#10005;</button>';
  document.body.appendChild(banner);

  function check(){
    fetch('https://api.github.com/repos/SRISANTH588/HASHSHOOTSMEDIA/commits/main', {cache:'no-store'})
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(d.sha && d.sha !== CURRENT){
          document.getElementById('hs_update_banner').style.display = 'flex';
        }
      }).catch(function(){});
  }
  // Check after 3s on load, then every 2 minutes
  setTimeout(check, 3000);
  setInterval(check, 120000);
})();
