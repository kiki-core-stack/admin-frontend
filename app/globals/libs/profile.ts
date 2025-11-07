export async function updateProfileState() {
    const response = await ProfileApi.use().get();
    const profileState = useProfileState();
    Object.assign(profileState.value, response?.data?.data);
    return profileState;
}
