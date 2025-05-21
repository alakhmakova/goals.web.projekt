function openSPA() {
    const targetPage = this.getAttribute('data-page');
    document.getElementById(`${targetPage}-page`).classList.add('active');
    document.querySelector("header").style.display = 'none';
}

const submitButton = document.querySelector('input[data-button="submit"]');

submitButton.addEventListener("click", function(event) {
    event.preventDefault(); //prevents form submission and page reloading
    openSPA.call(this);     //pass the button context to openSPA
});