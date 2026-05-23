/**
 * Builds the publishable _site folder:
 * 1. Generates js/site-dates.js from git history
 * 2. Copies static assets
 * 3. Pre-renders {{PLACEHOLDERS}} in HTML so dates work even without runtime JS
 */
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const siteDir = join(rootDir, '_site');

const HTML_FILES = ['index.html', 'privacy-policy.html', 'terms-and-conditions.html'];

execSync('node scripts/generate-dates.mjs', { cwd: rootDir, stdio: 'inherit' });

function loadSiteValues() {
    const constantsJs = readFileSync(join(rootDir, 'js', 'constants.js'), 'utf8');
    const siteDates = readFileSync(join(rootDir, 'js', 'site-dates.js'), 'utf8');
    const context = { Constants: undefined, result: undefined };

    vm.createContext(context);
    vm.runInContext(`${constantsJs}\n${siteDates}\nresult = Constants.getAll();`, context);

    return context.result;
}

function replaceTokens(text, values) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) =>
        Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match
    );
}

const values = loadSiteValues();

mkdirSync(siteDir, { recursive: true });
cpSync(join(rootDir, 'css'), join(siteDir, 'css'), { recursive: true });
cpSync(join(rootDir, 'js'), join(siteDir, 'js'), { recursive: true });
cpSync(join(rootDir, '.nojekyll'), join(siteDir, '.nojekyll'));

for (const file of HTML_FILES) {
    const source = readFileSync(join(rootDir, file), 'utf8');
    writeFileSync(join(siteDir, file), replaceTokens(source, values), 'utf8');
}

console.log('Built _site with pre-rendered dates:');
console.log(`  PRIVACY_LAST_UPDATED: ${values.PRIVACY_LAST_UPDATED}`);
console.log(`  TERMS_LAST_UPDATED:   ${values.TERMS_LAST_UPDATED}`);
