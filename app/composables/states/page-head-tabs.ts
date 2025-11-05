import type { ShallowReactive } from 'vue';

interface PageHeadTabsState {
    tabs: ShallowReactive<{ path: string; title: Ref<string> }>[];
    titles: ShallowReactive<Record<string, Ref<string>>>;
}

export function usePageHeadTabsState() {
    return useState<PageHeadTabsState>(
        'pageHeadTabs',
        () => ({
            tabs: [],
            titles: shallowReactive({}),
        }),
    );
}
