function initCircularProgress() {
    const progressContainers = document.querySelectorAll('.circular-progress-container');

    function updateProgress(container, targetValue) {
        const progressText = container.querySelector('.circular-progress-text');
        const progressSvg = container.querySelector('.circular-progress');
        const fgCircle = progressSvg.querySelector('.fg');
        let progress = 0;

        function animateProgress() {
            if (progress >= targetValue) {
                progressText.textContent = `${targetValue}%`;

                if (progress === 100) {
                    fgCircle.style.stroke = '#74C857'; // Обводка круга
                    progressText.style.color = '#74C857'; // Цвет текста
                }

                return;
            }

            progress += 1;
            progressSvg.style.setProperty('--progress', progress);
            progressText.textContent = `${progress}%`;
            setTimeout(animateProgress, 10);
        }

        animateProgress();
    }

    progressContainers.forEach((container) => {
        const targetValue = parseInt(container.getAttribute('data-target'), 10) || 0;
        updateProgress(container, targetValue);
    });
}
