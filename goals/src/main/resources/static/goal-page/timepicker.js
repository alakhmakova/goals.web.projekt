(function(){
  let openContainer = null;
  let activeCell = null;

  function buildContainer(){
    const wrap = document.createElement('div');
    wrap.className = 'time-picker-container';
    wrap.innerHTML = `
      <input type="text" class="time-input" placeholder="Select time" readonly />
      <div class="dropdown-time" hidden>
        <div class="tp-head">Select time</div>
        <div class="tp-body">
          <select class="tp-hour"></select> : <select class="tp-minute"></select>
        </div>
        <div class="tp-foot">
          <button type="button" class="tp-clear">Clear</button>
          <div class="spacer"></div>
          <button type="button" class="tp-cancel">Cancel</button>
          <button type="button" class="tp-apply">Save</button>
        </div>
      </div>`;
    // Fill hours/minutes
    const h = wrap.querySelector('.tp-hour');
    const m = wrap.querySelector('.tp-minute');
    for(let i=0;i<24;i++){ const o=document.createElement('option'); o.value=o.textContent=String(i).padStart(2,'0'); h.appendChild(o); }
    for(let i=0;i<60;i+=5){ const o=document.createElement('option'); o.value=o.textContent=String(i).padStart(2,'0'); m.appendChild(o); }
    return wrap;
  }

  function openForCell(cell){
    close();
    activeCell = cell;
    // Create container inside the cell to ensure dropdown positions exactly under input
    let container = cell.querySelector('.time-picker-container');
    if(!container){
      container = buildContainer();
      cell.textContent='';
      cell.appendChild(container);
      // make sure container inherits positioning context
      container.style.position = 'relative';
      container.style.width = '100%';
    }
    const input = container.querySelector('.time-input');
    const dd = container.querySelector('.dropdown-time');
    const hourSel = container.querySelector('.tp-hour');
    const minSel = container.querySelector('.tp-minute');
    // prefill
    const t = (cell.dataset.time || '').split(':');
    if(t.length===2){ hourSel.value=t[0].padStart(2,'0'); minSel.value=t[1].padStart(2,'0'); input.value = `${hourSel.value}:${minSel.value}`; }
    else { input.value = ''; hourSel.value='00'; minSel.value='00'; }
    // show dropdown directly under input by using absolute inside relative container
    dd.hidden = false;
    dd.style.position = 'absolute';
    dd.style.left = '0';
    // compute top as input.offsetTop + input.offsetHeight
    dd.style.top = (input.offsetTop + input.offsetHeight + 6) + 'px';
    openContainer = container;

    // wire buttons
    container.querySelector('.tp-cancel').onclick = function(){ close(); };
    container.querySelector('.tp-clear').onclick = function(){ cell.dataset.time=''; input.value=''; updateMobile(cell, '--:--'); close(); };
    container.querySelector('.tp-apply').onclick = function(){ const val = `${hourSel.value}:${minSel.value}`; cell.dataset.time = val; input.value = val; updateMobile(cell, val); close(); };

    // toggle on input click
    input.onclick = function(e){ e.stopPropagation(); dd.hidden = !dd.hidden; };
  }

  function updateMobile(cell, val){
    const mt = cell.closest('tr').querySelector('.d-mobile-time');
    mt && (mt.textContent = val);
  }

  function close(){
    if(openContainer){ const dd = openContainer.querySelector('.dropdown-time'); dd && (dd.hidden = true); }
    openContainer = null; activeCell = null;
  }

  function bindAll(){
    document.querySelectorAll('.deadline-time-cell').forEach(function(cell){
      if(cell.dataset.tp2bound==='1') return; cell.dataset.tp2bound='1';
      cell.style.cursor='pointer';
      cell.addEventListener('click', function(e){ e.stopPropagation(); openForCell(cell); });
    });
  }

  document.addEventListener('click', function(){ close(); });
  document.addEventListener('DOMContentLoaded', function(){ bindAll(); const obs=new MutationObserver(bindAll); obs.observe(document.body,{childList:true,subtree:true}); });
})();