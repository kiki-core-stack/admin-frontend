import type { AdminChangePasswordData } from '@kcs-project/pack/types/data/admin';

export interface ProfileSecurityChangePasswordFormData extends AdminChangePasswordData {
    confirmPassword: string;
}
