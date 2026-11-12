import type { PrincipalPermissions } from '@kcs-project/pack/types/permission';

interface ProfileState {
    id: string;
    permission: PrincipalPermissions;
}

export function useProfileState() {
    return useState<ProfileState>(
        'profile',
        () => ({
            id: '',
            permission: {
                permissions: [],
                unrestricted: false,
            },
        }),
    );
}
