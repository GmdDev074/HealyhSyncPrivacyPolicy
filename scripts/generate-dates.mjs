/**
 * Generates js/constants.generated.js with last-updated dates derived from git history.
 * Run before deploy or locally: node scripts/generate-dates.mjs
 */
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputPath = join(rootDir, 'js', 'constants.generated.js');

const PRIVACY_WATCH_FILES = [
    'privacy-policy.html',
    'js/constants.js',
    'css/style.css',
];

const TERMS_WATCH_FILES = [
    'terms-and-conditions.html',
    'js/constants.js',
    'css/style.css',
];

function runGit(command) {
    try {
        return execSync(command, {
            cwd: rootDir,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();
    } catch {
        return '';
    }
}

function getLastCommitDateForFiles(files) {
    const timestamps = [];

    for (const file of files) {
        const iso = runGit(`git log -1 --format=%cI -- "${file}"`);
        if (iso) {
            timestamps.push(new Date(iso).getTime());
        }
    }

    if (timestamps.length > 0) {
        return new Date(Math.max(...timestamps));
    }

    const iso = runGit('git log -1 --format=%cI');
    return iso ? new Date(iso) : new Date();
}

function formatDisplayDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function resolveSiteBaseUrl() {
    const repo = process.env.GITHUB_REPOSITORY;
    if (!repo) {
        return '';
    }

    const [owner, name] = repo.split('/');
    if (!owner || !name) {
        return '';
    }

    return `https://${owner}.github.io/${name}/`;
}

const privacyDate = formatDisplayDate(getLastCommitDateForFiles(PRIVACY_WATCH_FILES));
const termsDate = formatDisplayDate(getLastCommitDateForFiles(TERMS_WATCH_FILES));
const copyrightYear = String(new Date().getFullYear());
const siteBaseUrl = resolveSiteBaseUrl();

const generated = `/**
 * AUTO-GENERATED — do not edit manually.
 * Produced by scripts/generate-dates.mjs from git history and CI environment.
 * Regenerated on every GitHub Actions build when tracked files change.
 */
Constants.PRIVACY_LAST_UPDATED = ${JSON.stringify(privacyDate)};
Constants.TERMS_LAST_UPDATED = ${JSON.stringify(termsDate)};
Constants.COPYRIGHT_YEAR = ${JSON.stringify(copyrightYear)};
Constants.SITE_BASE_URL = ${JSON.stringify(siteBaseUrl)};
`;

writeFileSync(outputPath, generated, 'utf8');

console.log('Generated js/constants.generated.js');
console.log(`  PRIVACY_LAST_UPDATED: ${privacyDate}`);
console.log(`  TERMS_LAST_UPDATED:   ${termsDate}`);
console.log(`  COPYRIGHT_YEAR:       ${copyrightYear}`);
if (siteBaseUrl) {
    console.log(`  SITE_BASE_URL:        ${siteBaseUrl}`);
}
