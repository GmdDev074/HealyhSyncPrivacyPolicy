/**
 * Applies Constants values to {{PLACEHOLDER}} tokens across the page.
 */
(function initApp() {
    applyConstants();
    initMobileNav();
})();

function applyConstants() {
    if (typeof Constants === 'undefined') {
        return;
    }

    const values = Constants.getAll();

    function replaceTokens(text) {
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) =>
            Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match
        );
    }

    document.title = replaceTokens(document.title);

    document.querySelectorAll('meta[content]').forEach((meta) => {
        const content = meta.getAttribute('content');
        if (content && content.includes('{{')) {
            meta.setAttribute('content', replaceTokens(content));
        }
    });

    if (document.body) {
        document.body.innerHTML = replaceTokens(document.body.innerHTML);
    }
}

function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const backdrop = document.querySelector('.nav-backdrop');

    if (!toggle) {
        return;
    }

    function setNavOpen(isOpen) {
        document.body.classList.toggle('nav-open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', () => {
        setNavOpen(!document.body.classList.contains('nav-open'));
    });

    backdrop?.addEventListener('click', () => setNavOpen(false));

    document.querySelectorAll('.nav-link, .nav-cta').forEach((link) => {
        link.addEventListener('click', () => setNavOpen(false));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            setNavOpen(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setNavOpen(false);
        }
    });
}
