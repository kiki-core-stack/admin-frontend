import type { AdminData } from '@kiki-core-stack/pack/types/data/admin';

export interface AdminFormData extends TablePageFormData<AdminData, 'authenticationRevision' | 'isSuperAdmin'> {
    confirmPassword: string;
}
