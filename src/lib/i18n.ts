import type { Lang } from '../types';

/**
 * Maps the current pathname to the equivalent path in both locales.
 * Assumes the default locale (en) has no prefix and pt is served under /pt.
 */
export function localePaths(pathname: string, lang: Lang): { en: string; pt: string } {
  if (pathname === '/privacy/' || pathname === '/pt/privacidade/') {
    return { en: '/privacy/', pt: '/pt/privacidade/' };
  }
  const en = lang === 'pt' ? pathname.replace(/^\/pt(?=\/|$)/, '') || '/' : pathname;
  const pt = en === '/' ? '/pt/' : `/pt${en}`;
  return { en, pt };
}
