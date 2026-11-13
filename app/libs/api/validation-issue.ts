import type { ApiValidationIssue } from '@kcs-project/pack/types/data';
import { zhTW } from 'zod/locales';

// Constants/Variables
// Only zh-TW is supported now; pick the Zod locale by the app locale when more are added.
const { localeError } = zhTW();

// Functions

/**
 * Translates a backend validation issue: common cases use the app's own wording, the rest the Zod locale (issues carry
 * their Zod fields in `details`).
 */
export function translateApiValidationIssue(issue: ApiValidationIssue) {
    const details = issue.details ?? {};
    switch (issue.code) {
        case 'invalid_format':
            if (details.format === 'regex') return use$t('errors.validation.invalidFormat');
            break;
        // Zod does not report the received input, so the locale message would always say "received undefined".
        case 'invalid_type': return use$t('errors.validation.invalidValue');
        case 'too_small':
            if (details.origin === 'string' && details.minimum === 1) return use$t('errors.validation.required');
            break;

        case undefined: return issue.message;
    }

    const message = localeError({
        ...details,
        code: issue.code,
    } as Parameters<typeof localeError>[0]);

    return (typeof message === 'string' ? message : message?.message) ?? issue.message;
}
