(function(){
  let container = null;
  let activeCell = null;

  function ensureContainer(){
    if(container) return container;
    container = document.createElement('div');
    container.className = 'timepicker-container';
    container.innerHTML = `
      <div class="timepicker" hidden>
        <div class="timepicker-head">Select time</div>
        <div class="timepicker-body">
          <select class="tp-hour"></select>
          :
          <select class="tp-minute"></select>
        </div>
        <div class="timepicker-foot">
          <button type="button" class="tp-clear">Clear</button>
          <div class="spacer"></div>
          <button type="button" class="tp-cancel">Cancel</button>
          <button type="button" class="tp-apply">Save</button>
        </div>
      </div>`;
    document.body.appendChild(container);

    // fill hours and minutes once
    const h = container.querySelector('.tp-hour');
    const m = container.querySelector('.tp-minute');
    for(let i=0;i<24;i++){ const o=document.createElement('option'); o.value=o.textContent=String(i).padStart(2,'0'); h.appendChild(o); }
    for(let i=0;i<60;i+=5){ const o=document.createElement('option'); o.value=o.textContent=String(i).padStart(2,'0'); m.appendChild(o); }

    // actions
    container.querySelector('.tp-cancel').addEventListener('click', close);
    container.querySelector('.tp-clear').addEventListener('click', ()=>{ if(!activeCell) return; activeCell.dataset.time=''; activeCell.textContent='--:--'; const mt=activeCell.closest('tr').querySelector('.d-mobile-time'); mt && (mt.textContent='--:--'); close(); });
    container.querySelector('.tp-apply').addEventListener('click', ()=>{
      if(!activeCell) return;
      const hh = h.value; const mm = m.value;
      const val = `${hh}:${mm}`;
      activeCell.dataset.time = val;
      activeCell.textContent = val;
      const mt = activeCell.closest('tr').querySelector('.d-mobile-time');
      mt && (mt.textContent = val);
      close();
    });

    // close on outside click
    document.addEventListener('click', (e)=>{
      if(!container) return; const box = container.querySelector('.timepicker');
      if(box.hidden) return; if(!container.contains(e.target)) close();
    });
    return container;
  }

  function openAt(cell){
    ensureContainer();
    activeCell = cell;
    const box = container.querySelector('.timepicker');
    // prefill
    const t = (cell.dataset.time||'').split(':');
    const hSel = container.querySelector('.tp-hour');
    const mSel = container.querySelector('.tp-minute');
    if(t.length===2){ hSel.value = t[0].padStart(2,'0'); mSel.value = t[1].padStart(2,'0'); }
    else { hSel.value='00'; mSel.value='00'; }

    const r = cell.getBoundingClientRect();
    container.style.position = 'fixed';
    container.style.left = Math.round(r.left) + 'px';
    container.style.top = Math.round(r.bottom + 6) + 'px';
    box.hidden = false;
  }

  function close(){
    if(!container) return; const box = container.querySelector('.timepicker'); box.hidden = true; activeCell = null;
  }

  function bindAll(){
    document.querySelectorAll('.deadline-time-cell').forEach(cell=>{
      if(cell.dataset.tpbound==='1') return; cell.dataset.tpbound='1';
      cell.style.cursor='pointer';
      cell.addEventListener('click', (e)=>{ e.stopPropagation(); openAt(cell); });
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    bindAll();
    const obs = new MutationObserver(bindAll); obs.observe(document.body,{childList:true,subtree:true});
  });
})();

