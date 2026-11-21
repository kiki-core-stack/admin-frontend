export default defineNuxtConfig({
    icon: {
        clientBundle: { scan: true },
        provider: 'none',
    },
    kikiutilsNuxt: { enabledModules: { icon: true } },
});
