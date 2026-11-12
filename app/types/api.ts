import type {
    ApiResponseData,
    ClientApiErrorCode,
} from '@kcs-project/pack/types/data';
import type { AxiosResponse } from 'axios';

import type { ApiErrorCode } from '@/generated/static/types/api-error-code';

/**
 * Every API call resolves to a response (never throws) whose `data` is always the API envelope, so failures carry
 * `data.success === false` plus an `errorCode`, and `data.data` exists only on success.
 */
export type ApiRequestResult<T extends object | undefined = undefined> = AxiosResponse<
    ApiResponseData<T, ApiResponseErrorCode>
>;

export type ApiResponseErrorCode = ApiErrorCode | ClientApiErrorCode;
