import { expect, test } from '@playwright/test';
import { buildBibliography } from '../src/lib/publications';
import type { Publication } from '../src/types';
const paper: Publication = {
  title: 'A study on cloud computing',
  year: 2023,
  authors: ['Francisco Knebel'],
  venue: 'Research',
  type: 'Journal Article',
};

test('bibliography keys skip English articles and remain unique beyond 26 collisions', () => {
  const entries = buildBibliography(Array.from({ length: 40 }, () => ({ ...paper })));
  expect(entries[0].key).toBe('knebel2023study');
  expect(new Set(entries.map((entry) => entry.key)).size).toBe(40);
  expect(entries.every((entry) => /^[a-z0-9]+$/.test(entry.key))).toBe(true);
});

test('bibliography values escape TeX delimiters and preserve UTF-8 names', () => {
  const [result] = buildBibliography([
    {
      ...paper,
      title: 'The {Cloud} & Edge_100% #1',
      authors: ['João & Maria'],
      url: 'https://example.org/a_b?q=1&x=2',
    },
  ]);
  expect(result.entry).toContain('João \\& Maria');
  expect(result.entry).toContain('\\{Cloud\\} \\& Edge\\_100\\% \\#1');
  expect(result.entry).toContain('a\\_b?q=1\\&x=2');
});
