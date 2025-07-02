const radios = document.querySelectorAll('input[type="radio"]');
const typesContent = document.getElementById('types-content');

function renderTargetContent(type) {
    let html = '';

    if (type === 'number') {
        html = `
      <div class="target-range">
        <div class="unit-container">
            <label class="choose">Unit</label>
            <input type="text" class="input small" placeholder="e.g. steps, kg" name="unit"/>
        </div>
        <div>
          <label class="choose">Start</label>
          <input type="number" step="any" class="input small" placeholder="0" value="" name="start"/>
        </div>
        <div>
          <label class="choose">Target</label>
          <input type="number" step="any" class="input small" placeholder="0" value="" name="target"/>
        </div>
      </div>
      
    `;
    } else if(type === 'currency') {
        html = `
      <div class="target-range">
        <div class="unit-container">
            <label class="choose">Currency</label>
            <input type="text" class="input small" placeholder="e.g. USD, EUR, SEK" name="unit"/>
        </div>
        <div>
          <label class="choose">Start</label>
          <input type="number" step="any" class="input small" placeholder="0" value="" name="start"/>
        </div>
        <div>
          <label class="choose">Target</label>
          <input type="number" step="any" class="input small" placeholder="0" value="" name="target"/>
        </div>
      </div>
      
    `;
    }
    else if (type === 'success') {
        html = '';
    } else if (type === 'tasks') {
        html = `
      <div class="hint">Required*<br />Add tasks to your target</div>
      <button class="add-task-btn">+ Add task</button>
    `;
    }

    typesContent.innerHTML = html;
}

radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        renderTargetContent(e.target.value);
    });



});
