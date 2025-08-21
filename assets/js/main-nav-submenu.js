document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".main-nav__menu");
  if (!menu) return;

  function closeAll() {
    menu.querySelectorAll(".has-submenu.is-open").forEach((li) => {
      li.classList.remove("is-open");
      const btn = li.querySelector(".main-nav__disclosure[aria-expanded]");
      const box = li.querySelector(".nav-submenu");
      if (btn) btn.setAttribute("aria-expanded", "false");
      if (box) box.hidden = true;
    });
  }

  // клик по верхнему пункту (кнопке)
  menu.addEventListener("click", (e) => {
    const btn = e.target.closest(".main-nav__disclosure");
    if (!btn) {
      // клик по ссылке внутри подменю — закрываем всё и даём перейти
      if (e.target.closest(".nav-submenu__link")) closeAll();
      return;
    }

    e.preventDefault();
    const li = btn.closest(".has-submenu");
    const box = li.querySelector(".nav-submenu");
    const willOpen = !li.classList.contains("is-open");

    closeAll();
    if (willOpen && box) {
      li.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      box.hidden = false;
    }
  });

  // закрытие по клику вне меню
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".main-nav")) closeAll();
  });

  // закрытие по Esc, при resize/scroll
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
  window.addEventListener("resize", closeAll);
  window.addEventListener("scroll", closeAll, { passive: true });
});
