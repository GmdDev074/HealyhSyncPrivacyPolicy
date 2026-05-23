/**
 * Central configuration for HealthSync legal pages and site branding.
 * Edit values here — they are injected into HTML via main.js.
 *
 * Last-updated dates and copyright year are NOT set here.
 * They are generated automatically in js/site-dates.js
 * from git history when you run `npm run build` or on GitHub Actions deploy.
 */
class Constants {
    static APP_NAME = 'HealthSync';
    static APP_EMAIL = 'gmddev074@gmail.com';
    static PLAY_STORE_PACKAGE = 'com.health.sync';
    static GOOGLE_PLAY_URL = `https://play.google.com/store/apps/details?id=${Constants.PLAY_STORE_PACKAGE}`;

    static HOME_URL = 'index.html';
    static PRIVACY_POLICY_URL = 'privacy-policy.html';
    static TERMS_URL = 'terms-and-conditions.html';

    /** @type {string} Set by js/site-dates.js */
    static PRIVACY_LAST_UPDATED = '';
    /** @type {string} Set by js/site-dates.js */
    static TERMS_LAST_UPDATED = '';
    /** @type {string} Set by js/site-dates.js */
    static COPYRIGHT_YEAR = '';
    /** @type {string} Set by js/site-dates.js in CI */
    static SITE_BASE_URL = '';
    /** @type {boolean} Set by js/site-dates.js when build has run */
    static IS_BUILD_READY = false;

    static MIN_AGE = 13;

    static SERVICE_DESCRIPTION =
        'health and wellness tracking, data synchronization across devices, and personalized wellness insights';

    static APP_DESCRIPTION =
        '{{APP_NAME}} helps you track your daily health and wellness in one place. Log activity, monitor key health metrics, set goals, and keep your data securely synced across your devices — so your progress stays with you wherever you go.';

    static getAll() {
        const fallbackDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        return {
            APP_NAME: Constants.APP_NAME,
            APP_EMAIL: Constants.APP_EMAIL,
            PLAY_STORE_PACKAGE: Constants.PLAY_STORE_PACKAGE,
            GOOGLE_PLAY_URL: Constants.GOOGLE_PLAY_URL,
            HOME_URL: Constants.HOME_URL,
            PRIVACY_POLICY_URL: Constants.PRIVACY_POLICY_URL,
            TERMS_URL: Constants.TERMS_URL,
            PRIVACY_LAST_UPDATED: Constants.PRIVACY_LAST_UPDATED || fallbackDate,
            TERMS_LAST_UPDATED: Constants.TERMS_LAST_UPDATED || fallbackDate,
            COPYRIGHT_YEAR: Constants.COPYRIGHT_YEAR || String(new Date().getFullYear()),
            MIN_AGE: String(Constants.MIN_AGE),
            SERVICE_DESCRIPTION: Constants.SERVICE_DESCRIPTION,
            APP_DESCRIPTION: Constants.APP_DESCRIPTION.replace(/\{\{APP_NAME\}\}/g, Constants.APP_NAME),
            SITE_BASE_URL: Constants.SITE_BASE_URL,
        };
    }
}
