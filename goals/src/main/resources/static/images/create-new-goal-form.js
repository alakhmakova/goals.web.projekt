const form = document.getElementById('goal-page');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    //collects data from the HTML form
    const formData = new FormData(form);
    //creates a FormData object containing all fields of the specified form
    const goal = Object.fromEntries(formData.entries());

    const response = await fetch('http://localhost:8080/api/goals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(goal),
    });

    if (response.ok) {
        const updatedGoals = await response.json();
        console.log('Updated goals list:', updatedGoals);
        // Update the interface with the new goal list
    } else {
        console.error('Error when creating a goal:', response.statusText);
    }
});