(function(){
  function initNav(){
    var page = window.location.pathname.split('/').pop() || 'index.html';

    var links = [
      { href:'index.html',   icon:'fa-house',       title:'Home' },
      { href:'vibe.html',    icon:'fa-compass',     title:'Discover the Vibe' },
      { href:'partner.html', icon:'fa-star',        title:'Become a Partner' },
      { href:'about.html',   icon:'fa-clock-rotate-left', title:'About Us' },
    ];

    var navHTML = `
    <style>
      .hs-nav{
        background:rgba(0,0,0,0.35);
        backdrop-filter:blur(12px);
        -webkit-backdrop-filter:blur(12px);
        padding:0 2.5rem;
        display:flex;align-items:center;justify-content:space-between;
        height:58px;position:sticky;top:0;z-index:9999;
      }
      .hs-logo{
        font-size:1.4rem;font-weight:900;color:#fff;
        text-decoration:none;white-space:nowrap;flex-shrink:0;
        font-family:'Inter',sans-serif;text-transform:uppercase;letter-spacing:1px;
      }
      .hs-logo span{color:#e53935;}

      /* CENTER ICONS */
      .hs-nav-center{
        position:absolute;left:50%;transform:translateX(-50%);
        display:flex;align-items:center;gap:0;
      }
      .hs-icon-sep{width:1px;height:22px;background:rgba(229,57,53,0.3);margin:0 2px;flex-shrink:0;}
      .hs-icon-btn{
        width:44px;height:38px;
        display:flex;align-items:center;justify-content:center;
        border-radius:8px;
        color:rgba(229,57,53,0.75);
        font-size:1.05rem;
        text-decoration:none;
        transition:all 0.2s;
        position:relative;flex-shrink:0;
      }
      .hs-icon-btn:hover{color:#e53935;background:rgba(229,57,53,0.1);}
      .hs-icon-btn.active{color:#e53935;}
      .hs-icon-btn::after{
        content:attr(data-title);
        position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);
        background:rgba(6,0,0,0.95);color:#fff;
        font-size:0.68rem;font-weight:600;font-family:'Inter',sans-serif;
        padding:0.28rem 0.65rem;border-radius:6px;
        white-space:nowrap;pointer-events:none;opacity:0;
        transition:opacity 0.15s;
        border:1px solid rgba(229,57,53,0.2);z-index:9999;
      }
      .hs-icon-btn:hover::after{opacity:1;}

      /* RIGHT BUTTONS */
      .hs-nav-right{display:flex;align-items:center;gap:0.5rem;flex-shrink:0;}
      .hs-btn{
        display:inline-flex;align-items:center;gap:0.4rem;
        padding:0.45rem 1.15rem;
        font-size:0.82rem;font-weight:700;
        text-decoration:none;cursor:pointer;
        font-family:'Inter',sans-serif;
        transition:all 0.2s;white-space:nowrap;
      }
      .hs-btn-outline{
        background:transparent;
        border:1px solid rgba(255,255,255,0.22);
        color:#fff;border-radius:8px;
      }
      .hs-btn-outline:hover{border-color:rgba(255,255,255,0.5);}
      .hs-btn-red{
        background:#e53935;color:#fff;border:none;
        border-radius:8px;
        box-shadow:0 4px 16px rgba(229,57,53,0.4);
      }
      .hs-btn-red:hover{background:#c62828;transform:translateY(-1px);}

      /* HAMBURGER */
      .hs-hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:5px;background:none;border:none;flex-shrink:0;}
      .hs-hamburger span{width:22px;height:2px;background:#fff;border-radius:2px;display:block;}

      /* MOBILE MENU */
      .hs-mobile-menu{
        display:none;position:fixed;top:58px;left:0;right:0;
        background:rgba(6,0,0,0.98);backdrop-filter:blur(20px);
        border-bottom:1px solid rgba(229,57,53,0.15);
        padding:1rem 1.25rem 1.5rem;z-index:9998;
        flex-direction:column;gap:0.3rem;
      }
      .hs-mobile-menu.open{display:flex;}
      .hs-mobile-link{
        display:flex;align-items:center;gap:0.75rem;
        padding:0.8rem 1rem;border-radius:10px;
        color:#a08080;font-size:0.9rem;font-weight:600;
        text-decoration:none;transition:all 0.2s;border:1px solid transparent;
      }
      .hs-mobile-link:hover{color:#fff;background:rgba(255,255,255,0.05);}
      .hs-mobile-link.active{color:#e53935;background:rgba(229,57,53,0.08);border-color:rgba(229,57,53,0.2);}
      .hs-mobile-link i{width:20px;text-align:center;}
      .hs-mobile-divider{height:1px;background:rgba(255,255,255,0.06);margin:0.5rem 0;}
      .hs-mobile-btns{display:flex;flex-direction:column;gap:0.5rem;margin-top:0.25rem;}
      .hs-mobile-btns a{text-align:center;padding:0.8rem;border-radius:10px;font-size:0.88rem;font-weight:700;text-decoration:none;display:block;font-family:'Inter',sans-serif;}

      @media(max-width:768px){
        .hs-nav{padding:0 1rem;}
        .hs-nav-center{display:none;}
        .hs-nav-right{display:none;}
        .hs-hamburger{display:flex;}
      }
      @media(max-width:380px){.hs-logo{font-size:1.1rem;}}
    </style>
    <nav class="hs-nav" id="hsNav">
      <a href="index.html" class="hs-logo">HA<span>&#9889;</span>H SHOOTS</a>

      <div class="hs-nav-center">
        <div id="hsIconGroup" style="display:flex;align-items:center;gap:0;"></div>
      </div>

      <div class="hs-nav-right">
        <a href="booking.html" class="hs-btn hs-btn-outline">
          <i class="fas fa-mobile-alt"></i> Get the App &nbsp;&#8250;
        </a>
        <a href="#contact" class="hs-btn hs-btn-red">
          Contact Us
        </a>
        <a href="login.html" class="hs-btn hs-btn-outline">
          <i class="fas fa-sign-in-alt"></i> Login
        </a>
      </div>

      <button class="hs-hamburger" id="hsHamburger" onclick="toggleHsMenu()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </nav>
    <div class="hs-mobile-menu" id="hsMobileMenu">
      <div id="hsMobileLinks"></div>
      <div class="hs-mobile-divider"></div>
      <div class="hs-mobile-btns">
        <a href="login.html" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#ccc;" onclick="closeHsMenu()"><i class="fas fa-sign-in-alt"></i> Login</a>
        <a href="booking.html" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#ccc;" onclick="closeHsMenu()"><i class="fas fa-mobile-alt"></i> Get the App</a>
        <a href="#contact" style="background:#e53935;color:#fff;" onclick="closeHsMenu()">Contact Us</a>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('afterbegin', navHTML);

    var iconGroup  = document.getElementById('hsIconGroup');
    var mobileLinks = document.getElementById('hsMobileLinks');

    links.forEach(function(l, i){
      var isActive = page === l.href || (page === '' && l.href === 'index.html');

      if(i > 0){
        var sep = document.createElement('div');
        sep.className = 'hs-icon-sep';
        iconGroup.appendChild(sep);
      }

      var a = document.createElement('a');
      a.href = l.href;
      a.className = 'hs-icon-btn' + (isActive ? ' active' : '');
      a.setAttribute('data-title', l.title);
      a.innerHTML = '<i class="fas ' + l.icon + '"></i>';
      iconGroup.appendChild(a);

      var m = document.createElement('a');
      m.href = l.href;
      m.className = 'hs-mobile-link' + (isActive ? ' active' : '');
      m.innerHTML = '<i class="fas ' + l.icon + '"></i>' + l.title;
      m.onclick = closeHsMenu;
      mobileLinks.appendChild(m);
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();

function toggleHsMenu(){
  document.getElementById('hsMobileMenu').classList.toggle('open');
}
function closeHsMenu(){
  var m = document.getElementById('hsMobileMenu');
  if(m) m.classList.remove('open');
}
