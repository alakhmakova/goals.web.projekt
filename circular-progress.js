    //Find all elements with the class .circular-progress
    const progressContainers = document.querySelectorAll('.circular-progress-container');

    //Function for updating progress
    function updateProgress(container, targetValue) {
        const progressCircle = container.querySelector('.circular-progress');
        const progressText = container.querySelector('.circular-progress-text');
        let progress = 0;

        function animateProgress() {
            if (progress >= targetValue) {
                progressText.textContent = `${targetValue}%`; //Let's make sure the text shows the target value
                //return; //Stop function execution
                // Изменяем цвет текста и обводки при достижении 100%
            if (progress === 100) {
                progressCircle.style.stroke = '#74C857'; // Новый цвет обводки
                progressText.style.color = '#74C857'; // Новый цвет текста
            }
            return; // Останавливаем выполнение функции
            }

            progress += 1;

            //Update CSS variable --progress
            progressCircle.style.setProperty('--progress', progress);

            //Updating the text in the centre of the circle
            progressText.textContent = `${progress}%`;

            //Run an update every 50 ms
            setTimeout(animateProgress, 10);/*time between each increment of the progress value*/
        }

        //Starting the animation
        animateProgress();
    }

    //Run progress for each item
    progressContainers.forEach((container) => {
        //Get the target value from the data attribute (e.g. data-target=‘75’)
        const targetValue = parseInt(container.getAttribute('data-target'), 10) || 100; //Default 100%
        updateProgress(container, targetValue);
    });