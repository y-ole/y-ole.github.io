// =============================================
// Y-OLÉ CATAMARÁN · SCRIPT.JS
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // === NAVBAR & ACTIVE LINK ===
    const navbar       = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTop');
    const sections     = document.querySelectorAll('section[id]');
    const navLinks     = document.querySelectorAll('.nav-link');

    // Defined before onScroll so it can be called immediately
    const updateActiveLink = () => {
        const scrollPos = window.scrollY + navbar.offsetHeight + 20;

        sections.forEach(section => {
            const top    = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id     = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    const isMatch = link.getAttribute('href') === `#${id}`;
                    link.classList.toggle('active', isMatch);
                });
            }
        });
    };

    const onScroll = () => {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 50);
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', y > 400);
        }
        updateActiveLink();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load — updateActiveLink is already defined above

    // === MOBILE MENU ===
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');

    // Inject overlay element
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    const openMenu = () => {
        navMenu.classList.add('open');
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
        navMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
    });

    // === SMOOTH SCROLL ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });

    // === SCROLL TO TOP ===
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // === SCROLL ANIMATIONS (IntersectionObserver) ===
    const animItems = document.querySelectorAll('[data-animate]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const delay = parseInt(entry.target.dataset.delay || 0, 10);
                setTimeout(() => entry.target.classList.add('animated'), delay);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        animItems.forEach(el => observer.observe(el));
    } else {
        // Fallback: show everything immediately
        animItems.forEach(el => el.classList.add('animated'));
    }

    // ================================================================
    // BOOKEO INTEGRATION HELPER
    // ================================================================
    // Call window.loadBookeo(config) when you're ready to activate
    // the booking widget. It replaces the placeholder with the widget.
    //
    // Example usage after setting up Bookeo:
    //
    //   window.loadBookeo({
    //       accountId: 'YOUR_ACCOUNT_ID',
    //       productId: 'YOUR_PRODUCT_ID',
    //       language: 'es-ES'
    //   });
    //
    // The function removes the placeholder and injects the Bookeo script.
    // ================================================================
    window.loadBookeo = (config = {}) => {
        const widget = document.getElementById('bookeo-widget');
        if (!widget) return;

        // Remove placeholder content
        widget.innerHTML = '';
        widget.style.border = 'none';
        widget.style.background = 'transparent';
        widget.style.padding = '0';

        // Inject Bookeo script (replace URL with actual Bookeo widget URL)
        const script = document.createElement('script');
        script.src   = 'https://bookeo.com/widget.js';
        script.async = true;

        window.__bookeo_config = {
            accountId: config.accountId || '',
            productId: config.productId || '',
            language:  config.language  || 'es-ES',
        };

        widget.appendChild(script);
        console.info('[Y-Olé] Bookeo widget loaded with config:', window.__bookeo_config);
    };

});
