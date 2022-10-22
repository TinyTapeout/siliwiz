export function getUserAgent() {
  return typeof navigator === 'object' ? navigator.userAgent : '';
}

export function isMac() {
  return getUserAgent().indexOf('Macintosh') >= 0;
}

export function isMobile() {
  return getUserAgent().indexOf('Mobi') >= 0;
}
