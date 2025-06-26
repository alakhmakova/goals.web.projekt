
    document.addEventListener("DOMContentLoaded", () => {
    const textarea = document.querySelector(".goal-desc");
    const goalInfo = document.querySelector(".goal-info-container");
    const goalContent = document.querySelector(".goal-content");

    if (!textarea || !goalInfo || !goalContent) return;

    let previousHeight = textarea.offsetHeight;

    const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
    const currentHeight = entry.target.offsetHeight;
    const delta = currentHeight - previousHeight;

    // Updating the height of the .goal-info-container
    goalInfo.style.height = (goalInfo.offsetHeight + delta) + 'px';

    // Смещаем goal-content вниз/вверх
    const currentMargin = parseFloat(getComputedStyle(goalContent).marginTop) || 0;
    goalContent.style.marginTop = (currentMargin + delta/2) + 'px';

    // Обновляем предыдущее значение
    previousHeight = currentHeight;
}
});

    observer.observe(textarea);
});

