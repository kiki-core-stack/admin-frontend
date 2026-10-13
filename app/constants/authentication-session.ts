import type { AuthenticationSessionPrincipalType } from '@kcs-project/pack/types/authentication-session';
import type { ReadonlyRecord } from '@kikiutils/shared/types';

// TODO: 之後整理auth的時候會移除或改名或遷移
export const authenticationSessionPrincipalTypeToTextMap: ReadonlyRecord<
    AuthenticationSessionPrincipalType,
    string
> = { admin: '管理員' };
