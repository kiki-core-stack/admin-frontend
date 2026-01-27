import { defineNuxtModule } from '@nuxt/kit';

/**
 * Patches a typechecking error introduced in 4.3.0
 * https://github.com/nuxt/nuxt/issues/34140
 */
export default defineNuxtModule({
    meta: { name: 'patch-34140-shared-types' },
    setup(_options, nuxt) {
        nuxt.hook(
            'prepare:types',
            ({ sharedReferences }) => {
                const sharedImportIdx = sharedReferences.findIndex(
                    (ref) => 'path' in ref && ref.path.endsWith('shared-imports.d.ts'),
                );

                if (sharedImportIdx !== -1) sharedReferences.splice(sharedImportIdx, 1);
            },
        );
    },
});
