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

  function recalc(){
    const s = Number(startInput.value)||0;
    const c = Number(currentInput.value)||0;
    const t = Math.max(Number(targetInput.value)||1, 1);
    const pct = Math.max(0, Math.min(100, Math.round((c - s) / (t - s) * 100)));
    bar.style.width = pct + '%';
    percentEl.textContent = pct + '%';
    if(valueEl) valueEl.textContent = `${c}/${t}`;
  }

  document.querySelectorAll('.step').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const step = Number(btn.dataset.step);
      currentInput.value = Math.max(0, Number(currentInput.value||0) + step);
      recalc();
    });
  });
  [currentInput,startInput,targetInput].forEach(i=> i && i.addEventListener('input', recalc));

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
})();

