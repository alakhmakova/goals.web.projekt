(function(){
  // Dropdown behavior moved to drop-down.js

  // drawer logic moved to menu.js

  // Date picking handled by Flatpickr in calendar.js

  // Slider bubble follow
  (function(){
    const slider = document.getElementById('menu-slider');
    const bubble = document.getElementById('menu-slider-bubble');
    if(!slider || !bubble) return;
    function setBubble(){
      const min = Number(slider.min)||0, max = Number(slider.max)||100, val = Number(slider.value)||0;
      bubble.textContent = String(val);
      const pct = (val - min) / (max - min);
      const track = slider.getBoundingClientRect();
      bubble.style.left = (pct * track.width) + 'px';
    }
    slider.addEventListener('input', setBubble);
    window.addEventListener('resize', setBubble);
    setBubble();
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
        btn.textContent = expanded ? 'add' : 'remove';
        btn.setAttribute('aria-expanded', (!expanded).toString());
        item.setAttribute('data-open', (!expanded).toString());
      }
    });
  });
  // open/close by clicking the whole row
  document.querySelectorAll('.grow-item .row').forEach(row=>{
    row.addEventListener('click', (e)=>{
      if(e.target.classList.contains('add-rich')) return;
      const toggle = row.querySelector('.add-rich');
      toggle && toggle.click();
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
  // also bind for table cells with data-type=number
  document.querySelectorAll('.t-progress .progress-cell.clickable').forEach(cell=>{
    cell.addEventListener('click', ()=>{
      const unit = cell.dataset.unit || 'unit';
      const start = Number(cell.dataset.start||0);
      const current = Number(cell.dataset.current||0);
      const target = Math.max(Number(cell.dataset.target||1),1);
      const nameCell = cell.closest('tr').querySelector('.t-name');
      const title = document.getElementById('apply-title');
      if(title && nameCell) title.textContent = nameCell.textContent;
      document.getElementById('view-unit').textContent = unit;
      document.getElementById('apply-unit').value = unit;
      document.getElementById('view-start').textContent = String(start);
      document.getElementById('apply-start').value = String(start);
      document.getElementById('view-current').textContent = String(current);
      document.getElementById('apply-current').value = String(current);
      document.getElementById('view-target').textContent = String(target);
      document.getElementById('apply-target').value = String(target);
      const modal = document.getElementById('apply-modal');
      modal.setAttribute('aria-hidden','false');
    });
  });

  // Inline edit target name
  document.querySelectorAll('.t-name').forEach(cell=>{
    const view = cell.querySelector('.name-view');
    const input = cell.querySelector('.name-input');
    if(!view || !input) return;
    view.addEventListener('click', ()=>{ cell.classList.add('editing'); input.focus(); input.select && input.select(); });
    const finish = ()=>{ view.textContent = input.value.trim() || view.textContent; cell.classList.remove('editing'); };
    input.addEventListener('blur', finish);
    input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); input.blur(); } });
  });

  // Menu actions (FlyonUI dropdown structure)
  document.querySelectorAll('.t-name .t-menu .dropdown-menu').forEach(dd=>{
    const tr = dd.closest('tr');
    const nameCell = tr.querySelector('.t-name');
    const deadlineCell = tr.querySelector('.deadline-cell');
    // rename -> into inline edit
    const renameBtn = dd.querySelector('[data-rename]');
    renameBtn && renameBtn.addEventListener('click', ()=>{
      const input = nameCell.querySelector('.name-input');
      nameCell.classList.add('editing');
      input && input.focus();
      dd.style.display='none';
    });
    // change deadline -> trigger flatpickr
    const deadlineBtn = dd.querySelector('[data-deadline]');
    deadlineBtn && deadlineBtn.addEventListener('click', ()=>{
      const input = deadlineCell && deadlineCell.querySelector('input');
      if(input){ input.focus(); input.dispatchEvent(new Event('click',{bubbles:true})); }
      dd.style.display='none';
    });
    // note -> focus composer
    const noteBtn = dd.querySelector('[data-note]');
    noteBtn && noteBtn.addEventListener('click', ()=>{
      const input = document.getElementById('new-comment-text');
      input && input.focus();
      input && input.scrollIntoView({behavior:'smooth', block:'end'});
      const send = document.getElementById('send-comment');
      send && send.classList.add('active');
      send && (send.disabled=false);
      dd.style.display='none';
    });
    // delete -> reuse existing modal
    const delBtn = dd.querySelector('[data-delete]');
    delBtn && delBtn.addEventListener('click', ()=>{
      const deleteModal = document.getElementById('delete-modal');
      deleteModal && deleteModal.setAttribute('aria-hidden','false');
      dd.style.display='none';
    });
  });

  // Tasks target interactions
  (function(){
    const rows = document.querySelectorAll('tr.t-row[data-type="tasks"]');
    rows.forEach(row=>{
      const nameCell = row.querySelector('.t-name');
      const badge = nameCell ? nameCell.querySelector('.task-badge') : null;
      const plus = nameCell ? nameCell.querySelector('.task-plus') : null;
      const progressCell = row.querySelector('.t-progress .progress-cell[data-type="tasks"]');
      const panelRow = row.nextElementSibling && row.nextElementSibling.classList.contains('tasks-panel-row') ? row.nextElementSibling : null;
      if(!progressCell || !panelRow) return;
      const panel = panelRow.querySelector('.tasks-panel');
      const listUi = panel.querySelector('.task-list-ui');
      const newInput = panel.querySelector('.new-task-input');
      const addBtn = panel.querySelector('.add-task-btn');

      function readTasks(){
        const list = progressCell.querySelector('.task-list');
        const tasks = [];
        list && list.querySelectorAll('li').forEach(li=>{
          tasks.push({ name: li.textContent.trim(), done: li.classList.contains('done') });
        });
        return tasks;
      }
      function writeBadge(tasks){
        if(badge) badge.textContent = String(tasks.length);
      }
      function updateProgress(tasks){
        const total = tasks.length || 1; // avoid divide by zero; UI constraint will keep >=1
        const done = tasks.filter(t=>t.done).length;
        const pct = Math.round((done/total)*100);
        const bar = progressCell.querySelector('.bar');
        bar && (bar.style.width = pct + '%');
        const val = progressCell.querySelector('.value');
        val && (val.textContent = `${done}/${total}`);
      }
      function renderPanel(tasks){
        listUi.innerHTML = '';
        tasks.forEach((t, idx)=>{
          const item = document.createElement('div');
          item.className = 'task-row';
          const cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.checked = t.done;
          const name = document.createElement('div');
          name.className = 'name';
          name.textContent = t.name;
          const actions = document.createElement('div');
          actions.className = 'actions';
          const commentBtn = document.createElement('button');
          commentBtn.className = 'icon-btn';
          commentBtn.innerHTML = '<i class="bi bi-chat" ></i>';
          const editBtn = document.createElement('button');
          editBtn.className = 'icon-btn';
          editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
          const delBtn = document.createElement('button');
          delBtn.className = 'icon-btn';
          delBtn.innerHTML = '<i class="bi bi-x"></i>';

          actions.appendChild(commentBtn);
          actions.appendChild(editBtn);
          actions.appendChild(delBtn);
          item.appendChild(cb);
          item.appendChild(name);
          item.appendChild(actions);
          listUi.appendChild(item);

          cb.addEventListener('change', ()=>{ t.done = cb.checked; updateProgress(tasks); });
          editBtn.addEventListener('click', ()=>{
            name.setAttribute('contenteditable','true');
            name.focus();
            const onBlur = ()=>{
              const v = (name.textContent||'').trim();
              if(!v){ name.textContent = t.name; } else { t.name = v; }
              name.removeAttribute('contenteditable');
              name.removeEventListener('blur', onBlur);
              updateProgress(tasks);
            };
            name.addEventListener('blur', onBlur);
          });
          delBtn.addEventListener('click', ()=>{
            if(tasks.length<=1){ alert('At least one task must remain.'); return; }
            if(!confirm('Delete this task? This action cannot be undone.')) return;
            tasks.splice(idx,1);
            renderDropdown(tasks);
            writeBadge(tasks);
            updateProgress(tasks);
          });
          commentBtn.addEventListener('click', ()=>{
            const input = document.getElementById('new-comment-text');
            input && input.focus();
            input && input.scrollIntoView({behavior:'smooth', block:'end'});
            const send = document.getElementById('send-comment');
            send && send.classList.add('active');
            send && (send.disabled=false);
          });
        });

        function addNew(){
          const v = (newInput.value||'').trim();
          if(!v){ input.focus(); return; }
          tasks.push({name:v, done:false});
          newInput.value='';
          renderPanel(tasks);
          writeBadge(tasks);
          updateProgress(tasks);
        }
        addBtn.addEventListener('click', addNew);
        newInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); addNew(); } });
      }

      // initial state
      let tasks = readTasks();
      writeBadge(tasks);
      updateProgress(tasks);

      function togglePanel(forceOpen){
        const wantOpen = forceOpen===true ? true : forceOpen===false ? false : panelRow.hasAttribute('hidden');
        if(wantOpen){ panelRow.removeAttribute('hidden'); renderPanel(tasks); }
        else { panelRow.setAttribute('hidden',''); }
      }
      badge && badge.addEventListener('click', (e)=>{ togglePanel(true); e.stopPropagation(); });
      plus && plus.addEventListener('click', (e)=>{ togglePanel(true); e.stopPropagation(); });
      document.addEventListener('click', (e)=>{
        if(panelRow.hasAttribute('hidden')) return;
        if(!row.contains(e.target) && !panelRow.contains(e.target)) togglePanel(false);
      });
      // Ensure re-render when opened
      const observer = new MutationObserver(()=>{ if(!panelRow.hasAttribute('hidden')) renderPanel(tasks); });
      observer.observe(panelRow, { attributes:true, attributeFilter:['hidden'] });
    });
  })();

  // Deadline date picking handled by Flatpickr in calendar.js

  // Note button -> focus new comment composer with target name (as author)
  document.querySelectorAll('.note-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const tr = btn.closest('tr');
      const name = tr ? tr.querySelector('.t-name .name-view')?.textContent?.trim() : '';
      const input = document.getElementById('new-comment-text');
      const firstAuthor = document.querySelector('.comments .comment-item .c-author');
      if(firstAuthor) firstAuthor.textContent = name || 'Author';
      if(input){ input.value = ''; input.focus(); const send = document.getElementById('send-comment'); send && send.classList.add('active'); send && (send.disabled=false); }
    });
  });

  // Delete target modal
  (function(){
    const delModal = document.getElementById('delete-modal');
    const confirmBtn = document.getElementById('confirm-delete');
    const closeBtns = delModal ? delModal.querySelectorAll('[data-close-del]') : [];
    let toDelete = null;
    document.querySelectorAll('.del-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        toDelete = btn.closest('tr');
        delModal && delModal.setAttribute('aria-hidden','false');
      });
    });
    closeBtns.forEach(b=> b.addEventListener('click', ()=> delModal.setAttribute('aria-hidden','true')));
    confirmBtn && confirmBtn.addEventListener('click', ()=>{
      if(toDelete) toDelete.remove();
      delModal.setAttribute('aria-hidden','true');
      toDelete = null;
    });
  })();
  // Add Target modal
  const addBtn = document.querySelector('.add-target');
  const targetModal = document.getElementById('target-modal');
  const closeTargetBtn = targetModal ? targetModal.querySelector('[data-close-target]') : null;
  const targetForm = document.getElementById('target-form');
  // type switch elements
  const rNumber = document.getElementById('type-number');
  const rBoolean = document.getElementById('type-boolean');
  const rTasks = document.getElementById('type-tasks');
  const numberCfg = document.getElementById('type-number-config');
  const tasksCfg = document.getElementById('type-tasks-config');
  function updateTypeUI(){
    if(rNumber && rNumber.checked){ numberCfg && (numberCfg.hidden=false); tasksCfg && (tasksCfg.hidden=true); }
    else if(rTasks && rTasks.checked){ numberCfg && (numberCfg.hidden=true); tasksCfg && (tasksCfg.hidden=false); }
    else { numberCfg && (numberCfg.hidden=true); tasksCfg && (tasksCfg.hidden=true); }
  }
  [rNumber,rBoolean,rTasks].forEach(r=> r && r.addEventListener('change', updateTypeUI));
  updateTypeUI();
  if(addBtn && targetModal){
    addBtn.addEventListener('click', ()=> targetModal.setAttribute('aria-hidden','false'));
  }
  closeTargetBtn && closeTargetBtn.addEventListener('click', ()=> targetModal.setAttribute('aria-hidden','true'));
  targetModal && targetModal.addEventListener('click', (e)=>{ if(e.target===targetModal) targetModal.setAttribute('aria-hidden','true'); });

  targetForm && targetForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    // Deadline validation: time cannot be set without date
    const dDate = document.getElementById('t-deadline-date');
    const dTime = document.getElementById('t-deadline-time');
    const errDeadline = document.getElementById('err-deadline');
    if(dTime && dTime.value && dDate && !dDate.value){ errDeadline.hidden=false; return; }
    else if(errDeadline){ errDeadline.hidden=true; }
    const nameInput = document.getElementById('t-name');
    const name = nameInput.value.trim();
    const errTname = document.getElementById('err-tname');
    if(!name){ errTname.hidden=false; return; } else { errTname.hidden=true; }
    const typeNumber = document.getElementById('type-number');
    const startEl = document.getElementById('t-start');
    const targetEl = document.getElementById('t-target');
    const errStart = document.getElementById('err-start');
    const errTarget = document.getElementById('err-target');
    const isNumber = typeNumber && typeNumber.checked;
    const isTasks = rTasks && rTasks.checked;
    const taskNameEl = document.getElementById('t-task-name');
    const errTaskName = document.getElementById('err-task-name');
    // Validate number type: start and target required
    if(isNumber){
      let valid = true;
      const startVal = startEl.value;
      const targetVal = targetEl.value;
      const errEqual = document.getElementById('err-equal');
      if(startVal === '' || isNaN(Number(startVal))){ valid = false; errStart.hidden = false; } else { errStart.hidden = true; }
      if(targetVal === '' || isNaN(Number(targetVal))){ valid = false; errTarget.hidden = false; } else { errTarget.hidden = true; }
      if(valid && Number(startVal) === Number(targetVal)){ valid=false; errEqual.hidden=false; } else { errEqual.hidden=true; }
      if(!valid) return; // stop submission
    }
    // Validate tasks type: task name required
    if(isTasks){
      const tn = (taskNameEl.value||'').trim();
      if(!tn){ errTaskName.hidden = false; return; } else { errTaskName.hidden = true; }
    }
    const start = Number(startEl.value||0);
    const target = Math.max(Number(targetEl.value||1),1);
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

