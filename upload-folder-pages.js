let foldersData = []; // сюда загрузим JSON

// Загружаем JSON
fetch('folders.json')
  .then(response => response.json())
  .then(data => {
    foldersData = data.folders; // Извлекаем массив folders из объекта
    initFolderButtons(); // Инициализируем кнопки только после загрузки данных
  })
  .catch(error => console.error('Ошибка загрузки JSON:', error));

function initFolderButtons() {
  document.querySelectorAll('.card-button.name').forEach(button => {
    button.addEventListener('click', event => {
      const folderElement = button.closest('.folder');
      const folderId = folderElement.dataset.folderId;

      // Используем массив foldersData для поиска папки
      const folderData = foldersData.find(f => f.id === folderId);
      if (folderData) {
        openFolderPage(folderData);
      } else {
        console.error(`Папка с id "${folderId}" не найдена.`);
      }
    });
  });
}

function openFolderPage(folderData) {
  //Hide the current content
  document.getElementById('main-content')?.remove();

  const template = document.getElementById('folder-tmpl');
  if (!template) {
    console.error('The "folder-tmpl" template was not found!');
    return;
  }

  const clone = template.content.cloneNode(true);

  //Fill in the folder name
  clone.querySelector('#folder-name').textContent = folderData.button;

  //Fill in the goals
  const goalsContainer = clone.querySelector('#goalsContainer');
  folderData.goals.forEach(goal => {
    const div = document.createElement('div');
    div.className = 'card goal';
    div.id = goal.id;
    div.draggable = true;
    div.innerHTML = `
      <div class="card-icon circular-progress-container" data-target="${goal.progressTarget}">
                    <svg viewBox="0 0 250 250" class="circular-progress">
                        <circle class="bg"></circle>
                        <circle class="fg"></circle>
                    </svg>
                    <div class="circular-progress-text">0%</div>
                </div>
                <div class="card-text name">${goal.text}</div>
                <button class="card-button items"><i class="bi bi-crosshair2"></i> ${goal.button}</button>
            </div>
    `;
    goalsContainer.appendChild(div);
  });
  // Insert into the DOM
  document.body.appendChild(clone); 
  initCircularProgress();
}