export function tryJsonParse(source: string, message?: string) {
  try {
    return JSON.parse(source);
  } catch (err) {
    if (message != null) {
      console.warn(message, err);
    }
  }
  return undefined;
}
