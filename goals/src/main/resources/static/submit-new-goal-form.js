document.querySelector("#newGoalSidepanel form").addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("The form has been successfully submitted"); // Debugging

    const data = {
        text: document.getElementById("goalname").value,
        date: document.getElementById("date").value,
        description: document.getElementById("description").value,
        sharedWith: [document.getElementById("sharedWith").value],
        type: "goal",
        progressTarget: 0,
        button: "0 targets",
        inFolder: "",
        owner: "",
        targets: [],
    };

    console.log("Data to be sent:", data); // Debugging

    fetch("/api/goals", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            console.log("Server response:", response); // Debugging
            if (response.ok) {
                alert("Goal has been successfully created!");
            } else {
                alert("Error creating goal");
            }
        })
        .catch((error) => {
            console.error("Fetch error:", error); // Debugging
        });
});