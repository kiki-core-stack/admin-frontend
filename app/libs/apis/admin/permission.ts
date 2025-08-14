import { BaseApi } from '../_internals/base';

export class AdminPermissionApi extends BaseApi {
    constructor() {
        super('/api/admin/permission');
    }

    getTree() {
        return this.getRequest<ElTreeNode[]>('/tree');
    }
}
