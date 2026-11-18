import type { AuthChangePasswordData } from '@kcs-project/pack/types/data/auth';
import type {
    AuthenticationResponseJSON,
    PublicKeyCredentialCreationOptionsJSON,
    PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser';

/**
 * Proof of a factor, sent to complete a two-step login or to verify a high-risk operation.
 */
export type AuthFactorProofData =
  | {
      challengeId: string;
      factor: 'passkey';
      response: AuthenticationResponseJSON;
  }
  | {
      code: string;
      factor: 'code' | 'recoveryCode' | 'totp';
  }
  | {
      factor: 'password';
      password: string;
  };

export interface AuthChangePasswordFormData extends AuthChangePasswordData {
    confirmPassword: string;
}

export interface AuthPasskeyAuthenticationOptionsData {
    challengeId: string;
    options: PublicKeyCredentialRequestOptionsJSON;
}

export interface AuthPasskeyRegistrationOptionsData {
    challengeId: string;
    options: PublicKeyCredentialCreationOptionsJSON;
}
