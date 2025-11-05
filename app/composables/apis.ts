import { createUseApiFunction } from '@/libs/apis/_internals/factory';
import { AdminApi } from '@/libs/apis/admin';
import { AdminRoleApi } from '@/libs/apis/admin/role';
import { AuthApi } from '@/libs/apis/auth';
import { HomeApi } from '@/libs/apis/home';
import { ProfileApi } from '@/libs/apis/profile';
import { ProfileSecurityApi } from '@/libs/apis/profile/security';
import { ProfileSecuritySessionApi } from '@/libs/apis/profile/security/session';

export const useAdminApi = createUseApiFunction(AdminApi);
export const useAdminRoleApi = createUseApiFunction(AdminRoleApi);
export const useAuthApi = createUseApiFunction(AuthApi);
export const useHomeApi = createUseApiFunction(HomeApi);
export const useProfileApi = createUseApiFunction(ProfileApi);
export const useProfileSecurityApi = createUseApiFunction(ProfileSecurityApi);
export const useProfileSecuritySessionApi = createUseApiFunction(ProfileSecuritySessionApi);
