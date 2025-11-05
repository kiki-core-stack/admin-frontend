import type { RemovableRef } from '@vueuse/shared';

interface PageHeadTabData {
    path: string;
    title: string;
}

export const pageHeadTabsController = new class {
    // Private properties
    #storage?: RemovableRef<PageHeadTabData[]>;

    // Private getters
    get #state() {
        return usePageHeadTabsState();
    }

    // Private methods
    #afterClose() {
        if (
            window.location.pathname !== '/'
            && !this.#state.value.tabs.map((tab) => tab.path).includes(window.location.pathname)
        ) navigateTo(this.#state.value.tabs.at(-1)?.path || '/');

        this.save();
    }

    #getStorage() {
        return this.#storage ||= useLocalStorage<PageHeadTabData[]>(`headerTabs:${useProfileState().value.id}`, []);
    }

    #normalizePath(path: string) {
        return path.replace(/\/+$/, '') || '/';
    }

    // Public methods
    close(index: number) {
        this.#state.value.tabs.splice(index, 1);
        this.#afterClose();
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

    registerCurrentPageHeadTab(title: string, insertIndex?: number) {
        const path = this.#normalizePath(window.location.pathname);
        const titleRef = this.#state.value.titles[path] ||= ref(title);
        titleRef.value = title;
        useHead({ title: titleRef });
        for (const tab of this.#state.value.tabs) {
            if (tab.path === path) {
                navigateTo(path);
                tab.title.value = title;
                this.save();
                return titleRef;
            }
        }

        this.#state.value.tabs.splice(
            insertIndex ?? this.#state.value.tabs.length,
            0,
            shallowReactive({
                path,
                title: titleRef,
            }),
        );

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
