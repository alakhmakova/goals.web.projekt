/*function hideFolders() {
    const folders = document.getElementsByClassName('folder');//get all folders
    for (let i = 0; i < folders.length; i++) {
        folders[i].style.display = 'none';//loop to hide all folders
    }
    //in case of display = 'none' the space will be freed for the neighbouring element
    //element.style.visibility = 'hidden';//in this case the space will remain empty
}*/
function hideFolders() {
    const folders = document.querySelectorAll('.folder'); // get all folders
    folders.forEach(folder => {
        folder.style.display = 'none'; // loop to hide all folders
    });
}
function hideGoals() {
    const goals = document.querySelectorAll('.goal'); // get all goals
    goals.forEach(goal => {
        goal.style.display = 'none'; // loop to hide all goals
    });
}

function makeFoldersShowVisible() {
    const hideButton = document.querySelector('#folders-hide'); // find the hide button
    const showButton = document.querySelector('#folders-show');// find the show button
    hideButton.style.display = 'none';// hide the hide button
    showButton.style.display = 'block'; // make the show button visible
}
function makeGoalsShowVisible() {
    const hideButton = document.querySelector('#goals-hide'); // find the hide button
    const showButton = document.querySelector('#goals-show');
    hideButton.style.display = 'none';
    showButton.style.display = 'block'; 
}

function makeFoldersHideVisible() {
    const hideButton = document.querySelector('#folders-hide'); // find the hide button
    const showButton = document.querySelector('#folders-show');// find the show button
    hideButton.style.display = 'block';// hide the hide button
    showButton.style.display = 'none'; // make the show button visible
}
function makeGoalsHideVisible() {
    const hideButton = document.querySelector('#goals-hide'); // find the hide button
    const showButton = document.querySelector('#goals-show');
    hideButton.style.display = 'block';
    showButton.style.display = 'none'; 
}

function showFolders() {
    const folders = document.querySelectorAll('.folder'); // get all folders
    folders.forEach(folder => {
        folder.style.display = 'block'; // loop to show all folders
    });
}

function showGoals() {
    const goals = document.querySelectorAll('.goal'); // get all goals
    goals.forEach(goal => {
        goal.style.display = 'block'; // loop to show all goals
    });
}