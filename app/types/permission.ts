import type { PermissionRequirement } from '@kcs-project/pack/types/permission';

import type {
    AdminPermissionGroup,
    AdminPermissionKey,
} from '@/generated/admin/permission';

export type AdminPermissionRequirement = PermissionRequirement<AdminPermissionGroup, AdminPermissionKey>;
