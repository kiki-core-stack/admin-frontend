import type { AdminData } from '@kiki-core-stack/pack/types/data/admin';

import type { AdminFormData } from '@/types/data/admin';

import { BaseCrudApi } from '../_internals/base/crud';

export class AdminApi extends BaseCrudApi<AdminData, AdminFormData> {
    constructor() {
        super('/api/admin/admin');
    }

    override processCreateOrUpdateData(data: AdminFormData) {
        return {
            ...data,
            email: data.email?.trim() || undefined,
            password: data.password?.trim() || undefined,
            roles: data.roles.map((role) => role.id),
        };
    }
}
