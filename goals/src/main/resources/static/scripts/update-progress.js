function replaceAfterClick(originalElement, originalValue, type, name, className) {
    if (originalElement) {
        originalElement.addEventListener("click", () => replace(originalElement, originalValue, type, name, className));
    }
}

const modals = document.querySelectorAll(".targetProgressModal");
modals.forEach(modal => {
    const currentSpan = modal.querySelector(".current-value");
    const startSpan = modal.querySelector(".start-value");
    const unitSpan = modal.querySelector(".unit");
    const targetSpan = modal.querySelector(".target-value");

    let originalCurrentValue = currentSpan?.textContent.trim();
    let originalStartValue = startSpan?.textContent.trim();
    let originalUnitText = unitSpan?.textContent.trim();
    let originalTargetValue = targetSpan?.textContent.trim();

    replaceAfterClick(currentSpan, originalCurrentValue, "number", "current", "current-input");
    replaceAfterClick(startSpan, originalStartValue, "number", "start", "start-input");
    replaceAfterClick(unitSpan, originalUnitText, "text", "unit", "unit-input");
    replaceAfterClick(targetSpan, originalTargetValue, "number", "target", "target-input");
});

function replace(originalElement, originalValue, type, name, className) {
    const inputToReplaceElement = document.createElement("input");
    inputToReplaceElement.type = type;
    inputToReplaceElement.name = name;
    inputToReplaceElement.className = className;

    if (inputToReplaceElement.type === "number") {
        inputToReplaceElement.step = "any";
    }

    // Take the last saved value (if any), otherwise - originalValue
    inputToReplaceElement.value = originalElement.dataset.lastValue || originalValue;

    originalElement.replaceWith(inputToReplaceElement);
    inputToReplaceElement.focus();

    inputToReplaceElement.addEventListener("blur", () => {
        const newValue = inputToReplaceElement.value;
        originalElement.textContent = newValue;

        // Save the new value to the dataset attribute
        originalElement.dataset.lastValue = newValue;

        const inputHidden = document.createElement("input");
        inputHidden.type = "hidden";
        inputHidden.name = name;
        inputHidden.className = className;
        inputHidden.value = newValue;

        inputToReplaceElement.replaceWith(originalElement);
        originalElement.after(inputHidden);
    });
}