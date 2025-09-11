(function(){
  const kebabs = document.querySelectorAll('.kebab');
  kebabs.forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const wrap = e.currentTarget.parentElement;
      const dd = wrap.querySelector('.dropdown');
      const open = dd && dd.style.display === 'block';
      document.querySelectorAll('.dropdown').forEach(d=>d.style.display='none');
      if(dd) dd.style.display = open ? 'none' : 'block';
      e.stopPropagation();
    });
  });
  document.addEventListener('click',()=>document.querySelectorAll('.dropdown').forEach(d=>d.style.display='none'));

  // See more/less
  const seeToggle = document.querySelector('.see-toggle');
  const desc = document.querySelector('.description');
  if(seeToggle && desc){
    const update = ()=>{
      const collapsed = desc.getAttribute('data-collapsed') !== 'false';
      seeToggle.textContent = collapsed ? seeToggle.dataset.more : seeToggle.dataset.less;
    };
    update();
    seeToggle.addEventListener('click', ()=>{
      const collapsed = desc.getAttribute('data-collapsed') !== 'false';
      desc.setAttribute('data-collapsed', (!collapsed).toString());
      update();
    });
  }

  // Modal handling for any target progress
  const applyRow = document.getElementById('apply-row');
  const modal = document.getElementById('apply-modal');
  const closeBtns = modal ? modal.querySelectorAll('[data-close]') : [];
  const form = document.getElementById('apply-form');
  const currentInput = document.getElementById('apply-current');
  const startInput = document.getElementById('apply-start');
  const targetInput = document.getElementById('apply-target');
  const bar = document.getElementById('apply-bar');
  const percentEl = document.getElementById('apply-percent');
  const valueEl = document.getElementById('apply-value');
  const titleEl = document.getElementById('apply-title');
  const unitInput = document.getElementById('apply-unit');

  function recalc(){
    const s = Number(startInput.value)||0;
    const c = Number(currentInput.value)||0;
    const t = Math.max(Number(targetInput.value)||1, 1);
    const pct = Math.max(0, Math.min(100, Math.round((c - s) / (t - s) * 100)));
    if(window.updateProgressBar) window.updateProgressBar(bar, pct);
    percentEl.textContent = pct + '%';
    if(valueEl) valueEl.textContent = `${c}/${t}`;
  }

  [currentInput,startInput,targetInput,unitInput].forEach(i=> i && i.addEventListener('input', recalc));

  // Inline edit behavior: view mode by default, click to edit, blur to save/hide
  function setupInlineEdit(wrapper){
    const valueView = wrapper.querySelector('.value-view');
    const input = wrapper.querySelector('.value-input');
    if(!valueView || !input) return;
    function toInput(){
      valueView.style.display = 'none';
      input.style.display = 'block';
      input.focus();
      input.select && input.select();
    }
    function toView(){
      valueView.textContent = input.type === 'number' ? String(Number(input.value||0)) : (input.value||'');
      input.style.display = 'none';
      valueView.style.display = '';
      recalc();
    }
    valueView.addEventListener('click', toInput);
    input.addEventListener('blur', toView);
    input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); input.blur(); } });
  }
  // Start and Target simple fields (meta blocks)
  document.querySelectorAll('.counter.meta .inline-edit').forEach(setupInlineEdit);
  // Current has number and unit: reuse generic inline edit for each inline-edit wrapper
  document.querySelectorAll('.counter.current .inline-edit').forEach(setupInlineEdit);

  // open modal when clicking any progress bar or its value in targets
  function bindProgressOpen(scope){
    (scope||document).querySelectorAll('.target-row .right .progress, .target-row .right .value').forEach(el=>{
      el.addEventListener('click', (e)=>{
        const row = e.currentTarget.closest('.target-row');
        const name = row ? row.querySelector('.text .name') : null;
        if(titleEl && name) titleEl.textContent = name.textContent || 'Update progress';
        // try to parse current/target from UI when available
        const value = row ? row.querySelector('.right .value') : null;
        if(value){
          const parts = (value.textContent||'').split('/');
          if(parts.length===2){
            currentInput.value = Number(parts[0].trim())||0;
            targetInput.value = Math.max(Number(parts[1].trim())||1,1);
          }
        }
        modal.setAttribute('aria-hidden', 'false');
        recalc();
      });
    });
  }
  bindProgressOpen();

  // Add Target modal
  const addBtn = document.querySelector('.add-target');
  const targetModal = document.getElementById('target-modal');
  const closeTargetBtn = targetModal ? targetModal.querySelector('[data-close-target]') : null;
  const targetForm = document.getElementById('target-form');
  if(addBtn && targetModal){
    addBtn.addEventListener('click', ()=> targetModal.setAttribute('aria-hidden','false'));
  }
  closeTargetBtn && closeTargetBtn.addEventListener('click', ()=> targetModal.setAttribute('aria-hidden','true'));
  targetModal && targetModal.addEventListener('click', (e)=>{ if(e.target===targetModal) targetModal.setAttribute('aria-hidden','true'); });

  targetForm && targetForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('t-name').value.trim();
    const start = Number(document.getElementById('t-start').value||0);
    const target = Math.max(Number(document.getElementById('t-target').value||1),1);
    if(!name) return;
    const li = document.createElement('li');
    li.className = 'target-row';
    li.innerHTML = `
      <div class="left">
        <div class="dot"></div>
        <div class="text">
          <div class="name"></div>
          <div class="date">Just now</div>
        </div>
        <div class="row-menu">
          <button class="kebab"><i class="bi bi-three-dots"></i></button>
          <div class="dropdown">
            <button><i class="bi bi-plus"></i> Add task</button>
            <button><i class="bi bi-pencil"></i> Rename</button>
            <button class="danger"><i class="bi bi-trash3"></i> Delete</button>
          </div>
        </div>
      </div>
      <div class="right">
        <span class="label">applications</span>
        <div class="progress"><div class="bar" style="width:0%"></div></div>
        <span class="value">${start}/${target}</span>
      </div>`;
    li.querySelector('.text .name').textContent = name;
    document.querySelector('.target-list').appendChild(li);
    // rebind kebab + progress for the new row
    li.querySelectorAll('.kebab').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const wrap = e.currentTarget.parentElement;
        const dd = wrap.querySelector('.dropdown');
        const open = dd && dd.style.display === 'block';
        document.querySelectorAll('.dropdown').forEach(d=>d.style.display='none');
        if(dd) dd.style.display = open ? 'none' : 'block';
        e.stopPropagation();
      });
    });
    bindProgressOpen(li);
    targetModal.setAttribute('aria-hidden','true');
    (document.getElementById('t-name')).value='';
  });
  closeBtns.forEach(b=>b.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true')));
  modal && modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.setAttribute('aria-hidden','true'); });

  // Add subtle visual hint for clickable values
  document.querySelectorAll('.inline-edit .value-view, .counter.meta .value-view').forEach(v=>{
    v.classList.add('clickable');
  });

  // Comments inline edit and add new
  document.querySelectorAll('[data-comment]').forEach(item=>{
    const view = item.querySelector('.comment-view');
    const input = item.querySelector('.comment-input');
    view.addEventListener('click', ()=>{
      view.style.display='none';
      input.style.display='block';
      input.value = view.textContent || '';
      input.focus();
    });
    input.addEventListener('blur', ()=>{
      view.textContent = input.value || '';
      input.style.display='none';
      view.style.display='';
    });
    input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); input.blur(); } });
  });
  const addCommentBtn = document.getElementById('add-comment');
  const newCommentText = document.getElementById('new-comment-text');
  if(addCommentBtn && newCommentText){
    addCommentBtn.addEventListener('click', ()=>{
      const text = (newCommentText.value||'').trim();
      if(!text) return;
      const li = document.createElement('li');
      li.className = 'comment-item';
      li.setAttribute('data-comment','');
      li.innerHTML = `<div class="comment-view"></div><textarea class="comment-input" rows="2"></textarea>`;
      li.querySelector('.comment-view').textContent = text;
      document.querySelector('.comments').appendChild(li);
      newCommentText.value='';
      // bind inline edit
      const view = li.querySelector('.comment-view');
      const input = li.querySelector('.comment-input');
      view.addEventListener('click', ()=>{ view.style.display='none'; input.style.display='block'; input.value=view.textContent||''; input.focus(); });
      input.addEventListener('blur', ()=>{ view.textContent=input.value||''; input.style.display='none'; view.style.display=''; });
      input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); input.blur(); } });
    });
  }
})();

