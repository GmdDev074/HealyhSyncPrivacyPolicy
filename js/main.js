/**
 * Applies Constants values to {{PLACEHOLDER}} tokens across the page.
 */
(function applyConstants() {
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
})();
