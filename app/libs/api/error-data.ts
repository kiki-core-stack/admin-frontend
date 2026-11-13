import type { CommonApiErrorDataMap } from '@kcs-project/pack/types/api';

import type { ApiResponseEnvelope } from '@/types/api';

/**
 * `errorData` of the error codes that carry it; add this backend's own error data here.
 */
interface ApiErrorDataMap extends CommonApiErrorDataMap {}

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
