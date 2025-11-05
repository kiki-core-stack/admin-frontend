import type { AdminLogType } from '@kiki-core-stack/pack/constants/admin';

export interface GetAdminLogListFilter {
    adminObjectId: { $in: string[] };
    createdAt: { $gte: Date; $lt: Date };
    type: { $in: AdminLogType[] };
}
