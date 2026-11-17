import type { AuthEventType } from '@kcs-project/pack/constants/auth';

export interface GetAuthEventListFilter {
    createdAt: { $gte: Date; $lt: Date };
    type: { $in: AuthEventType[] };
}
