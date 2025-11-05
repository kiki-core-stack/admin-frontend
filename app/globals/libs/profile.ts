export async function updateProfileState() {
    const response = await useProfileApi().get();
    const profileState = useProfileState();
    Object.assign(profileState.value, response?.data?.data);
    return profileState;
}
