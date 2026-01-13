const ignoredPathPrefixes = new Set([]);

export default defineNuxtPlugin(async () => {
    const path = useRoute().fullPath;
    for (const prefix of ignoredPathPrefixes) if (path.startsWith(prefix)) return;
    await updateProfileState();
});
