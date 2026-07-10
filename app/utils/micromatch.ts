/* eslint-disable e18e/ban-dependencies -- node:path.matchesGlob is not behavior-compatible with micromatch. */
// @ts-expect-error The browser-compatible package does not provide TypeScript declarations.
import _micromatch from '@kikiutils/micromatch';
import type micromatchType from 'micromatch';
/* eslint-enable e18e/ban-dependencies */

export const micromatch = _micromatch as typeof micromatchType;
