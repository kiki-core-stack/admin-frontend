import { hasPermission as hasPrincipalPermission } from '@kcs-project/pack/libs/permission';
import type { Arrayable } from 'type-fest';

import type { AdminPermissionRequirement } from '@/types/permission';

/**
 * Whether the current admin passes the requirement (`ignore` always passes); same rules as the backend check.
 */
export function hasPermission(required: Arrayable<'ignore' | AdminPermissionRequirement>) {
    const patterns = [required].flat();
    if (patterns.includes('ignore')) return true;
    return hasPrincipalPermission(useProfileState().value.permission, patterns);
}
