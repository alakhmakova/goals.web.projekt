(function(){
  function closeAll(){
    document.querySelectorAll('.dropdown').forEach(w=>{
      w.classList.remove('dropdown-open');
      const m = w.querySelector('.dropdown-menu');
      if(m) m.classList.add('hidden');
      const t = w.querySelector('.dropdown-toggle');
      if(t) t.setAttribute('aria-expanded','false');
    });
  }

  function bindDropdown(wrap){
    const toggle = wrap.querySelector('.dropdown-toggle');
    const menu = wrap.querySelector('.dropdown-menu');
    if(!toggle || !menu) return;
    // open/close on toggle click
    toggle.addEventListener('click', (e)=>{
      const isOpen = wrap.classList.contains('dropdown-open');
      closeAll();
      if(!isOpen){
        wrap.classList.add('dropdown-open');
        menu.classList.remove('hidden');
        toggle.setAttribute('aria-expanded','true');
      }
      e.stopPropagation();
    });
    // close when clicking a menu item
    menu.addEventListener('click', (e)=>{
      const target = e.target.closest('a,button,li');
      if(target){ closeAll(); }
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.dropdown').forEach(bindDropdown);
    // close when clicking outside or on Escape
    document.addEventListener('click', closeAll);
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeAll(); });
  });
})();

