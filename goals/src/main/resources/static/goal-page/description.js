(function(){
  // Open editor when clicking the entire row, not just +
  document.querySelectorAll('.grow-item').forEach(item=>{
    const row = item.querySelector('.row');
    const panel = item.querySelector('.rich-editor');
    const toggleBtn = item.querySelector('.add-rich');
    if(!row || !panel) return;
    const toggle = ()=>{
      const expanded = item.getAttribute('data-open') === 'true';
      panel.hidden = expanded;
      item.setAttribute('data-open', (!expanded).toString());
      if(toggleBtn) toggleBtn.setAttribute('aria-expanded', (!expanded).toString());
    };
    row.addEventListener('click', (e)=>{
      // avoid toggling when clicking inside rich editor controls accidentally
      if(e.target.closest('.rich-editor')) return;
      toggle();
    });
  });

  // Rich text commands
  document.querySelectorAll('.rich-editor .toolbar button').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.execCommand(b.dataset.cmd, false, null);
    });
  });
  // Save buttons just collapse
  document.querySelectorAll('.rich-editor .save-rich').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const editor = e.currentTarget.closest('.rich-editor');
      const item = editor && editor.closest('.grow-item');
      if(item && editor){ editor.hidden = true; item.setAttribute('data-open','false'); }
    });
  });
})();