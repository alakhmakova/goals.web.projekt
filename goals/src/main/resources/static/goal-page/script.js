(function(){
  const kebabs = document.querySelectorAll('.kebab');
  kebabs.forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const wrap = e.currentTarget.parentElement;
      const dd = wrap.querySelector('.dropdown');
      const open = dd && dd.style.display === 'block';
      document.querySelectorAll('.dropdown').forEach(d=>d.style.display='none');
      if(dd) dd.style.display = open ? 'none' : 'block';
      e.stopPropagation();
    });
  });
  document.addEventListener('click',()=>document.querySelectorAll('.dropdown').forEach(d=>d.style.display='none'));

  // See more/less
  const seeToggle = document.querySelector('.see-toggle');
  const desc = document.querySelector('.description');
  if(seeToggle && desc){
    const update = ()=>{
      const collapsed = desc.getAttribute('data-collapsed') !== 'false';
      seeToggle.textContent = collapsed ? seeToggle.dataset.more : seeToggle.dataset.less;
    };
    update();
    seeToggle.addEventListener('click', ()=>{
      const collapsed = desc.getAttribute('data-collapsed') !== 'false';
      desc.setAttribute('data-collapsed', (!collapsed).toString());
      update();
    });
  }

  // Modal handling for any target progress
  const applyRow = document.getElementById('apply-row');
  const modal = document.getElementById('apply-modal');
  const closeBtns = modal ? modal.querySelectorAll('[data-close]') : [];
  const form = document.getElementById('apply-form');
  const currentInput = document.getElementById('apply-current');
  const startInput = document.getElementById('apply-start');
  const targetInput = document.getElementById('apply-target');
  const bar = document.getElementById('apply-bar');
  const percentEl = document.getElementById('apply-percent');
  const valueEl = document.getElementById('apply-value');
  const titleEl = document.getElementById('apply-title');

  function recalc(){
    const s = Number(startInput.value)||0;
    const c = Number(currentInput.value)||0;
    const t = Math.max(Number(targetInput.value)||1, 1);
    const pct = Math.max(0, Math.min(100, Math.round((c - s) / (t - s) * 100)));
    bar.style.width = pct + '%';
    percentEl.textContent = pct + '%';
    if(valueEl) valueEl.textContent = `${c}/${t}`;
  }

  document.querySelectorAll('.step').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const step = Number(btn.dataset.step);
      currentInput.value = Math.max(0, Number(currentInput.value||0) + step);
      recalc();
    });
  });
  [currentInput,startInput,targetInput].forEach(i=> i && i.addEventListener('input', recalc));

  // open modal when clicking any progress bar or its value in targets
  document.querySelectorAll('.target-row .right .progress, .target-row .right .value').forEach(el=>{
    el.addEventListener('click', (e)=>{
      const row = e.currentTarget.closest('.target-row');
      const name = row ? row.querySelector('.text .name') : null;
      if(titleEl && name) titleEl.textContent = name.textContent || 'Update progress';
      // try to parse current/target from UI when available
      const value = row ? row.querySelector('.right .value') : null;
      if(value){
        const parts = (value.textContent||'').split('/');
        if(parts.length===2){
          currentInput.value = Number(parts[0].trim())||0;
          targetInput.value = Math.max(Number(parts[1].trim())||1,1);
        }
      }
      modal.setAttribute('aria-hidden', 'false');
      recalc();
    });
  });
  closeBtns.forEach(b=>b.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true')));
  modal && modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.setAttribute('aria-hidden','true'); });
})();

