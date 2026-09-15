import { describe, expect, it } from 'vitest';
import { resolvePath, steps } from './steps';
import { initialFormData, type OnboardingFormData } from './types';

function buildFormData(overrides: Partial<OnboardingFormData>): OnboardingFormData {
  return { ...initialFormData, ...overrides };
}

const validPersonalInfo = {
  firstName: 'Sayma',
  lastName: 'Hia',
  email: 'sayma@example.com',
};

describe('steps.personalInfo', () => {
  it('always moves on to accountType', () => {
    expect(steps.personalInfo.next(buildFormData({}))).toBe('accountType');
  });

  it('is invalid until first name, last name, and a valid email are filled', () => {
    expect(steps.personalInfo.isValid(buildFormData({}))).toBe(false);
    expect(
      steps.personalInfo.isValid(buildFormData({ personalInfo: validPersonalInfo })),
    ).toBe(true);
  });
});

describe('steps.accountType', () => {
  it('routes business accounts to companyDetails', () => {
    const data = buildFormData({ accountType: { type: 'business' } });
    expect(steps.accountType.next(data)).toBe('companyDetails');
  });

  it('routes individual accounts to personalDetails', () => {
    const data = buildFormData({ accountType: { type: 'individual' } });
    expect(steps.accountType.next(data)).toBe('personalDetails');
  });

  it('is invalid until a type is selected', () => {
    expect(steps.accountType.isValid(buildFormData({}))).toBe(false);
    expect(
      steps.accountType.isValid(buildFormData({ accountType: { type: 'individual' } })),
    ).toBe(true);
  });
});

describe('steps.personalDetails', () => {
  it('always moves on to preferences', () => {
    expect(steps.personalDetails.next(buildFormData({}))).toBe('preferences');
  });

  it('is invalid until a job title is filled', () => {
    expect(steps.personalDetails.isValid(buildFormData({}))).toBe(false);
    expect(
      steps.personalDetails.isValid(
        buildFormData({ personalDetails: { jobTitle: 'Engineer', phone: '' } }),
      ),
    ).toBe(true);
  });
});

describe('steps.companyDetails', () => {
  it('always moves on to teamSize', () => {
    expect(steps.companyDetails.next(buildFormData({}))).toBe('teamSize');
  });

  it('is invalid until company name and type are filled', () => {
    expect(steps.companyDetails.isValid(buildFormData({}))).toBe(false);
    expect(
      steps.companyDetails.isValid(
        buildFormData({ companyDetails: { companyName: 'Acme Corp', companyType: 'llc' } }),
      ),
    ).toBe(true);
  });
});

describe('steps.teamSize', () => {
  it('always moves on to preferences', () => {
    expect(steps.teamSize.next(buildFormData({}))).toBe('preferences');
  });

  it('is invalid until a size is selected', () => {
    expect(steps.teamSize.isValid(buildFormData({}))).toBe(false);
    expect(steps.teamSize.isValid(buildFormData({ teamSize: { size: '11-50' } }))).toBe(true);
  });
});

describe('steps.preferences, review, complete', () => {
  it('preferences has no required fields and moves on to review', () => {
    expect(steps.preferences.isValid(buildFormData({}))).toBe(true);
    expect(steps.preferences.next(buildFormData({}))).toBe('review');
  });

  it('review has no required fields and moves on to complete', () => {
    expect(steps.review.isValid(buildFormData({}))).toBe(true);
    expect(steps.review.next(buildFormData({}))).toBe('complete');
  });

  it('complete is terminal - next() points back at itself', () => {
    expect(steps.complete.isValid(buildFormData({}))).toBe(true);
    expect(steps.complete.next(buildFormData({}))).toBe('complete');
  });
});

describe('resolvePath', () => {
  it('walks the individual branch', () => {
    const data = buildFormData({ accountType: { type: 'individual' } });
    expect(resolvePath(data)).toEqual([
      'personalInfo',
      'accountType',
      'personalDetails',
      'preferences',
      'review',
      'complete',
    ]);
  });

  it('walks the business branch, which is one step longer', () => {
    const data = buildFormData({ accountType: { type: 'business' } });
    expect(resolvePath(data)).toEqual([
      'personalInfo',
      'accountType',
      'companyDetails',
      'teamSize',
      'preferences',
      'review',
      'complete',
    ]);
  });

  it('defaults to the individual-length path before a type is chosen', () => {
    const data = buildFormData({});
    expect(resolvePath(data)).toHaveLength(6);
  });
});
