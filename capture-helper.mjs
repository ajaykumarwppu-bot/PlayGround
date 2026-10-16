import {mkdirSync, readFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {createRequire} from 'node:module';

const url = process.env.CAPTURE_URL;
const output = process.env.CAPTURE_DIR;
if (!url || !output) {
  console.error('Set CAPTURE_URL and CAPTURE_DIR.');
  process.exit(1);
}
mkdirSync(output, {recursive: true});

const runtime = join(process.env.HOME || '/home/runner', '.local/share/omgithub-playwright');
const require = createRequire(join(runtime, 'package.json'));
const {chromium} = require('playwright');

let config = {browser: {launchOptions: {headless: true}}};
try {
  const cfgPath = join(runtime, process.platform === 'darwin' ? 'metal.json' : 'linux.json');
  if (existsSync(cfgPath)) config = JSON.parse(readFileSync(cfgPath, 'utf8'));
} catch (e) {
  console.error('config read failed, using headless fallback: ' + e.message);
}

if (process.platform === 'linux') {
  try {
    const disp = readFileSync(join(runtime, 'display'), 'utf8').trim();
    process.env.DISPLAY ||= ':' + disp;
  } catch {}
}

const transient = (err) => {
  const e = err instanceof Error ? err : new Error(String(err));
  throw Object.assign(e, {exitCode: 75});
};

let browser;
try {
  browser = await chromium.launch({...config.browser.launchOptions, timeout: 30000}).catch(transient);
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await browser.newPage({viewport: {width, height}}).catch(transient);
    page.setDefaultTimeout(30000);
    page.on('pageerror', (e) => console.error('pageerror: ' + e.message));
    let response;
    try {
      response = await page.goto(url, {waitUntil: 'load', timeout: 45000});
    } catch (e) {
      transient(e);
    }
    if (!response) {
      console.error(`no response loading ${url}`);
      process.exit(75);
    }
    const status = response.status();
    if (!response.ok()) {
      console.error(`HTTP ${status} loading preview`);
      const isTransient = [408, 429, 500, 502, 503, 504].includes(status);
      process.exit(isTransient ? 75 : 1);
    }
    try {
      await page.locator('body').waitFor({state: 'visible', timeout: 30000});
    } catch (e) {
      console.error('body not visible: ' + e.message);
      process.exit(1);
    }
    try {
      await page.waitForFunction(() => document.fonts.status === 'loaded', {timeout: 15000});
    } catch {}
    await page.waitForTimeout(2500);
    // ensure non-blank render: body must have size
    const hasContent = await page.evaluate(() => {
      const b = document.body;
      if (!b) return false;
      const text = (b.innerText || '').trim().length;
      const rect = b.getBoundingClientRect();
      return text > 0 && rect.width > 0 && rect.height > 0;
    });
    if (!hasContent) {
      console.error(`render defect: blank body on ${name}`);
      await page.close().catch(() => {});
      process.exit(1);
    }
    const outPath = join(output, `final-${name}.png`);
    try {
      await page.screenshot({path: outPath, timeout: 30000});
    } catch (e) {
      if (e.name === 'TimeoutError' || !browser.isConnected()) transient(e);
      throw e;
    }
    console.log(`captured ${name} -> ${outPath}`);
    await page.close();
  }
} catch (error) {
  console.error(error);
  process.exit(error.exitCode || 1);
} finally {
  await browser?.close().catch((e) => {
    console.error('browser close failed: ' + e.message);
    process.exitCode ||= 75;
  });
}
