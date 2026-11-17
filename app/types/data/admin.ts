import type { AdminData } from '@kcs-project/pack/types/data/admin';

export interface AdminFormData extends CrudFormData<AdminData, 'isSuperAdmin'> {
    confirmPassword: string;
}
