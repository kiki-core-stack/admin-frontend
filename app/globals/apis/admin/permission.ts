export class AdminPermissionApi extends BaseApi {
    constructor() {
        super('/api/admin/admin/permission');
    }

    getTree() {
        return this.getRequest<ElTreeNode[]>('/tree');
    }
}
