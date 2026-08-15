import { describe, expect, it } from 'vitest'
import { manifestHasSkin } from '../src/client/manifest.ts'

/** A served document with only the skin-center plugin enabled (stock look). */
const STOCK = '<html><script>window.__DSH_BOOT__={"entries":[{"id":"ui-skin-center","url":"/plugins/@linxin666/dsh-client-ui-skin-center/client.js?rev=abc"}]}</script></html>'

/** The same document with the @linxin666 qq98 skin enabled as well. */
const WITH_QQ98 = STOCK.replace(
  '</script>',
  ',{"id":"ui-skin-qq98","url":"/plugins/@linxin666/dsh-client-ui-skin-qq98/client.js?rev=def"}</script>',
)

/** The same document with an EXTERNAL-scope (@AnNingUI) skin enabled. */
const WITH_EXTERNAL = STOCK.replace(
  '</script>',
  ',{"id":"ui-skin-md3-wallpaper","url":"/plugins/@AnNingUI/dsh-client-ui-skin-md3-wallpaper/client.js?rev=def"}</script>',
)

describe('manifestHasSkin', () => {
  it('accepts the stock look when no skin bundle is enabled', () => {
    expect(manifestHasSkin(STOCK, null)).toBe(true)
  })

  it('rejects the stock look while a skin bundle is enabled', () => {
    expect(manifestHasSkin(WITH_QQ98, null)).toBe(false)
  })

  it('accepts the target skin once its bundle appears (monorepo scope)', () => {
    expect(manifestHasSkin(WITH_QQ98, '@linxin666/dsh-client-ui-skin-qq98')).toBe(true)
  })

  it('rejects other skins while one is enabled', () => {
    expect(manifestHasSkin(WITH_QQ98, '@linxin666/dsh-client-ui-skin-xp')).toBe(false)
  })

  it('ignores skins that are not enabled at all', () => {
    expect(manifestHasSkin(STOCK, '@linxin666/dsh-client-ui-skin-qq98')).toBe(false)
  })

  it('does not treat the always-present skin-center plugin bundle as a skin', () => {
    expect(manifestHasSkin(STOCK, null)).toBe(true)
    expect(manifestHasSkin(WITH_QQ98, null)).toBe(false)
  })

  it('recognizes an EXTERNAL-scope (non-@linxin666) skin bundle', () => {
    expect(manifestHasSkin(WITH_EXTERNAL, null)).toBe(false)
    expect(manifestHasSkin(WITH_EXTERNAL, '@AnNingUI/dsh-client-ui-skin-md3-wallpaper')).toBe(true)
  })
})
