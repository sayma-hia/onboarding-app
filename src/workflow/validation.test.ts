import { describe, expect, it } from 'vitest';
import { isNonEmpty, isValidEmail, lengthError } from './validation';

describe('isNonEmpty', () => {
  it('is false for an empty string', () => {
    expect(isNonEmpty('')).toBe(false);
  });

  it('is false for a whitespace-only string', () => {
    expect(isNonEmpty('   ')).toBe(false);
  });

  it('is true once there is real content', () => {
    expect(isNonEmpty('  Sayma  ')).toBe(true);
  });
});

describe('isValidEmail', () => {
  it('accepts a normal address', () => {
    expect(isValidEmail('sayma@example.com')).toBe(true);
  });

  it('rejects an address missing a domain', () => {
    expect(isValidEmail('sayma@example')).toBe(false);
  });

  it('rejects an address missing the @', () => {
    expect(isValidEmail('sayma.example.com')).toBe(false);
  });

  it('rejects a string with spaces', () => {
    expect(isValidEmail('sayma @example.com')).toBe(false);
  });
});

describe('lengthError', () => {
  it('flags a value under the minimum', () => {
    expect(lengthError('First name', 'A', { min: 2 })).toBe(
      'First name must be at least 2 characters',
    );
  });

  it('flags a value over the maximum', () => {
    expect(lengthError('Bio', 'x'.repeat(11), { max: 10 })).toBe(
      'Bio must be 10 characters or fewer',
    );
  });

  it('accepts a value exactly at the minimum', () => {
    expect(lengthError('First name', 'Al', { min: 2 })).toBeUndefined();
  });

  it('accepts a value exactly at the maximum', () => {
    expect(lengthError('Bio', 'x'.repeat(10), { max: 10 })).toBeUndefined();
  });

  it('trims whitespace before measuring length', () => {
    expect(lengthError('First name', '  A  ', { min: 2 })).toBe(
      'First name must be at least 2 characters',
    );
  });

  it('passes when no limits are given', () => {
    expect(lengthError('Anything', '', {})).toBeUndefined();
  });
});
