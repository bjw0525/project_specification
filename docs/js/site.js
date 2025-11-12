// Vanilla JS utilities for dynamic effects reminiscent of campaign pages
(function(){
  // Helpers
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Sticky nav subtle style change on scroll
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (!nav) return;
    if (y > 8) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Mobile menu toggle
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.links');
  if (toggle && nav && links) {
    const closeMenu = () => nav.classList.remove('open');
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 960) closeMenu(); });
    window.addEventListener('keyup', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  // Intersection observer for reveal animations
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {rootMargin: '0px 0px -10% 0px', threshold: 0.1});
    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Count-up effect for numbers
  const counters = $$('[data-count-to]');
  const format = (n) => {
    const str = n.toString();
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const startCounter = (el) => {
    const to = parseFloat(el.getAttribute('data-count-to') || '0');
    const dur = parseInt(el.getAttribute('data-count-duration') || '1200', 10);
    const easing = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic
    const start = performance.now();
    const from = parseFloat(el.getAttribute('data-count-from') || '0');
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const v = from + (to - from) * easing(p);
      el.textContent = format(Math.round(v));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries)=>{
      entries.forEach(e => {
        if (e.isIntersecting) {
          startCounter(e.target);
          io2.unobserve(e.target);
        }
      });
    }, {rootMargin: '0px 0px -10% 0px', threshold: 0.25});
    counters.forEach(el => io2.observe(el));
  } else {
    counters.forEach(startCounter);
  }

  // Hero inline CSS variable animation disabled per request

  // Rolling words effect (pleaseshop-like)
  const rollContainer = $('.roll-words .words');
  if (rollContainer) {
    const roll = () => {
      const first = rollContainer.querySelector('li:first-child');
      if (!first) return;
      const h = first.getBoundingClientRect().height;
      // animate by translating list upward then append first to end
      rollContainer.style.transition = 'transform 0.6s ease';
      rollContainer.style.transform = `translateY(-${h}px)`;
      setTimeout(() => {
        rollContainer.appendChild(first);
        rollContainer.style.transition = 'none';
        rollContainer.style.transform = 'translateY(0)';
      }, 620);
    };
    setInterval(roll, 2600);
  }

  // Slider auto-rotate
  const slider = document.querySelector('#slider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.slider__slide'));
    let idx = 0;
    const activate = (i) => {
      slides.forEach((s, n) => s.classList.toggle('slider__slide--active', n === i));
    };
    const next = () => { idx = (idx + 1) % slides.length; activate(idx); };
    let timer = setInterval(next, 5000);
    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', () => { timer = setInterval(next, 5000); });
    // Keyboard navigation
    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') { idx = (idx - 1 + slides.length) % slides.length; activate(idx); }
    });
  }

  // Parallax for elements with data-speed
  const speedEls = Array.from(document.querySelectorAll('[data-speed]'));
  const parallax = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    speedEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height/2; // position relative to viewport
      const delta = (vh/2 - center); // element above/below center
      const sp = parseFloat(el.getAttribute('data-speed') || '0');
      const drift = parseFloat(el.getAttribute('data-drift') || '0');
      el.style.transform = `translateY(${delta*sp + drift*40}px)`;
    });
  };
  window.addEventListener('scroll', parallax, {passive:true});
  window.addEventListener('resize', parallax);
  parallax();
})();
