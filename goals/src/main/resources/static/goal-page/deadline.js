(function(){
  if(typeof window.flatpickr === 'undefined') return;

  window.addEventListener('load', function(){
    document.querySelectorAll('.deadline-cell').forEach((cell, idx)=>{
      // Create input inside the cell as per FlyonUI snippet
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'input max-w-sm';
      input.placeholder = 'YYYY-MM-DD';
      input.id = 'flatpickr-date-' + idx; // unique id per cell
      // preserve initial display text as value if parsable
      const initDate = cell.dataset.date ? new Date(cell.dataset.date) : null;
      if(initDate && !isNaN(initDate)){
        const pad = (n)=> String(n).padStart(2,'0');
        input.value = `${initDate.getFullYear()}-${pad(initDate.getMonth()+1)}-${pad(initDate.getDate())}`;
      }
      cell.textContent = '';
      cell.appendChild(input);

      const fp = flatpickr(input, {
        enableTime: false,
        dateFormat: 'Y-m-d',
        disableMobile: true,
        monthSelectorType: 'dropdown',
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
            cell.dataset.date = d.toISOString();
            // update visible date in cell and mobile line
            const human = d.toLocaleDateString(undefined,{month:'short', day:'numeric'});
            cell.textContent = human;
            const mobileDate = cell.closest('tr').querySelector('.d-mobile-date');
            mobileDate && (mobileDate.textContent = human);
          }
        }
      });

      // Open on cell click as well
      // Disable direct change by clicking date cell; use menu instead
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

