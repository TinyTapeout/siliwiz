export function tryJsonParse(source: string, message?: string) {
  try {
    return JSON.parse(source);
  } catch (err) {
    if (message) {
      console.warn(message, err);
    }
  }
  return undefined;
}
