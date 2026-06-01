let initialized = false;

export function initPortfolio() {
  if (initialized) return;
  initialized = true;

  const filters = document.querySelectorAll<HTMLElement>('.portfolio__filter');
  const cards = document.querySelectorAll<HTMLElement>('.portfolio__card');

  if (!filters.length || !cards.length) return;

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(f => {
        f.classList.remove('is-active');
        f.setAttribute('aria-selected', 'false');
      });
      filter.classList.add('is-active');
      filter.setAttribute('aria-selected', 'true');

      const category = filter.dataset.filter;

      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}
