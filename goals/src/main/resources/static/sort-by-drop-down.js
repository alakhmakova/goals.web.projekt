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
        selector: "items",
        keyExtractor: el => parseInt(el.textContent.trim(), 10),
        isFolderCheck: true,
        order: "asc"
    });
}
function sortByNumberOfItemsDesc() {
    sortCards({
        selector: "items",
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


//Object for tracking the current status of the sorting
const sortState = {
    currentSortKey: null, // The current sorting key (e.g, "name", "items", "progress")
    currentOrder: "asc" // Current sort order ("asc" or "desc")
};

// sortMap to call sorting functions
const sortMap = {
    name: { asc: sortByNameAsc, desc: sortByNameDesc },
    items: { asc: sortByNumberOfItemsAsc, desc: sortByNumberOfItemsDesc },
    progress: { asc: sortByProgressAsc, desc: sortByProgressDesc }
};

/* Добавить обработчики событий для всех ссылок в меню
sortByLinks.forEach(link => {
    link.addEventListener("click", event => {
        changeSortByText(event); // Изменить текст кнопки

        const sortKey = event.target.dataset.sort; // Получить ключ сортировки (например, "name", "items", "progress")

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
        const sortKey = event.target.dataset.sort; // Получить ключ сортировки (например, "name", "items", "progress")

        if (sortMap[sortKey]) {
            if (sortState.currentSortKey === sortKey) {
                //If the user has selected an already active sorting - change direction
                const nextOrder = sortState.currentOrder === "asc" ? "desc" : "asc";
                sortState.currentOrder = nextOrder;
                sortMap[sortKey][nextOrder]();
            } else {
                //New sorting type
                sortState.currentSortKey = sortKey;
                sortState.currentOrder = "asc";
                sortMap[sortKey]["asc"]();
            }

            //Update the text of the button
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

//Function for updating the button text "sort-by"
function updateSortByButton() {
    const dropdown = document.getElementById("sort-by");

    // Определяем, нужно ли отображать только иконки
    const isSmallScreen = window.innerWidth < 1450;

    //Convert the first letter of sortKey to upper case
    const capitalizedKey = sortState.currentSortKey.charAt(0).toUpperCase() + sortState.currentSortKey.slice(1);

    //Select an icon depending on the sorting order
    const orderIcon = sortState.currentOrder === "asc"
        ? '<i class="bi bi-sort-up"></i>'
        : '<i class="bi bi-sort-down"></i>';

        if (isSmallScreen) {
            // Если экран меньше 1450px, отображаем только иконки
            dropdown.innerHTML = orderIcon;
        } else {
            // Если экран больше или равен 1450px, отображаем текст и иконки
            const capitalizedKey = sortState.currentSortKey.charAt(0).toUpperCase() + sortState.currentSortKey.slice(1);
            dropdown.innerHTML = `Sort by: ${capitalizedKey} ${orderIcon}`;
        }

    //dropdown.innerHTML = `Sort by: ${capitalizedKey} ${orderIcon}`;
}


//When the page loads, we immediately update the button text
window.addEventListener("DOMContentLoaded", () => {
    sortState.currentSortKey = "name";
    sortState.currentOrder = "asc";
    updateSortByButton(); // Обновляем текст кнопки сразу
});

// Обновляем кнопку при изменении размера окна
window.addEventListener("resize", updateSortByButton);

//Apply sorting on the first scroll
let hasSortedOnScroll = false;

window.addEventListener("scroll", () => {
    if (!hasSortedOnScroll) {
        sortByNameAsc();
        hasSortedOnScroll = true;
    }
});

