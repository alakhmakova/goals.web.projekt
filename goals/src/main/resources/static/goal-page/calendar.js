(function(){
  const pop = document.getElementById('due-popover');
  const grid = document.getElementById('cal-grid');
  const weekdays = document.getElementById('cal-weekdays');
  const title = document.getElementById('cal-title');
  const dueText = document.getElementById('due-text');
  const toggle = document.getElementById('due-toggle');
  if(!pop || !grid || !title || !dueText) return;

  let current = new Date(localStorage.getItem('goal_due') || Date.now());
  let view = new Date(current.getFullYear(), current.getMonth(), 1);

  function fmt(d){ return d.toLocaleDateString(undefined,{month:'short', day:'numeric'}); }
  function weekNumber(d){
    const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = dt.getUTCDay() || 7; // Mon..Sun
    dt.setUTCDate(dt.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(dt.getUTCFullYear(),0,1));
    return Math.ceil((((dt - yearStart) / 86400000) + 1)/7);
  }

  function render(){
    title.textContent = view.toLocaleDateString(undefined,{month:'long', year:'numeric'});
    grid.innerHTML='';
    if(weekdays){
      weekdays.innerHTML='';
      ;['W','M','T','W','T','F','S','S'].forEach(t=>{
        const s = document.createElement('span'); s.textContent=t; weekdays.appendChild(s);
      });
    }
    const startDay = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
    const firstWeekday = (startDay + 6) % 7; // Monday=0
    let cursor = new Date(view.getFullYear(), view.getMonth(), 1);
    cursor.setDate(1 - firstWeekday);
    for(let row=0; row<6; row++){
      const wk = document.createElement('div');
      wk.className = 'weeknum';
      wk.textContent = String(weekNumber(cursor));
      const now = new Date();
      const sameWeek = weekNumber(now) === weekNumber(cursor) && now.getFullYear() === cursor.getFullYear();
      if(sameWeek) wk.classList.add('week-current');
      grid.appendChild(wk);
      for(let col=0; col<7; col++){
        const dt = new Date(cursor);
        const btn = document.createElement('button');
        btn.textContent = String(dt.getDate());
        if(sameWeek) btn.classList.add('week-current');
        if(new Date().toDateString()===dt.toDateString()) btn.classList.add('today');
        if(current.toDateString()===dt.toDateString()) btn.classList.add('selected');
        if(dt.getMonth()!==view.getMonth()) btn.classList.add('muted-day');
        btn.addEventListener('click', ()=>{
          current = dt;
          localStorage.setItem('goal_due', current.toISOString());
          dueText.textContent = fmt(current);
          pop.hidden = true;
          // dispatch a custom event so listeners (deadline cells) can set their own date
          document.dispatchEvent(new CustomEvent('calendar:datePicked', { detail: { date: current } }));
        });
        grid.appendChild(btn);
        cursor.setDate(cursor.getDate()+1);
      }
    }
  }

  function positionAt(elem){
    const r = elem.getBoundingClientRect();
    pop.style.left = Math.round(r.left) + 'px';
    pop.style.top = Math.round(r.bottom + 6) + 'px';
  }

  // initial render
  render();
  dueText.textContent = fmt(current);

  // header toggle
  toggle && toggle.addEventListener('click', (e)=>{ pop.hidden=false; positionAt(toggle); e.stopPropagation(); });
  document.querySelectorAll('.cal-nav').forEach(n=>{
    n.addEventListener('click', (e)=>{ const dir = Number(n.dataset.dir)||0; view = new Date(view.getFullYear(), view.getMonth()+dir, 1); render(); e.stopPropagation(); });
  });
  document.addEventListener('click', (e)=>{ if(!pop.hidden && !pop.contains(e.target) && e.target!==toggle){ pop.hidden=true; } });

  // open from deadline cells near the cell
  document.querySelectorAll('.deadline-cell').forEach(cell=>{
    cell.style.cursor='pointer';
    cell.addEventListener('click', (e)=>{ pop.hidden=false; positionAt(cell); e.stopPropagation(); });
    document.addEventListener('calendar:datePicked', (ev)=>{
      if(pop.hidden) return; // ignore if already closed
      const dt = ev.detail.date;
      if(!cell.matches(':hover')) return; // apply to the cell that opened it
      cell.dataset.date = dt.toISOString().slice(0,10);
      cell.textContent = dt.toLocaleDateString(undefined,{month:'short', day:'numeric'});
    });
  });
})();