import { describe, expect, it } from 'vitest';
import {
  accountTypeErrors,
  companyDetailsErrors,
  fieldErrorProps,
  hasNoErrors,
  lengthSlotProps,
  personalDetailsErrors,
  personalInfoErrors,
  teamSizeErrors,
} from './fieldErrors';
import { initialFormData, type OnboardingFormData } from './types';

// builds a full OnboardingFormData with just the sections a test cares
// about overridden, so every test isn't retyping the whole shape
function buildFormData(overrides: Partial<OnboardingFormData>): OnboardingFormData {
  return { ...initialFormData, ...overrides };
}

describe('hasNoErrors', () => {
  it('is true for an empty errors object', () => {
    expect(hasNoErrors({})).toBe(true);
  });

  it('is false once any key is present', () => {
    expect(hasNoErrors({ firstName: 'First name is required' })).toBe(false);
  });
});

describe('fieldErrorProps', () => {
  it('hides the error before the user has tried to advance', () => {
    expect(fieldErrorProps(false, 'First name is required')).toEqual({
      error: false,
      helperText: undefined,
    });
  });

  it('shows the error once the user has tried to advance', () => {
    expect(fieldErrorProps(true, 'First name is required')).toEqual({
      error: true,
      helperText: 'First name is required',
    });
  });

  it('is not an error state when there is no message, even after attempting', () => {
    expect(fieldErrorProps(true, undefined)).toEqual({
      error: false,
      helperText: undefined,
    });
  });
});

describe('lengthSlotProps', () => {
  it('forwards only the limits that were provided', () => {
    expect(lengthSlotProps({ min: 2, max: 50 })).toEqual({
      slotProps: { htmlInput: { minLength: 2, maxLength: 50 } },
    });
    expect(lengthSlotProps({ max: 254 })).toEqual({
      slotProps: { htmlInput: { maxLength: 254 } },
    });
    expect(lengthSlotProps({})).toEqual({ slotProps: { htmlInput: {} } });
  });
});

describe('personalInfoErrors', () => {
  it('requires first name, last name, and email', () => {
    const errors = personalInfoErrors(buildFormData({}));
    expect(errors).toEqual({
      firstName: 'First name is required',
      lastName: 'Last name is required',
      email: 'Email is required',
    });
  });

  it('rejects a first name under the 2 character minimum', () => {
    const errors = personalInfoErrors(
      buildFormData({
        personalInfo: { firstName: 'A', lastName: 'Hia', email: 'sayma@example.com' },
      }),
    );
    expect(errors.firstName).toBe('First name must be at least 2 characters');
  });

  it('rejects a malformed email', () => {
    const errors = personalInfoErrors(
      buildFormData({
        personalInfo: { firstName: 'Sayma', lastName: 'Hia', email: 'not-an-email' },
      }),
    );
    expect(errors.email).toBe('Enter a valid email address');
  });

  it('passes with valid data', () => {
    const errors = personalInfoErrors(
      buildFormData({
        personalInfo: { firstName: 'Sayma', lastName: 'Hia', email: 'sayma@example.com' },
      }),
    );
    expect(hasNoErrors(errors)).toBe(true);
  });
});

describe('accountTypeErrors', () => {
  it('requires a selection', () => {
    expect(accountTypeErrors(buildFormData({}))).toEqual({
      type: 'Select an account type',
    });
  });

  it('passes once individual or business is selected', () => {
    expect(
      hasNoErrors(accountTypeErrors(buildFormData({ accountType: { type: 'individual' } }))),
    ).toBe(true);
    expect(
      hasNoErrors(accountTypeErrors(buildFormData({ accountType: { type: 'business' } }))),
    ).toBe(true);
  });
});

describe('personalDetailsErrors', () => {
  it('requires a job title but not a phone', () => {
    const errors = personalDetailsErrors(buildFormData({}));
    expect(errors).toEqual({ jobTitle: 'Job title is required' });
  });

  it('validates phone length only when a phone is provided', () => {
    const tooShort = personalDetailsErrors(
      buildFormData({ personalDetails: { jobTitle: 'Engineer', phone: '123' } }),
    );
    expect(tooShort.phone).toBe('Phone must be at least 7 characters');

    const valid = personalDetailsErrors(
      buildFormData({ personalDetails: { jobTitle: 'Engineer', phone: '555-1234' } }),
    );
    expect(valid.phone).toBeUndefined();
  });
});

describe('companyDetailsErrors', () => {
  it('requires both company name and company type', () => {
    const errors = companyDetailsErrors(buildFormData({}));
    expect(errors).toEqual({
      companyName: 'Company name is required',
      companyType: 'Company type is required',
    });
  });

  it('passes with both fields filled', () => {
    const errors = companyDetailsErrors(
      buildFormData({ companyDetails: { companyName: 'Acme Corp', companyType: 'llc' } }),
    );
    expect(hasNoErrors(errors)).toBe(true);
  });
});

describe('teamSizeErrors', () => {
  it('requires a selection', () => {
    expect(teamSizeErrors(buildFormData({}))).toEqual({ size: 'Select a team size' });
  });

  it('passes once a size is selected', () => {
    expect(hasNoErrors(teamSizeErrors(buildFormData({ teamSize: { size: '11-50' } })))).toBe(true);
  });
});
