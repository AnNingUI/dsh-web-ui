/**
 * Boot-manifest readiness checks for the one-click apply flow.
 *
 * The host half writes the skin patch synchronously, but the web app's boot
 * graph (the `window.__DSH_BOOT__` JSON inside the served HTML) is
 * regenerated asynchronously by the config watcher. A page reloaded right
 * after the patch write can therefore boot into the previous skin. These
 * helpers let the frontend poll the served document until the manifest
 * actually reflects the target before reloading.
 *
 * The matchers are scope-agnostic: they key off the skin's full package name
 * (`@<scope>/dsh-client-ui-skin-<id>`), so a bundle in any npm scope — the
 * monorepo `@linxin666` home or an external `@AnNingUI` — is recognized.
 * @module @linxin666/dsh-client-ui-skin-center/manifest
 */

/** Bundle URL pattern of any skin entry in the boot manifest — any scope.
 *  Matches `/plugins/@<scope>/dsh-client-ui-skin-<id>/client.js` for any
 *  scoped plugin package except the skin-center manager itself. */
const SKIN_BUNDLE_URL = /\/plugins\/@[A-Za-z0-9][A-Za-z0-9._-]*\/dsh-client-ui-skin-(?!center)[a-z0-9-]+\/client\.js/

/**
 * Whether a served GUI document's boot manifest enables the given skin.
 * A `null` target means the stock look: no skin bundle URL may be present
 * (the skin-center plugin's own bundle always loads and is excluded).
 * @param documentHtml - the served GUI document (contains the boot JSON).
 * @param targetPackage - the target skin's full package name
 *   (`@<scope>/dsh-client-ui-skin-<id>`), or `null` for the stock look.
 * @returns whether the manifest already enables the target.
 */
export function manifestHasSkin(documentHtml: string, targetPackage: string | null): boolean {
  if (targetPackage === null) return !SKIN_BUNDLE_URL.test(documentHtml)
  return documentHtml.includes(`/plugins/${targetPackage}/client.js`)
}
