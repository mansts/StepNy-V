(function () {
  const BASE_PATH = '';

  const withBase = (path) => {
    if (!path || path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('#')) {
      return path;
    }
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return `${BASE_PATH}${cleanPath}`;
  };

  const LAYOUT_CONFIG = {
    defaultLang: localStorage.getItem('stepny_lang') || document.documentElement.lang || 'ru',

    CONTACTS_TITLE: {
      kz: 'Байланыс:',
      ru: 'Контакты:',
      en: 'Contacts:'
    },

    MENU_SECTIONS: [
      {
        id: 'nav',
        type: 'list',
        title: { kz: '1. Навигация', ru: '1. Навигация', en: '1. Navigation' },
        items: [
          { href: '/', label: { kz: 'Басты бет', ru: 'Главная', en: 'Home' } },
          { href: '/aboutus/', label: { kz: 'Жоба туралы', ru: 'О проекте', en: 'About Project' } },
          { href: '/about/', label: { kz: 'Турнир', ru: 'Турнир', en: 'Tournament' } },
          { href: '/docs/', label: { kz: 'Құжаттар', ru: 'Документы', en: 'Documents' } },
          { href: '/faq/', label: { kz: 'Жиі қойылатын сұрақтар', ru: 'Часто задаваемые вопросы', en: 'Frequently Asked Questions' } },
          { href: '/sponsor/', label: { kz: 'Серіктестер', ru: 'Партнеры', en: 'Partners' } }
        ]
      },
      {
        id: 'participants',
        type: 'accordion',
        title: { kz: '2. Қатысушыларға', ru: '2. Участникам', en: '2. For Participants' },
        items: [
          { href: '/registration/', label: { kz: 'Менің тіркелуім', ru: 'Моя регистрация', en: 'My Registration' } },
          { href: '/status/', label: { kz: 'Өтінім мәртебесі', ru: 'Статус заявки', en: 'Application Status' } },
          { href: '/team/', label: { kz: 'Команда туралы ақпарат', ru: 'Информация о команде', en: 'Team Information' } },
          { href: '/results/', label: { kz: 'Турнир нәтижелері', ru: 'Результаты турнира', en: 'Tournament Results' } }
        ]
      },
      {
        id: 'general',
        type: 'accordion',
        title: { kz: '3. Жалпы мәліметтер', ru: '3. Общие сведения', en: '3. General Information' },
        items: [
          { href: '/gi/#contact', label: { kz: 'Ұйымдастырушымен байланысу', ru: 'Связаться с организатором', en: 'Contact Organizer' } },
          { href: '/gi/#partner', label: { kz: 'Серіктес / демеуші болу', ru: 'Стать партнером / спонсором', en: 'Become a Partner / Sponsor' } },
          { href: '/gi/#report', label: { kz: 'Мәселе туралы жазу', ru: 'Написать о проблеме', en: 'Report an Issue' } }
        ]
      }
    ],

    FOOTER_LINKS: [
      { href: '/docs/', label: { kz: 'Құжаттама', ru: 'Документация', en: 'Documentation' } },
      { href: '/sponsor/', label: { kz: 'Серіктестер', ru: 'Партнеры', en: 'Partners' } },
      { href: '/aboutus/', label: { kz: 'Біз туралы', ru: 'О нас', en: 'About Us' } },
      { href: '/about/', label: { kz: 'Турнир туралы толығырақ', ru: 'Подробнее о турнире', en: 'More About the Tournament' } }
    ],

    CONTACTS: [
      { text: 'stepny.debate@gmail.com', href: 'mailto:stepny.debate@gmail.com' },
      { text: 'Instagram: @stepny.debate', href: 'https://instagram.com/stepny.debate' },
      { text: 'Tiktok: @stepny.debate', href: 'https://tiktok.com/@stepny.debate' },
      { text: 'Telegram: @StepNysupport', href: 'https://t.me/StepNysupport' },
      { text: 'Telegram Channel: @StepNyDebate', href: 'https://t.me/StepNyDebate' }
    ]
  };

  let currentLang = ['kz', 'ru', 'en'].includes(LAYOUT_CONFIG.defaultLang) ? LAYOUT_CONFIG.defaultLang : 'ru';
  const openAccordions = new Set();

  if (!document.getElementById('stepny-layout-style')) {
    const style = document.createElement('style');
    style.id = 'stepny-layout-style';
    style.textContent = `
      .stepny-acc-content { display: none; }
      .stepny-acc-content.open { display: block; }
    `;
    document.head.appendChild(style);
  }

  function isCurrentPath(href) {
    const normalize = (p) => p.replace(/\/+$/, '') || '/';
    return normalize(window.location.pathname) === normalize(withBase(href));
  }

  function mountHeaderAndMenu() {
    const headerMount = document.getElementById('site-header');
    if (!headerMount) return;

    headerMount.innerHTML = `
      <header class="sticky top-0 z-40 bg-[#FAF9F6] border-b-2 border-[#111111]">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          <a href="${withBase('/')}" class="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#111111] select-none shrink-0">
            Step<span class="text-[#0047AB]">Ny</span> Debate
          </a>

          <div class="flex items-center gap-3 sm:gap-4">
            <div role="group" aria-label="Language switcher" class="inline-flex border-2 border-[#111111] bg-[#FAF9F6]">
              <button type="button" data-lang-btn="kz" class="lang-btn px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-r-2 border-[#111111] transition-colors cursor-pointer">kz</button>
              <button type="button" data-lang-btn="ru" class="lang-btn px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-r-2 border-[#111111] transition-colors cursor-pointer">ru</button>
              <button type="button" data-lang-btn="en" class="lang-btn px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer">en</button>
            </div>

            <button
              id="menu-open-btn"
              type="button"
              aria-label="Открыть меню"
              class="p-2.5 border-2 border-[#111111] bg-[#FAF9F6] hover:bg-[#111111] hover:text-[#FAF9F6] active:scale-95 transition-all cursor-pointer flex flex-col justify-center items-center gap-1.5 w-11 h-10"
            >
              <span class="block w-5 h-0.5 bg-current"></span>
              <span class="block w-5 h-0.5 bg-current"></span>
              <span class="block w-5 h-0.5 bg-current"></span>
            </button>
          </div>
        </div>
      </header>

      <div id="menu-backdrop" class="fixed inset-0 z-50 bg-[#111111]/40 hidden"></div>
      <aside
        id="slide-menu"
        aria-hidden="true"
        class="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[#FAF9F6] border-l-2 border-[#111111] transform translate-x-full transition-transform duration-200 ease-out flex flex-col justify-between overflow-y-auto"
      >
        <div class="p-6 sm:p-8">
          <div class="flex items-center justify-between gap-2 pb-6 mb-6 border-b-2 border-[#111111]">
            <a href="${withBase('/')}" class="font-display text-base sm:text-lg font-extrabold tracking-tight text-[#111111] truncate">
              Step<span class="text-[#0047AB]">Ny</span> Debate
            </a>

            <div class="flex items-center gap-2 shrink-0">
              <div role="group" aria-label="Menu language switcher" class="inline-flex border-2 border-[#111111] bg-[#FAF9F6] shrink-0">
                <button type="button" data-lang-btn="kz" class="lang-btn px-2 py-1.5 text-xs font-bold uppercase tracking-wider border-r-2 border-[#111111] transition-colors cursor-pointer">kz</button>
                <button type="button" data-lang-btn="ru" class="lang-btn px-2 py-1.5 text-xs font-bold uppercase tracking-wider border-r-2 border-[#111111] transition-colors cursor-pointer">ru</button>
                <button type="button" data-lang-btn="en" class="lang-btn px-2 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">en</button>
              </div>

              <button
                id="menu-close-btn"
                type="button"
                aria-label="Закрыть меню"
                class="w-9 h-9 shrink-0 border-2 border-[#111111] flex items-center justify-center text-base font-bold hover:bg-[#111111] hover:text-[#FAF9F6] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          <nav id="menu-sections-container" class="space-y-7 text-[#111111]"></nav>
        </div>

        <div class="p-6 sm:p-8 font-display text-sm font-extrabold text-[#111111]">
          © Step<span class="text-[#0047AB]">Ny</span> Debate
        </div>
      </aside>
    `;

    const menuOpenBtn = document.getElementById('menu-open-btn');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const slideMenu = document.getElementById('slide-menu');
    const menuBackdrop = document.getElementById('menu-backdrop');

    const openMenu = () => {
      slideMenu.classList.remove('translate-x-full');
      slideMenu.setAttribute('aria-hidden', 'false');
      menuBackdrop.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      slideMenu.classList.add('translate-x-full');
      slideMenu.setAttribute('aria-hidden', 'true');
      menuBackdrop.classList.add('hidden');
      document.body.style.overflow = '';
    };

    window.closeStepNyMenu = closeMenu;

    menuOpenBtn.addEventListener('click', openMenu);
    menuCloseBtn.addEventListener('click', closeMenu);
    menuBackdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    headerMount.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.setStepNyLanguage(btn.getAttribute('data-lang-btn'));
      });
    });
  }

  function renderMenu(lang) {
    const container = document.getElementById('menu-sections-container');
    if (!container) return;

    container.innerHTML = LAYOUT_CONFIG.MENU_SECTIONS.map((section) => {
      const title = section.title[lang] || section.title.ru;
      const itemsHtml = section.items
        .map((item) => {
          const label = item.label[lang] || item.label.ru;
          const activeClass = isCurrentPath(item.href) ? 'text-[#0047AB] font-bold' : 'hover:text-[#0047AB]';
          return `
            <li>
              <a href="${withBase(item.href)}" data-menu-link class="${activeClass} transition-colors inline-flex items-center gap-2">
                <span>•</span><span>${label}</span>
              </a>
            </li>
          `;
        })
        .join('');

      if (section.type === 'accordion') {
        const isOpen = openAccordions.has(section.id);
        return `
          <div>
            <button
              type="button"
              data-accordion-toggle="${section.id}"
              aria-expanded="${isOpen}"
              class="w-full flex items-center justify-between text-left text-sm font-extrabold uppercase tracking-wider text-[#111111] hover:text-[#0047AB] transition-colors cursor-pointer"
            >
              <span>${title}</span>
              <span class="accordion-arrow text-xs transition-transform duration-150" style="transform: ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}">▼</span>
            </button>
            <ul id="stepny-acc-${section.id}" class="stepny-acc-content ${isOpen ? 'open' : ''} space-y-2.5 pl-1 pt-3 text-base font-medium">
              ${itemsHtml}
            </ul>
          </div>
        `;
      }

      return `
        <div>
          <p class="text-sm font-extrabold uppercase tracking-wider text-[#111111] mb-3">${title}</p>
          <ul class="space-y-2.5 pl-1 text-base font-medium">${itemsHtml}</ul>
        </div>
      `;
    }).join('');

    container.querySelectorAll('[data-accordion-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-accordion-toggle');
        const content = document.getElementById(`stepny-acc-${id}`);
        const arrow = btn.querySelector('.accordion-arrow');
        const nowOpen = content.classList.toggle('open');
        if (nowOpen) openAccordions.add(id);
        else openAccordions.delete(id);
        btn.setAttribute('aria-expanded', String(nowOpen));
        if (arrow) arrow.style.transform = nowOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      });
    });

    container.querySelectorAll('[data-menu-link]').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.closeStepNyMenu) window.closeStepNyMenu();
      });
    });
  }

  function renderFooter(lang) {
    const footerMount = document.getElementById('site-footer');
    if (!footerMount) return;

    const linksHtml = LAYOUT_CONFIG.FOOTER_LINKS.map((link) => {
      const label = link.label[lang] || link.label.ru;
      return `
        <li>
          <a href="${withBase(link.href)}" class="hover:text-[#0047AB] transition-colors inline-block">${label}</a>
        </li>
      `;
    }).join('');

    const contactsHtml = LAYOUT_CONFIG.CONTACTS.map((c) => {
      const ext = c.href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<p><a href="${c.href}"${ext} class="hover:text-[#0047AB] transition-colors">${c.text}</a></p>`;
    }).join('');

    footerMount.innerHTML = `
      <footer class="w-full bg-[#EFECE4] mt-6">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
            <div>
              <p class="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#111111] mb-6">
                © Step<span class="text-[#0047AB]">Ny</span> Debate
              </p>
              <ul class="space-y-3 text-base font-semibold">${linksHtml}</ul>
            </div>

            <div class="space-y-2 text-base">
              <p class="font-extrabold text-[#111111] mb-2">
                ${LAYOUT_CONFIG.CONTACTS_TITLE[lang] || LAYOUT_CONFIG.CONTACTS_TITLE.ru}
              </p>
              <div class="space-y-2 font-medium">${contactsHtml}</div>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  window.setStepNyLanguage = function (lang) {
    if (!['kz', 'ru', 'en'].includes(lang)) return;
    currentLang = lang;
    localStorage.setItem('stepny_lang', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const isActive = btn.getAttribute('data-lang-btn') === lang;
      btn.classList.toggle('bg-[#111111]', isActive);
      btn.classList.toggle('text-[#FAF9F6]', isActive);
      btn.classList.toggle('bg-[#FAF9F6]', !isActive);
      btn.classList.toggle('text-[#111111]', !isActive);
    });

    renderMenu(lang);
    renderFooter(lang);

    window.dispatchEvent(new CustomEvent('stepny:langchange', { detail: { lang } }));
  };

  mountHeaderAndMenu();
  window.setStepNyLanguage(currentLang);
})();
