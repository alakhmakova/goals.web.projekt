(function(){
  let openContainer = null;

  function buildContainer(){
    const wrap = document.createElement('div');
    wrap.className = 'time-picker-container';
    wrap.innerHTML = `
      <input type="text" class="time-input" placeholder="Select time" readonly>
      <button class="clear-btn" type="button">&times;</button>
      <div class="dropdown-time"></div>
    `;
    return wrap;
  }

  function generateTimes(){
    const times=[]; for(let h=0;h<24;h++){ for(let m=0;m<60;m+=30){ times.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`); } } return times;
  }

  function renderDropdown(container, selected){
    const dropdown = container.querySelector('.dropdown-time');
    dropdown.innerHTML = '';
    generateTimes().forEach(t=>{
      const div=document.createElement('div');
      div.textContent=t;
      if(t===selected) div.classList.add('selected');
      div.addEventListener('click', ()=>{
        const input = container.querySelector('.time-input');
        input.value = t;
        showClearBtn(container);
        hideDropdown(container);
        // persist immediately in the attached cell
        const cell = container.parentElement;
        cell.dataset.time = t;
        cell.textContent = '';
        cell.appendChild(container);
        const mt = cell.closest('tr').querySelector('.d-mobile-time');
        mt && (mt.textContent = t);
      });
      dropdown.appendChild(div);
    });
  }

  function showDropdown(container){
    const dropdown = container.querySelector('.dropdown-time');
    renderDropdown(container, container.querySelector('.time-input').value);
    dropdown.style.display='block';
  }
  function hideDropdown(container){
    const dropdown = container.querySelector('.dropdown-time');
    dropdown.style.display='none';
  }
  function showClearBtn(container){
    const btn = container.querySelector('.clear-btn');
    const val = container.querySelector('.time-input').value;
    btn.style.display = val ? 'block' : 'none';
  }

  function attachToCell(cell){
    let container = cell.querySelector('.time-picker-container');
    if(!container){
      container = buildContainer();
      cell.textContent = '';
      cell.appendChild(container);
      const input = container.querySelector('.time-input');
      const dropdown = container.querySelector('.dropdown-time');
      const clearBtn = container.querySelector('.clear-btn');
      // initial value
      const current = cell.dataset.time || '';
      input.value = current; showClearBtn(container);
      // open dropdown on focus or click
      input.addEventListener('focus', ()=>{ showDropdown(container); });
      input.addEventListener('click', (e)=>{ e.stopPropagation(); showDropdown(container); });
      // allow typing arbitrary time; re-render list and keep open
      input.addEventListener('input', ()=>{ renderDropdown(container, input.value); dropdown.style.display='block'; showClearBtn(container); });
      // Enter saves and closes
      input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); if(input.value.trim()!==''){ hideDropdown(container); showClearBtn(container); cell.dataset.time=input.value; const mt=cell.closest('tr').querySelector('.d-mobile-time'); mt && (mt.textContent=input.value); } } });
      // clear button
      clearBtn.addEventListener('click', (e)=>{ e.stopPropagation(); input.value=''; cell.dataset.time=''; showClearBtn(container); hideDropdown(container); const mt=cell.closest('tr').querySelector('.d-mobile-time'); mt && (mt.textContent='--:--'); });
      // outside click closes
      document.addEventListener('click', (e)=>{ if(container.contains(e.target)) return; hideDropdown(container); });
    }
  }

  function bindAll(){
    document.querySelectorAll('.deadline-time-cell').forEach(cell=>{
      if(cell.dataset.timepickerBound==='1') return; cell.dataset.timepickerBound='1';
      cell.style.cursor='pointer';
      cell.addEventListener('click', (e)=>{ e.stopPropagation(); attachToCell(cell); const input=cell.querySelector('.time-input'); input && input.focus(); });
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{ bindAll(); const obs=new MutationObserver(bindAll); obs.observe(document.body,{childList:true,subtree:true}); });
})();