
document.addEventListener('DOMContentLoaded', function () {
    function initDragAndDrop() {
        const cardsContainer = document.getElementById('cardsContainer');

        document.querySelectorAll('.goal').forEach(goal => {
            goal.addEventListener('dragstart', dragStart);
        });

        
        document.querySelectorAll('.folder').forEach(folder => {
            folder.addEventListener('dragover', dragOver);
            folder.addEventListener('dragenter', dragEnter);
            folder.addEventListener('dragleave', dragLeave);
            folder.addEventListener('drop', drop);
        });

        function dragStart(e) {
            e.dataTransfer.setData('text/plain', e.target.id);
            setTimeout(() => {
                e.target.classList.add('dragging');
            }, 0);
        }

        function dragOver(e) {
            e.preventDefault();
        }

        function dragEnter(e) {
            e.preventDefault();
            e.target.classList.add('drag-over');
        }

        function dragLeave(e) {
            e.target.classList.remove('drag-over');
        }

        function drop(e) {
            e.preventDefault();
            e.target.classList.remove('drag-over');

            const goalId = e.dataTransfer.getData('text/plain');
            const goalElement = document.getElementById(goalId);
            const folderElement = e.target.closest('.folder');
            const folderId = folderElement.dataset.folderId;

            if (!goalElement || !folderId) return;

            //Update the goal counter in the folder
            updateFolderCounter(folderElement);

            //Remove goal from cardContainer
            goalElement.remove();

            // Открываем страницу папки
            openFolderPage(folderId, goalElement);
        }

        async function openFolderPage(folderId, goalElement) {
            // Проверяем, есть ли уже открытая страница
            let folderPage = document.querySelector('.folder-page');
            if (!folderPage) {

                //Hide the current content
                document.getElementById('main-content')?.remove();
                const template = document.getElementById('folder-tmpl');
                if (!template) {
                    console.error('The "folder-tmpl" template was not found!');
                    return;
                }
                const clone = template.content.cloneNode(true);
                document.body.appendChild(clone); // Добавляем страницу в DOM

                // Обновляем ссылку на страницу
                folderPage = document.querySelector('.folder-page');
            }

            //Set the folder name
            const folderNameElement = folderPage.querySelector('#folder-name');
            const folderData = await getFolderData(folderId);
            if (folderNameElement && folderData) {
                folderNameElement.textContent = folderData.title || 'Folder';
            }

            //Add existing targets from the folder
            const goalsContainer = folderPage.querySelector('#goalsContainer');
            if (goalsContainer && folderData) {
                // Очищаем контейнер
                goalsContainer.innerHTML = '';

                //Add targets from folders.json
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
                            <div class="circular-progress-text">${goal.progressTarget}%</div>
                        </div>
                        <div class="card-text name">${goal.text}</div>
                        <button class="card-button items"><i class="bi bi-crosshair2"></i> ${goal.button}</button>
                    `;
                    goalsContainer.appendChild(div);
                });

                //Add the copied target that was dragged 
                if (goalElement) {
                    const goalClone = goalElement.cloneNode(true);
                    goalClone.classList.remove('dragging');
                    goalsContainer.appendChild(goalClone);

                    // Обновляем данные папки
                    folderData.goals.push({
                        id: goalElement.id,
                        text: goalElement.querySelector('.card-text.name').textContent,
                        progressTarget: goalElement.querySelector('.circular-progress-container').dataset.target,
                        button: `${folderData.goals.length + 1} targets`
                    });

                    // Сохраняем обновлённые данные
                    updateFoldersJSON(folderData);
                }
            }
        }

        async function getFolderData(folderId) {
            // Загружаем данные из folders.json
            const response = await fetch('folders.json');
            const data = await response.json();
            return data.folders.find(folder => folder.id === folderId);
        }

        function updateFoldersJSON(updatedFolder) {
            // Здесь должна быть логика для обновления JSON
            console.log('Обновление folders.json:', updatedFolder);
        }
    }

    initDragAndDrop();

    function updateFolderCounter(folderElement) {
        const counterElement = folderElement.querySelector('.card-text.items');
        if (!counterElement) return;

        const currentText = counterElement.textContent;
        const match = currentText.match(/(\d+)/);
        if (!match) return;

        const currentCount = parseInt(match[0]);
        counterElement.textContent = currentText.replace(/\d+/, currentCount + 1);
    }
});