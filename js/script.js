document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js');

    const nav = document.getElementById('nav');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.getElementById('nav-links');
    const hero = document.getElementById('hero');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('main > section[id]');

    // Hide a closed mobile menu from both keyboard and assistive technology.
    if (toggle && links) {
        const desktop = window.matchMedia('(min-width: 769px)');
        let menuOpen = false;

        const setMenuOpen = (open, returnFocus = false) => {
            menuOpen = open && !desktop.matches;
            links.hidden = !desktop.matches && !menuOpen;
            links.inert = links.hidden;
            links.classList.toggle('open', menuOpen);
            toggle.classList.toggle('active', menuOpen);
            toggle.setAttribute('aria-expanded', String(menuOpen));
            toggle.setAttribute('aria-label', menuOpen ? 'Close navigation' : 'Open navigation');
            if (returnFocus) toggle.focus();
        };

        toggle.addEventListener('click', () => setMenuOpen(!menuOpen));
        navAnchors.forEach(anchor => {
            anchor.addEventListener('click', () => setMenuOpen(false));
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && menuOpen) {
                event.preventDefault();
                setMenuOpen(false, true);
            }
        });
        document.addEventListener('click', event => {
            if (menuOpen && !links.contains(event.target) && !toggle.contains(event.target)) {
                setMenuOpen(false);
            }
        });
        desktop.addEventListener('change', () => setMenuOpen(false));
        setMenuOpen(false);
    }

    // Track the visible section without replacing the visitor's URL or history.
    const updateNavigation = () => {
        if (!nav) return;
        nav.classList.toggle('scrolled', window.scrollY > 10);
        if (hero) {
            const heroBottom = hero.offsetTop + hero.offsetHeight - nav.offsetHeight;
            nav.classList.toggle('nav-dark', window.scrollY < heroBottom);
        }

        let current = '';
        const offset = window.scrollY + nav.offsetHeight + 80;
        sections.forEach(section => {
            if (section.offsetTop <= offset) current = section.id;
        });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) {
            current = sections[sections.length - 1]?.id || current;
        }
        navAnchors.forEach(anchor => {
            const active = anchor.getAttribute('href') === `#${current}`;
            anchor.classList.toggle('active', active);
            if (active) anchor.setAttribute('aria-current', 'location');
            else anchor.removeAttribute('aria-current');
        });
    };

    let navigationFramePending = false;
    const scheduleNavigationUpdate = () => {
        if (navigationFramePending) return;
        navigationFramePending = true;
        window.requestAnimationFrame(() => {
            updateNavigation();
            navigationFramePending = false;
        });
    };
    window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
    window.addEventListener('resize', scheduleNavigationUpdate);
    updateNavigation();

    // Keep YouTube unloaded until requested and stop the previous performance.
    let activePlayer = null;
    document.querySelectorAll('.video-wrap[data-id]').forEach(wrap => {
        const button = wrap.querySelector('button.video-facade');
        if (!button) return;
        button.disabled = false;

        button.addEventListener('click', () => {
            if (activePlayer) {
                activePlayer.wrap.replaceChildren(activePlayer.button);
            }
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(wrap.dataset.id)}?autoplay=1`;
            iframe.title = wrap.dataset.title || 'Live music performance';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            wrap.replaceChildren(iframe);
            activePlayer = { wrap, button };
            iframe.focus();
        });
    });

    // Prepare an email locally. Sending remains an explicit action in the visitor's email app.
    const form = document.getElementById('booking-form');
    if (!form) return;

    const preview = document.getElementById('enquiry-preview');
    const draft = document.getElementById('enquiry-draft');
    const emailLink = document.getElementById('open-email');
    const readyHeading = document.getElementById('enquiry-ready');
    const copyButton = document.getElementById('copy-enquiry');
    const status = document.getElementById('enquiry-status');
    const nameInput = form.elements.namedItem('name');
    const dateInput = form.elements.namedItem('date');
    const ensembleInput = form.elements.namedItem('ensemble');

    const updateEarliestDate = () => {
        const today = new Date();
        dateInput.min = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, '0'),
            String(today.getDate()).padStart(2, '0'),
        ].join('-');
    };

    const clearPreview = () => {
        preview.hidden = true;
        draft.value = '';
        emailLink.removeAttribute('href');
        status.textContent = '';
        nameInput.setCustomValidity('');
    };

    form.addEventListener('input', clearPreview);
    form.addEventListener('change', clearPreview);

    document.querySelectorAll('a[data-ensemble]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            event.preventDefault();
            const selection = anchor.dataset.ensemble;
            if (Array.from(ensembleInput.options).some(option => option.value === selection)) {
                ensembleInput.value = selection;
            }
            clearPreview();
            form.scrollIntoView({ block: 'start' });
            nameInput.focus({ preventScroll: true });
        });
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        updateEarliestDate();
        nameInput.setCustomValidity(nameInput.value.trim() ? '' : 'Please enter your name.');
        if (!form.reportValidity()) return;

        const value = name => form.elements.namedItem(name).value.trim();
        const subject = `Music enquiry — ${value('ensemble')}${value('date') ? ` — ${value('date')}` : ''}`;
        const body = [
            'Hi Sam,',
            '',
            'I’d like to enquire about live music for my event.',
            '',
            `Name: ${value('name')}`,
            `Email: ${value('email')}`,
            `Event date: ${value('date') || 'To be confirmed'}`,
            `Location / venue: ${value('location') || 'To be confirmed'}`,
            `Ensemble: ${value('ensemble')}`,
            '',
            `Event details: ${value('details') || 'To be discussed'}`,
            '',
            `Thanks,\n${value('name')}`,
        ].join('\n');

        draft.value = body;
        emailLink.href = `mailto:sam.ohalloran@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        status.textContent = '';
        preview.hidden = false;
        readyHeading.focus();
    });

    copyButton.addEventListener('click', async event => {
        event.preventDefault();
        const text = draft.value;
        try {
            if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
            await navigator.clipboard.writeText(text);
            if (!preview.hidden && draft.value === text) {
                status.textContent = 'Enquiry copied. Paste it into an email to sam.ohalloran@gmail.com, then send when you’re ready.';
            }
        } catch {
            if (!preview.hidden && draft.value === text) {
                draft.focus();
                draft.select();
                status.textContent = 'Automatic copying is unavailable. Copy the selected enquiry, then paste it into your email app.';
            }
        }
    });

    updateEarliestDate();
    form.hidden = false;
});
