(function(){
  if(typeof window.flatpickr === 'undefined') return;

  window.addEventListener('load', function(){
    document.querySelectorAll('.deadline-cell').forEach((cell, idx)=>{
      // Create input inside the cell as per FlyonUI snippet
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'input max-w-sm';
      input.placeholder = 'YYYY-MM-DD HH:MM';
      input.id = 'flatpickr-date-time-' + idx; // unique id per cell
      // preserve initial display text as value if parsable
      const initDate = cell.dataset.date ? new Date(cell.dataset.date) : null;
      if(initDate && !isNaN(initDate)){
        const pad = (n)=> String(n).padStart(2,'0');
        input.value = `${initDate.getFullYear()}-${pad(initDate.getMonth()+1)}-${pad(initDate.getDate())} ${pad(initDate.getHours())}:${pad(initDate.getMinutes())}`;
      }
      cell.textContent = '';
      cell.appendChild(input);

      const fp = flatpickr(input, {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        disableMobile: true,
        onChange: function(sel){
          if(sel && sel[0]){
            const d = sel[0];
            cell.dataset.date = d.toISOString();
          }
        }
      });

      // Open on cell click as well
      // Disable direct change by clicking date cell; use menu instead
    });
  });
})();

