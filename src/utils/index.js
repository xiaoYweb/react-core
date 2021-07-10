

export function onlyOne(params) {
  return Array.isArray(params) ? params[0] : params;
}