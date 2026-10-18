(() => {
  'use strict';
  document.documentElement.classList.add('has-js');
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 1100px)');

  // Closed-form critically damped spring. Retargets retain the current velocity.
  function spring(initial, render, response = .32) {
    let value = initial, velocity = 0, target = initial, frame = 0, previous = 0;
    const omega = 2 * Math.PI / response;
    function tick(now) {
      const dt = Math.min((now - previous) / 1000, .064);
      previous = now;
      const offset = value - target;
      const c = velocity + omega * offset;
      const decay = Math.exp(-omega * dt);
      value = target + (offset + c * dt) * decay;
      velocity = (velocity - omega * c * dt) * decay;
      render(value);
      if (Math.abs(value - target) > .001 || Math.abs(velocity) > .01) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
        value = target;
        velocity = 0;
        render(value);
      }
    }
    return {
      set(next, immediate = false) {
        target = next;
        if (immediate || motionPreference.matches) {
          cancelAnimationFrame(frame);
          frame = 0;
          value = target;
          velocity = 0;
          render(value);
        } else if (!frame) {
          previous = performance.now();
          frame = requestAnimationFrame(tick);
        }
      }
    };
  }

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav-links');
  let menuOpen = false;
  if (menuButton && navigation) {
    const menuSpring = spring(0, value => {
      navigation.style.setProperty('--menu-progress', value);
      navigation.style.setProperty('--menu-y', `${-12 * (1 - value)}px`);
      navigation.style.setProperty('--menu-scale', .98 + .02 * value);
      if (!menuOpen && value <= .001) navigation.dataset.visible = 'false';
    });
    function setMenu(open, restoreFocus = false, immediate = false) {
      menuOpen = open && mobile.matches;
      menuButton.setAttribute('aria-expanded', String(menuOpen));
      menuButton.setAttribute('aria-label', menuOpen ? 'Close navigation' : 'Open navigation');
      navigation.inert = mobile.matches && !menuOpen;
      if (menuOpen) navigation.dataset.visible = 'true';
      menuSpring.set(menuOpen ? 1 : 0, immediate);
      if (restoreFocus) menuButton.focus();
    }
    menuButton.addEventListener('click', () => setMenu(!menuOpen));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuOpen) setMenu(false, true);
    });
    document.addEventListener('pointerdown', event => {
      if (menuOpen && !header.contains(event.target)) setMenu(false);
    });
    navigation.addEventListener('click', event => {
      if (event.target.closest('a') && mobile.matches) setMenu(false);
    });
    mobile.addEventListener('change', () => setMenu(false, false, true));
    motionPreference.addEventListener('change', () => setMenu(menuOpen, false, true));
    setMenu(false, false, true);
  }

  if (header) {
    let scheduled = false;
    const update = () => {
      header.classList.toggle('is-scrolled', scrollY > 16);
      scheduled = false;
    };
    addEventListener('scroll', () => {
      if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  const segmented = document.querySelector('.segmented');
  if (segmented) {
    const buttons = [...segmented.querySelectorAll('[data-filter]')];
    const indicator = segmented.querySelector('.segment-indicator');
    const rows = [...document.querySelectorAll('.program-table tbody tr[data-period]')];
    const status = document.querySelector('[data-program-status]');
    const move = spring(0, value => indicator.style.transform = `translateX(${value}px)`);
    const resize = spring(0, value => indicator.style.width = `${value}px`);
    let selected = buttons[0];
    function position(immediate = false) {
      move.set(selected.offsetLeft - indicator.offsetLeft, immediate);
      resize.set(selected.offsetWidth, immediate);
    }
    for (const button of buttons) {
      button.addEventListener('click', () => {
        selected = button;
        for (const item of buttons) item.setAttribute('aria-pressed', String(item === selected));
        for (const row of rows) row.hidden = selected.dataset.filter !== 'all' && row.dataset.period !== selected.dataset.filter;
        const label = selected.dataset.filter === 'all' ? 'All sessions' : `${selected.textContent} sessions`;
        status.textContent = `${label} · All times are local to Windsor, Ontario.`;
        position();
      });
    }
    position(true);
    new ResizeObserver(() => position(true)).observe(segmented);
    motionPreference.addEventListener('change', () => position(true));
  }

  document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => print()));
  document.querySelectorAll('[data-year]').forEach(node => node.textContent = new Date().getFullYear());

  // Content remains visible without JavaScript or when reduced motion is requested.
  if (!motionPreference.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove('reveal-ready');
        entry.target.animate(
          [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 420, easing: 'cubic-bezier(.2,.65,.3,1)' }
        );
        observer.unobserve(entry.target);
      }
    }, { threshold: .06 });
    document.querySelectorAll('.focus-copy, .venue-panel, .speaker-preview-grid, .cta-band, .team-card, .speaker, .keynote-card').forEach(node => {
      if (node.getBoundingClientRect().top >= innerHeight) {
        node.classList.add('reveal-ready');
        observer.observe(node);
      }
    });
    motionPreference.addEventListener('change', () => {
      if (!motionPreference.matches) return;
      document.querySelectorAll('.reveal-ready').forEach(node => node.classList.remove('reveal-ready'));
      observer.disconnect();
      document.getAnimations().forEach(animation => animation.finish());
    });
  }
})();
