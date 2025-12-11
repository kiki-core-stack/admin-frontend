export class AdminPermissionApi extends BaseApi {
    constructor() {
        super('/api/admin/admin/permission');
    }

    getTreeNodes() {
        return this.getRequest<ElTreeNode[]>('/tree-nodes');
    }
}
