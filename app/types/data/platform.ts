import type { PlatformIpAccessPolicyScope } from '@kcs-project/pack/constants/platform';
import type { AdminData } from '@kcs-project/pack/types/data/admin';
import type { PlatformIpAccessPolicyData } from '@kcs-project/pack/types/data/platform';
import type { SetFieldType } from 'type-fest';

export type PlatformIpAccessPolicyFormData = CrudFormData<PlatformIpAccessPolicyListItemData>;
export type PlatformIpAccessPolicyListItemData = SetFieldType<
    PlatformIpAccessPolicyData,
    'targets',
    PlatformIpAccessPolicyTargetData[]
>;

export interface PlatformIpAccessPolicyTargetData {
    principalIds: Array<Partial<AdminData>> | null;
    scope: null | PlatformIpAccessPolicyScope;
}
