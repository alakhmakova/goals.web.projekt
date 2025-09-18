// Attach one datepicker container and reuse it for all .deadline-cell
(function(){
  let container = null, picker = null, monthInput=null, yearInput=null, dates=null, activeCell=null;
  let current = new Date(); let selected = null;

  function ensure(){
    if(container) return container;
    container = document.createElement('div');
    container.className = 'datepicker-container';
    container.innerHTML = `
      <input type="text" class="date-input" placeholder="Select date" />
      <div class="datepicker" hidden>
        <div class="datepicker-header">
          <button class="prev" type="button">Prev</button>
          <div>
            <select class="month-input">
              <option>January</option><option>February</option><option>March</option><option>April</option>
              <option>May</option><option>June</option><option>July</option><option>August</option>
              <option>September</option><option>October</option><option>November</option><option>December</option>
            </select>
            <input type="number" class="year-input" min="1900" max="2100" />
          </div>
          <button class="next" type="button">Next</button>
        </div>
        <div class="days"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
        <div class="dates"></div>
        <div class="datepicker-footer"><button class="cancel" type="button">Cancel</button><button class="apply" type="button">Apply</button></div>
      </div>`;
    document.body.appendChild(container);
    picker = container.querySelector('.datepicker');
    monthInput = container.querySelector('.month-input');
    yearInput = container.querySelector('.year-input');
    dates = container.querySelector('.dates');
    bindControls();
    return container;
  }

  function bindControls(){
    container.querySelector('.prev').addEventListener('click',()=>{ current.setMonth(current.getMonth()-1); render(); });
    container.querySelector('.next').addEventListener('click',()=>{ current.setMonth(current.getMonth()+1); render(); });
    monthInput.addEventListener('change',()=>{ current.setMonth(monthInput.selectedIndex); render(); });
    yearInput.addEventListener('change',()=>{ const y=parseInt(yearInput.value,10)||current.getFullYear(); current.setFullYear(Math.min(2100,Math.max(1900,y))); yearInput.value=current.getFullYear(); render(); });
    container.querySelector('.cancel').addEventListener('click',()=>{ picker.hidden=true; activeCell=null; });
    container.querySelector('.apply').addEventListener('click',()=>{
      if(!activeCell){ picker.hidden=true; return; }
      if(!selected){ activeCell.dataset.date=''; const dsp=activeCell.querySelector('.date-display'); dsp && (dsp.textContent=''); picker.hidden=true; return; }
      const human = selected.toLocaleDateString(undefined,{month:'short',day:'numeric'});
      activeCell.dataset.date = selected.toISOString();
      const dsp=activeCell.querySelector('.date-display'); dsp && (dsp.textContent=human);
      const mobileDate = activeCell.closest('tr').querySelector('.d-mobile-date'); mobileDate && (mobileDate.textContent=human);
      picker.hidden=true; activeCell=null;
    });
    document.addEventListener('click',(e)=>{ if(picker.hidden) return; if(!container.contains(e.target)) { picker.hidden=true; activeCell=null; } });
  }

  function render(){
    monthInput.selectedIndex = current.getMonth();
    yearInput.value = current.getFullYear();
    dates.innerHTML='';
    const first = new Date(current.getFullYear(), current.getMonth(), 1);
    const start = new Date(first); start.setDate(1 - first.getDay());
    for(let i=0;i<42;i++){
      const d = new Date(start); d.setDate(start.getDate()+i);
      const btn = document.createElement('button'); btn.type='button'; btn.textContent=String(d.getDate());
      btn.className='date-btn'; if(d.getMonth()!==current.getMonth()) btn.classList.add('muted');
      if(selected && d.toDateString()===selected.toDateString()) btn.classList.add('selected');
      btn.addEventListener('click',()=>{ selected = new Date(d); render(); });
      dates.appendChild(btn);
    }
  }

  function openForCell(cell){
    ensure();
    activeCell = cell;
    selected = cell.dataset.date ? new Date(cell.dataset.date) : null;
    current = selected ? new Date(selected) : new Date();
    render();
    const r = cell.getBoundingClientRect();
    container.style.position='fixed';
    container.style.left = Math.round(r.left)+'px';
    container.style.top = Math.round(r.bottom + 6)+'px';
    picker.hidden=false;
  }

  function bindAll(){
    document.querySelectorAll('.deadline-cell').forEach(cell=>{
      if(cell.dataset.dpbound==='1') return; cell.dataset.dpbound='1';
      if(!cell.querySelector('.date-display')){ const sp=document.createElement('span'); sp.className='date-display'; sp.textContent=cell.textContent||''; cell.textContent=''; cell.appendChild(sp); }
      cell.addEventListener('click', (e)=>{ e.stopPropagation(); openForCell(cell); });
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    bindAll();
    const obs = new MutationObserver(bindAll); obs.observe(document.body,{childList:true,subtree:true});
  });
})();