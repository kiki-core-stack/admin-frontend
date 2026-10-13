import type { AdminLogType } from '@kcs-project/pack/constants/admin';
import type { AdminData } from '@kcs-project/pack/types/data/admin';

export interface GetAdminLogListFilter {
    adminObjectId: { $in: AdminData[] };
    createdAt: { $gte: Date; $lt: Date };
    type: { $in: AdminLogType[] };
}
