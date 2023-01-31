export function getUserAgent() {
  return typeof navigator === 'object' ? navigator.userAgent : '';
}

export function isMac() {
  return getUserAgent().includes('Macintosh');
}

export function isMobile() {
  return getUserAgent().includes('Mobi');
}
