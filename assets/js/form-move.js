(function () {
  let form = document.querySelector(".form--mobile-bottom");
  const faqSection = document.querySelector(".faq");

  if (!form || !faqSection) return;

  // Save original parent and next sibling for restoration
  const originalParent = form.parentNode;
  const originalNextSibling = form.nextElementSibling;

  function moveFormToBottomOnMobile() {
    if (window.innerWidth <= 1023) {
      // Move after FAQ (to bottom of section/container)
      faqSection.parentNode.appendChild(form);
    } else {
      // Restore original position
      if (originalNextSibling) {
        originalParent.insertBefore(form, originalNextSibling);
      } else {
        originalParent.appendChild(form);
      }
    }
  }

  window.addEventListener("resize", moveFormToBottomOnMobile);
  window.addEventListener("DOMContentLoaded", moveFormToBottomOnMobile);
})();
