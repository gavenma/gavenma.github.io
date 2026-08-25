(function () {
  'use strict';

  var root = document.documentElement;
  var themeToggle = document.querySelector('[data-theme-toggle]') || document.querySelector('.theme-toggle');
  var storedTheme = null;

  try {
    storedTheme = window.localStorage.getItem('site-theme');
  } catch (error) {
    storedTheme = null;
  }

  var preferredTheme = storedTheme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-theme', preferredTheme);

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', preferredTheme === 'dark' ? 'true' : 'false');
    themeToggle.addEventListener('click', function () {
      var nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', nextTheme);
      themeToggle.setAttribute('aria-pressed', nextTheme === 'dark' ? 'true' : 'false');
      try {
        window.localStorage.setItem('site-theme', nextTheme);
      } catch (error) {
        // Theme persistence is optional when storage is unavailable.
      }
    });
  }

  var publicationIndex = document.querySelector('[data-publication-index]');
  if (!publicationIndex) {
    return;
  }

  var publicationItems = Array.prototype.slice.call(publicationIndex.querySelectorAll('[data-publication-item]'));
  var filterButtons = Array.prototype.slice.call(publicationIndex.querySelectorAll('[data-publication-filter]'));
  var searchInput = publicationIndex.querySelector('[data-publication-search]');
  var emptyState = publicationIndex.querySelector('[data-publication-empty]');
  var activeYear = 'all';

  var applyPublicationFilters = function () {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var visibleCount = 0;

    publicationItems.forEach(function (item) {
      var yearMatches = activeYear === 'all' || item.getAttribute('data-publication-year') === activeYear;
      var textMatches = !query || (item.getAttribute('data-publication-text') || '').indexOf(query) !== -1;
      var visible = yearMatches && textMatches;
      item.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  };

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeYear = button.getAttribute('data-publication-filter') || 'all';
      filterButtons.forEach(function (filterButton) {
        var isActive = filterButton === button;
        filterButton.classList.toggle('is-active', isActive);
        filterButton.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      applyPublicationFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyPublicationFilters);
  }

  publicationIndex.addEventListener('click', function (event) {
    var toggle = event.target.closest('[data-abstract-toggle]');
    if (!toggle) {
      return;
    }

    var item = toggle.closest('[data-publication-item]');
    var panel = item && item.querySelector('[data-abstract-panel]');
    if (!item || !panel) {
      return;
    }

    var isOpen = item.getAttribute('data-open') === 'true';
    item.setAttribute('data-open', isOpen ? 'false' : 'true');
    toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    panel.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    toggle.querySelector('i').classList.toggle('fa-plus', isOpen);
    toggle.querySelector('i').classList.toggle('fa-minus', !isOpen);
  });

  applyPublicationFilters();
}());
