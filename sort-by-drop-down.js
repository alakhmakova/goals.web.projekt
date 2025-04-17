const sortByLinks = document.querySelectorAll(".dropdown-content a");//find all the links in the dropdown menu
//change the text of the "Sort by: ..." button when the user clicks on a link in the dropdown menu
function changeSortByText(event) {
    const dropdown = document.getElementById("sort-by");
    const clickedLink = event.target; //Get the element clicked by the user
    dropdown.innerHTML = "Sort by: " + clickedLink.textContent; //Extract the link text and paste it into the button 
}


//sorting - general algorithm
function sortCards({ selector, keyExtractor, order = 'asc'}) {
    const foldersAndGoals = Array.from(document.querySelectorAll(`.${selector}`))
.map(element => {
        const key = keyExtractor(element);
        const card = element.closest('.card');
        return { key, card};
    });

    foldersAndGoals.sort((a, b) => {

        return order === 'asc'
            ? a.key > b.key ? 1 : a.key < b.key ? -1 : 0
            : a.key < b.key ? 1 : a.key > b.key ? -1 : 0;
    });

    const cardsContainer = document.getElementById("cardsContainer");
    foldersAndGoals.forEach(item => {
        cardsContainer.appendChild(item.card);
    });
}



//different kinds of sorting
function sortByNameAsc() {
    sortCards({
        selector: "name",
        keyExtractor: el => el.textContent.trim().toLowerCase(),
        isFolderCheck: true,
        order: "asc"
    });
}
function sortByNameDesc() {
    sortCards({
        selector: "name",
        keyExtractor: el => el.textContent.trim().toLowerCase(),
        isFolderCheck: true,
        order: "desc"
    });
}

function sortByNumberOfItemsAsc() {
    sortCards({
        selector: "number",
        keyExtractor: el => parseInt(el.textContent.trim(), 10),
        isFolderCheck: true,
        order: "asc"
    });
}
function sortByNumberOfItemsDesc() {
    sortCards({
        selector: "number",
        keyExtractor: el => parseInt(el.textContent.trim(), 10),
        isFolderCheck: true,
        order: "desc"
    });
}

function sortByProgressAsc() {
    sortCards({
        selector: "circular-progress-text",
        keyExtractor: el => parseFloat(el.textContent.trim().replace('%', '')),
        isFolderCheck: false,
        order: "asc",
        goalOnly: true
    });
}
function sortByProgressDesc() {
    sortCards({
        selector: "circular-progress-text",
        keyExtractor: el => parseFloat(el.textContent.trim().replace('%', '')),
        isFolderCheck: false,
        order: "desc",
        goalOnly: true
    });
}


// Объект для отслеживания текущего состояния сортировки
const sortState = {
    currentSortKey: null, // Текущий ключ сортировки (например, "name", "number", "progress")
    currentOrder: "asc" // Текущий порядок сортировки ("asc" или "desc")
};

// sortMap для вызова функций сортировки
const sortMap = {
    name: { asc: sortByNameAsc, desc: sortByNameDesc },
    number: { asc: sortByNumberOfItemsAsc, desc: sortByNumberOfItemsDesc },
    progress: { asc: sortByProgressAsc, desc: sortByProgressDesc }
};

/* Добавить обработчики событий для всех ссылок в меню
sortByLinks.forEach(link => {
    link.addEventListener("click", event => {
        changeSortByText(event); // Изменить текст кнопки

        const sortKey = event.target.dataset.sort; // Получить ключ сортировки (например, "name", "number", "progress")

        if (sortMap[sortKey]) {
            // Установить текущий тип сортировки и порядок
            sortState.currentSortKey = sortKey;
            sortState.currentOrder = "asc"; // При выборе из меню всегда начинать с "asc"

            // Выполнить сортировку в порядке "asc"
            sortMap[sortKey]["asc"]();

            // Обновить функцию кнопки "sort-by"
            updateSortByButton();
        }
    });
});*/

sortByLinks.forEach(link => {
    link.addEventListener("click", event => {
        const sortKey = event.target.dataset.sort; // Получить ключ сортировки (например, "name", "number", "progress")

        if (sortMap[sortKey]) {
            if (sortState.currentSortKey === sortKey) {
                // Если пользователь выбрал уже активную сортировку — просто сменить направление
                const nextOrder = sortState.currentOrder === "asc" ? "desc" : "asc";
                sortState.currentOrder = nextOrder;
                sortMap[sortKey][nextOrder]();
            } else {
                // Новый тип сортировки
                sortState.currentSortKey = sortKey;
                sortState.currentOrder = "asc";
                sortMap[sortKey]["asc"]();
            }

            // Обновить текст кнопки
            updateSortByButton();
        }
    });
});


/* Обработчик для кнопки "sort-by"
document.getElementById("sort-by").addEventListener("click", () => {
    if (sortState.currentSortKey) {
        // Переключить порядок сортировки
        const currentOrder = sortState.currentOrder;
        const nextOrder = currentOrder === "asc" ? "desc" : "asc";

        // Выполнить сортировку
        sortMap[sortState.currentSortKey][nextOrder]();

        // Обновить состояние
        sortState.currentOrder = nextOrder;

        // Обновить текст кнопки
        updateSortByButton();
    }
});*/

document.getElementById("sort-by").addEventListener("click", () => {
    if (sortState.currentSortKey) {
        const currentOrder = sortState.currentOrder;
        const nextOrder = currentOrder === "asc" ? "desc" : "asc";
        sortMap[sortState.currentSortKey][nextOrder]();
        sortState.currentOrder = nextOrder;
        updateSortByButton();
    }
});
/* Функция для обновления текста кнопки "sort-by"
function updateSortByButton() {
    const dropdown = document.getElementById("sort-by");
    dropdown.innerHTML = `Sort by: ${sortState.currentSortKey} (${sortState.currentOrder})`;
}*/

// Функция для обновления текста кнопки "sort-by"
function updateSortByButton() {
    const dropdown = document.getElementById("sort-by");

    // Преобразуем первую букву sortKey в верхний регистр
    const capitalizedKey = sortState.currentSortKey.charAt(0).toUpperCase() + sortState.currentSortKey.slice(1);

    // Выбираем иконку в зависимости от порядка сортировки
    const orderIcon = sortState.currentOrder === "asc"
        ? '<i class="bi bi-arrow-up"></i>'
        : '<i class="bi bi-arrow-down"></i>';

    dropdown.innerHTML = `Sort by: ${capitalizedKey} ${orderIcon}`;
}


// При загрузке страницы сразу обновляем текст кнопки
window.addEventListener("DOMContentLoaded", () => {
    sortState.currentSortKey = "name";
    sortState.currentOrder = "asc";
    updateSortByButton(); // Обновляем текст кнопки сразу
});

// Применяем сортировку при первом скролле
let hasSortedOnScroll = false;

window.addEventListener("scroll", () => {
    if (!hasSortedOnScroll) {
        sortByNameAsc();
        hasSortedOnScroll = true;
    }
});

