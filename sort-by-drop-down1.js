
const sortByLinks = document.querySelectorAll(".dropdown-content a");//find all the links in the dropdown menu
//change the text of the "Sort by: ..." button when the user clicks on a link in the dropdown menu
function changeSortByText(event) {
    const dropdown = document.getElementById("sort-by");
    const clickedLink = event.target; //Get the element clicked by the user
    dropdown.innerHTML = "Sort by: " + clickedLink.textContent; //Extract the link text and paste it into the button 
}

//Sorting ascending and descending by name
function sortByNameAsc() {
    //Find all elements (in my case p for goals and button for folders) with class "name" and their parent cards
    const foldersAndGoals = Array.from(document.getElementsByClassName("name")).map(element => ({
        name: element.textContent.trim(), //Extract text content and remove extra spaces with trim()
        card: element.parentElement, //Save parent item (card)
        isFolder: element.parentElement.classList.contains("folder") //Check if the parent item is a folder
    }));

    //Sort an array of objects by name (in this case by text content of the element with class "name")
    //foldersAndGoals.sort((a, b) => a.name.localeCompare(b.name));
    foldersAndGoals.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1; //Folders go first
        if (!a.isFolder && b.isFolder) return 1;  //Goals go second
        return a.name.localeCompare(b.name);      //Sort by name
    });

    //Find the container that holds the cards (in my case it is a div with class "cards" and id "cardsContainer")
    const cardsContainer = document.getElementById("cardsContainer"); // Замените ".container" на ваш реальный класс/селектор контейнера

    //Insert cards in the container in a new order
    foldersAndGoals.forEach(item => {
        cardsContainer.appendChild(item.card);
    });
}

function sortByNameDesc() {
    //Find all elements (in my case p for goals and button for folders) with class "name" and their parent cards
    const foldersAndGoals = Array.from(document.getElementsByClassName("name")).map(element => ({
        name: element.textContent.trim(), //Extract text content and remove extra spaces with trim()
        card: element.parentElement, //Save parent item (card)
        isFolder: element.parentElement.classList.contains("folder") //Check if the parent item is a folder
    }));

    //Sort an array of objects by name (in this case by text content of the element with class "name")
    //foldersAndGoals.sort((a, b) => a.name.localeCompare(b.name));
    foldersAndGoals.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1; //Folders go first
        if (!a.isFolder && b.isFolder) return 1;  //Goals go second
        return b.name.localeCompare(a.name);      //Sort by name
    });

    //Find the container that holds the cards (in my case it is a div with class "cards" and id "cardsContainer")
    const cardsContainer = document.getElementById("cardsContainer"); // Замените ".container" на ваш реальный класс/селектор контейнера

    //Insert cards in the container in a new order
    foldersAndGoals.forEach(item => {
        cardsContainer.appendChild(item.card);
    });
}

//Sorting ascending and descending by number of items inside the folder/goal
function sortByNumberOfItemsAsc() {
    //Find all elements (in my case p for goals and button for folders) with class "number" and their parent cards
    const foldersAndGoals = Array.from(document.getElementsByClassName("number")).map(element => ({
        number: parseInt(element.textContent.trim(), 10), //Take the number from the text content and convert it to an integer
        card: element.parentElement, //Save parent item (card)
        isFolder: element.parentElement.classList.contains("folder") //Check if the parent item is a folder
    }));

    //Sort an array of objects by name (in this case by text content of the element with class "number")
    foldersAndGoals.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1; //Folders go first
        if (!a.isFolder && b.isFolder) return 1;  //Goals go second
        return a.number - b.number;               //Sort by number
    });

    //Find the container that holds the cards (in my case it is a div with class "cards" and id "cardsContainer")
    const cardsContainer = document.getElementById("cardsContainer"); // Замените ".container" на ваш реальный класс/селектор контейнера

    //Insert cards in the container in a new order
    foldersAndGoals.forEach(item => {
        cardsContainer.appendChild(item.card);
    });
}

function sortByNumberOfItemsDesc() {
    //Find all elements (in my case p for goals and button for folders) with class "number" and their parent cards
    const foldersAndGoals = Array.from(document.getElementsByClassName("number")).map(element => ({
        number: parseInt(element.textContent.trim(), 10), //Take the number from the text content and convert it to an integer
        card: element.parentElement, //Save parent item (card)
        isFolder: element.parentElement.classList.contains("folder") //Check if the parent item is a folder
    }));

    //Sort an array of objects by name (in this case by text content of the element with class "number")
    foldersAndGoals.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1; //Folders go first
        if (!a.isFolder && b.isFolder) return 1;  //Goals go second
        return b.number - a.number;               //Sort by number
    });

    //Find the container that holds the cards (in my case it is a div with class "cards" and id "cardsContainer")
    const cardsContainer = document.getElementById("cardsContainer"); // Замените ".container" на ваш реальный класс/селектор контейнера

    //Insert cards in the container in a new order
    foldersAndGoals.forEach(item => {
        cardsContainer.appendChild(item.card);
    });
}

//Sorting goals ascending and descending by progress
function sortByProgressAsc() {
    //Find all circular-progress-texts
    const foldersAndGoals = Array.from(document.getElementsByClassName("circular-progress-text")).map(element => ({
        progress: parseFloat(element.textContent.trim().replace('%', '')),//Take the text from the circular-progress-text content 
        card: element.parentElement.parentElement, //Save parent item (card)
        isGoal: element.parentElement.parentElement.classList.contains("goal") //Check if the parent item is a goal
    }));

    //Sort an array of objects by name (in this case by text content of the element with class "number")
    foldersAndGoals.sort((a, b) => {
        if (a.isGoal && !b.isGoal) return -1;   //Folders go second
        if (!a.isGoal && b.isGoal) return 1;  //Goals go first
        return a.progress - b.progress;            //Sort by progress
    });

    //Find the container that holds the cards (in my case it is a div with class "cards" and id "cardsContainer")
    const cardsContainer = document.getElementById("cardsContainer"); // Замените ".container" на ваш реальный класс/селектор контейнера

    //Insert cards in the container in a new order
    foldersAndGoals.forEach(item => {
        cardsContainer.appendChild(item.card);
    });
}

function sortByProgressDesc() {
    //Find all circular-progress-texts
    const foldersAndGoals = Array.from(document.getElementsByClassName("circular-progress-text")).map(element => ({
        progress: parseFloat(element.textContent.trim().replace('%', '')),//Take the text from the circular-progress-text content 
        card: element.parentElement.parentElement, //Save parent item (card)
        isGoal: element.parentElement.parentElement.classList.contains("goal") //Check if the parent item is a goal
    }));

    //Sort an array of objects by name (in this case by text content of the element with class "number")
    foldersAndGoals.sort((a, b) => {
        if (a.isGoal && !b.isGoal) return -1;   //Folders go second
        if (!a.isGoal && b.isGoal) return 1;  //Goals go first
        return b.progress - a.progress;            //Sort by progress
    });

    //Find the container that holds the cards (in my case it is a div with class "cards" and id "cardsContainer")
    const cardsContainer = document.getElementById("cardsContainer"); // Замените ".container" на ваш реальный класс/селектор контейнера

    //Insert cards in the container in a new order
    foldersAndGoals.forEach(item => {
        cardsContainer.appendChild(item.card);
    });
}


  sortByLinks.forEach(link => {
    link.addEventListener("click", event => {
        changeSortByText(event); //Change the text of the button
        
         //Identify which menu item has been clicked
         const clickedText = event.target.textContent.trim();
         const clickedHTML = event.target.innerHTML.trim(); //Get the HTML of the clicked link

         if (clickedText === "Name A-Z") {
             sortByNameAsc(); 
         } else if (clickedText === "Name Z-A") {
             sortByNameDesc(); 
         } else if (clickedHTML === 'Number of items <i class="bi bi-arrow-up"></i>') {
            sortByNumberOfItemsAsc();
        } else if (clickedHTML === 'Number of items <i class="bi bi-arrow-down"></i>') {
            sortByNumberOfItemsDesc(); 
        }else if (clickedHTML === 'Progress <i class="bi bi-arrow-up"></i>') {
            sortByProgressAsc();
        } else if (clickedHTML === 'Progress <i class="bi bi-arrow-down"></i>') {
            sortByProgressDesc(); 
        }
    });
});