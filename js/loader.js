/**
 * loader.js — HTML Partial Loader
 *
 * Fetches HTML fragment files and injects them into the DOM,
 * replacing the mount-point element entirely.
 *
 * Usage:
 *   await loadAllSections();
 *
 * To add a new section:
 *   1. Create  html/my-section.html  with the section markup.
 *   2. Add     <div id="section-my-section"></div>  to index.html.
 *   3. Add an entry to SECTIONS below.
 */

/** Map of mount-point ID → HTML partial path. */
const SECTIONS = [
  { mountId: 'section-hero',   path: 'html/hero.html'   },
  { mountId: 'section-teaser', path: 'html/teaser.html' },
  { mountId: 'section-footer', path: 'html/footer.html' },
];

/**
 * Fetch one HTML partial and replace the mount element with it.
 * Silently warns on network error instead of crashing the page.
 *
 * @param {string} mountId   - id of the placeholder <div>
 * @param {string} path      - relative path to the .html partial
 */
async function loadSection(mountId, path) {
  const mount = document.getElementById(mountId);
  if (!mount) {
    console.warn(`[loader] Mount point #${mountId} not found.`);
    return;
  }

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    mount.outerHTML = await res.text();
  } catch (err) {
    console.warn(`[loader] Could not load "${path}": ${err.message}`);
    mount.remove(); // remove empty placeholder
  }
}

/**
 * Load all registered sections in parallel.
 * Awaiting this guarantees all section DOM is ready before
 * interactive scripts run.
 */
export async function loadAllSections() {
  await Promise.all(SECTIONS.map(({ mountId, path }) => loadSection(mountId, path)));
}
