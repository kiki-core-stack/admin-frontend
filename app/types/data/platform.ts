import type { PlatformIpAccessPolicyScope } from '@kcs-project/pack/constants/platform';
import type { AuthenticationSessionPrincipalType } from '@kcs-project/pack/types/authentication-session';
import type { AdminData } from '@kcs-project/pack/types/data/admin';
import type { PlatformIpAccessPolicyData } from '@kcs-project/pack/types/data/platform';
import type { SetFieldType } from 'type-fest';

export type PlatformIpAccessPolicyFormData = TablePageFormData<PlatformIpAccessPolicyListItemData>;
export type PlatformIpAccessPolicyListItemData = SetFieldType<
    PlatformIpAccessPolicyData,
    'targets',
    PlatformIpAccessPolicyTargetData[]
>;

export interface PlatformIpAccessPolicyPrincipalTypeToDataMap {
    admin: Partial<AdminData>;
}

export interface PlatformIpAccessPolicyTargetData {
    principalIds: null | PlatformIpAccessPolicyPrincipalTypeToDataMap[AuthenticationSessionPrincipalType][];
    principalType: AuthenticationSessionPrincipalType | null;
    scope: null | PlatformIpAccessPolicyScope;
}
