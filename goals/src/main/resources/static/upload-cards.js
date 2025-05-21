const cardsContainer = document.getElementById("cardsContainer");

// Receive data from two APIs
Promise.all([
    fetch("/api/goals").then(res => res.json()),
    fetch("/api/folders").then(res => res.json())
])
    .then(([goals, folders]) => {
        // Merge data into one array
        const allCards = [
            ...folders.map(folder => ({ ...folder, type: "folder" })),
            ...goals.map(goal => ({ ...goal, type: "goal" }))
        ];

        if (allCards.length === 0) {
            cardsContainer.innerHTML = `<p class="empty">🔍 No cards found</p>`;
            return;
        }

        myDisplay({ cards: allCards });
        initCircularProgress();
    })
    .catch(error => {
        console.error('Error when loading JSON:', error);
        cardsContainer.innerHTML = `<p class="error">⚠️ Failed to load your goals and folders</p>`;
    });

function myDisplay(data) {
    data.cards.forEach(card => {
        if (card.type === "folder") {
            cardsContainer.innerHTML += `
                <div class="card folder" data-folder-id="${card.id}">
                    <img src="${card.img}" class="card-icon">
                    <div class="card-text items">${card.text}</div>
                    <button class="card-button name">${card.button}<i class="bi bi-chevron-right"></i></button>
                </div>
            `;
        } else if (card.type === "goal") {
            cardsContainer.innerHTML += `
                <div class="card goal" draggable="true">
                    <div class="card-icon circular-progress-container" data-target="${card.progressTarget}">
                        <svg viewBox="0 0 250 250" class="circular-progress">
                            <circle class="bg"></circle>
                            <circle class="fg"></circle>
                        </svg>
                        <div class="circular-progress-text">0%</div>
                    </div>
                    <div class="card-text name">${card.text}</div>
                    <button class="card-button items"><i class="bi bi-crosshair2"></i> ${card.button}</button>
                </div>
            `;
        }
    });
}
