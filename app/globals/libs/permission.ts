import type { Arrayable } from 'type-fest';

import type { PermissionPattern } from '@/types/permission';

export function hasPermission(...requiredPermissions: Arrayable<PermissionPattern>[]) {
    const permissions = requiredPermissions.flat();
    if (permissions.includes('ignore')) return true;
    const profileState = useProfileState();
    return (
        profileState.value.permission.isSuperAdmin
        || micromatch(profileState.value.permission.permissions, permissions).length > 0
    );
}
