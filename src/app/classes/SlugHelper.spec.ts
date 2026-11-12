import { createSlug, extractIdFromSlug } from './SlugHelper';

describe('Fashion slugs', () => {
  it('removes Vietnamese accents including đ', () => {
    expect(createSlug('Đầm Dạ Hội – Mùa Hè!', 12)).toBe('dam-da-hoi-mua-he-p12');
  });

  it('distinguishes identical names using their numeric IDs', () => {
    expect(extractIdFromSlug(createSlug('Đầm đẹp', 1))).toBe(1);
    expect(extractIdFromSlug(createSlug('Đầm đẹp', 2))).toBe(2);
  });

  it('only parses a positive safe integer at the end of the slug', () => {
    for (const slug of ['dress', 'dress-p0', 'dress-p-1', 'dress-p2-extra', 'dress-p9007199254740992']) {
      expect(extractIdFromSlug(slug)).toBeNull();
    }
    expect(extractIdFromSlug('style-p3-summer-p25')).toBe(25);
  });
});
