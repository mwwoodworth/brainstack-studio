import { formatPriceDisplay, parseProductFeatures } from '@/lib/pricing';

describe('pricing helpers', () => {
  describe('parseProductFeatures', () => {
    it('returns an empty array for nullish and empty input', () => {
      expect(parseProductFeatures(null)).toEqual([]);
      expect(parseProductFeatures(undefined)).toEqual([]);
      expect(parseProductFeatures('')).toEqual([]);
    });

    it('splits by newline and comma, trims values, and drops empty entries', () => {
      const raw = 'Feature A,\n  Feature B  \n,\nFeature C,,  ';
      expect(parseProductFeatures(raw)).toEqual(['Feature A', 'Feature B', 'Feature C']);
    });
  });

  describe('formatPriceDisplay', () => {
    it('returns Custom when amount is null', () => {
      expect(formatPriceDisplay(null, 'usd', 'month')).toBe('Custom');
    });

    it('formats monthly and yearly intervals with suffixes', () => {
      expect(formatPriceDisplay(99, 'usd', 'month')).toBe('$99/mo');
      expect(formatPriceDisplay(149, 'usd', 'year')).toBe('$149/yr');
    });

    it('returns bare formatted currency for non-recurring intervals', () => {
      expect(formatPriceDisplay(199, 'usd', 'once')).toBe('$199');
      expect(formatPriceDisplay(2500, 'usd', 'custom')).toBe('$2,500');
    });

    it('normalizes currency casing before formatting', () => {
      expect(formatPriceDisplay(99, 'uSd', 'month')).toBe('$99/mo');
    });
  });
});
