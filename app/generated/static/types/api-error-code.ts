/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

export const apiErrorCodes = [
  'badRequest',
  'conflict',
  'duplicateKey',
  'forbidden',
  'gatewayTimeout',
  'gone',
  'internalServerError',
  'notFound',
  'payloadTooLarge',
  'serviceUnavailable',
  'sessionInvalid',
  'tooManyRequests',
  'unauthorized',
  'validationFailed',
] as const;

export type ApiErrorCode = (typeof apiErrorCodes)[number];
