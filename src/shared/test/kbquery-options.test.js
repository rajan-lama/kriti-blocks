/**
 * @jest-environment node
 *
 * Tests for the helpers and option lists shared by the query blocks. The
 * option values are compared with the whitelists in each render.php so the
 * editor can never offer a value the server would reject.
 */
import fs from 'fs';
import path from 'path';
import {
  CARD_STYLE_OPTIONS,
  HOVER_OPTIONS,
  RATIO_OPTIONS,
  STICKY_OPTIONS,
  TITLE_TAG_OPTIONS,
  normalizeIdList,
  toggleId,
} from '../kbquery-options';

const blocksDir = path.join(__dirname, '..', '..', 'blocks');
const php = (block) =>
  fs.readFileSync(path.join(blocksDir, block, 'render.php'), 'utf8');

describe('normalizeIdList', () => {
  test('keeps digits, drops junk, de-duplicates and removes zeros', () => {
    expect(normalizeIdList(' 12,abc, 7;;12 0 -3 ')).toBe('12, 7, 3');
  });

  test('handles empty and non-string input', () => {
    expect(normalizeIdList('')).toBe('');
    expect(normalizeIdList(undefined)).toBe('');
    expect(normalizeIdList('<script>')).toBe('');
  });

  test('caps the list at 50 IDs, like the server', () => {
    const many = Array.from({ length: 80 }, (_, i) => i + 1).join(',');
    expect(normalizeIdList(many).split(', ')).toHaveLength(50);
  });
});

describe('toggleId', () => {
  test('adds and removes', () => {
    expect(toggleId([1], 2)).toEqual([1, 2]);
    expect(toggleId([1, 2], 1)).toEqual([2]);
  });

  test('tolerates a missing list', () => {
    expect(toggleId(undefined, 5)).toEqual([5]);
  });
});

describe('option lists match the PHP whitelists', () => {
  const values = (list) => list.map((item) => item.value);

  test.each(['post-grid', 'post-carousel', 'related-posts'])('%s', (block) => {
    const source = php(block);

    values(CARD_STYLE_OPTIONS()).forEach((value) =>
      expect(source).toContain(`'${value}'`),
    );
    values(HOVER_OPTIONS()).forEach((value) =>
      expect(source).toContain(`'${value}'`),
    );
    values(TITLE_TAG_OPTIONS()).forEach((value) =>
      expect(source).toContain(`'${value}'`),
    );
    values(RATIO_OPTIONS())
      .filter((value) => value !== 'default')
      .forEach((value) => expect(source).toContain(`'${value}'`));
  });

  test('sticky options exist in post grid and carousel', () => {
    ['post-grid', 'post-carousel'].forEach((block) => {
      values(STICKY_OPTIONS()).forEach((value) =>
        expect(php(block)).toContain(`'${value}'`),
      );
    });
  });
});
