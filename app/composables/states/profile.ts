import type { PrincipalPermissions } from '@kcs-project/pack/types/permission';

export interface ProfileState {
    id: string;
    permission: PrincipalPermissions;

    /**
     * A restricted session may only set up two-factor authentication.
     */
    restricted: boolean;
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
            restricted: false,
        }),
    );
}
