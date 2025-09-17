(function(){
  if(typeof window.flatpickr === 'undefined') return;

  window.addEventListener('load', function(){
    document.querySelectorAll('.deadline-cell').forEach((cell, idx)=>{
      // Visible display span + hidden input for flatpickr
      const initDate = cell.dataset.date ? new Date(cell.dataset.date) : null;
      const display = document.createElement('span');
      const humanInit = initDate && !isNaN(initDate) ? initDate.toLocaleDateString(undefined,{month:'short', day:'numeric'}) : (cell.textContent || '');
      display.className = 'date-display';
      display.textContent = humanInit;

      const input = document.createElement('input');
      input.type = 'text';
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

      const fp = flatpickr(input, {
        enableTime: false,
        dateFormat: 'Y-m-d',
        disableMobile: true,
        monthSelectorType: 'dropdown',
        onOpen: function(){
          const r = cell.getBoundingClientRect();
          const cal = fp.calendarContainer;
          const vW = window.innerWidth; const vH = window.innerHeight; const margin = 8;
          const calW = cal.offsetWidth || 300; const calH = cal.offsetHeight || 320;
          let left = Math.round(r.left); let top = Math.round(r.bottom + 6);
          left = Math.max(margin, Math.min(vW - calW - margin, left));
          if(top + calH + margin > vH){ top = Math.max(margin, Math.round(r.top - calH - 6)); }
          cal.style.position = 'fixed';
          cal.style.top = top + 'px';
          cal.style.left = left + 'px';
          cal.style.zIndex = '2000';
        },
        onChange: function(sel){
          if(sel && sel[0]){
            const d = sel[0];
            cell.dataset.date = d.toISOString();
            const human = d.toLocaleDateString(undefined,{month:'short', day:'numeric'});
            display.textContent = human;
            const mobileDate = cell.closest('tr').querySelector('.d-mobile-date');
            mobileDate && (mobileDate.textContent = human);
          }
        }
      });
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', (e)=>{ e.stopPropagation(); fp.open(); });
    });
    // Time picker: apply to each .deadline-time-cell
    document.querySelectorAll('.deadline-time-cell').forEach((cell, idx)=>{
      const input = document.createElement('input');
      input.type = 'text';
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
      const fp = flatpickr(input, {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        time_24hr: true,
        disableMobile: true,
        onOpen: function(){
          const r = cell.getBoundingClientRect();
          const cal = fp.calendarContainer;
          cal.style.position = 'fixed';
          cal.style.top = Math.round(r.bottom + 6) + 'px';
          cal.style.left = Math.round(r.left) + 'px';
          cal.style.zIndex = '2000';
        },
        onChange: function(sel){
          if(sel && sel[0]){
            const d = sel[0];
            const t = d.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit',hour12:false});
            cell.dataset.time = t;
            cell.textContent = t;
            const mobileTime = cell.closest('tr').querySelector('.d-mobile-time');
            mobileTime && (mobileTime.textContent = t);
          }
        }
      });
      // Show picker only when user clicks the cell
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', (e)=>{
        e.stopPropagation();
        const current = cell.dataset.time || '';
        if(current){ fp.setDate(`2000-01-01 ${current}`, false); }
        fp.open();
      });
    });
  });
})();

