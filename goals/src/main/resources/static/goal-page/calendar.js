(function(){
  if(!window.flatpickr) return;

  function fmt(d){ return d.toLocaleDateString(undefined,{month:'short', day:'numeric'}); }

  function createPicker(onChange){
    const input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    const fp = flatpickr(input, {
      clickOpens: false,
      allowInput: false,
      dateFormat: 'M j, Y',
      onOpen: function(){
        const anchor = fp._anchor;
        if(!anchor) return;
        const r = anchor.getBoundingClientRect();
        const cal = fp.calendarContainer;
        cal.style.position = 'fixed';
        cal.style.left = Math.round(r.left) + 'px';
        cal.style.top = Math.round(r.bottom + 6) + 'px';
        cal.style.zIndex = '1000';
      },
      onChange: function(selected){ if(selected && selected[0]) onChange(selected[0]); }
    });
    return fp;
  }
  function openAt(fp, anchor, defaultDate){
    fp._anchor = anchor;
    fp.setDate(defaultDate, false);
    fp.open();
  }

  // Due to
  const dueBtn = document.getElementById('due-toggle');
  const dueText = document.getElementById('due-text');
  let dueDate = new Date(localStorage.getItem('goal_due') || Date.now());
  if(dueText) dueText.textContent = fmt(dueDate);
  const duePicker = createPicker((d)=>{
    dueDate = d;
    localStorage.setItem('goal_due', d.toISOString());
    dueText.textContent = fmt(dueDate);
  });
  dueBtn && dueBtn.addEventListener('click', (e)=>{ openAt(duePicker, dueBtn, dueDate); e.stopPropagation(); });

  // Deadlines
  document.querySelectorAll('.deadline-cell').forEach(cell=>{
    let d = cell.dataset.date ? new Date(cell.dataset.date) : new Date();
    const picker = createPicker((sel)=>{
      d = sel;
      cell.dataset.date = d.toISOString().slice(0,10);
      cell.textContent = fmt(d);
    });
    cell.addEventListener('click', (e)=>{ openAt(picker, cell, d); e.stopPropagation(); });
  });

  document.addEventListener('click', (ev)=>{
    // close any open picker only if click outside calendar
    const calOpen = document.querySelector('.flatpickr-calendar.open');
    if(calOpen && !calOpen.contains(ev.target)){
      calOpen._flatpickr && calOpen._flatpickr.close();
    }
  });
})();