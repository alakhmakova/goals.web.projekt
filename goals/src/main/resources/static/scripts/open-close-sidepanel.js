/*Sidebar - show it*/
function open(){
    document.querySelector(".sidepanel").style.display = 'block';
    document.querySelector("#overlay").style.display = "block";
    document.querySelector("body").style.overflow = 'hidden'; // Prevent scrolling of the body when the side panel is open
    document.querySelector("header").style.display = 'none';
}

/*Sidebar - hide it*/
function close() {
    document.querySelector(".sidepanel").style.display = 'none';
    document.querySelector("#overlay").style.display = "none";
    document.querySelector("body").style.overflow = 'visible'; // Prevent scrolling of the body when the side panel is open
    document.querySelector("header").style.display = 'flex';
}

const newGoalButton = document.querySelector(".new-goal");
const openButton = document.querySelector(".open-sidepanel"); // find the open button
const closeButton = document.querySelector("#close-sidepanel"); // find the close button
openButton.addEventListener("click", event => {
    open();
    console.log("The form is opened")
});

closeButton.addEventListener("click", event => {
    close();
});