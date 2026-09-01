import type { AdminData } from '@kcs-project/pack/types/data/admin';

export interface AdminFormData extends TablePageFormData<AdminData, 'authenticationRevision' | 'isSuperAdmin'> {
    confirmPassword: string;
}
