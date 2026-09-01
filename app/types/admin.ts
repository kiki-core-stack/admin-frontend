import type { AdminLogType } from '@kcs-project/pack/constants/admin';

export interface GetAdminLogListFilter {
    adminObjectId: { $in: string[] };
    createdAt: { $gte: Date; $lt: Date };
    type: { $in: AdminLogType[] };
}
