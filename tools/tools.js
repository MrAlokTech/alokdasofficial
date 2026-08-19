document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('toolSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.tool-card');
  const noResults = document.getElementById('noResults');
  const clearSearchBtn = document.getElementById('clearSearch');

  let activeCategory = 'all';
  let searchQuery = '';

  function filterTools() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const name = card.getAttribute('data-name').toLowerCase();
      const category = card.getAttribute('data-category').toLowerCase();
      const keywords = card.getAttribute('data-keywords').toLowerCase();

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        name.includes(searchQuery) ||
        keywords.includes(searchQuery) ||
        category.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.add('visible');
      } else {
        noResults.classList.remove('visible');
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterTools();
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      activeCategory = btn.getAttribute('data-filter');
      filterTools();
    });
  });

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      activeCategory = 'all';

      filterBtns.forEach((b) => b.classList.remove('active'));
      const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
      if (allBtn) allBtn.classList.add('active');

      filterTools();
    });
  }
});
