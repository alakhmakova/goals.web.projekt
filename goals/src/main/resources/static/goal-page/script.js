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

  // Modal for "Skicka ansökningar"
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

  if(applyRow && modal){
    applyRow.addEventListener('click', ()=>{
      modal.setAttribute('aria-hidden', 'false');
      recalc();
    });
  }
  closeBtns.forEach(b=>b.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true')));
  modal && modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.setAttribute('aria-hidden','true'); });
})();

// Lightweight calendar popover used for both Due date and per-target Deadline
(function(){
  function firstDayOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
  function addMonths(d, n){ return new Date(d.getFullYear(), d.getMonth()+n, 1); }
  function fmt(d){ return `${d.getMonth()+1}/${d.getDate()}/${String(d.getFullYear()).slice(2)}`; }
  function startOfCalendar(d){
    const first = firstDayOfMonth(d);
    const day = first.getDay() || 7; // Monday as first if needed; keep Sunday=0 -> 7
    const shift = (day===1?0: (day-1));
    const start = new Date(first);
    start.setDate(first.getDate()-shift);
    return start;
  }
  function build(grid, state){
    grid.innerHTML='';
    const start = startOfCalendar(state.current);
    for(let i=0;i<42;i++){
      const d = new Date(start); d.setDate(start.getDate()+i);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = String(d.getDate());
      if(d.toDateString() === new Date().toDateString()) btn.setAttribute('aria-current','date');
      if(d.getMonth()!==state.current.getMonth()) btn.style.opacity = .5;
      if(state.value && d.toDateString()===state.value.toDateString()) btn.setAttribute('aria-pressed','true');
      btn.addEventListener('click', ()=>{
        state.value = new Date(d);
        state.onSelect(state.value);
        state.host.setAttribute('data-open','false');
      });
      grid.appendChild(btn);
    }
    state.title.textContent = state.current.toLocaleString(undefined,{month:'long', year:'numeric'});
  }
  function attachPopover(host, trigger, onSelect){
    const title = host.querySelector('.title');
    const grid = host.querySelector('.cal-grid');
    const prev = host.querySelector('.prev');
    const next = host.querySelector('.next');
    const state = { host, trigger, title, grid, current: new Date(), value:null, onSelect };
    build(grid, state);
    prev.addEventListener('click', ()=>{ state.current = addMonths(state.current,-1); build(grid,state); });
    next.addEventListener('click', ()=>{ state.current = addMonths(state.current, 1); build(grid,state); });
    function place(){
      const r = trigger.getBoundingClientRect();
      host.style.top = `${r.bottom + window.scrollY + 6}px`;
      host.style.left = `${r.left + window.scrollX}px`;
    }
    trigger.addEventListener('click', (e)=>{
      e.stopPropagation();
      place();
      const open = host.getAttribute('data-open')==='true';
      document.querySelectorAll('.cal-popover').forEach(p=>p.setAttribute('data-open','false'));
      host.setAttribute('data-open', open?'false':'true');
    });
    window.addEventListener('resize', place);
    document.addEventListener('click', (e)=>{
      if(!host.contains(e.target) && e.target!==trigger) host.setAttribute('data-open','false');
    });
  }

  const dueBtn = document.querySelector('.due-btn');
  const dueCal = document.getElementById('due-cal');
  if(dueBtn && dueCal){
    attachPopover(dueCal, dueBtn, (date)=>{ dueBtn.textContent = `Due: ${fmt(date)}`; });
  }
  document.querySelectorAll('.deadline-btn').forEach(btn=>{
    const host = document.getElementById('deadline-cal');
    if(host) attachPopover(host, btn, (date)=>{ btn.textContent = `Deadline: ${fmt(date)}`; });
  });
})();

