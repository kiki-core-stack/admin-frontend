import type {
    PlatformIpAccessPolicyFormData,
    PlatformIpAccessPolicyListItemData,
} from '@/types/data/platform';

export class PlatformIpAccessPolicyApi extends BaseCrudApi<
    PlatformIpAccessPolicyListItemData,
    PlatformIpAccessPolicyFormData
> {
    constructor() {
        super('/api/admin/platform/ip-access-policy');
    }

    protected override readonly serializeInput = (data: PlatformIpAccessPolicyFormData) => ({
        ...data,
        note: data.note.trim() || undefined,
        targets: data.targets.map((target) => ({
            ...target,
            principalIds: target.principalIds?.map((principal) => principal.id) ?? null,
        })),
    });
}
