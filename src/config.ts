// ─────────────────────────────────────────────────────────────
// Central wedding configuration – edit details here only.
// ─────────────────────────────────────────────────────────────

export const WEDDING = {
  brideName: 'Shayani',
  groomName: 'Senaka',
  brideParents: 'Mr. Ajith Athukorala & Mrs. Sriyani Ranaseli',
  groomParents: 'Mr. R.M. Podi Banda & Mrs. Priyani Dhammika',

  // Date & time
  dateISO: '2027-01-20T09:00:00',
  dayName: 'Wednesday',
  dateLong: 'January 20, 2027',       // footer
  dateShort: '20 . 01 . 2027',        // hero pill
  dateDayMonth: 'Wednesday, January 20',
  yearInWords: 'The Year Two Thousand Twenty Seven',
  monthYear: 'January 2027',
  ceremonyTime: '09:00 AM',

  // Venue
  venueName: 'Amaya Green',
  venueCity: 'Yakkala',
  venueFull: 'Amaya Green, Yakkala',
  mapsLink: 'https://maps.app.goo.gl/dwXk2hydg8ZfYAqJA',
  mapsEmbed: 'https://maps.google.com/maps?q=Amaya+Green+Yakkala&t=&z=15&ie=UTF8&iwloc=&output=embed',
} as const;

/**
 * Google Apps Script Web App URL (from Deploy → New deployment → Web app).
 * Hard-coded – if you redeploy as a NEW deployment, replace this URL.
 */
export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbygNIsduSh2F572HHeiI4jl8IOojYQXnHLVtxzrjA0x1Z-1Pp6sojYtEEecmcO0RAMi/exec';

// ─────────────────────────────────────────────────────────────
// Guest name / prefix logic (shared by /admin and the invitation)
// ─────────────────────────────────────────────────────────────

export const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;
export type Prefix = (typeof PREFIXES)[number];

/** Combines prefix + name. "Dear" is a greeting style, so it adds nothing to the name. */
export function buildDisplayName(prefix: Prefix, name: string): string {
  const n = name.trim().replace(/\s+/g, ' ');
  if (!n) return '';
  switch (prefix) {
    case 'Family':
      return `${n} and Family`;
    case 'Dear':
      return n;
    default:
      return `${prefix} ${n}`;
  }
}

/** Reads the personalised guest name from the URL: /{encodedDisplayName} (legacy ?prefix=&name= also supported). */
export function getGuestDisplayName(): string | null {
  const params = new URLSearchParams(window.location.search);
  const legacyName = params.get('name');
  if (legacyName) {
    const legacyPrefix = params.get('prefix');
    return [legacyPrefix, legacyName].filter(Boolean).join(' ').trim() || null;
  }

  const segment = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!segment || segment.toLowerCase() === 'admin' || segment.includes('/')) return null;

  try {
    const decoded = decodeURIComponent(segment).replace(/\s+/g, ' ').trim();
    // Strip anything that isn't a letter, number, space or simple punctuation.
    const safe = decoded.replace(/[^\p{L}\p{N} .&'’,-]/gu, '').slice(0, 80).trim();
    return safe || null;
  } catch {
    return null;
  }
}
