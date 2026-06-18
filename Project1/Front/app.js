/* ============================================================
   Personal Finance App — vanilla interactivity
   Nav switching, auth, modals, kebab menus, password toggle,
   live Add/Withdraw preview. No dependencies.
   ============================================================ */
(function () {
  'use strict';

  var app = document.getElementById('app');
  var bottomNav = document.querySelector('.bottom-nav');

  function fmt(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /* ---------- Navigation ---------- */
  function showPage(page) {
    document.querySelectorAll('.auth').forEach(function (a) { a.classList.remove('is-active'); });
    app.style.display = '';
    bottomNav.style.display = '';
    document.querySelectorAll('.page').forEach(function (p) {
      p.classList.toggle('is-active', p.id === 'page-' + page);
    });
    document.querySelectorAll('.nav-item, .bottom-nav__item').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.page === page);
    });
    closeMenus();
    window.scrollTo(0, 0);
  }

  function showAuth(which) {
    app.style.display = 'none';
    bottomNav.style.display = 'none';
    document.querySelectorAll('.auth').forEach(function (a) {
      a.classList.toggle('is-active', a.id === 'page-' + which);
    });
    window.scrollTo(0, 0);
  }

  /* ---------- Modals ---------- */
  function openModal(id, trigger) {
    var m = document.getElementById(id);
    if (!m) return;
    if (id === 'modal-add-money' || id === 'modal-withdraw') setupMoney(m, trigger);
    if (id === 'modal-delete-budget' || id === 'modal-delete-pot') {
      var t = m.querySelector('[data-del-title]');
      if (t && trigger && trigger.dataset.name) t.textContent = 'Delete \u2018' + trigger.dataset.name + '\u2019?';
    }
    m.classList.add('is-open');
  }

  function closeModal(m) { m.classList.remove('is-open'); }

  function setupMoney(m, trigger) {
    var mode = m.dataset.mode;
    var saved = trigger ? parseFloat(trigger.dataset.saved) || 0 : 0;
    var target = trigger ? parseFloat(trigger.dataset.target) || 1 : 1;
    var name = trigger ? (trigger.dataset.name || '') : '';
    var color = 'var(' + (mode === 'add' ? (trigger && trigger.dataset.color ? trigger.dataset.color : '--green') : '--red') + ')';
    m._money = { saved: saved, target: target, color: color };
    m.querySelector('[data-money-title]').textContent =
      (mode === 'add' ? 'Add to \u2018' : 'Withdraw from \u2018') + name + '\u2019';
    m.querySelector('[data-money-target]').textContent = 'Target of $' + target.toLocaleString();
    m.querySelector('[data-money-input]').value = '';
    updateMoney(m);
  }

  function updateMoney(m) {
    if (!m._money) return;
    var mode = m.dataset.mode;
    var amt = parseFloat(m.querySelector('[data-money-input]').value) || 0;
    var next = mode === 'add' ? m._money.saved + amt : Math.max(m._money.saved - amt, 0);
    var pct = Math.min(next / m._money.target * 100, 100);
    m.querySelector('[data-money-new]').textContent = fmt(next);
    var bar = m.querySelector('[data-money-bar]');
    bar.style.width = pct + '%';
    bar.style.background = m._money.color;
    var pctEl = m.querySelector('[data-money-pct]');
    pctEl.textContent = pct.toFixed(2) + '%';
    pctEl.style.color = m._money.color;
  }

  /* ---------- Kebab menus ---------- */
  function closeMenus() {
    document.querySelectorAll('.menu.is-open').forEach(function (el) { el.classList.remove('is-open'); });
  }

  /* ---------- Event delegation ---------- */
  document.addEventListener('click', function (e) {
    var nav = e.target.closest('[data-page]');
    if (nav) { showPage(nav.dataset.page); return; }

    var auth = e.target.closest('[data-auth]');
    if (auth) { showAuth(auth.dataset.auth); return; }

    var open = e.target.closest('[data-open]');
    if (open) { openModal(open.dataset.open, open); closeMenus(); return; }

    var close = e.target.closest('[data-close]');
    if (close) { closeModal(close.closest('.modal-overlay')); return; }

    // click on overlay backdrop (outside the .modal)
    if (e.target.classList.contains('modal-overlay')) { closeModal(e.target); return; }

    var pw = e.target.closest('[data-pw]');
    if (pw) {
      var input = pw.parentNode.querySelector('input');
      input.type = input.type === 'password' ? 'text' : 'password';
      return;
    }

    var kebab = e.target.closest('[data-menu]');
    if (kebab) {
      var menu = kebab.parentNode.querySelector('.menu');
      var wasOpen = menu.classList.contains('is-open');
      closeMenus();
      if (!wasOpen) menu.classList.add('is-open');
      return;
    }

    // click anywhere else closes open kebab menus
    closeMenus();
  });

  // live preview for Add Money / Withdraw
  document.addEventListener('input', function (e) {
    if (e.target.matches('[data-money-input]')) {
      updateMoney(e.target.closest('.modal-overlay'));
    }
  });

  // Esc closes any open modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.is-open').forEach(closeModal);
      closeMenus();
    }
  });
})();
