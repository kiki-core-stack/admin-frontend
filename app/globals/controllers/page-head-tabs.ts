import type { RemovableRef } from '@vueuse/shared';

interface PageHeadTabData {
    path: string;
    title: string;
}

export const pageHeadTabsController = new class {
    // Private properties
    #registeredPaths = new Set<string>();
    #storage?: RemovableRef<PageHeadTabData[]>;

    // Private getters
    get #state() {
        return usePageHeadTabsState();
    }

    // Private methods
    #afterClose(navigateToIndex?: number) {
        this.save();
        const tabs = this.#state.value.tabs;
        if (window.location.pathname !== '/' && !tabs.map((tab) => tab.path).includes(window.location.pathname)) {
            if (navigateToIndex !== undefined && tabs[navigateToIndex]) {
                navigateTo(tabs[navigateToIndex].path);
                return;
            }

            navigateTo(tabs.at(-1)?.path || '/');
        }
    }

    #getStorage() {
        return this.#storage ||= useLocalStorage<PageHeadTabData[]>(`headerTabs:${useProfileState().value.id}`, []);
    }

    #normalizePath(path: string) {
        return path.endsWith('/') ? path : `${path}/`;
    }

    // Public methods
    close(index: number) {
        this.#state.value.tabs.splice(index, 1);
        this.#afterClose(index);
    }

    closeAll() {
        this.#state.value.tabs.length = 0;
        this.#afterClose();
    }

    closeByPath(path: string = window.location.pathname) {
        path = this.#normalizePath(path);
        const index = this.#state.value.tabs.findIndex((tab) => tab.path === path);
        if (index === -1) return;
        this.close(index);
    }

    closeByPathAfter(delayMs: number, path: string = window.location.pathname) {
        setTimeout(() => this.closeByPath(this.#normalizePath(path)), delayMs);
    }

    closeFromIndexTo(fromIndex: number, toIndex: number) {
        const startIndex = Math.min(fromIndex, toIndex);
        const endIndex = Math.max(fromIndex, toIndex);
        if (fromIndex < 0) return;
        this.#state.value.tabs.splice(startIndex, endIndex - startIndex + 1);
        this.#afterClose();
    }

    registerCurrentPageHeadTab(title: string) {
        const path = this.#normalizePath(window.location.pathname);
        const titleRef = this.#state.value.titles[path] ||= ref(title);
        titleRef.value = title;
        useHead({ title: titleRef });
        if (!this.#registeredPaths.has(path)) {
            this.#registeredPaths.add(path);
            onActivated(() => {
                if (!this.#state.value.tabs.some((tab) => tab.path === path)) {
                    this.#state.value.tabs.push(shallowReactive({
                        path,
                        title: titleRef,
                    }));
                }
            });
        }

        this.save();
        return titleRef;
    }

    load() {
        this.#getStorage().value.forEach((pageHeadTabData) => {
            this.#state.value.tabs.push(shallowReactive({
                path: pageHeadTabData.path,
                title: this.#state.value.titles[pageHeadTabData.path] ||= ref(pageHeadTabData.title),
            }));
        });
    }

    save() {
        this.#getStorage().value = this.#state.value.tabs.map((tab) => ({
            path: tab.path,
            title: tab.title.value,
        }));
    }
}();
