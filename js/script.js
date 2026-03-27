document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    const navAnchors = document.querySelectorAll('.nav-links a');
    const hero = document.getElementById('hero');

    const updateNav = () => {
        nav.classList.toggle('scrolled', window.scrollY > 10);

        if (hero) {
            const heroBottom = hero.offsetTop + hero.offsetHeight - nav.offsetHeight;
            nav.classList.toggle('nav-dark', window.scrollY < heroBottom);
        }
    };

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

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

    const fadeTargets = document.querySelectorAll(
        '.ensemble-card, .about-content, .contact-section'
    );

    fadeTargets.forEach(el => el.classList.add('fade-in'));

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        fadeTargets.forEach(el => observer.observe(el));
    } else {
        fadeTargets.forEach(el => el.classList.add('visible'));
    }
});
