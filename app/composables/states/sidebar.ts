interface SidebarState {
    isShow: boolean;
}

export function useSidebarState() {
    return useState<SidebarState>('sidebar', () => ({ isShow: false }));
}
