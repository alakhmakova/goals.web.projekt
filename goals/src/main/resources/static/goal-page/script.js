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

  // Drawer toggle and push content
  (function(){
    const menuBtn = document.querySelector('.menu-btn');
    const drawer = document.getElementById('left-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const content = document.querySelector('.content');
    const closeBtn = document.getElementById('drawer-close');
    function open(){ drawer.classList.add('open'); overlay.hidden=false; content.style.transform='translateX(320px)'; }
    function close(){ drawer.classList.remove('open'); overlay.hidden=true; content.style.transform=''; }
    menuBtn && menuBtn.addEventListener('click', (e)=>{ open(); e.stopPropagation(); });
    closeBtn && closeBtn.addEventListener('click', close);
    overlay && overlay.addEventListener('click', close);
  })();

  // Due date calendar
  (function(){
    const toggle = document.getElementById('due-toggle');
    const pop = document.getElementById('due-popover');
    const grid = document.getElementById('cal-grid');
    const title = document.getElementById('cal-title');
    const dueText = document.getElementById('due-text');
    if(!toggle || !pop || !grid || !title || !dueText) return;

    let current = new Date(localStorage.getItem('goal_due') || Date.now());
    let view = new Date(current.getFullYear(), current.getMonth(), 1);

    function fmt(d){
      return d.toLocaleDateString(undefined,{month:'short', day:'numeric'});
    }
    function render(){
      title.textContent = view.toLocaleDateString(undefined,{month:'long', year:'numeric'});
      grid.innerHTML='';
      const startDay = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
      const firstWeekday = (startDay + 6) % 7; // make Monday=0
      for(let i=0;i<firstWeekday;i++) grid.appendChild(document.createElement('span'));
      const days = new Date(view.getFullYear(), view.getMonth()+1, 0).getDate();
      for(let d=1; d<=days; d++){
        const btn = document.createElement('button');
        btn.textContent = String(d);
        const dt = new Date(view.getFullYear(), view.getMonth(), d);
        const isToday = new Date().toDateString()===dt.toDateString();
        const isSelected = current.toDateString()===dt.toDateString();
        if(isToday) btn.classList.add('today');
        if(isSelected) btn.classList.add('selected');
        btn.addEventListener('click', ()=>{
          current = dt;
          localStorage.setItem('goal_due', current.toISOString());
          dueText.textContent = fmt(current);
          pop.hidden = true;
        });
        grid.appendChild(btn);
      }
    }
    render();
    dueText.textContent = fmt(current);

    toggle.addEventListener('click', (e)=>{ pop.hidden = !pop.hidden; e.stopPropagation(); });
    document.querySelectorAll('.cal-nav').forEach(n=>{
      n.addEventListener('click', (e)=>{
        const dir = Number(n.dataset.dir)||0;
        view = new Date(view.getFullYear(), view.getMonth()+dir, 1);
        render();
        e.stopPropagation();
      });
    });
    document.addEventListener('click', (e)=>{
      if(!pop.hidden && !pop.contains(e.target) && e.target!==toggle){ pop.hidden = true; }
    });
  })();

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
  // Current has number and unit: bind explicitly to avoid cross-target conflicts
  (function(){
    const viewCurrent = document.getElementById('view-current');
    const inputCurrent = document.getElementById('apply-current');
    const viewUnit = document.getElementById('view-unit');
    const inputUnit = document.getElementById('apply-unit');
    function bindExplicit(viewEl, inputEl, isNumber){
      if(!viewEl || !inputEl) return;
      viewEl.classList.add('clickable');
      viewEl.addEventListener('click', (e)=>{
        e.stopPropagation();
        // show only its own input
        [inputCurrent,inputUnit].forEach(i=>{ if(i) i.style.display='none'; });
        [viewCurrent,viewUnit].forEach(v=>{ if(v) v.style.display=''; });
        viewEl.style.display='none';
        inputEl.style.display='block';
        inputEl.focus();
        inputEl.select && inputEl.select();
      });
      inputEl.addEventListener('blur', ()=>{
        if(isNumber){ viewCurrent.textContent = String(Number(inputCurrent.value||0)); }
        else { viewUnit.textContent = inputUnit.value || ''; }
        inputEl.style.display='none';
        viewEl.style.display='';
        recalc();
      });
      inputEl.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); inputEl.blur(); } });
    }
    bindExplicit(viewCurrent, inputCurrent, true);
    bindExplicit(viewUnit, inputUnit, false);
  })();

  // Rich text editors for GROW items
  document.querySelectorAll('.grow-item .add-rich').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const item = btn.closest('.grow-item');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panel = item.querySelector('.rich-editor');
      if(panel){
        panel.hidden = expanded;
        btn.setAttribute('aria-expanded', (!expanded).toString());
        item.setAttribute('data-open', (!expanded).toString());
      }
    });
  });
  document.querySelectorAll('.rich-editor .toolbar button').forEach(b=>{
    b.addEventListener('click', ()=>{
      const cmd = b.dataset.cmd;
      document.execCommand(cmd, false, null);
    });
  });
  document.querySelectorAll('.rich-editor .save-rich').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const panel = e.currentTarget.closest('.rich-editor');
      panel && (panel.hidden = true);
      const toggle = document.querySelector(`.add-rich[data-target="${panel.getAttribute('data-for')}"]`);
      toggle && toggle.setAttribute('aria-expanded','false');
    });
  });

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

  // Comments: menus, inline edit, like/reply, add new
  function bindCommentItem(item){
    const menuBtn = item.querySelector('.c-menu .kebab');
    const dd = item.querySelector('.c-menu .dropdown');
    if(menuBtn && dd){
      menuBtn.addEventListener('click', (e)=>{
        document.querySelectorAll('.c-menu .dropdown').forEach(d=> d.style.display='none');
        dd.style.display = 'block';
        e.stopPropagation();
      });
    }
    const view = item.querySelector('.comment-view');
    const input = item.querySelector('.comment-input');
    const editBtn = item.querySelector('[data-edit]');
    const delBtn = item.querySelector('[data-delete]');
    const likeBtn = item.querySelector('.c-like');
    const replyBtn = item.querySelector('.c-reply');
    const replyBox = item.querySelector('.c-reply-box');
    const saveReply = item.querySelector('.save-reply');
    if(view && input){
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
    }
    editBtn && editBtn.addEventListener('click', ()=>{ view && view.click(); dd && (dd.style.display='none'); });
    delBtn && delBtn.addEventListener('click', ()=>{ item.remove(); });
    likeBtn && likeBtn.addEventListener('click', ()=>{ likeBtn.classList.toggle('liked'); });
    if(replyBtn && replyBox && saveReply){
      replyBtn.addEventListener('click', ()=>{ replyBox.style.display = replyBox.style.display==='block' ? 'none' : 'block'; });
      saveReply.addEventListener('click', ()=>{
        const text = replyBox.querySelector('.reply-input').value.trim();
        if(!text) return;
        const child = document.createElement('div');
        child.className = 'reply-bubble';
        child.textContent = text;
        item.querySelector('.c-content').appendChild(child);
        replyBox.querySelector('.reply-input').value='';
        replyBox.style.display='none';
      });
    }
  }
  document.querySelectorAll('.comment-item').forEach(bindCommentItem);

  const addCommentBtn = document.getElementById('send-comment');
  const newCommentText = document.getElementById('new-comment-text');
  if(addCommentBtn && newCommentText){
    // update send button active state
    function updateSendState(){
      const has = (newCommentText.value||'').trim().length>0;
      addCommentBtn.disabled = !has;
      addCommentBtn.classList.toggle('active', has);
    }
    newCommentText.addEventListener('input', updateSendState);
    updateSendState();
    // prevent Enter from submitting
    newCommentText.addEventListener('keydown', (e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.stopPropagation(); } });
    addCommentBtn.addEventListener('click', ()=>{
      const text = (newCommentText.value||'').trim();
      if(!text) return;
      const li = document.createElement('li');
      li.className = 'comment-item';
      li.innerHTML = `
        <div class="comment">
          <div class="c-avatar"></div>
          <div class="c-content">
            <div class="c-head">
              <div class="c-author">You</div>
              <div class="c-time">Just now</div>
              <div class="c-menu">
                <button class="kebab"><i class="bi bi-three-dots"></i></button>
                <div class="dropdown">
                  <button data-edit><i class="bi bi-pencil"></i> Edit</button>
                  <button class="danger" data-delete><i class="bi bi-trash3"></i> Delete</button>
                </div>
              </div>
            </div>
            <div class="c-body">
              <div class="comment-view"></div>
              <textarea class="comment-input" rows="2"></textarea>
            </div>
            <div class="c-actions">
              <button class="c-like"><i class="bi bi-hand-thumbs-up"></i> Like</button>
              <button class="c-reply"><i class="bi bi-reply"></i> Reply</button>
            </div>
            <div class="c-reply-box">
              <textarea class="reply-input" rows="2" placeholder="Write a reply..."></textarea>
              <div class="actions"><button class="btn primary save-reply">Send</button></div>
            </div>
          </div>
        </div>`;
      li.querySelector('.comment-view').textContent = text;
      document.querySelector('.comments').appendChild(li);
      newCommentText.value='';
      updateSendState();
      bindCommentItem(li);
    });
  }
})();

