(function(){
  window.addEventListener('load', function(){
    document.querySelectorAll('.deadline-cell').forEach((cell, idx)=>{
      // Visible display span + hidden input for flatpickr
      const initDate = cell.dataset.date ? new Date(cell.dataset.date) : null;
      const display = document.createElement('span');
      const humanInit = initDate && !isNaN(initDate) ? initDate.toLocaleDateString(undefined,{month:'short', day:'numeric'}) : (cell.textContent || '');
      display.className = 'date-display';
      display.textContent = humanInit;

      const input = document.createElement('input');
      input.type = 'date';
      input.placeholder = 'YYYY-MM-DD';
      input.id = 'flatpickr-date-' + idx;
      input.style.position = 'absolute';
      input.style.opacity = '0';
      input.style.pointerEvents = 'none';
      input.style.width = '0';
      input.style.height = '0';
      input.style.border = '0';
      cell.style.position = 'relative';
      cell.textContent = '';
      cell.appendChild(display);
      cell.appendChild(input);

      // open native date selector on click and update display
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', (e)=>{ e.stopPropagation(); input.showPicker && input.showPicker(); input.focus(); });
      input.addEventListener('change', ()=>{
        if(!input.value) return;
        const parts = input.value.split('-');
        const d = new Date(Number(parts[0]), Number(parts[1])-1, Number(parts[2]));
        cell.dataset.date = d.toISOString();
        const human = d.toLocaleDateString(undefined,{month:'short', day:'numeric'});
        display.textContent = human;
        const mobileDate = cell.closest('tr').querySelector('.d-mobile-date');
        mobileDate && (mobileDate.textContent = human);
      });
    });
    // Time picker: apply to each .deadline-time-cell
    document.querySelectorAll('.deadline-time-cell').forEach((cell, idx)=>{
      const input = document.createElement('input');
      input.type = 'time';
      input.placeholder = 'HH:MM';
      input.id = 'flatpickr-time-' + idx;
      // keep input inside cell but visually hidden
      input.style.position = 'absolute';
      input.style.opacity = '0';
      input.style.pointerEvents = 'none';
      input.style.width = '0';
      input.style.height = '0';
      input.style.border = '0';
      cell.style.position = 'relative';
      cell.appendChild(input);
      // Show picker only when user clicks the cell
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', (e)=>{ e.stopPropagation(); input.showPicker && input.showPicker(); input.focus(); });
      input.addEventListener('change', ()=>{
        if(!input.value) return;
        const t = input.value;
        cell.dataset.time = t;
        cell.textContent = t;
        const mobileTime = cell.closest('tr').querySelector('.d-mobile-time');
        mobileTime && (mobileTime.textContent = t);
      });
    });
  });
})();

