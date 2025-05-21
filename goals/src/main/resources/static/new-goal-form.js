/*Sidebar - show it*/
function openNewGoalForm(){
    document.getElementById("newGoalSidepanel").style.display = 'block'; 
    document.getElementById("overlay").style.display = "block";
    document.querySelector("body").style.overflow = 'hidden'; // Prevent scrolling of the body when the side panel is open
    document.querySelector("header").style.display = 'none'; 
}

/*Sidebar - hide it*/
function closeNewGoalForm() {
    document.getElementById("newGoalSidepanel").style.display = 'none';
    document.getElementById("overlay").style.display = "none";
    document.querySelector("body").style.overflow = 'visible'; // Prevent scrolling of the body when the side panel is open
    document.querySelector("header").style.display = 'flex'; 
  }

const newGoalButton = document.querySelector("#new-goal");
const closeButton = document.querySelector("#close-new-goal-sidepanel"); // find the close button
newGoalButton.addEventListener("click", event => {
    openNewGoalForm();
    });

    closeButton.addEventListener("click", event => {
        closeNewGoalForm();
    });