(function(){
  if(!window.flatpickr) return;

  // Due to date picker
  const dueBtn = document.getElementById('due-toggle');
  const dueText = document.getElementById('due-text');
  const stored = localStorage.getItem('goal_due');
  let dueDate = stored ? new Date(stored) : new Date();
  function fmt(d){ return d.toLocaleDateString(undefined,{month:'short', day:'numeric'}); }
  if(dueText) dueText.textContent = fmt(dueDate);

  if(dueBtn){
    const fp = flatpickr(dueBtn, {
      clickOpens: true,
      allowInput: false,
      defaultDate: dueDate,
      dateFormat: 'M j, Y',
      onOpen: function(_, __, inst){
        // position below button
        const r = dueBtn.getBoundingClientRect();
        inst.calendarContainer.style.position = 'fixed';
        inst.calendarContainer.style.left = Math.round(r.left) + 'px';
        inst.calendarContainer.style.top = Math.round(r.bottom + 6) + 'px';
        inst.calendarContainer.style.zIndex = '1000';
      },
      onChange: function(selected){
        if(!selected || !selected[0]) return;
        dueDate = selected[0];
        localStorage.setItem('goal_due', dueDate.toISOString());
        dueText.textContent = fmt(dueDate);
      }
    });
  }

  // Deadline pickers in table
  document.querySelectorAll('.deadline-cell').forEach(cell=>{
    const currentISO = cell.dataset.date;
    const current = currentISO ? new Date(currentISO) : new Date();
    flatpickr(cell, {
      clickOpens: true,
      allowInput: false,
      defaultDate: current,
      dateFormat: 'M j, Y',
      onOpen: function(_, __, inst){
        const r = cell.getBoundingClientRect();
        inst.calendarContainer.style.position = 'fixed';
        inst.calendarContainer.style.left = Math.round(r.left) + 'px';
        inst.calendarContainer.style.top = Math.round(r.bottom + 6) + 'px';
        inst.calendarContainer.style.zIndex = '1000';
      },
      onChange: function(selected){
        if(!selected || !selected[0]) return;
        const d = selected[0];
        cell.dataset.date = d.toISOString().slice(0,10);
        cell.textContent = d.toLocaleDateString(undefined,{month:'short', day:'numeric'});
      }
    });
  });
})();