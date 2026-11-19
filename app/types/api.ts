import type {
    ApiResponseData,
    ClientApiErrorCode,
} from '@kcs-project/pack/types/api';
import type { ApiClientResponse } from '@kcs-project/pack/types/api-client';

import type { ApiErrorCode } from '@/generated/api-error-code';

/**
 * Every API call resolves to a response (never throws) whose `data` is always the API envelope, so failures carry
 * `data.success === false` plus an `errorCode` and a localized `message`, and `data.data` exists only on success.
 */
export type ApiRequestResult<T extends object | undefined = undefined> = ApiClientResponse<ApiResponseEnvelope<T>>;
export type ApiResponseEnvelope<T extends object | undefined = object | undefined> = ApiResponseData<
    T,
    ApiResponseErrorCode
>;

export type ApiResponseErrorCode = ApiErrorCode | ClientApiErrorCode;
