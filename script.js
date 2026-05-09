// Y-Olé Catamarán — script.js

(function () {
    'use strict';

    // --- Navbar: transparent → solid on scroll ---
    const navbar     = document.getElementById('navbar');
    const scrollTop  = document.getElementById('scrollTop');

    function onScroll() {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 60);
        scrollTop.classList.toggle('visible', y > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Hero parallax fade ---
    const heroContent = document.querySelector('.hero-content');
    const heroH = window.innerHeight;
    window.addEventListener('scroll', function () {
        const y = window.scrollY;
        if (heroContent && y < heroH) {
            heroContent.style.transform = 'translateY(' + (y * 0.28) + 'px)';
            heroContent.style.opacity   = String(1 - y / (heroH * 0.75));
        }
    }, { passive: true });

    // --- Mobile menu ---
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');

    navToggle.addEventListener('click', function () {
        const open = navMenu.classList.toggle('open');
        navToggle.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // --- Scroll to top ---
    scrollTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - navH,
                behavior: 'smooth'
            });
        });
    });

    // --- Intersection Observer: fade-in animations ---
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var delay = Number(entry.target.dataset.delay) || 0;
            setTimeout(function () {
                entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-animate]').forEach(function (el) {
        observer.observe(el);
    });

    // --- Gallery strip: drag to scroll ---
    var strip = document.getElementById('galleryStrip');
    if (strip) {
        var isDown   = false;
        var startX   = 0;
        var scrollL  = 0;

        strip.addEventListener('mousedown', function (e) {
            isDown  = true;
            startX  = e.pageX - strip.offsetLeft;
            scrollL = strip.scrollLeft;
        });
        strip.addEventListener('mouseleave', function () { isDown = false; });
        strip.addEventListener('mouseup',    function () { isDown = false; });
        strip.addEventListener('mousemove',  function (e) {
            if (!isDown) return;
            e.preventDefault();
            var x    = e.pageX - strip.offsetLeft;
            var walk = (x - startX) * 1.6;
            strip.scrollLeft = scrollL - walk;
        });
    }

})();

// ============================================================
// I18N — Language switcher
// ============================================================
(function () {
    'use strict';

    var TRANSLATIONS = {
        es: {
            'nav.paseos':        'Paseos diarios',
            'nav.especiales':    'Salidas especiales',
            'nav.privados':      'Eventos privados',
            'nav.contacto':      'Contacto',
            'nav.toggle':        'Abrir menú',
            'hero.eyebrow':      'CARTAGENA · MAR',
            'hero.pill1':        '⚓ 97 pasajeros',
            'hero.pill2':        '🌊 Salidas todo el año',
            'hero.pill3':        '🏊 Zona de baño',
            'hero.cta':          'Explorar',
            'paseos.label':      'Paseos diarios',
            'paseos.title':      'La bahía de Cartagena<br><em>desde el agua</em>',
            'paseos.lead':       '45 minutos navegando por uno de los puertos más espectaculares del Mediterráneo. Sin reserva previa. Puerto de Cartagena, junto a la bandera de España.',
            'price.adult':       'Adulto',
            'price.senior':      'Senior / Joven',
            'price.child':       'Niño (3 – 9 años)',
            'price.under3':      'Menor de 3 años',
            'price.free':        'Gratis',
            'price.retired':     'Jubilado / Adolescente',
            'price.child2':      'Niño',
            'embarque.label':    'Dónde embarcamos',
            'embarque.location': 'Puerto de Cartagena, junto a la bandera de España',
            'embarque.hours':    'Todos los días · 11:00 – 19:00 h',
            'btn.directions':    'Cómo llegar',
            'chip.45min':        '45 minutos',
            'chip.port':         'Puerto de Cartagena',
            'chip.yearround':    'Todo el año',
            'chip.noreserve':    'Sin reserva previa',
            'chip.3h':           '3 horas',
            'chip.swim':         '🏊 Baño incluido',
            'paseos.note':       'Venta de entradas en la <strong>caseta del embarcadero</strong> · Puerto de Cartagena · Efectivo y tarjeta',
            'esp.label':         'Salidas especiales',
            'esp.title':         'Tres horas en<br><em>alta mar</em>',
            'esp.lead':          'Una experiencia más intensa: navegación prolongada por la bahía de Cartagena con parada para baño en aguas cristalinas del Mediterráneo.',
            'reserva.label':     'Reserva por teléfono o WhatsApp',
            'btn.wa':            'Reservar por WhatsApp',
            'priv.label':        'Eventos privados',
            'priv.title':        'El catamarán,<br><em>solo para vosotros</em>',
            'priv.lead':         'Hasta 97 pasajeros. Celebraciones, despedidas, teambuilding, rutas a medida. Cada propuesta es única y se estudia individualmente.',
            'priv.stat1':        'personas máximo',
            'priv.stat2':        'personalización',
            'priv.stat3':        'meses disponibles',
            'priv.intro':        'Solicitudes por correo electrónico:',
            'priv.note':         'Estudiamos cada propuesta y respondemos por correo en el menor tiempo posible.',
            'contact.label':     'Contacto',
            'contact.title':     'Estamos en el puerto',
            'contact.where':     'Dónde encontrarnos',
            'contact.location':  'Puerto de Cartagena,<br>junto a la bandera de España',
            'contact.schedule':  'Horario de salidas',
            'contact.hours':     'Todos los días<br>11:00 – 19:00 h',
            'contact.phone':     'Teléfono / WhatsApp',
            'contact.email':     'Email',
            'btn.wa.lg':         'Escríbenos por WhatsApp',
            'footer.brand':      'Paseos en catamarán por la bahía<br>de Cartagena, Mediterráneo.',
            'footer.nav':        'Navegación',
            'footer.contact':    'Contacto',
            'footer.legal':      'Legal',
            'footer.legal1':     'Aviso legal',
            'footer.legal2':     'Política de privacidad',
            'footer.legal3':     'Política de cookies',
            'footer.legal4':     'Condiciones generales',
            'footer.copy':       '© 2025 Y-Olé Catamarán · Todos los derechos reservados',
        },
        en: {
            'nav.paseos':        'Daily trips',
            'nav.especiales':    'Special outings',
            'nav.privados':      'Private events',
            'nav.contacto':      'Contact',
            'nav.toggle':        'Open menu',
            'hero.eyebrow':      'CARTAGENA · SEA',
            'hero.pill1':        '⚓ 97 passengers',
            'hero.pill2':        '🌊 Year-round departures',
            'hero.pill3':        '🏊 Swimming area',
            'hero.cta':          'Explore',
            'paseos.label':      'Daily trips',
            'paseos.title':      'Cartagena Bay<br><em>from the water</em>',
            'paseos.lead':       '45 minutes sailing through one of the most spectacular ports in the Mediterranean. No prior reservation required. Port of Cartagena, next to the Spanish flag.',
            'price.adult':       'Adult',
            'price.senior':      'Senior / Youth',
            'price.child':       'Child (3 – 9 years)',
            'price.under3':      'Under 3 years',
            'price.free':        'Free',
            'price.retired':     'Senior / Teenager',
            'price.child2':      'Child',
            'embarque.label':    'Where we board',
            'embarque.location': 'Port of Cartagena, next to the Spanish flag',
            'embarque.hours':    'Every day · 11:00 – 19:00',
            'btn.directions':    'Get directions',
            'chip.45min':        '45 minutes',
            'chip.port':         'Port of Cartagena',
            'chip.yearround':    'Year-round',
            'chip.noreserve':    'No reservation needed',
            'chip.3h':           '3 hours',
            'chip.swim':         '🏊 Swimming included',
            'paseos.note':       'Tickets sold at the <strong>boarding booth</strong> · Port of Cartagena · Cash and card',
            'esp.label':         'Special outings',
            'esp.title':         'Three hours<br><em>at sea</em>',
            'esp.lead':          'A more intense experience: extended sailing around Cartagena Bay with a swimming stop in the crystal-clear Mediterranean waters.',
            'reserva.label':     'Book by phone or WhatsApp',
            'btn.wa':            'Book on WhatsApp',
            'priv.label':        'Private events',
            'priv.title':        'The catamaran,<br><em>just for you</em>',
            'priv.lead':         'Up to 97 passengers. Celebrations, farewells, team building, custom routes. Every proposal is unique and studied individually.',
            'priv.stat1':        'maximum people',
            'priv.stat2':        'customisation',
            'priv.stat3':        'months available',
            'priv.intro':        'Enquiries by email:',
            'priv.note':         'We study each proposal and reply by email as soon as possible.',
            'contact.label':     'Contact',
            'contact.title':     'We\'re at the port',
            'contact.where':     'Where to find us',
            'contact.location':  'Port of Cartagena,<br>next to the Spanish flag',
            'contact.schedule':  'Departure schedule',
            'contact.hours':     'Every day<br>11:00 – 19:00',
            'contact.phone':     'Phone / WhatsApp',
            'contact.email':     'Email',
            'btn.wa.lg':         'Message us on WhatsApp',
            'footer.brand':      'Catamaran trips in the bay<br>of Cartagena, Mediterranean.',
            'footer.nav':        'Navigation',
            'footer.contact':    'Contact',
            'footer.legal':      'Legal',
            'footer.legal1':     'Legal notice',
            'footer.legal2':     'Privacy policy',
            'footer.legal3':     'Cookie policy',
            'footer.legal4':     'General terms',
            'footer.copy':       '© 2025 Y-Olé Catamarán · All rights reserved',
        },
        fr: {
            'nav.paseos':        'Sorties quotidiennes',
            'nav.especiales':    'Sorties spéciales',
            'nav.privados':      'Événements privés',
            'nav.contacto':      'Contact',
            'nav.toggle':        'Ouvrir le menu',
            'hero.eyebrow':      'CARTHAGÈNE · MER',
            'hero.pill1':        '⚓ 97 passagers',
            'hero.pill2':        '🌊 Départs toute l\'année',
            'hero.pill3':        '🏊 Zone de baignade',
            'hero.cta':          'Explorer',
            'paseos.label':      'Sorties quotidiennes',
            'paseos.title':      'La baie de Carthagène<br><em>depuis l\'eau</em>',
            'paseos.lead':       '45 minutes à naviguer dans l\'un des ports les plus spectaculaires de la Méditerranée. Sans réservation préalable. Port de Carthagène, près du drapeau espagnol.',
            'price.adult':       'Adulte',
            'price.senior':      'Senior / Jeune',
            'price.child':       'Enfant (3 – 9 ans)',
            'price.under3':      'Moins de 3 ans',
            'price.free':        'Gratuit',
            'price.retired':     'Retraité / Adolescent',
            'price.child2':      'Enfant',
            'embarque.label':    'Où nous embarquons',
            'embarque.location': 'Port de Carthagène, près du drapeau espagnol',
            'embarque.hours':    'Tous les jours · 11:00 – 19:00',
            'btn.directions':    'Comment y aller',
            'chip.45min':        '45 minutes',
            'chip.port':         'Port de Carthagène',
            'chip.yearround':    'Toute l\'année',
            'chip.noreserve':    'Sans réservation',
            'chip.3h':           '3 heures',
            'chip.swim':         '🏊 Baignade incluse',
            'paseos.note':       'Billets vendus à la <strong>cabine d\'embarquement</strong> · Port de Carthagène · Espèces et carte',
            'esp.label':         'Sorties spéciales',
            'esp.title':         'Trois heures<br><em>en haute mer</em>',
            'esp.lead':          'Une expérience plus intense : navigation prolongée dans la baie de Carthagène avec une pause baignade dans les eaux cristallines de la Méditerranée.',
            'reserva.label':     'Réservez par téléphone ou WhatsApp',
            'btn.wa':            'Réserver sur WhatsApp',
            'priv.label':        'Événements privés',
            'priv.title':        'Le catamaran,<br><em>rien que pour vous</em>',
            'priv.lead':         'Jusqu\'à 97 passagers. Célébrations, enterrements de vie, team building, itinéraires sur mesure. Chaque proposition est unique et étudiée individuellement.',
            'priv.stat1':        'personnes maximum',
            'priv.stat2':        'personnalisation',
            'priv.stat3':        'mois disponibles',
            'priv.intro':        'Demandes par e-mail :',
            'priv.note':         'Nous étudions chaque proposition et répondons par e-mail dans les meilleurs délais.',
            'contact.label':     'Contact',
            'contact.title':     'Nous sommes au port',
            'contact.where':     'Où nous trouver',
            'contact.location':  'Port de Carthagène,<br>près du drapeau espagnol',
            'contact.schedule':  'Horaire des départs',
            'contact.hours':     'Tous les jours<br>11:00 – 19:00',
            'contact.phone':     'Téléphone / WhatsApp',
            'contact.email':     'E-mail',
            'btn.wa.lg':         'Écrivez-nous sur WhatsApp',
            'footer.brand':      'Sorties en catamaran dans la baie<br>de Carthagène, Méditerranée.',
            'footer.nav':        'Navigation',
            'footer.contact':    'Contact',
            'footer.legal':      'Mentions légales',
            'footer.legal1':     'Mentions légales',
            'footer.legal2':     'Politique de confidentialité',
            'footer.legal3':     'Politique de cookies',
            'footer.legal4':     'Conditions générales',
            'footer.copy':       '© 2025 Y-Olé Catamarán · Tous droits réservés',
        }
    };

    var LANGS = ['es', 'en', 'fr'];
    var currentLang = 'es';

    function applyLang(lang) {
        if (!TRANSLATIONS[lang]) return;
        currentLang = lang;
        var t = TRANSLATIONS[lang];

        document.documentElement.lang = lang;
        localStorage.setItem('ylang', lang);

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) el.textContent = t[key];
        });

        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-html');
            if (t[key] !== undefined) el.innerHTML = t[key];
        });

        document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-aria');
            if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
        });

        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
    }

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            applyLang(btn.getAttribute('data-lang'));
        });
    });

    var saved = localStorage.getItem('ylang');
    applyLang(LANGS.indexOf(saved) !== -1 ? saved : 'es');

}());
