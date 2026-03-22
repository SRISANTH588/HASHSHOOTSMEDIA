(function(){
  var page = window.location.pathname.split('/').pop() || 'index.html';

  var links = [
    { href:'index.html',    icon:'fa-house',       label:'Home' },
    { href:'vibe.html',     icon:'fa-compass',     label:'Discover the Vibe' },
    { href:'partner.html',  icon:'fa-handshake',   label:'Become a Partner' },
    { href:'about.html',    icon:'fa-circle-info', label:'About Us' },
  ];

  var navHTML = `
  <style>
    .hs-nav{background:rgba(10,0,0,0.92);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(229,57,53,0.15);padding:0 1.5rem;display:flex;align-items:center;justify-content:space-between;height:62px;position:sticky;top:0;z-index:999;box-shadow:0 4px 24px rgba(0,0,0,0.4);}
    .hs-nav-logo{font-size:1.35rem;font-weight:900;color:#fff;text-decoration:none;letter-spacing:-0.5px;white-space:nowrap;flex-shrink:0;}
    .hs-nav-logo span{color:#e53935;}
    .hs-nav-links{display:flex;align-items:center;gap:0.25rem;}
    .hs-nav-link{display:flex;align-items:center;gap:0.45rem;padding:0.45rem 0.9rem;border-radius:8px;color:#a08080;font-size:0.82rem;font-weight:600;text-decoration:none;transition:all 0.2s;white-space:nowrap;border:1px solid transparent;}
    .hs-nav-link:hover{color:#fff;background:rgba(255,255,255,0.06);}
    .hs-nav-link.active{color:#e53935;background:rgba(229,57,53,0.1);border-color:rgba(229,57,53,0.2);}
    .hs-nav-link i{font-size:0.85rem;}
    .hs-nav-actions{display:flex;align-items:center;gap:0.65rem;}
    .hs-nav-btn{padding:0.45rem 1.1rem;border-radius:8px;font-size:0.82rem;font-weight:700;text-decoration:none;transition:all 0.2s;cursor:pointer;font-family:inherit;border:none;}
    .hs-nav-btn-outline{background:transparent;border:1px solid rgba(255,255,255,0.12);color:#ccc;}
    .hs-nav-btn-outline:hover{border-color:rgba(229,57,53,0.5);color:#e53935;}
    .hs-nav-btn-primary{background:#e53935;color:#fff;box-shadow:0 4px 14px rgba(229,57,53,0.3);}
    .hs-nav-btn-primary:hover{background:#b71c1c;transform:translateY(-1px);}
    .hs-hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px;background:none;border:none;}
    .hs-hamburger span{width:22px;height:2px;background:#fff;border-radius:2px;transition:all 0.3s;display:block;}
    .hs-mobile-menu{display:none;position:fixed;top:62px;left:0;right:0;background:rgba(8,0,0,0.98);backdrop-filter:blur(20px);border-bottom:1px solid rgba(229,57,53,0.15);padding:1rem 1.5rem 1.5rem;z-index:998;flex-direction:column;gap:0.35rem;}
    .hs-mobile-menu.open{display:flex;}
    .hs-mobile-link{display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;border-radius:10px;color:#a08080;font-size:0.88rem;font-weight:600;text-decoration:none;transition:all 0.2s;border:1px solid transparent;}
    .hs-mobile-link:hover{color:#fff;background:rgba(255,255,255,0.05);}
    .hs-mobile-link.active{color:#e53935;background:rgba(229,57,53,0.08);border-color:rgba(229,57,53,0.2);}
    .hs-mobile-link i{width:18px;text-align:center;font-size:0.9rem;}
    .hs-mobile-divider{height:1px;background:rgba(255,255,255,0.06);margin:0.5rem 0;}
    .hs-mobile-actions{display:flex;gap:0.65rem;margin-top:0.5rem;}
    .hs-mobile-actions a{flex:1;text-align:center;padding:0.7rem;border-radius:10px;font-size:0.82rem;font-weight:700;text-decoration:none;}
    @media(max-width:860px){.hs-nav-links{display:none;}.hs-hamburger{display:flex;}}
    @media(max-width:500px){.hs-nav-actions{display:none;}}
  </style>
  <nav class="hs-nav" id="hsNav">
    <a href="index.html" class="hs-nav-logo">HA<span>⚡</span>H SHOOTS</a>
    <div class="hs-nav-links" id="hsNavLinks"></div>
    <div class="hs-nav-actions">
      <a href="#contact" class="hs-nav-btn hs-nav-btn-outline"><i class="fas fa-envelope"></i> Contact Us</a>
      <a href="login.html" class="hs-nav-btn hs-nav-btn-outline"><i class="fas fa-sign-in-alt"></i> Login</a>
      <a href="booking.html" class="hs-nav-btn hs-nav-btn-primary"><i class="fas fa-camera"></i> Book Now</a>
    </div>
    <button class="hs-hamburger" id="hsHamburger" onclick="toggleMobileMenu()">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <div class="hs-mobile-menu" id="hsMobileMenu">
    <div id="hsMobileLinks"></div>
    <div class="hs-mobile-divider"></div>
    <div class="hs-mobile-actions">
      <a href="#contact" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#ccc;">Contact Us</a>
      <a href="login.html" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#ccc;">Login</a>
      <a href="booking.html" style="background:#e53935;color:#fff;">Book Now</a>
    </div>
  </div>`;

  // Inject nav at top of body
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // Build desktop links
  var desktopContainer = document.getElementById('hsNavLinks');
  var mobileContainer  = document.getElementById('hsMobileLinks');
  links.forEach(function(l){
    var isActive = page === l.href || (page === '' && l.href === 'index.html');
    // desktop
    var a = document.createElement('a');
    a.href = l.href;
    a.className = 'hs-nav-link' + (isActive ? ' active' : '');
    a.innerHTML = '<i class="fas ' + l.icon + '"></i>' + l.label;
    desktopContainer.appendChild(a);
    // mobile
    var m = document.createElement('a');
    m.href = l.href;
    m.className = 'hs-mobile-link' + (isActive ? ' active' : '');
    m.innerHTML = '<i class="fas ' + l.icon + '"></i>' + l.label;
    m.onclick = function(){ document.getElementById('hsMobileMenu').classList.remove('open'); };
    mobileContainer.appendChild(m);
  });

  // Scroll effect
  window.addEventListener('scroll', function(){
    document.getElementById('hsNav').style.background =
      window.scrollY > 20 ? 'rgba(6,0,0,0.98)' : 'rgba(10,0,0,0.92)';
  });
})();

function toggleMobileMenu(){
  var menu = document.getElementById('hsMobileMenu');
  menu.classList.toggle('open');
}
