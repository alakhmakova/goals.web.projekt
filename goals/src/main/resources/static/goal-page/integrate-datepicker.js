(function(){
  // Due to: attach custom datepicker to header button
  document.addEventListener('DOMContentLoaded', function(){
    var dueBtn = document.getElementById('due-toggle');
    var dueText = document.getElementById('due-text');
    if(dueBtn && window.CustomDatepicker){
      var dp = new CustomDatepicker({ allowEmpty: true });
      dueBtn.addEventListener('click', function(e){
        e.stopPropagation();
        var r = dueBtn.getBoundingClientRect();
        dp.open({
          x: Math.round(r.left),
          y: Math.round(r.bottom + 6),
          onSelect: function(date){
            if(!date){ dueText.textContent=''; return; }
            var d = new Date(date);
            dueText.textContent = d.toLocaleDateString(undefined,{month:'short', day:'numeric'});
          }
        });
      });
      document.addEventListener('click', function(){ dp.close && dp.close(); });
    }

    // Grid: deadline date/time per cell
    if(window.CustomDatepicker){
      document.querySelectorAll('.deadline-cell').forEach(function(cell){
        var display = cell.querySelector('.date-display');
        var dp = new CustomDatepicker({ allowEmpty: true });
        cell.addEventListener('click', function(e){
          e.stopPropagation();
          var r = cell.getBoundingClientRect();
          dp.open({
            x: Math.round(r.left),
            y: Math.round(r.bottom + 6),
            onSelect: function(date){
              if(!date){ display && (display.textContent=''); cell.dataset.date=''; return; }
              var d = new Date(date);
              var human = d.toLocaleDateString(undefined,{month:'short', day:'numeric'});
              display && (display.textContent = human);
              cell.dataset.date = d.toISOString();
              var mobileDate = cell.closest('tr').querySelector('.d-mobile-date');
              mobileDate && (mobileDate.textContent = human);
            }
          });
        });
      });
    }

    // Time: use native time input temporarily shown
    document.querySelectorAll('.deadline-time-cell').forEach(function(cell){
      var input = cell.querySelector('input[type=time]');
      if(!input){
        input = document.createElement('input');
        input.type = 'time';
        input.style.position='absolute'; input.style.opacity='0'; input.style.pointerEvents='none'; input.style.width='0'; input.style.height='0'; input.style.border='0';
        cell.style.position='relative';
        cell.appendChild(input);
      }
      cell.addEventListener('click', function(e){ e.stopPropagation(); input.style.pointerEvents='auto'; input.style.opacity='0.01'; input.style.width='100%'; input.style.height='100%'; input.showPicker && input.showPicker(); });
      var hide = function(){ input.style.pointerEvents='none'; input.style.opacity='0'; input.style.width='0'; input.style.height='0'; };
      input.addEventListener('change', function(){
        if(!input.value){ hide(); return; }
        cell.dataset.time = input.value; cell.textContent = input.value;
        var mobileTime = cell.closest('tr').querySelector('.d-mobile-time');
        mobileTime && (mobileTime.textContent = input.value);
        hide();
      });
      input.addEventListener('blur', hide);
    });
  });
})();

