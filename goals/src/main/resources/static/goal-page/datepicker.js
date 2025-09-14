document.addEventListener("DOMContentLoaded", () => {
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const calendarWrapper = document.querySelector(".calendar-wrapper");
  const monthSelect = document.querySelector(".month");
  const yearInput = document.querySelector(".year");
  const daysContainer = document.querySelector(".calendar-days");
  const prevBtn = document.querySelector(".nav.prev");
  const nextBtn = document.querySelector(".nav.next");
  const dueBtn = document.getElementById("due-toggle"); // ✅ совпадает с твоей кнопкой
  const dueText = document.querySelector("#due-text");

  // Заполняем селект месяцами
  monthNames.forEach(m => {
    const opt = document.createElement("option");
    opt.textContent = m;
    monthSelect.appendChild(opt);
  });

  function renderCalendar() {
    const year = parseInt(yearInput.value, 10);
    const month = monthNames.indexOf(monthSelect.value);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = (firstDay.getDay() + 6) % 7; // чтобы неделя начиналась с Пн
    const totalDays = lastDay.getDate();

    daysContainer.innerHTML = "";

    // Дни предыдущего месяца
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const span = document.createElement("span");
      span.className = "day prev";
      span.textContent = prevMonthLastDay - i;
      daysContainer.appendChild(span);
    }

    // Дни текущего месяца
    for (let d = 1; d <= totalDays; d++) {
      const span = document.createElement("span");
      span.className = "day";
      span.textContent = d;
      span.addEventListener("click", () => {
        const selectedDate = new Date(year, month, d);
        const formatted = selectedDate.toLocaleDateString("sv-SE"); // YYYY-MM-DD
        dueText.textContent = formatted;
        calendarWrapper.style.display = "none";
      });
      daysContainer.appendChild(span);
    }

    // Дни следующего месяца (чтобы было 6 рядов)
    const remaining = 42 - daysContainer.childNodes.length;
    for (let d = 1; d <= remaining; d++) {
      const span = document.createElement("span");
      span.className = "day next";
      span.textContent = d;
      daysContainer.appendChild(span);
    }
  }

  // Переключение месяцев
  prevBtn.addEventListener("click", () => {
    let idx = monthNames.indexOf(monthSelect.value);
    let y = parseInt(yearInput.value, 10);
    idx--; if (idx < 0) { idx = 11; y--; }
    monthSelect.value = monthNames[idx];
    yearInput.value = y;
    renderCalendar();
  });

  nextBtn.addEventListener("click", () => {
    let idx = monthNames.indexOf(monthSelect.value);
    let y = parseInt(yearInput.value, 10);
    idx++; if (idx > 11) { idx = 0; y++; }
    monthSelect.value = monthNames[idx];
    yearInput.value = y;
    renderCalendar();
  });

  monthSelect.addEventListener("change", renderCalendar);
  yearInput.addEventListener("input", renderCalendar);

  // Открытие календаря с авто-подстройкой
  dueBtn.addEventListener("click", () => {
    calendarWrapper.style.display = calendarWrapper.style.display === "none" ? "block" : "none";

    if (calendarWrapper.style.display === "block") {
      const rect = dueBtn.getBoundingClientRect();
      const calWidth = calendarWrapper.offsetWidth;
      const viewportWidth = window.innerWidth;

      // позиция по умолчанию
      calendarWrapper.style.top = rect.bottom + "px";
      calendarWrapper.style.left = rect.left + "px";

      // если не влезает вправо → сдвигаем влево
      if (rect.left + calWidth > viewportWidth) {
        calendarWrapper.style.left = (viewportWidth - calWidth - 10) + "px";
      }

      renderCalendar();
    }
  });

  // Первый запуск
  monthSelect.value = monthNames[new Date().getMonth()];
  yearInput.value = new Date().getFullYear();
  renderCalendar();
});
