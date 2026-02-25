(function () {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

  const langToggle = $('.lang-toggle');
  const langDropdown = $('.lang-dropdown');
  if (langToggle && langDropdown) {
    langToggle.addEventListener('click', () => langDropdown.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lang-menu')) langDropdown.classList.remove('open');
    });
  }

  const drawer = $('.mobile-drawer');
  const drawerToggle = $('.drawer-toggle');
  const drawerClose = $('.drawer-close');
  let lastFocus = null;

  function trapFocus(container, event) {
    const focusables = $$('button, [href], input', container).filter((el) => !el.disabled);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    document.body.classList.add('nav-open');
    $('.drawer-panel button, .drawer-panel a', drawer)?.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    document.body.classList.remove('nav-open');
    if (lastFocus) lastFocus.focus();
  }

  drawerToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawer?.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
    }
    if (drawer?.classList.contains('open')) trapFocus($('.drawer-panel', drawer), e);
    if (modal?.classList.contains('open')) trapFocus($('.modal-box', modal), e);
  });

  const amountButtons = $$('.segmented button');
  const monthRange = $('#monthsRange');
  const monthLabel = $('.month-pill');
  const resultNodes = {
    low: $('[data-result="low"]'),
    base: $('[data-result="base"]'),
    high: $('[data-result="high"]')
  };
  let amount = 50000;

  function usd(v) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v); }

  function recalc() {
    const months = Number(monthRange?.value || 12);
    if (monthLabel) monthLabel.textContent = `${months} months`;
    const baseRate = 0.115 / 12;
    const low = amount * Math.pow(1 + baseRate * 0.7, months);
    const base = amount * Math.pow(1 + baseRate, months);
    const high = amount * Math.pow(1 + baseRate * 1.35, months);
    if (resultNodes.low) resultNodes.low.textContent = usd(low);
    if (resultNodes.base) resultNodes.base.textContent = usd(base);
    if (resultNodes.high) resultNodes.high.textContent = usd(high);
  }

  amountButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      amountButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      amount = Number(btn.dataset.amount);
      recalc();
    });
  });
  monthRange?.addEventListener('input', recalc);
  recalc();

  $$('.faq-item').forEach((item) => {
    const q = $('.faq-q', item);
    q?.addEventListener('click', () => {
      $$('.faq-item.open').forEach((openItem) => { if (openItem !== item) openItem.classList.remove('open'); });
      item.classList.toggle('open');
    });
  });

  const modal = $('#privacyModal');
  const openModalBtn = $('[data-open-modal]');
  const closeModalBtns = $$('[data-close-modal]');
  let modalLastFocus = null;

  function openModal() {
    if (!modal) return;
    modalLastFocus = document.activeElement;
    modal.classList.add('open');
    document.body.classList.add('nav-open');
    $('.modal-head button', modal)?.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('nav-open');
    if (modalLastFocus) modalLastFocus.focus();
  }

  openModalBtn?.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  closeModalBtns.forEach((btn) => btn.addEventListener('click', closeModal));
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.15 });

  $$('section .visual-card, .kpi-card, .review-card, .timeline-step').forEach((el) => {
    el.style.transform = 'translateY(10px)';
    el.style.opacity = '0.01';
    el.style.transition = 'transform .5s ease, opacity .5s ease';
    observer.observe(el);
  });
})();
