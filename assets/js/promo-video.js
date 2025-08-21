// /assets/js/promo-video.js
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.promo-video__play');
  if (!btn) return;

  const box = btn.closest('.promo-video__media');
  if (!box || box.classList.contains('is-playing')) return;

  const raw = box.dataset.videoSrc || box.dataset.embed || '';
  if (!raw) return;

  // добавим autoplay=1 и hd=2 (для VK), если не передали
  let finalUrl = raw;
  try {
    const u = new URL(raw, window.location.href);
    if (!u.searchParams.has('autoplay')) u.searchParams.set('autoplay', '1');
    if (!u.searchParams.has('hd'))       u.searchParams.set('hd', '2');
    finalUrl = u.toString();
  } catch {}

  const iframe = document.createElement('iframe');
  iframe.src = finalUrl;
  iframe.loading = 'lazy';
  iframe.title = btn.getAttribute('aria-label') || 'Видео';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
  iframe.setAttribute('allowfullscreen', '');
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';

  // твой SCSS сам спрячет постер и кнопку по .is-playing
  box.classList.add('is-playing');
  box.appendChild(iframe);
});
