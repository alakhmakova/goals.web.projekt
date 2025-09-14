(function(){
  if(typeof window.flatpickr === 'undefined') return;

  function toIsoLocal(dt){
    const pad = (n)=> String(n).padStart(2,'0');
    return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  }

  window.addEventListener('load', function(){
    document.querySelectorAll('.deadline-cell').forEach((cell)=>{
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'input max-w-sm';
      input.placeholder = 'YYYY-MM-DD HH:MM';
      input.style.position = 'fixed';
      input.style.left = '-9999px';
      document.body.appendChild(input);

      const fp = flatpickr(input, {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        disableMobile: true,
        onChange: function(sel){
          if(sel && sel[0]){
            const d = sel[0];
            cell.dataset.date = d.toISOString();
            // Render compact human date in cell
            cell.textContent = d.toLocaleDateString(undefined,{month:'short', day:'numeric'}) + ' ' + d.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'});
          }
        },
        onOpen: function(){
          const cal = fp.calendarContainer;
          const r = cell.getBoundingClientRect();
          cal.style.position = 'fixed';
          const calW = cal.offsetWidth || 300;
          const calH = cal.offsetHeight || 320;
          const vW = window.innerWidth;
          const vH = window.innerHeight;
          const margin = 10;
          const spaceBelow = vH - r.bottom;
          const spaceAbove = r.top;
          const openAbove = calH + 8 > spaceBelow && spaceAbove > spaceBelow;
          const top = openAbove ? Math.max(margin, Math.round(r.top - calH - 6)) : Math.min(vH - calH - margin, Math.round(r.bottom + 6));
          const left = Math.max(margin, Math.min(vW - calW - margin, Math.round(r.left)));
          cal.style.top = top + 'px';
          cal.style.left = left + 'px';
          cal.style.zIndex = '2000';
        }
      });

      // Open on cell click with current or parsed date
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', function(e){
        e.stopPropagation();
        const currentDate = cell.dataset.date ? new Date(cell.dataset.date) : new Date();
        fp.setDate(currentDate, false);
        fp.open();
      });
    });

    // Close pickers on outside click
    document.addEventListener('click', function(ev){
      const cal = document.querySelector('.flatpickr-calendar.open');
      if(cal && !cal.contains(ev.target)) cal._flatpickr && cal._flatpickr.close();
    });
  });
})();

