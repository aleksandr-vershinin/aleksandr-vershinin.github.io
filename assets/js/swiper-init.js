// assets/js/swiper-init.js
document.addEventListener("DOMContentLoaded", () => {
  // === MAIN SLIDER ===
  if (document.querySelector(".main-slider__image-wrapper")) {
    new Swiper(".main-slider__image-wrapper", {
      wrapperClass: "main-slider__track",
      slideClass: "main-slider__slide",
      slideActiveClass: "is-active",
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 350,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      navigation: {
        nextEl: ".main-slider__arrow--next",
        prevEl: ".main-slider__arrow--prev",
        disabledClass: "is-disabled",
      },
      pagination: {
        el: ".main-slider__pagination",
        clickable: true,
        bulletClass: "main-slider__dot",
        bulletActiveClass: "is-active",
        renderBullet: (i, cls) =>
          `<span class="${cls}" aria-label="Слайд ${i + 1}"></span>`,
      },
    });
  }

  // === REVIEWS SLIDER ===
  if (document.querySelector(".reviews-slider__image-wrapper")) {
    new Swiper(".reviews-slider__image-wrapper", {
      wrapperClass: "reviews-slider__track",
      slideClass: "reviews-slider__slide",
      slidesPerView: "auto",
      spaceBetween: 20, // gap в CSS = 0
      speed: 350,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      navigation: {
        nextEl: ".reviews-slider__arrow--next",
        prevEl: ".reviews-slider__arrow--prev",
        disabledClass: "is-disabled",
      },
      pagination: {
        el: ".reviews-slider__pagination",
        clickable: true,
        bulletClass: "reviews-slider__dot",
        bulletActiveClass: "is-active",
        renderBullet: (i, cls) =>
          `<span class="${cls}" aria-label="Слайд ${i + 1}"></span>`,
      },
    });
  }

  // === GALLERY SLIDERS ===
  document.querySelectorAll(".gallery-slider").forEach((root) => {
    const container = root.querySelector(".gallery-slider__image-wrapper");
    if (!container) return;

    const prevDesktop = root.querySelector(
      ".gallery-slider__arrow--prev.desktop-only"
    );
    const nextDesktop = root.querySelector(
      ".gallery-slider__arrow--next.desktop-only"
    );
    const prevMobile = root.querySelector(
      ".gallery-slider__arrow--prev:not(.desktop-only)"
    );
    const nextMobile = root.querySelector(
      ".gallery-slider__arrow--next:not(.desktop-only)"
    );
    const pagination = root.querySelector(".gallery-slider__pagination");

    const swiper = new Swiper(container, {
      wrapperClass: "gallery-slider__track",
      slideClass: "gallery-slider__slide",
      slideActiveClass: "is-active",
      slidesPerView: "auto",
      spaceBetween: 0, // отступы через CSS gap на __track
      speed: 350,
      observer: true,
      observeParents: true,
      watchOverflow: true,
      navigation: {
        prevEl:
          prevDesktop || root.querySelector(".gallery-slider__arrow--prev"),
        nextEl:
          nextDesktop || root.querySelector(".gallery-slider__arrow--next"),
        disabledClass: "is-disabled",
      },
      pagination: pagination
        ? {
            el: pagination,
            clickable: true,
            bulletClass: "gallery-slider__dot",
            bulletActiveClass: "is-active",
            renderBullet: (i, cls) =>
              `<span class="${cls}" aria-label="Слайд ${i + 1}"></span>`,
          }
        : undefined,
    });

    const syncDisabled = () => {
      if (prevMobile)
        prevMobile.classList.toggle("is-disabled", swiper.isBeginning);
      if (nextMobile) nextMobile.classList.toggle("is-disabled", swiper.isEnd);
    };

    syncDisabled();
    swiper.on("update", syncDisabled);
    swiper.on("resize", syncDisabled);
    swiper.on("slideChange", syncDisabled);
    swiper.on("reachBeginning", syncDisabled);
    swiper.on("reachEnd", syncDisabled);
    swiper.on("fromEdge", syncDisabled);

    prevMobile &&
      prevMobile.addEventListener("click", () => swiper.slidePrev());
    nextMobile &&
      nextMobile.addEventListener("click", () => swiper.slideNext());
  });

  // === FEATURES SLIDER (reason-cards) ===
  document.querySelectorAll(".features-slider").forEach((root) => {
    const container = root.querySelector(".features-slider__image-wrapper");
    if (!container) return;

    const prevDesktop = root.querySelector(
      ".features-slider__arrow--prev.desktop-only"
    );
    const nextDesktop = root.querySelector(
      ".features-slider__arrow--next.desktop-only"
    );
    const prevMobile = root.querySelector(
      ".features-slider__arrow--prev:not(.desktop-only)"
    );
    const nextMobile = root.querySelector(
      ".features-slider__arrow--next:not(.desktop-only)"
    );
    const pagination = root.querySelector(".features-slider__pagination");

    const swiper = new Swiper(container, {
      wrapperClass: "features-slider__track",
      slideClass: "features-slider__slide",
      slideActiveClass: "is-active",
      slidesPerView: "auto",
      spaceBetween: 20, // отступы между карточками
      speed: 350,
      observer: true,
      observeParents: true,
      watchOverflow: true,
      navigation: {
        prevEl:
          prevDesktop || root.querySelector(".features-slider__arrow--prev"),
        nextEl:
          nextDesktop || root.querySelector(".features-slider__arrow--next"),
        disabledClass: "is-disabled",
      },
      pagination: {
        el: pagination,
        clickable: true,
        bulletClass: "features-slider__dot",
        bulletActiveClass: "is-active",
        renderBullet: (i, cls) =>
          `<span class="${cls}" aria-label="Слайд ${i + 1}"></span>`,
      },
    });

    // ——— выравнивание высоты карточек ———
    const equalizeCards = () => {
      const cards = root.querySelectorAll(
        ".features-slider__slide > .reason-card"
      );
      if (!cards.length) return;
      let maxH = 0;
      cards.forEach((c) => {
        c.style.height = "auto";
        maxH = Math.max(maxH, c.offsetHeight);
      });
      cards.forEach((c) => {
        c.style.height = maxH + "px";
      });
    };

    equalizeCards();
    swiper.on("init", equalizeCards);
    swiper.on("update", equalizeCards);
    swiper.on("resize", equalizeCards);
    swiper.on("imagesReady", equalizeCards);
    window.addEventListener("load", equalizeCards);
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(equalizeCards);

    // мобильные стрелки: disabled-состояния и клики
    const syncDisabled = () => {
      if (prevMobile)
        prevMobile.classList.toggle("is-disabled", swiper.isBeginning);
      if (nextMobile) nextMobile.classList.toggle("is-disabled", swiper.isEnd);
    };
    syncDisabled();
    swiper.on("update", syncDisabled);
    swiper.on("resize", syncDisabled);
    swiper.on("slideChange", syncDisabled);
    swiper.on("reachBeginning", syncDisabled);
    swiper.on("reachEnd", syncDisabled);
    swiper.on("fromEdge", syncDisabled);

    prevMobile &&
      prevMobile.addEventListener("click", () => swiper.slidePrev());
    nextMobile &&
      nextMobile.addEventListener("click", () => swiper.slideNext());
  });

  // === CERTIFICATES SLIDER ===
  document.querySelectorAll(".certificates-slider").forEach((root) => {
    const container = root.querySelector(".certificates-slider__image-wrapper");
    if (!container) return;

    const prevDesktop = root.querySelector(
      ".certificates-slider__arrow--prev.desktop-only"
    );
    const nextDesktop = root.querySelector(
      ".certificates-slider__arrow--next.desktop-only"
    );
    const prevMobile = root.querySelector(
      ".certificates-slider__arrow--prev:not(.desktop-only)"
    );
    const nextMobile = root.querySelector(
      ".certificates-slider__arrow--next:not(.desktop-only)"
    );
    const pagination = root.querySelector(".certificates-slider__pagination");

    const swiper = new Swiper(container, {
      wrapperClass: "certificates-slider__track",
      slideClass: "certificates-slider__slide",
      slideActiveClass: "is-active",
      slidesPerView: "auto",
      spaceBetween: 20,
      speed: 350,
      observer: true,
      observeParents: true,
      watchOverflow: true,
      navigation: {
        prevEl:
          prevDesktop ||
          root.querySelector(".certificates-slider__arrow--prev"),
        nextEl:
          nextDesktop ||
          root.querySelector(".certificates-slider__arrow--next"),
        disabledClass: "is-disabled",
      },
      pagination: {
        el: pagination,
        clickable: true,
        bulletClass: "certificates-slider__dot",
        bulletActiveClass: "is-active",
        renderBullet: (i, cls) =>
          `<span class="${cls}" aria-label="Слайд ${i + 1}"></span>`,
      },
    });

    // sync disabled on mobile arrows
    const syncDisabled = () => {
      if (prevMobile)
        prevMobile.classList.toggle("is-disabled", swiper.isBeginning);
      if (nextMobile) nextMobile.classList.toggle("is-disabled", swiper.isEnd);
    };

    syncDisabled();

    swiper.on("update", syncDisabled);
    swiper.on("resize", syncDisabled);
    swiper.on("slideChange", syncDisabled);
    swiper.on("reachBeginning", syncDisabled);
    swiper.on("reachEnd", syncDisabled);
    swiper.on("fromEdge", syncDisabled);

    prevMobile &&
      prevMobile.addEventListener("click", () => swiper.slidePrev());
    nextMobile &&
      nextMobile.addEventListener("click", () => swiper.slideNext());
  });

  // === TESTIMONIALS SLIDER ===
  document.querySelectorAll(".testimonials-slider").forEach((root) => {
    const container = root.querySelector(".testimonials-slider__image-wrapper");
    if (!container) return;

    const prevDesktop = root.querySelector(
      ".testimonials-slider__arrow--prev.desktop-only"
    );

    const nextDesktop = root.querySelector(
      ".testimonials-slider__arrow--next.desktop-only"
    );

    const prevMobile = root.querySelector(
      ".testimonials-slider__arrow--prev:not(.desktop-only)"
    );

    const nextMobile = root.querySelector(
      ".testimonials-slider__arrow--next:not(.desktop-only)"
    );

    const pagination = root.querySelector(".testimonials-slider__pagination");

    const swiper = new Swiper(container, {
      wrapperClass: "testimonials-slider__track",
      slideClass: "testimonials-slider__slide",
      slideActiveClass: "is-active",
      slidesPerView: "auto",
      spaceBetween: 20,
      speed: 350,
      observer: true,
      observeParents: true,
      watchOverflow: true,
      navigation: {
        prevEl:
          prevDesktop ||
          root.querySelector(".testimonials-slider__arrow--prev"),
        nextEl:
          nextDesktop ||
          root.querySelector(".testimonials-slider__arrow--next"),
        disabledClass: "is-disabled",
      },
      pagination: {
        el: pagination,
        clickable: true,
        bulletClass: "testimonials-slider__dot",
        bulletActiveClass: "is-active",
        renderBullet: (i, cls) =>
          `<span class="${cls}" aria-label="Слайд ${i + 1}"></span>`,
      },
    });

    const syncDisabled = () => {
      if (prevMobile)
        prevMobile.classList.toggle("is-disabled", swiper.isBeginning);
      if (nextMobile) nextMobile.classList.toggle("is-disabled", swiper.isEnd);
    };

    syncDisabled();

    swiper.on("update", syncDisabled);
    swiper.on("resize", syncDisabled);
    swiper.on("slideChange", syncDisabled);
    swiper.on("reachBeginning", syncDisabled);
    swiper.on("reachEnd", syncDisabled);
    swiper.on("fromEdge", syncDisabled);

    prevMobile &&
      prevMobile.addEventListener("click", () => swiper.slidePrev());
    nextMobile &&
      nextMobile.addEventListener("click", () => swiper.slideNext());
  });
});
