import type { AdminRoleData } from '@kcs-project/pack/types/data/admin';

export class AdminRoleApi extends BaseCrudApi<AdminRoleData, CrudFormData<AdminRoleData>> {
    constructor() {
        super('/api/admin/admin/role');
    }

    // The tree also reports checked group nodes; roles store permission keys only.
    protected override readonly serializeInput = (data: CrudFormData<AdminRoleData>) => ({
        ...data,
        permissions: data.permissions.filter(isAdminPermissionKey),
    });
}
