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
