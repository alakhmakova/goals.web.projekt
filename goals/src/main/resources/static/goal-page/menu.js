(function(){
  const menuBtn = document.querySelector('.menu-btn');
  const drawer = document.getElementById('left-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const app = document.querySelector('.app');
  const closeBtn = document.getElementById('drawer-close');
  function open(){ drawer.classList.add('open'); overlay.hidden=true; app.classList.add('drawer-open'); menuBtn && (menuBtn.style.visibility='hidden'); }
  function close(){ drawer.classList.remove('open'); overlay.hidden=true; app.classList.remove('drawer-open'); menuBtn && (menuBtn.style.visibility=''); }
  menuBtn && menuBtn.addEventListener('click', (e)=>{ open(); e.stopPropagation(); });
  closeBtn && closeBtn.addEventListener('click', close);
  overlay && overlay.addEventListener('click', close);
})();