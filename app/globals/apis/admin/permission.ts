export class AdminPermissionApi extends BaseApi {
    constructor() {
        super('/api/admin/admin/permission');
    }

    async getTreeNodes() {
        return await this.getRequest<ElTreeNode[]>('/tree-nodes');
    }
}
