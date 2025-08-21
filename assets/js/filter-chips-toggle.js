// // клики по чипам внутри .tour-catalog__filters
// document.addEventListener("click", (e) => {
//   const chip = e.target.closest(".filter-chip");
//   if (!chip) return;

//   const group = chip.closest(".tour-catalog__filters");
//   if (!group) return;

//   // если уже активен — ничего не делаем
//   if (chip.classList.contains("is-active")) return;

//   // снимаем active со всех в группе
//   group.querySelectorAll(".filter-chip.is-active").forEach((el) => {
//     el.classList.remove("is-active");
//     el.setAttribute("aria-pressed", "false"); // для a11y; можно убрать
//   });

//   // активируем кликнутый
//   chip.classList.add("is-active");
//   chip.setAttribute("aria-pressed", "true"); // для a11y; можно убрать
// });

// Единый обработчик для всех групп чипов на странице
document.addEventListener("click", (e) => {
  const chip = e.target.closest(".filter-chip");
  if (!chip) return;

  // ✅ Ищем контейнер группы: новый способ (data-атрибут) + старый класс для совместимости
  const group = chip.closest(
    "[data-chip-group], .tour-catalog__filters, .team__filters"
  );
  if (!group) return;

  // Если уже активен — ничего не делаем
  if (chip.classList.contains("is-active")) return;

  // Снимаем active со всех в этой группе
  group.querySelectorAll(".filter-chip.is-active").forEach((el) => {
    el.classList.remove("is-active");
    el.setAttribute("aria-pressed", "false"); // a11y
  });

  // Активируем кликнутый
  chip.classList.add("is-active");
  chip.setAttribute("aria-pressed", "true"); // a11y
});
