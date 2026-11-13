import type { ApiValidationIssue } from '@kcs-project/pack/types/data';

import type { ApiResponseEnvelope } from '@/types/api';

/**
 * `errorData` of the error codes that carry it.
 */
interface ApiErrorDataMap {
    duplicateKey: { fields: string[] };
    validationFailed: { issues: ApiValidationIssue[] };
}

/**
 * The typed `errorData` when the response failed with the given error code.
 */
export function getApiErrorData<Code extends keyof ApiErrorDataMap>(
    responseData: ApiResponseEnvelope,
    errorCode: Code,
) {
    if (responseData.success || responseData.errorCode !== errorCode) return;
    return responseData.errorData as ApiErrorDataMap[Code] | undefined;
}
