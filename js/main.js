/**
 * Applies Constants values to {{PLACEHOLDER}} tokens across the page.
 */
(function initApp() {
    applyConstants();
    initCursorGlow();
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

function initCursorGlow() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (prefersReduced || !hasFinePointer || !document.body) {
        return;
    }

    const wrap = document.createElement('div');
    wrap.className = 'cursor-glow-wrap';
    wrap.setAttribute('aria-hidden', 'true');

    const glowOuter = document.createElement('div');
    glowOuter.className = 'cursor-glow cursor-glow--outer';

    const glowInner = document.createElement('div');
    glowInner.className = 'cursor-glow cursor-glow--inner';

    wrap.append(glowOuter, glowInner);
    document.body.insertBefore(wrap, document.body.firstChild);
    document.body.classList.add('has-cursor-glow');

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.35;
    let currentX = targetX;
    let currentY = targetY;
    let isActive = false;
    let rafId = 0;

    function setGlowPosition(x, y) {
        const transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        glowOuter.style.transform = transform;
        glowInner.style.transform = transform;
    }

    function tick() {
        currentX += (targetX - currentX) * 0.14;
        currentY += (targetY - currentY) * 0.14;
        setGlowPosition(currentX, currentY);
        rafId = requestAnimationFrame(tick);
    }

    function onPointerMove(event) {
        targetX = event.clientX;
        targetY = event.clientY;

        if (!isActive) {
            isActive = true;
            wrap.classList.add('is-active');
            currentX = targetX;
            currentY = targetY;
            if (!rafId) {
                rafId = requestAnimationFrame(tick);
            }
        }
    }

    function onPointerLeave() {
        isActive = false;
        wrap.classList.remove('is-active');
    }

    setGlowPosition(currentX, currentY);
    rafId = requestAnimationFrame(tick);

    document.addEventListener('mousemove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);

    document.addEventListener(
        'mouseover',
        (event) => {
            if (event.target.closest('a, button, .home-link, .home-feature, .btn-back, .download-btn')) {
                wrap.classList.add('is-intense');
            }
        },
        { passive: true }
    );

    document.addEventListener(
        'mouseout',
        (event) => {
            if (event.target.closest('a, button, .home-link, .home-feature, .btn-back, .download-btn')) {
                wrap.classList.remove('is-intense');
            }
        },
        { passive: true }
    );

    window.addEventListener(
        'beforeunload',
        () => {
            document.removeEventListener('mousemove', onPointerMove);
            document.removeEventListener('mouseleave', onPointerLeave);
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
        },
        { once: true }
    );
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
