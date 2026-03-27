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
      .hs-logo span{color:#c9a84c;}

      /* CENTER ICONS */
      .hs-nav-center{
        position:absolute;left:50%;transform:translateX(-50%);
        display:flex;align-items:center;gap:0;
      }
      .hs-icon-sep{width:1px;height:22px;background:rgba(201,168,76,0.3);margin:0 2px;flex-shrink:0;}
      .hs-icon-btn{
        width:44px;height:38px;
        display:flex;align-items:center;justify-content:center;
        border-radius:8px;
        color:rgba(201,168,76,0.75);
        font-size:1.05rem;
        text-decoration:none;
        transition:all 0.2s;
        position:relative;flex-shrink:0;
      }
      .hs-icon-btn:hover{color:#c9a84c;background:rgba(201,168,76,0.1);}
      .hs-icon-btn.active{color:#c9a84c;}
      .hs-icon-btn::after{
        content:attr(data-title);
        position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);
        background:rgba(6,0,0,0.95);color:#fff;
        font-size:0.68rem;font-weight:600;font-family:'Inter',sans-serif;
        padding:0.28rem 0.65rem;border-radius:6px;
        white-space:nowrap;pointer-events:none;opacity:0;
        transition:opacity 0.15s;
        border:1px solid rgba(201,168,76,0.2);z-index:9999;
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
        background:#c9a84c;color:#fff;border:none;
        border-radius:8px;
        box-shadow:0 4px 16px rgba(201,168,76,0.4);
      }
      .hs-btn-red:hover{background:#8a6520;transform:translateY(-1px);}

      /* HAMBURGER */
      .hs-hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:5px;background:none;border:none;flex-shrink:0;}
      .hs-hamburger span{width:22px;height:2px;background:#fff;border-radius:2px;display:block;}

      /* MOBILE MENU */
      .hs-mobile-menu{
        display:none;position:fixed;top:58px;left:0;right:0;
        background:rgba(6,0,0,0.98);backdrop-filter:blur(20px);
        border-bottom:1px solid rgba(201,168,76,0.15);
        padding:1rem 1.25rem 1.5rem;z-index:9998;
        flex-direction:column;gap:0.3rem;
      }
      .hs-mobile-menu.open{display:flex;}
      .hs-mobile-link{
        display:flex;align-items:center;gap:0.75rem;
        padding:0.8rem 1rem;border-radius:10px;
        color:#888070;font-size:0.9rem;font-weight:600;
        text-decoration:none;transition:all 0.2s;border:1px solid transparent;
      }
      .hs-mobile-link:hover{color:#fff;background:rgba(255,255,255,0.05);}
      .hs-mobile-link.active{color:#c9a84c;background:rgba(201,168,76,0.08);border-color:rgba(201,168,76,0.2);}
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
      <a href="index.html" class="hs-logo">OG SHOOTS <sup style="font-size:0.45em;font-weight:700;color:#c9a84c;letter-spacing:2px;vertical-align:super;opacity:0.85;">LUXE</sup></a>

      <div class="hs-nav-center">
        <div id="hsIconGroup" style="display:flex;align-items:center;gap:0;"></div>
      </div>

      <div class="hs-nav-right" id="hsNavRight">
        <a href="booking.html" class="hs-btn hs-btn-outline">
          <i class="fas fa-mobile-alt"></i> Get the App &nbsp;&#8250;
        </a>
        <a href="contact.html" class="hs-btn hs-btn-red">
          Contact Us
        </a>
        <a href="login.html" class="hs-btn hs-btn-outline" id="hsLoginBtn">
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
      <div class="hs-mobile-btns" id="hsMobileBtns">
        <a href="login.html" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#ccc;" onclick="closeHsMenu()" id="hsMobileLoginBtn"><i class="fas fa-sign-in-alt"></i> Login</a>
        <a href="booking.html" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#ccc;" onclick="closeHsMenu()"><i class="fas fa-mobile-alt"></i> Get the App</a>
        <a href="contact.html" style="background:#c9a84c;color:#fff;" onclick="closeHsMenu()">Contact Us</a>
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

    // Show logged-in state if customer is logged in
    var role = localStorage.getItem('hs_role');
    var custName = localStorage.getItem('hs_customer_name');
    if(role === 'customer' && custName){
      var navRight = document.getElementById('hsNavRight');
      var loginBtn = document.getElementById('hsLoginBtn');
      // Hide login button
      loginBtn.style.display = 'none';

      // Profile dropdown
      var profileWrap = document.createElement('div');
      profileWrap.style.cssText = 'position:relative;';
      profileWrap.innerHTML = `
        <style>
          .hs-profile-btn{display:flex;align-items:center;gap:0.5rem;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.25);border-radius:50px;padding:0.38rem 0.9rem 0.38rem 0.45rem;cursor:pointer;font-family:'Inter',sans-serif;font-size:0.82rem;font-weight:700;color:#fff;transition:all 0.2s;white-space:nowrap;}
          .hs-profile-btn:hover{background:rgba(201,168,76,0.18);border-color:rgba(201,168,76,0.5);}
          .hs-profile-av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#c9a84c,#7f0000);display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:800;color:#fff;flex-shrink:0;}
          .hs-dropdown{display:none;position:absolute;top:calc(100% + 10px);right:0;background:rgba(10,0,0,0.98);border:1px solid rgba(201,168,76,0.2);border-radius:16px;padding:0.5rem;min-width:210px;z-index:9999;box-shadow:0 20px 50px rgba(0,0,0,0.7);backdrop-filter:blur(20px);}
          .hs-dropdown.open{display:block;}
          .hs-dd-header{padding:0.75rem 0.85rem 0.6rem;border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:0.4rem;}
          .hs-dd-name{font-size:0.9rem;font-weight:800;color:#fff;}
          .hs-dd-tag{font-size:0.7rem;color:#c9a84c;font-weight:600;margin-top:0.1rem;}
          .hs-dd-item{display:flex;align-items:center;gap:0.75rem;padding:0.65rem 0.85rem;border-radius:10px;color:#ccc;font-size:0.83rem;font-weight:600;text-decoration:none;cursor:pointer;transition:background 0.15s,color 0.15s;font-family:'Inter',sans-serif;background:none;border:none;width:100%;text-align:left;}
          .hs-dd-item:hover{background:rgba(201,168,76,0.1);color:#fff;}
          .hs-dd-item i{width:16px;text-align:center;color:#c9a84c;font-size:0.85rem;}
          .hs-dd-divider{height:1px;background:rgba(255,255,255,0.06);margin:0.4rem 0;}
          .hs-dd-logout{color:#ff6b6b !important;}
          .hs-dd-logout i{color:#ff6b6b !important;}
        </style>
        <button class="hs-profile-btn" id="hsProfileBtn">
          <div class="hs-profile-av" id="hsProfileAv"></div>
          <span id="hsProfileName"></span>
          <i class="fas fa-chevron-down" style="font-size:0.65rem;color:#888;"></i>
        </button>
        <div class="hs-dropdown" id="hsDropdown">
          <div class="hs-dd-header">
            <div class="hs-dd-name" id="hsDdName"></div>
            <div class="hs-dd-tag">Customer Account</div>
          </div>
          <button class="hs-dd-item" onclick="navigate('customer-profile.html')"><i class="fas fa-user"></i> Profile</button>
          <button class="hs-dd-item" onclick="navigate('customer-orders.html')"><i class="fas fa-box"></i> Order Details</button>
          <button class="hs-dd-item" onclick="navigate('customer-support.html')"><i class="fas fa-headset"></i> Customer Support</button>
          <button class="hs-dd-item" onclick="navigate('customer-wallet.html')"><i class="fas fa-wallet"></i> Wallet</button>
          <div class="hs-dd-divider"></div>
          <button class="hs-dd-item hs-dd-logout" id="hsDdLogout"><i class="fas fa-sign-out-alt"></i> Logout</button>
        </div>`;

      navRight.insertBefore(profileWrap, loginBtn);

      var initials = custName.split(' ').map(function(w){ return w[0]; }).join('').toUpperCase().slice(0,2);
      var prof = JSON.parse(localStorage.getItem('hs_customer_profile') || '{}');
      var avEl = document.getElementById('hsProfileAv');
      if(prof.pic){
        avEl.innerHTML = '<img src="'+prof.pic+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;"/>';
      } else {
        avEl.textContent = initials;
      }
      document.getElementById('hsProfileName').textContent = custName.split(' ')[0];
      document.getElementById('hsDdName').textContent = custName;

      document.getElementById('hsProfileBtn').onclick = function(e){
        e.stopPropagation();
        document.getElementById('hsDropdown').classList.toggle('open');
      };
      document.addEventListener('click', function(){
        var dd = document.getElementById('hsDropdown');
        if(dd) dd.classList.remove('open');
      });
      document.getElementById('hsDdLogout').onclick = function(){
        localStorage.removeItem('hs_role');
        localStorage.removeItem('hs_user');
        localStorage.removeItem('hs_customer_name');
        window.location.href = 'index.html';
      };

      // Mobile
      var mobileLoginBtn = document.getElementById('hsMobileLoginBtn');
      if(mobileLoginBtn){
        mobileLoginBtn.innerHTML = '<i class="fas fa-user"></i> ' + custName;
        mobileLoginBtn.href = 'customer.html';
      }
      var mobileBtns = document.getElementById('hsMobileBtns');
      if(mobileBtns){
        var mLogout = document.createElement('button');
        mLogout.style.cssText = 'background:rgba(244,67,54,0.1);border:1px solid rgba(244,67,54,0.2);color:#ff6b6b;text-align:center;padding:0.8rem;border-radius:10px;font-size:0.88rem;font-weight:700;font-family:inherit;cursor:pointer;display:block;width:100%;';
        mLogout.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        mLogout.onclick = function(){
          localStorage.removeItem('hs_role');
          localStorage.removeItem('hs_user');
          localStorage.removeItem('hs_customer_name');
          window.location.href = 'index.html';
        };
        mobileBtns.appendChild(mLogout);
      }
    }
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
function hsGoContact(){
  var el = document.getElementById('contact');
  if(el){ el.scrollIntoView({behavior:'smooth'}); }
  else { window.location.href = 'index.html#contact'; }
}
function navigate(page){
  var base = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
  window.location.href = base + page;
}
