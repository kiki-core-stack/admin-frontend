import { hasPermission as hasPrincipalPermission } from '@kcs-project/pack/libs/permission';
import type { Arrayable } from 'type-fest';

import { adminPermissionKeys } from '@/generated/static/types/admin/permission';
import type { AdminPermissionKey } from '@/generated/static/types/admin/permission';
import type { AdminPermissionRequirement } from '@/types/permission';

// Constants/Variables
const adminPermissionKeySet = new Set<string>(adminPermissionKeys);

// Functions

/**
 * Whether the current admin passes the requirement (`ignore` always passes); same rules as the backend check.
 */
export function hasPermission(required: Arrayable<'ignore' | AdminPermissionRequirement>) {
    const patterns = [required].flat();
    if (patterns.includes('ignore')) return true;
    return hasPrincipalPermission(useProfileState().value.permission, patterns);
}

/**
 * Whether the string is a key in the generated admin permission catalog.
 */
export function isAdminPermissionKey(value: string): value is AdminPermissionKey {
    return adminPermissionKeySet.has(value);
}
