import type { CachedAdminPermission } from '@kcs-project/pack/types/admin';

interface ProfileState {
    id: string;
    permission: CachedAdminPermission;
}

export function useProfileState() {
    return useState<ProfileState>(
        'profile',
        () => ({
            id: '',
            permission: {
                isSuperAdmin: false,
                permissions: [],
            },
        }),
    );
}
