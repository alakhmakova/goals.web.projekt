
// Find the container which displays the cards <div class="cards" id="cardsContainer"></div>
const cardsContainer = document.getElementById("cardsContainer");

// Fetch data
fetch("cards.json")
  .then(response => response.json())
  .then(data => {
    //If the "cards" array is empty, an error should be generated
    if (!data.cards || data.cards.length === 0) {
        cardsContainer.innerHTML = `<p class="empty">🔍 No cards found</p>`;
        return;
      }
    myDisplay(data);
    initCircularProgress();
    
  })
  .catch(error => {
    console.error('Error when loading JSON:', error);
    cardsContainer.innerHTML = `<p class="error">⚠️ Failed to load your goals and folders</p>`;
  });

  //Define myDisplay(y) function
  function myDisplay(data) {
    data.cards.forEach(card => {

        if (card.type === "folder") {
            //add this code to an empty container
            cardsContainer.innerHTML += `
                <div class="card folder" id="${card.id}">
                    <img src="${card.img}" class="card-icon" alt="${card.alt}" title="${card.title}">
                    <p class="card-text">${card.text}</p>
                    <button class="card-button">${card.button}<i class="bi bi-chevron-compact-right" style="font-size: 13px;"></i></button>
                </div>
            `;
        } else if (card.type === "goal") {
           //add this code to an empty container
            cardsContainer.innerHTML += `
                <div class="card goal" id="${card.id}">
                    <div class="card-icon circular-progress-container" data-target="${card.progressTarget}">
                        <svg width="8rem" height="8rem" viewBox="0 0 250 250" class="circular-progress">
                            <circle class="bg"></circle>
                            <circle class="fg"></circle>
                        </svg>
                        <div class="circular-progress-text">0%</div>
                    </div>
                    <p class="card-text">${card.text}</p>
                    <button class="card-button"><i class="bi bi-crosshair2"></i> ${card.button}</button>
                </div>
            `;
        }


    })
  }


