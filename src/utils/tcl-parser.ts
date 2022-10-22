/**
 * Parses a TCL list, without nesting. e.g.:
 * `{Local interconnect width < 0.17um (li.1)} {80 90 94 110} {60 110 80 124} {140 90 154 110} {120 110 140 124}`
 */
export function parseTCLList(list: string) {
  const result: string[] = [];
  let current = '';
  let inBraces = false;
  let inQuotes = false;
  for (let i = 0; i < list.length; i++) {
    const char = list[i];
    if (char === '{') {
      if (inQuotes) {
        current += char;
      } else {
        inBraces = true;
      }
    } else if (char === '}') {
      if (inQuotes) {
        current += char;
      } else {
        inBraces = false;
      }
    } else if (char === '"') {
      if (inBraces) {
        current += char;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ' ') {
      if (inQuotes || inBraces) {
        current += char;
      } else {
        result.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  if (current.length > 0) {
    result.push(current);
  }

  return result;
}
