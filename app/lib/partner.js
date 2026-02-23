/**
 * Partner LTD ID logic — shared utility.
 * If the LTD ID ends with '2' (and has more than 1 digit), strip the trailing '2'.
 * Otherwise, append '2'.
 */
export function getPartnerLtdId(ltdId) {
  if (!ltdId) return null;
  const s = ltdId.toString();
  if (s.endsWith('2') && s.length > 1) return s.slice(0, -1);
  return s + '2';
}
