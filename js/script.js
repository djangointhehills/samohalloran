document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    const navAnchors = document.querySelectorAll('.nav-links a');
    const hero = document.getElementById('hero');
    const heroBg = document.querySelector('.hero-bg img');

    // ---- NAV APPEARANCE ----

    const updateNav = () => {
        nav.classList.toggle('scrolled', window.scrollY > 10);

        if (hero) {
            const heroBottom = hero.offsetTop + hero.offsetHeight - nav.offsetHeight;
            nav.classList.toggle('nav-dark', window.scrollY < heroBottom);
        }
    };

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    // ---- MOBILE MENU ----

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // ---- YOUTUBE FACADE ----

    document.querySelectorAll('.video-facade').forEach(facade => {
        const originalHTML = facade.innerHTML;
        const activate = () => {
            document.querySelectorAll('.video-wrap iframe').forEach(iframe => {
                const wrap = iframe.closest('.video-wrap');
                wrap.innerHTML = wrap._originalHTML;
                wrap.classList.add('video-facade');
                wrap.setAttribute('role', 'button');
                wrap.setAttribute('tabindex', '0');
                wrap.style.cursor = '';
            });
            facade._originalHTML = originalHTML;
            const id = facade.dataset.id;
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            facade.innerHTML = '';
            facade.appendChild(iframe);
            facade.classList.remove('video-facade');
            facade.removeAttribute('role');
            facade.removeAttribute('tabindex');
            facade.style.cursor = 'default';
        };
        facade.addEventListener('click', activate);
        facade.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });

    // ---- SCROLL TRACKING: URL HASH + ACTIVE NAV ----

    const sections = document.querySelectorAll('main > section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    let scrollingFromClick = false;

    const setActiveNav = (id) => {
        navLinks.forEach(link => {
            const isMatch = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isMatch);
        });
    };

    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', () => {
            scrollingFromClick = true;
            const href = anchor.getAttribute('href');
            if (href && href.startsWith('#')) {
                setActiveNav(href.slice(1));
            }
            setTimeout(() => { scrollingFromClick = false; }, 1200);
        });
    });

    let scrollTicking = false;
    const updateActiveSection = () => {
        if (scrollingFromClick) return;
        const atBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 50);
        let current = '';
        if (atBottom && sections.length) {
            current = sections[sections.length - 1].id;
        } else {
            const offset = window.scrollY + nav.offsetHeight + 80;
            sections.forEach(section => {
                if (section.offsetTop <= offset) {
                    current = section.id;
                }
            });
        }
        const hash = current === 'hero' || !current ? '' : `#${current}`;
        if (window.location.hash !== hash) {
            history.replaceState(null, '', hash || window.location.pathname);
        }
        setActiveNav(current);
    };

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                updateActiveSection();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });
    updateActiveSection();

    // ---- STAGGERED FADE-INS ----

    const fadeTargets = document.querySelectorAll(
        '.ensemble-card, .about-photo, .about-text, .contact-section'
    );

    fadeTargets.forEach((el, i) => {
        el.classList.add('fade-in');
        const isCard = el.classList.contains('ensemble-card');
        if (isCard) {
            el.style.transitionDelay = `${(i % 2) * 0.12}s`;
        }
    });

    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        fadeObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );
        fadeTargets.forEach(el => fadeObserver.observe(el));
    } else {
        fadeTargets.forEach(el => el.classList.add('visible'));
    }

    // ---- HERO PARALLAX ----

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (heroBg && !prefersReducedMotion) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const heroH = hero.offsetHeight;
                    if (scrollY < heroH) {
                        heroBg.style.transform = `translateY(${scrollY * 0.15}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
});
