/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

export const apiErrorCodes = [
  'badRequest',
  'challengeExpired',
  'conflict',
  'duplicateKey',
  'forbidden',
  'gatewayTimeout',
  'gone',
  'incorrectPassword',
  'internalServerError',
  'invalidCredentials',
  'invalidVerificationCode',
  'notFound',
  'originNotAllowed',
  'passkeyLimitReached',
  'passkeyUnsupported',
  'passkeyVerificationFailed',
  'payloadTooLarge',
  'qrCodeLoginDisabled',
  'qrCodeLoginExpired',
  'secondFactorNotConfigured',
  'secondFactorSetupRequired',
  'serviceUnavailable',
  'sessionInvalid',
  'tooManyAttempts',
  'tooManyRequests',
  'totpAlreadyConfigured',
  'twoFactorEnforced',
  'unauthorized',
  'validationFailed',
  'verificationCodeUnavailable',
  'verificationRequired',
] as const;

export type ApiErrorCode = (typeof apiErrorCodes)[number];
