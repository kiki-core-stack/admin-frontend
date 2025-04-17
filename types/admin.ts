import type { AdminLogType } from '@kiki-core-stack/pack/constants/admin';

export interface GetAdminLogListFilters extends TimeRangeFilter {
    adminIds: string[];
    types: AdminLogType[];
}
