// @ts-expect-error Ignore this error.
import _micromatch from '@kikiutils/micromatch';
import type micromatchType from 'micromatch';

export const micromatch = _micromatch as typeof micromatchType;
