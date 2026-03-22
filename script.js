// Navbar scroll effect
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);

    const sections = [
      { id: 'home', btn: 0 },
      { id: 'services', btn: 1 },
      { id: 'how-it-works', btn: 2 }
    ];
    const navBtns = document.querySelectorAll('.nav-icon-btn');
    let current = 0;
    sections.forEach((s, i) => {
      const el = document.getElementById(s.id);
      if (el && window.scrollY >= el.offsetTop - 120) current = i;
    });
    navBtns.forEach((b, i) => b.classList.toggle('active-icon', i === current));
  });
}

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks) navLinks.classList.remove('open');
  });
});

// Back to top
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Portfolio filter
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach(item => {
      item.style.opacity = (filter === 'all' || item.dataset.category === filter) ? '1' : '0.2';
      item.style.transform = (filter === 'all' || item.dataset.category === filter) ? 'scale(1)' : 'scale(0.95)';
    });
  });
});

// Booking form submit
const bookingBtn = document.querySelector('.booking-form .btn-primary');
if (bookingBtn) {
  bookingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll('.booking-form input, .booking-form select');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value || input.value === 'Select Service') {
        input.style.borderColor = '#f5576c';
        valid = false;
      } else {
        input.style.borderColor = '';
      }
    });
    if (valid) {
      alert('🎉 Booking confirmed! Our team will contact you shortly.');
      inputs.forEach(input => input.value = '');
    }
  });
}

// Phone 3D tilt on mouse move
const phone = document.getElementById('phoneFrame');
if (phone) {
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    phone.style.transform = `perspective(800px) rotateY(${dx * 12}deg) rotateX(${-dy * 8}deg)`;
  });
  document.addEventListener('mouseleave', () => {
    phone.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
  });
}

// Animated banner dots
const dots = document.querySelectorAll('.banner-dots .dot');
if (dots.length) {
  let dotIndex = 0;
  setInterval(() => {
    dots.forEach(d => d.classList.remove('active'));
    dotIndex = (dotIndex + 1) % dots.length;
    if (dots[dotIndex]) dots[dotIndex].classList.add('active');
  }, 2000);
}

// Scroll reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .step, .testimonial-card, .pricing-card, .portfolio-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
