/* assets/js/contacts.js
   Контакты: фильтр по городу + Яндекс.Карта (без геокодинга)
   Требует в разметке:
   - .chips .chip[role="tab"][data-city]
   - .contacts__city-note, .contacts__count > [data-count]
   - .contact-card[data-city][data-lat][data-lng]
   - #ymap (контейнер под карту)
*/
document.addEventListener('DOMContentLoaded', () => {
  // --- DOM refs ---
  const chips = Array.from(document.querySelectorAll('.chips .chip[role="tab"]'));
  const countEl = document.querySelector('.contacts__count [data-count]');
  const cityNoteEl = document.querySelector('.contacts__city-note');
  const listEl = document.getElementById('contacts-list');
  const mapNode = document.getElementById('ymap');

  if (!listEl) return;

  const CITY_READABLE = {khv: 'Хабаровске', vdk: 'Владивостоке', msk: 'Москве'};
// какой зум показывать, если в городе одна точка
  const SINGLE_CITY_ZOOM = { khv: 13, vdk: 13, msk: 13 };
// максимальный зум-«потолок» после fitBounds (чтобы не улетать на уровень домов)
  const MAX_FIT_ZOOM =   { khv: 14,  vdk: 13, msk: 13 };

  const BOUND_CARDS = new WeakSet();

  // текущий город
  let currentCity =
    chips.find(c => c.classList.contains('is-active'))?.dataset.city ||
    chips[0]?.dataset.city ||
    'khv';

  // карта / кластеризатор
  let map = null;
  let clusterer = null;

  // связь «карточка → метка», чтобы открывать нужный балун
  const CARD_TO_PM = new WeakMap();

  // --- helpers ---
  const parseCoords = (el) => {
    const lat = parseFloat(el.dataset.lat || '');
    const lng = parseFloat(el.dataset.lng || '');
    return (Number.isFinite(lat) && Number.isFinite(lng)) ? [lat, lng] : null;
  };

  const extractAddress = (card) => {
    // ищем строку с меткой "Адрес", иначе берём первый .contact-card__value
    for (const row of card.querySelectorAll('.contact-card__row')) {
      const label = row.querySelector('.contact-card__label')?.textContent?.trim() || '';
      if (/адрес/i.test(label)) {
        return row.querySelector('.contact-card__value')?.textContent?.trim() || '';
      }
    }
    return card.querySelector('.contact-card__value')?.textContent?.trim() || '';
  };

  const showOnlyCity = (city) => {
    const all = Array.from(listEl.querySelectorAll('.contact-card'));
    const visible = [];
    all.forEach(card => {
      const ok = (card.dataset.city || '').toLowerCase() === city.toLowerCase();
      card.style.display = ok ? '' : 'none';
      if (ok) visible.push(card);
    });
    if (countEl) countEl.textContent = String(visible.length);
    if (cityNoteEl) cityNoteEl.textContent = `В ${CITY_READABLE[city] || ''}`;
    return visible;
  };

  const setActiveChip = (city) => {
    chips.forEach(chip => {
      const active = chip.dataset.city === city;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-selected', String(active));
      chip.tabIndex = active ? 0 : -1;
    });
  };

  // --- карта ---
  const ensureMap = () => {
    if (!mapNode || !window.ymaps || map) return;

    map = new ymaps.Map(mapNode, {
      center: [48.480223, 135.072972], // центр Хабаровска по умолчанию
      zoom: 13,
      controls: ['zoomControl'],
    }, {suppressMapOpenBlock: true});

    map.behaviors.disable('scrollZoom');

    // клик по пустой карте — закрыть любые балуны
    map.events.add('click', () => {
      map.balloon.close();
      if (clusterer && clusterer.balloon) clusterer.balloon.close();
    });

    clusterer = new ymaps.Clusterer({
      preset: 'islands#orangeClusterIcons',
      groupByCoordinates: true,        // объединять совпадающие точки (например, 2 офиса в одном доме)
      clusterOpenBalloonOnClick: true,
      clusterDisableClickZoom: false,
    });

    map.geoObjects.add(clusterer);
  };

  const rebuildMarkers = (cards, city) => {
    if (!map || !clusterer) return;

    // закрыть любые открытые балуны
    map.balloon?.close();
    if (clusterer && clusterer.balloon) clusterer.balloon.close();

    clusterer.removeAll();

    const placemarks = [];
    cards.forEach((card) => {
      const coords = parseCoords(card);
      if (!coords) return;

      const title   = (card.querySelector('.contact-card__title')?.textContent || '').trim();
      const address = extractAddress(card);

      const pm = new ymaps.Placemark(
        coords,
        { balloonContentHeader: title, balloonContentBody: address },
        { preset: 'islands#orangeIcon' }
      );

      pm.events.add('click', () => {
        card.classList.add('is-active');
        setTimeout(() => card.classList.remove('is-active'), 1200);
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      if (!BOUND_CARDS.has(card)) {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.contact-card__btn')) return;
          map.balloon?.close();
          map.setCenter(coords, Math.max(map.getZoom(), 15), { duration: 300 });
          pm.balloon.open();
        });
        BOUND_CARDS.add(card);
      }

      card.addEventListener('click', (e) => {
        if ((e.target).closest('.contact-card__btn')) return;
        map.balloon?.close();
        map.setCenter(coords, Math.max(map.getZoom(), 15), { duration: 300 });
        pm.balloon.open();
      });

      placemarks.push(pm);
    });

    if (!placemarks.length) return;

    clusterer.add(placemarks);

    if (placemarks.length === 1) {
      // ОДНА метка — просто центр и городской зум
      const coords = placemarks[0].geometry.getCoordinates();
      const z = (SINGLE_CITY_ZOOM[city] ?? 13);
      map.setCenter(coords, z, { duration: 300 });
    } else {
      // НЕСКОЛЬКО меток — fitBounds и затем «потолок» зума после анимации
      const bounds = clusterer.getBounds();
      if (bounds) {
        const cap = (MAX_FIT_ZOOM[city] ?? 14);

        const clampZoom = () => {
          if (map.getZoom() > cap) map.setZoom(cap);
          map.events.remove('actionend', clampZoom);
        };

        map.events.add('actionend', clampZoom);
        map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 40 });
      }
    }
  };


  // --- первичная отрисовка ---
  setActiveChip(currentCity);
  const visibleAtStart = showOnlyCity(currentCity);

  if (window.ymaps) {
    ymaps.ready(() => {
      ensureMap();
      rebuildMarkers(visibleAtStart, currentCity);
    });
  }

  // --- переключение города ---
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const city = chip.dataset.city;
      if (!city || city === currentCity) return;
      currentCity = city;

      setActiveChip(currentCity);
      const visible = showOnlyCity(currentCity);

      // при смене города закрыть открытые балуны и перерисовать метки
      if (map) rebuildMarkers(visible, currentCity);
    });

    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chip.click();
      }
    });
  });
});
