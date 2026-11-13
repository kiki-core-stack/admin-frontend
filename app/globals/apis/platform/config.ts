import type { PlatformConfigData } from '@kcs-project/pack/types/data/platform';

export class PlatformConfigApi extends BaseCrudApi<PlatformConfigData, CrudFormData<PlatformConfigData>> {
    constructor() {
        super('/api/admin/platform/config');
    }
}
