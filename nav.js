// Sidebar drawer interactions (left) with focus trap
(function(){
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.sidebar-toggle');
  if(!sidebar || !toggle) return;
  const backdrop = document.querySelector('.drawer-backdrop');
  const focusableSel = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  function trapFocus(e){
    if(e.key !== 'Tab') return;
    const focusables = Array.from(sidebar.querySelectorAll(focusableSel));
    if(!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length-1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
  function open(){
    lastFocused = document.activeElement;
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded','true');
    setTimeout(()=>{ const f = sidebar.querySelector('a'); f && f.focus(); }, 30);
    document.addEventListener('keydown', esc);
    document.addEventListener('keydown', trapFocus);
  }
  function close(){
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded','false');
    document.removeEventListener('keydown', esc);
    document.removeEventListener('keydown', trapFocus);
    lastFocused && lastFocused.focus();
  }
  function esc(e){ if(e.key==='Escape') close(); }
  toggle.addEventListener('click', ()=> document.body.classList.contains('nav-open') ? close() : open());
  backdrop && backdrop.addEventListener('click', close);
  sidebar.addEventListener('click', e => { if(e.target.matches('.sidebar-nav a')) close(); });

  // Active section highlighting (home page anchors)
  const anchorLinks = Array.from(document.querySelectorAll('.js-nav-anchor'));
  if('IntersectionObserver' in window && anchorLinks.length){
    const map = new Map(anchorLinks.map(a => [a.getAttribute('href').replace('#',''), a]));
    const sections = anchorLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    function setActive(id){
      anchorLinks.forEach(a=>a.classList.toggle('is-active', a.getAttribute('href') === '#'+id));
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => { if(entry.isIntersecting) setActive(entry.target.id); });
    }, {rootMargin:'-45% 0px -50% 0px', threshold:0.01});
    sections.forEach(s=>io.observe(s));
  }
})();
