/**
 * @see {@link https://developer.chrome.com/extensions/manifest}
 */
module.exports = {
  name: 'image-picker',
  description: 'chrome extension named image picker version',
  author: 'gswon <bluemirr5@gmail.com>',
  version: '2.0.3',
  icons: {
    '16': 'icons/16.png',
    '128': 'icons/128.png'
  },
  homepage_url: 'https://github.com/bluemirr5/image-picker2',
  /**
   * @see {@link https://developer.chrome.com/extensions/declare_permissions}
   */
  permissions: [
    'tabs',
    'http://*/*',
    'https://*/*',
    '<all_urls>',
    'activeTab',
    'pageCapture',
    'downloads'
  ],
  browser_action: {
    default_title: 'image-picker',
    default_popup: 'pages/popup.html'
  },
  background: {
    persistent: false,
    page: 'pages/background.html'
  },
  options_page: 'pages/options.html',
  manifest_version: 2,
  content_security_policy: "script-src 'self'; object-src 'self'",
  web_accessible_resources: [
    'js/content.js'
  ]
}
