(function () {
  'use strict';

  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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

  var navigation = document.querySelector('.site-navigation');
  var hoverDetails = [];
  document.querySelectorAll('[data-portrait-facts], [data-hover-details]').forEach(function (portraitFacts) {
    var portraitSummary = portraitFacts.querySelector('summary');
    var portraitClose = portraitFacts.querySelector('.portrait-facts__close');
    var factsPinned = false;
    var positionDetails = function () {
      if (!portraitFacts.open || !portraitFacts.hasAttribute('data-hover-details')) { return; }
      var panel = portraitFacts.querySelector('.lab-member__panel');
      var rect = portraitSummary.getBoundingClientRect();
      var header = document.querySelector('.masthead');
      var dock = document.querySelector('[data-section-dock]');
      var above = rect.top - (header ? header.getBoundingClientRect().bottom : 0) - 12;
      var below = (dock ? dock.getBoundingClientRect().top : window.innerHeight) - rect.bottom - 12;
      var placement = below < panel.scrollHeight && above > below ? 'above' : 'below';
      portraitFacts.setAttribute('data-placement', placement);
      panel.style.setProperty('--details-space', Math.max(120, placement === 'above' ? above : below) + 'px');
    };
    var dismissFacts = function (restoreFocus) {
      factsPinned = false;
      portraitFacts.open = false;
      if (restoreFocus) { portraitSummary.focus(); portraitFacts.open = false; }
    };
    var openFacts = function () {
      hoverDetails.forEach(function (details) {
        if (details.element !== portraitFacts) { details.dismiss(false); }
      });
      portraitFacts.open = true;
      positionDetails();
    };
    hoverDetails.push({ element: portraitFacts, dismiss: dismissFacts });
    portraitClose.hidden = false;
    portraitFacts.addEventListener('pointerenter', function (event) {
      if (event.pointerType === 'mouse') { openFacts(); }
    });
    portraitFacts.addEventListener('pointerleave', function () {
      if (!factsPinned && !portraitFacts.contains(document.activeElement)) { portraitFacts.open = false; }
    });
    portraitSummary.addEventListener('focus', function () {
      if (portraitSummary.matches(':focus-visible')) { openFacts(); }
    });
    portraitSummary.addEventListener('click', function (event) {
      event.preventDefault();
      factsPinned = !factsPinned;
      if (factsPinned) { openFacts(); }
      else { portraitFacts.open = false; }
    });
    portraitFacts.addEventListener('focusout', function (event) {
      if (!factsPinned && !portraitFacts.contains(event.relatedTarget)) { portraitFacts.open = false; }
    });
    portraitClose.addEventListener('click', function () { dismissFacts(true); });
    window.addEventListener('resize', positionDetails);
    window.addEventListener('scroll', positionDetails, { passive: true });
  });
  document.addEventListener('click', function (event) {
    hoverDetails.forEach(function (details) {
      if (!details.element.contains(event.target)) { details.dismiss(false); }
    });
  });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') { return; }
    hoverDetails.forEach(function (details) {
      if (details.element.open) { details.dismiss(details.element.contains(document.activeElement)); }
    });
  });
  if (navigation) {
    var navigationToggle = navigation.querySelector('.site-navigation__toggle');
    var navigationPanel = navigation.querySelector('.site-navigation__panel');
    var navigationCollapsed = null;
    var setNavigationOpen = function (open) {
      navigationToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navigationPanel.hidden = navigationCollapsed && !open;
      navigationToggle.querySelector('i').classList.toggle('fa-bars', !open);
      navigationToggle.querySelector('i').classList.toggle('fa-times', open);
    };
    navigationToggle.addEventListener('click', function () {
      setNavigationOpen(navigationPanel.hidden);
    });
    var fitNavigation = function () {
      var menu = navigation.closest('.masthead__menu');
      var brand = menu.querySelector('.site-brand');
      var theme = menu.querySelector('.theme-toggle');
      var gap = parseFloat(window.getComputedStyle(menu).columnGap) || 0;
      navigationPanel.setAttribute('data-measuring', '');
      var requiredWidth = navigationPanel.getBoundingClientRect().width;
      navigationPanel.removeAttribute('data-measuring');
      var availableWidth = menu.clientWidth - brand.getBoundingClientRect().width - (theme ? theme.getBoundingClientRect().width : 0) - gap * 2;
      var collapsed = window.innerWidth <= 820 || requiredWidth > availableWidth - 4;
      if (collapsed !== navigationCollapsed) {
        navigationCollapsed = collapsed;
        navigation.setAttribute('data-collapsed', collapsed ? 'true' : 'false');
        setNavigationOpen(false);
      }
    };
    fitNavigation();
    if ('ResizeObserver' in window) { new ResizeObserver(fitNavigation).observe(navigation.closest('.masthead__menu')); }
    window.addEventListener('resize', fitNavigation);
    if (document.fonts) { document.fonts.ready.then(fitNavigation); }
    document.addEventListener('click', function (event) {
      if (!navigation.contains(event.target)) {
        setNavigationOpen(false);
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navigationCollapsed && !navigationPanel.hidden) {
        setNavigationOpen(false);
        navigationToggle.focus();
      }
    });
    navigation.addEventListener('focusout', function (event) {
      if (!navigation.contains(event.relatedTarget)) {
        setNavigationOpen(false);
      }
    });
  }

  var sectionDock = document.querySelector('[data-section-dock]');
  if (sectionDock) {
    // Build from reading-content H2s, excluding paper titles and other nested records.
    var dockMenu = sectionDock.querySelector('.home-sections__links');
    document.querySelectorAll('#main .home-content h2, #main .page__content h2, #main .archive h2').forEach(function (heading, index) {
      if (heading.closest('.publication-item, .archive__item, blockquote') || !heading.textContent.trim()) { return; }
      if (!heading.id) {
        var candidate = 'page-section-' + (index + 1);
        while (document.getElementById(candidate)) { candidate += '-section'; }
        heading.id = candidate;
      }
      var link = document.createElement('a');
      link.href = '#' + encodeURIComponent(heading.id);
      link.textContent = heading.textContent.trim();
      dockMenu.appendChild(link);
    });
    dockMenu.hidden = !dockMenu.querySelector('a');
  }

  var slidingMenus = [];
  document.querySelectorAll('[data-sliding-nav]').forEach(function (menu) {
    var links = Array.prototype.slice.call(menu.querySelectorAll('a'));
    var highlighted = null;
    var moveIndicator = function (link) {
      if (!link || !menu.getBoundingClientRect().width) { return; }
      var menuRect = menu.getBoundingClientRect();
      var linkRect = link.getBoundingClientRect();
      menu.style.setProperty('--indicator-x', (linkRect.left - menuRect.left + menu.scrollLeft) + 'px');
      menu.style.setProperty('--indicator-y', (linkRect.top - menuRect.top + menu.scrollTop) + 'px');
      menu.style.setProperty('--indicator-width', linkRect.width + 'px');
      menu.style.setProperty('--indicator-height', linkRect.height + 'px');
      menu.setAttribute('data-enhanced', 'true');
    };
    var refresh = function () {
      moveIndicator(highlighted || menu.querySelector('[aria-current]') || links[0]);
    };
    links.forEach(function (link) {
      link.addEventListener('pointerenter', function () { highlighted = link; refresh(); });
      link.addEventListener('focus', function () { if (link.matches(':focus-visible')) { highlighted = link; refresh(); } });
    });
    menu.addEventListener('pointerleave', function () {
      highlighted = menu.contains(document.activeElement) && document.activeElement.matches(':focus-visible') ? document.activeElement.closest('a') : null;
      refresh();
    });
    menu.addEventListener('focusout', function (event) {
      highlighted = event.relatedTarget && menu.contains(event.relatedTarget) && event.relatedTarget.matches(':focus-visible') ? event.relatedTarget.closest('a') : null;
      refresh();
    });
    if ('ResizeObserver' in window) { new ResizeObserver(refresh).observe(menu); }
    slidingMenus.push(refresh);
    refresh();
  });
  if (document.fonts) {
    document.fonts.ready.then(function () { slidingMenus.forEach(function (refresh) { refresh(); }); });
  }

  var masthead = document.querySelector('.masthead');
  var sectionLinks = Array.prototype.slice.call(document.querySelectorAll('.home-sections__links a'));
  var sections = sectionLinks.map(function (link) {
    if (link.pathname !== window.location.pathname || !link.hash) { return null; }
    return document.getElementById(decodeURIComponent(link.hash.slice(1)));
  });
  var scrollPending = false;
  var activeSection = -1;
  var updateScroll = function () {
    scrollPending = false;
    if (masthead) { masthead.classList.toggle('is-scrolled', window.scrollY > 24); }
    if (!sectionDock) { return; }
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var readingProgress = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 1;
    sectionDock.style.setProperty('--reading-progress', (readingProgress * 100) + '%');
    var current = -1;
    var closestTop = -Infinity;
    var lastSection = -1;
    var furthestTop = -Infinity;
    var activeLine = masthead ? masthead.getBoundingClientRect().bottom + 48 : 160;
    sections.forEach(function (section, index) {
      if (!section) { return; }
      var top = section.getBoundingClientRect().top;
      if (current === -1) { current = index; }
      if (top <= activeLine && top > closestTop) { closestTop = top; current = index; }
      if (top > furthestTop) { furthestTop = top; lastSection = index; }
    });
    if (readingProgress >= .99 && lastSection !== -1) { current = lastSection; }
    sectionLinks.forEach(function (link, index) {
      if (index === current) { link.setAttribute('aria-current', 'location'); }
      else { link.removeAttribute('aria-current'); }
    });
    if (current !== activeSection && current !== -1) {
      activeSection = current;
      var activeLink = sectionLinks[current];
      var sectionMenu = activeLink.parentElement;
      if (sectionMenu.scrollWidth > sectionMenu.clientWidth) {
        sectionMenu.scrollTo({ left: activeLink.offsetLeft - (sectionMenu.clientWidth - activeLink.offsetWidth) / 2, behavior: 'auto' });
      }
    }
    slidingMenus.forEach(function (refresh) { refresh(); });
  };
  var scheduleScroll = function () {
    if (!scrollPending) { scrollPending = true; window.requestAnimationFrame(updateScroll); }
  };
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll);
  if (sectionDock && 'ResizeObserver' in window) { new ResizeObserver(scheduleScroll).observe(document.body); }
  updateScroll();

  // Keep pointer movement local to small controls, with native focus and touch behavior.
  document.querySelectorAll('.icon-control, .theme-toggle').forEach(function (control) {
    var resetPointer = function () {
      control.style.removeProperty('--pointer-x');
      control.style.removeProperty('--pointer-y');
    };
    control.addEventListener('pointermove', function (event) {
      if (reducedMotion.matches || event.pointerType !== 'mouse' || control.disabled) { return; }
      var rect = control.getBoundingClientRect();
      control.style.setProperty('--pointer-x', Math.max(-4, Math.min(4, (event.clientX - rect.left - rect.width / 2) * .16)) + 'px');
      control.style.setProperty('--pointer-y', Math.max(-4, Math.min(4, (event.clientY - rect.top - rect.height / 2) * .16)) + 'px');
    });
    control.addEventListener('pointerleave', resetPointer);
    control.addEventListener('blur', resetPointer);
    reducedMotion.addEventListener('change', resetPointer);
  });

  var carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var slides = Array.prototype.slice.call(track.querySelectorAll('[data-publication-item]'));
    var previous = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    var count = carousel.querySelector('[data-carousel-count]');
    var progress = carousel.querySelector('[data-carousel-progress]');
    var updateCarousel = function () {
      var step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth;
      var first = Math.round(track.scrollLeft / step);
      var gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
      var visible = Math.max(1, Math.floor((track.clientWidth + gap + 2) / step));
      previous.disabled = track.scrollLeft < 2;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      count.textContent = (first + 1) + (visible > 1 ? ' - ' + Math.min(slides.length, first + visible) : '') + ' / ' + slides.length;
      progress.style.transform = 'scaleX(' + Math.min(1, (track.scrollLeft + track.clientWidth) / track.scrollWidth) + ')';
    };
    var browse = function (direction) {
      var step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth;
      track.scrollBy({ left: direction * step, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };
    previous.addEventListener('click', function () { browse(-1); });
    next.addEventListener('click', function () { browse(1); });
    track.addEventListener('keydown', function (event) {
      if (event.target !== track) { return; }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        browse(event.key === 'ArrowLeft' ? -1 : 1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      }
    });
    track.addEventListener('scroll', updateCarousel, { passive: true });
    if ('ResizeObserver' in window) { new ResizeObserver(updateCarousel).observe(track); }
    carousel.querySelector('[data-carousel-controls]').hidden = false;
    carousel.setAttribute('data-enhanced', 'true');
    updateCarousel();
  }

  if ('IntersectionObserver' in window) {
    // Animate on entry without making content depend on JavaScript to become visible.
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        if (!reducedMotion.matches && entry.target.animate) {
          Array.prototype.slice.call(entry.target.children).forEach(function (child, index) {
            child.animate([
              { opacity: 0.45, transform: 'translateY(20px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 650, delay: Math.min(index * 65, 260), easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });
          });
        }
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(function (section) { revealObserver.observe(section); });
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
