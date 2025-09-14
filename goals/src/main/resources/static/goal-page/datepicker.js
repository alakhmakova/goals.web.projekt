(function(){
  // Ensure dependencies exist
  if(typeof window.flatpickr === 'undefined'){ return; }

  // Helpers
  function formatHuman(d){
    try{ return d.toLocaleDateString(undefined,{month:'short', day:'numeric'}); }catch(e){ return ''; }
  }

  // Initialize a hidden input-based flatpickr and open it near an anchor element
  function createAnchorPicker(onSelect){
    const input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    const fp = flatpickr(input, {
      clickOpens: false,
      allowInput: false,
      dateFormat: 'Y-m-d',
      disableMobile: true,
      weekNumbers: true,
      locale: { firstDayOfWeek: 1 },
      onChange: function(sel){ if(sel && sel[0]) onSelect(sel[0]); }
    });
    return fp;
  }

  function openPickerAt(fp, anchor, d){
    // Set date without closing, then open and position calendar near anchor
    fp.setDate(d || new Date(), false);
    fp.open();
    const cal = fp.calendarContainer;
    const r = anchor.getBoundingClientRect();
    cal.style.position = 'fixed';
    cal.style.zIndex = '2000';
    // Wait a tick for dimensions to settle, then clamp within viewport
    requestAnimationFrame(function(){
      const calW = cal.offsetWidth || 300;
      const calH = cal.offsetHeight || 300;
      const vW = window.innerWidth;
      const vH = window.innerHeight;
      // Prefer below; flip above if not enough space
      const spaceBelow = vH - r.bottom;
      const spaceAbove = r.top;
      const openAbove = calH + 8 > spaceBelow && spaceAbove > spaceBelow;
      const top = openAbove ? Math.max(8, Math.round(r.top - calH - 6)) : Math.min(vH - calH - 8, Math.round(r.bottom + 6));
      const left = Math.max(8, Math.min(vW - calW - 8, Math.round(r.left)));
      cal.style.top = top + 'px';
      cal.style.left = left + 'px';
    });
  }

  // Due to button in header
  const dueBtn = document.getElementById('due-toggle');
  const dueText = document.getElementById('due-text');
  if(dueBtn && dueText){
    let dueDate = new Date(localStorage.getItem('goal_due') || Date.now());
    dueText.textContent = formatHuman(dueDate);

    const duePicker = createAnchorPicker(function(d){
      dueDate = d;
      localStorage.setItem('goal_due', d.toISOString());
      dueText.textContent = formatHuman(dueDate);
    });

    dueBtn.addEventListener('click', function(e){
      openPickerAt(duePicker, dueBtn, dueDate);
      e.stopPropagation();
    });

    // Close when clicking outside
    document.addEventListener('click', function(ev){
      const cal = document.querySelector('.flatpickr-calendar.open');
      if(cal && !cal.contains(ev.target)){
        cal._flatpickr && cal._flatpickr.close();
      }
    });
  }
})();

