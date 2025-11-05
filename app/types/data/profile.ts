import type { AdminChangePasswordData } from '@kiki-core-stack/pack/types/data/admin';

export interface ProfileSecurityChangePasswordFormData extends AdminChangePasswordData {
    confirmPassword: string;
}
